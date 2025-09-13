# 🗺️ MAPBOX COMPREHENSIVE ANALYSIS & FIXES - 2025

## 🚨 **CRITICAL ISSUES IDENTIFIED**

### **Problem 1: Using Raw Addresses Instead of Coordinates**
- **Current Issue**: We're passing full addresses directly to Directions API
- **Result**: Geocoding fails, returns `null` duration/distance
- **Solution**: Forward-geocode first, then use `[lon,lat];[lon,lat]` coordinates

### **Problem 2: Missing 10-Hour Limit Enforcement**
- **Current Issue**: Long-distance moves (17+ hours) showing 2.6 hours
- **Result**: Customers get incorrect quotes for impossible moves
- **Solution**: Enforce `duration_sec >= 36000` (10 hours) → Contact Sales

### **Problem 3: No Fallback Logic**
- **Current Issue**: When Directions API fails, no backup plan
- **Result**: System returns default values instead of proper rejection
- **Solution**: Directions → Matrix → Heuristic → Reject

---

## 🔧 **GOLDEN RULES FOR MAPBOX INTEGRATION**

### **Rule 1: Always Route with Coordinates, Not Raw Addresses**
```bash
# ❌ WRONG - Raw addresses to Directions
curl "https://api.mapbox.com/directions/v5/mapbox/driving/16%20Island%20Green%20Lane%2C%20Markham%2C%20Ontario%20L6C%200Y7%2C%20Canada;21%20Four%20Seasons%20Lane%2C%20Brule%2C%20Nova%20Scotia%20B0K%201N0%2C%20Canada"

# ✅ CORRECT - Geocode first, then use coordinates
curl "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-79.262931,43.906779;-63.0,45.0"
```

### **Rule 2: Use Geocoding v6 with Proper Parameters**
```bash
# Forward geocoding with Canada bias
curl -s "https://api.mapbox.com/geocoding/v6/forward?q=Toronto%2C%20ON&types=place,address,locality&country=CA&limit=1&access_token=$MAPBOX_TOKEN"
```

### **Rule 3: Use driving-traffic Profile for Realistic Times**
```bash
# Directions with traffic awareness
curl -s "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-79.3832,43.6532;-73.5673,45.5019?geometries=geojson&annotations=duration,distance&alternatives=true&access_token=$MAPBOX_TOKEN"
```

### **Rule 4: Matrix API as Fallback**
```bash
# Matrix API for ETA-only when Directions fails
curl -s "https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/-79.3832,43.6532;-73.5673,45.5019?annotations=duration,distance&access_token=$MAPBOX_TOKEN"
```

---

## 📊 **WORKING CURL PATTERNS**

### **A) Forward Geocoding (v6) with Tight Filters**
```bash
# Toronto (origin)
curl -s "https://api.mapbox.com/geocoding/v6/forward?q=Toronto%2C%20ON&types=place,address,locality&country=CA&limit=1&access_token=$MAPBOX_TOKEN"

# Montreal (destination)
curl -s "https://api.mapbox.com/geocoding/v6/forward?q=Montreal%2C%20QC&types=place,address,locality&country=CA&limit=1&access_token=$MAPBOX_TOKEN"
```

**Key Parameters:**
- `types=address,place,locality` - avoid noisy POIs
- `country=CA` - bias to Canada
- `limit=1` - get best match only

### **B) Directions (Traffic-Aware) with Robust Fields**
```bash
curl -s "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-79.3832,43.6532;-73.5673,45.5019?geometries=geojson&annotations=duration,distance&alternatives=true&overview=full&access_token=$MAPBOX_TOKEN"
```

**Key Parameters:**
- `profile=driving-traffic` - realistic times with traffic
- `annotations=duration,distance` - get raw numbers
- `alternatives=true` - try multiple routes if one fails
- `geometries=geojson` - for map visualization

### **C) Matrix ETA Fallback**
```bash
curl -s "https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/-79.3832,43.6532;-73.5673,45.5019?annotations=duration,distance&access_token=$MAPBOX_TOKEN"
```

**Returns:**
- `durations[0][1]` - A→B duration in seconds
- `distances[0][1]` - A→B distance in meters

---

## 🎯 **10-HOUR CAP IMPLEMENTATION**

### **The Exact Guard We Need**
```python
TEN_HOURS_SEC = 10 * 3600  # 36000 seconds

def enforce_10_hour_cap(duration_sec: float) -> bool:
    """Returns True if move should be rejected (≥10 hours)"""
    return duration_sec >= TEN_HOURS_SEC
```

### **Fallback Sequence**
1. **Directions API** (best accuracy)
2. **Matrix API** (ETA-only fallback)
3. **Provincial Heuristic** (region-based gating)
4. **Reject to Contact Sales** (safety net)

---

## 🔍 **DEBUGGING CHECKLIST**

### **1. Print Exact URLs (Without Token)**
```python
print(f"DEBUG: Calling {url} with params {params}")
print(f"DEBUG: HTTP status {response.status_code}")
print(f"DEBUG: Response code {data.get('code')}")
```

### **2. Log Geocoded Coordinates**
```python
print(f"DEBUG: Geocoded origin: {origin_coords}")
print(f"DEBUG: Geocoded destination: {dest_coords}")
```

### **3. Test Coordinates Manually**
```bash
# Test the exact coordinates from your geocoding
curl -s "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-79.262931,43.906779;-63.0,45.0?access_token=$MAPBOX_TOKEN"
```

### **4. Try Matrix Fallback**
```bash
# If Directions fails, try Matrix on same coordinates
curl -s "https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/-79.262931,43.906779;-63.0,45.0?access_token=$MAPBOX_TOKEN"
```

### **5. Provincial Sanity Check**
- **Toronto→Hamilton**: ~70-90 km, ~60-90 min ✅
- **Toronto→Montreal**: ~5-6 hours ✅
- **Toronto→Vancouver**: ~40+ hours → Should reject ❌
- **Markham→Brule, NS**: ~17+ hours → Should reject ❌

---

## 🚀 **PRODUCTION-READY IMPLEMENTATION STRATEGY**

### **Phase 1: Fix Geocoding**
1. Update `mapbox_service.py` to use v6 geocoding
2. Always geocode before calling Directions
3. Extract coordinates properly

### **Phase 2: Fix Directions**
1. Use `driving-traffic` profile
2. Add proper error handling for `null` responses
3. Implement Matrix fallback

### **Phase 3: Implement 10-Hour Cap**
1. Check `duration_sec >= 36000`
2. Return special "Contact Sales" vendor card
3. Add provincial heuristic for edge cases

### **Phase 4: Testing**
1. Test all 5 scenarios from our curl tests
2. Verify long-distance moves are rejected
3. Verify short-distance moves work correctly

---

## 📋 **CURRENT SYSTEM STATUS**

### **What's Working ✅**
- Dispatcher selection (Vaughan, ON for Markham)
- Total distance calculation (75.9km for Vaughan)
- Short-distance moves (Toronto→Mississauga: 0.5-2h)

### **What's Broken ❌**
- Mapbox API calls returning `null` duration
- 10-hour limit not enforced
- Long-distance moves showing 2.6h instead of 17+h
- No fallback when Directions API fails

### **Root Cause**
- Passing raw addresses to Directions API instead of coordinates
- Missing proper error handling for failed geocoding
- No Matrix API fallback implementation

---

## 🎯 **NEXT STEPS**

1. **Document this data** ✅ (This file)
2. **Fix mapbox_service.py** to use coordinates
3. **Implement Matrix fallback**
4. **Add 10-hour cap enforcement**
5. **Test with all 5 scenarios**
6. **Deploy and verify**

---

*Last Updated: January 15, 2025*
*Status: Documentation Complete - Ready for Implementation*
