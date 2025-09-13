# 📊 **LET'S GET MOVING CSV ANALYSIS 2025**

## 🎯 **COMPREHENSIVE ANALYSIS COMPLETED**

### **CSV Download Results**
- **47 Canadian GID CSVs** successfully downloaded
- **System CSVs**: year.csv, truck_storage.csv, time_zones.csv, discounts.csv, deposit_amounts.csv
- **Location CSVs**: 42 location-specific CSVs with complete calendar data

### **File Size Analysis**
- **Largest files**: 18,678 characters (301 lines)
- **Average size**: ~15,000 characters (300+ lines)
- **All files**: Hundreds of lines as expected

## 📅 **CALENDAR DATA STRUCTURE**

### **Month Pattern Analysis**
Each CSV contains full year calendar data with different structures:

#### **Standard Pattern (Most Common)**
```
DURHAM,,,,,,,MAR,,DURHAM,,,,,,,APR,
SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,,SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,
,,,1,2,3,4,,,,,,,,,1,,
,,,149,139,139,139,,,,,,,,,169,,
5,6,7,8,9,10,11,,,2,3,4,5,6,7,8,,
139,139,139,139,139,139,139,,,139,139,139,139,139,139,139,,
```

#### **Toronto Pattern**
```
TORONTO - MAY,,,,,,,MAY,,TORONTO - JUNE,,,,,,,JUN
SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,,SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,
```

#### **Vancouver Pattern**
```
VANCOUVER - MARCH,,,,,,,MAR,,VANCOUVER - APRIL,,,,,,,APR,,
SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,,SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,,
```

## 📍 **LOCATION DETAILS EXTRACTED**

### **Abbotsford (GID: 586231927)**
- **Location**: Abbotsford, BC
- **Address**: 32615 South Fraser Way unit 1402 104, Abbotsford, BC V2T 1X8
- **OPS Manager**: Harsh: 825-343-5734/Anees Aps 780-920-1935
- **Trucks**: 1+
- **Terminal ID**: 35zt7H96uDK

### **Toronto North York (GID: 348861685)**
- **Location**: Toronto North York
- **Address**: 945 Wilson Ave, North York
- **OPS Manager**: NICK (437-983-2384)
- **Sales Phone**: (416) 955-0079 - Dial 2 for Operations
- **Trucks**: 7+ (2 trucks fit more than 3 men)
- **Terminal ID**: 29y5QUbS

### **Calgary (GID: 1384980803)**
- **Location**: Calgary, AB
- **Address**: 1122 40 Ave NE unit 120, Calgary, AB, T2E 5T8
- **OPS Manager**: HARRY (437-256-3488), Jasdeep: 647-960-0267
- **Sales Phone**: 587-430-3006 - Dial 2 for Operations
- **Trucks**: 3 - ONLY seats 3 men
- **Terminal ID**: 5kra4TT8x

### **Vancouver (GID: 445545962)**
- **Location**: Vancouver, BC
- **Address**: 400 Industrial Avenue, Vancouver V6A2P3
- **OPS Manager**: Raz and Shabaz
- **Sales Phone**: (604) 238-1500 - Dial 2 for Operations
- **Trucks**: 9 trucks - 5 seats 3 men
- **Terminal ID**: 4bt5PHj6YWY4

### **Montreal (GID: 1591534972)**
- **Location**: Montreal, QC
- **Address**: 3700 Rue Griffith, Saint-Laurent, QC
- **OPS Manager**: Chafe - 438-483-3577
- **Sales Phone**: (514) 556 8898 - Dial 2 for Operations
- **Trucks**: 4 TRUCK
- **Terminal ID**: 3jR4exGpu24Q

## 💰 **PRICING DATA STRUCTURE**

### **Hourly Rate Patterns**
- **Standard rates**: 139, 149, 169, 199
- **Weekend rates**: Higher rates on weekends
- **Special rates**: 219/169, 239/199 (range pricing)
- **Location-specific**: Different base rates per location

### **Calendar Coverage**
- **Full year**: All 12 months (JAN-DEC)
- **Complete dates**: 1-31 for each month
- **Day of week**: Proper calendar layout
- **Price mapping**: Date to hourly rate mapping

## 🔧 **PARSER FIXES REQUIRED**

### **1. Month Pattern Recognition**
```python
# Handle: DURHAM,,,,,,,MAR,,DURHAM,,,,,,,APR,
month_pattern = r'([A-Z]+),+([A-Z]{3}),+([A-Z]+),+([A-Z]{3})'
```

### **2. Location Details Extraction**
```python
patterns = {
    'ops_manager': r'OPS MANAGER:\s*([^\n,]+)',
    'address': r'ADDRESS:\s*([^\n,]+)',
    'sales_phone': r'SALES #:\s*([^\n,]+)',
    'truck_count': r'# OF TRUCKS:\s*([^\n,]+)',
    'terminal_id': r'Terminal ID:\s*([^\n,]+)'
}
```

### **3. Calendar Data Extraction**
- Find month sections
- Extract day numbers (1-31)
- Extract corresponding prices
- Build date-to-price mapping

## 📈 **EXPECTED RESULTS**

After implementing the fixes:
- **Let's Get Moving** will appear in live API responses
- **Complete calendar data** for all 47 Canadian locations
- **Proper location details** with names, addresses, phones
- **Full year pricing** available for all dates
- **System stability** maintained

## 🔒 **VENDOR LOGIC PRESERVATION**

**Critical**: Each vendor maintains their own calculation logic:
- **Let's Get Moving**: Uses Google Sheets calendar data
- **Easy2Go**: Uses their own pricing system
- **Velocity Movers**: Uses their own pricing system
- **Pierre & Sons**: Uses their own pricing system

The fix only addresses the **data extraction** issue, not the calculation logic.
