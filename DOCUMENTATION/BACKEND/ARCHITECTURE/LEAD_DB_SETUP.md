# Lead Database Setup Guide

## 🗄️ **Current Database Status: FULLY OPERATIONAL**

### ✅ **Database Configuration**
- **Type**: PostgreSQL 15.13 (Debian 15.13-1.pgdg120+1)
- **Architecture**: ARM64 (aarch64-unknown-linux-gnu)
- **Database**: `movedin`
- **Username**: `movedin`
- **Password**: `movedin`
- **Host**: `localhost` (external access) / `postgres` (internal Docker)
- **Port**: `5432`

## 🚀 **Quick Connection**

### **Docker Connection (Recommended)**
```bash
# Connect to database
docker exec -it movedin20-postgres-1 psql -U movedin -d movedin

# View all tables
\dt

# View leads with payment data
SELECT id, origin_address, destination_address, payment_intent_id, created_at FROM leads;
```

### **External Connection**
```bash
# Using psql client
psql -h localhost -p 5432 -U movedin -d movedin

# GUI Tools (DBeaver, pgAdmin, etc.)
Host: localhost
Port: 5432
Database: movedin
Username: movedin
Password: movedin
```

## 📊 **Current Schema**

### **Tables Overview**
```sql
-- View all tables
\dt

-- Expected output:
           List of relations
 Schema |    Name     | Type  | Owner  
--------+-------------+-------+--------
 public | alembic_version | table | movedin
 public | dispatchers     | table | movedin
 public | leads          | table | movedin
 public | quotes         | table | movedin
 public | users          | table | movedin
 public | vendors        | table | movedin
```

### **Leads Table (Updated with Payment Integration)**
```sql
-- View leads table structure
\d leads

-- Expected structure:
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    origin_address VARCHAR NOT NULL,
    destination_address VARCHAR NOT NULL,
    move_date DATE NOT NULL,
    move_time VARCHAR NOT NULL,
    total_rooms INTEGER NOT NULL,
    square_footage VARCHAR,
    estimated_weight FLOAT DEFAULT 0,
    heavy_items JSONB DEFAULT '{}',
    stairs_at_pickup INTEGER DEFAULT 0,
    stairs_at_dropoff INTEGER DEFAULT 0,
    elevator_at_pickup BOOLEAN DEFAULT FALSE,
    elevator_at_dropoff BOOLEAN DEFAULT FALSE,
    additional_services JSONB DEFAULT '{}',
    selected_vendor_id INTEGER,
    selected_quote_id INTEGER,
    payment_intent_id VARCHAR,  -- ✅ NEW: Stripe payment intent ID
    status VARCHAR DEFAULT 'new',
    source VARCHAR DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Vendors Table**
```sql
-- View vendors table
\d vendors

-- Expected structure:
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    slug VARCHAR NOT NULL UNIQUE,
    display_name VARCHAR NOT NULL,
    logo_url VARCHAR,
    vendor_type VARCHAR NOT NULL,
    pricing_model JSONB,
    coverage_areas JSONB,
    service_radius FLOAT,
    phone VARCHAR,
    email VARCHAR,
    website VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 **Recent Updates**

### ✅ **Payment Integration Added**
- **Field**: `payment_intent_id VARCHAR` added to leads table
- **Purpose**: Store Stripe payment intent ID for payment tracking
- **Status**: ✅ **Working** - Automatically saved after successful payment

### ✅ **Vendor System Integration**
- **Real Vendor Quotes**: 4 vendors with working pricing logic
- **Geographic Dispatching**: Location-based vendor selection
- **Service Area Validation**: Proper city/region filtering

### ✅ **Lead Management**
- **Automatic Lead Creation**: After successful payment
- **Complete Data Capture**: All form fields stored
- **Payment Tracking**: Stripe integration working

## 📈 **Data Verification**

### **Check Current Data**
```sql
-- View all leads
SELECT 
    id,
    origin_address,
    destination_address,
    payment_intent_id,
    status,
    created_at
FROM leads
ORDER BY created_at DESC;

-- View vendor data
SELECT 
    id,
    name,
    slug,
    is_active,
    service_radius
FROM vendors
WHERE is_active = true;

-- Check for payment data
SELECT 
    COUNT(*) as total_leads,
    COUNT(payment_intent_id) as paid_leads,
    COUNT(*) FILTER (WHERE payment_intent_id IS NOT NULL) as payment_success_rate
FROM leads;
```

### **Test Lead Creation**
```sql
-- Insert test lead
INSERT INTO leads (
    origin_address,
    destination_address,
    move_date,
    move_time,
    total_rooms,
    payment_intent_id,
    status
) VALUES (
    '123 Test St, Toronto, ON',
    '456 Test Ave, Toronto, ON',
    '2025-07-30',
    'Afternoon',
    4,
    'pi_test_123456789',
    'new'
);

-- Verify insertion
SELECT * FROM leads WHERE origin_address LIKE '%Test%';
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Connection Refused**
```bash
# Check if Docker containers are running
docker-compose ps

# Restart if needed
docker-compose restart postgres
```

#### **2. Authentication Failed**
```bash
# Verify credentials
docker exec -it movedin20-postgres-1 psql -U movedin -d movedin -c "SELECT current_user, current_database();"
```

#### **3. Table Not Found**
```sql
-- Check if tables exist
\dt

-- If missing, check migrations
SELECT * FROM alembic_version;
```

### **Database Health Check**
```sql
-- Check database size
SELECT 
    pg_size_pretty(pg_database_size('movedin')) as database_size;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check recent activity
SELECT 
    query_start,
    state,
    query
FROM pg_stat_activity 
WHERE datname = 'movedin'
ORDER BY query_start DESC;
```

## 🚀 **Performance Optimization**

### **Indexes (Auto-created)**
```sql
-- View existing indexes
\di

-- Common indexes should exist on:
-- leads: id, created_at, payment_intent_id
-- vendors: slug, is_active
-- quotes: vendor_id, created_at
```

### **Maintenance**
```sql
-- Analyze tables for query optimization
ANALYZE leads;
ANALYZE vendors;
ANALYZE quotes;

-- Vacuum to reclaim space
VACUUM ANALYZE;
```

## 📊 **Monitoring**

### **Key Metrics**
```sql
-- Lead conversion rate
SELECT 
    COUNT(*) as total_leads,
    COUNT(payment_intent_id) as paid_leads,
    ROUND(COUNT(payment_intent_id) * 100.0 / COUNT(*), 2) as conversion_rate
FROM leads;

-- Vendor performance
SELECT 
    v.name,
    COUNT(q.id) as quote_count,
    AVG(q.total_cost) as avg_quote
FROM vendors v
LEFT JOIN quotes q ON v.id = q.vendor_id
WHERE v.is_active = true
GROUP BY v.id, v.name
ORDER BY quote_count DESC;
```

## 🔐 **Security**

### **Access Control**
- **Database**: Only accessible via Docker container
- **Credentials**: Stored in environment variables
- **Network**: Isolated in Docker network
- **Backup**: Regular backups recommended

### **Environment Variables**
```bash
# Database connection
DATABASE_URL=postgresql://movedin:movedin@postgres:5432/movedin

# For external access
DATABASE_URL=postgresql://movedin:movedin@localhost:5432/movedin
```

## 📚 **Related Documentation**

- **Main README**: [README.md](../README.md)
- **Vendor Logic**: [GEOGRAPHIC_VENDOR_LOGIC.md](GEOGRAPHIC_VENDOR_LOGIC.md)
- **Payment Integration**: [PAYMENT_LEAD_INTEGRATION.md](../PAYMENT_LEAD_INTEGRATION.md)
- **Admin Dashboard**: [ADMIN_DASHBOARD_IMPLEMENTATION.md](../ADMIN_DASHBOARD_IMPLEMENTATION.md)

---

**Last Updated**: January 2025  
**Status**: ✅ **FULLY OPERATIONAL**  
**Version**: 2.0 