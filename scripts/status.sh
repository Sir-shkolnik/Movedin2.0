#!/bin/bash

# MovedIn 2.0 Quick Status Check Script
# Provides a quick overview of all service statuses

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# URLs
FRONTEND_URL="https://movedin-frontend.onrender.com"
BACKEND_URL="https://movedin-backend.onrender.com"
ADMIN_URL="https://movedin-frontend.onrender.com/admin"
API_DOCS_URL="https://movedin-backend.onrender.com/docs"

# Function to check URL status
check_url() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name"
        return 0
    else
        echo -e "${RED}❌${NC} $name"
        return 1
    fi
}

# Function to check API health
check_api_health() {
    local response=$(curl -s "$BACKEND_URL/health" 2>/dev/null)
    if [ $? -eq 0 ] && echo "$response" | grep -q "healthy"; then
        echo -e "${GREEN}✅${NC} Backend API Health"
        return 0
    else
        echo -e "${RED}❌${NC} Backend API Health"
        return 1
    fi
}

# Function to get response time
get_response_time() {
    local url=$1
    local start_time=$(date +%s%N)
    curl -s -f "$url" >/dev/null 2>&1
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))
    echo "${duration}ms"
}

# Main status check
echo -e "${BLUE}🚀 MovedIn 2.0 Service Status${NC}"
echo "=================================="
echo

# Check all services
services_ok=0
total_services=0

((total_services++))
if check_url "$FRONTEND_URL" "Frontend"; then
    ((services_ok++))
fi

((total_services++))
if check_url "$BACKEND_URL" "Backend"; then
    ((services_ok++))
fi

((total_services++))
if check_url "$ADMIN_URL" "Admin Panel"; then
    ((services_ok++))
fi

((total_services++))
if check_url "$API_DOCS_URL" "API Documentation"; then
    ((services_ok++))
fi

((total_services++))
if check_api_health; then
    ((services_ok++))
fi

echo
echo -e "${BLUE}📊 Summary:${NC}"
echo "Services: $services_ok/$total_services operational"

if [ $services_ok -eq $total_services ]; then
    echo -e "${GREEN}🎉 All services are running!${NC}"
else
    echo -e "${YELLOW}⚠️  Some services may have issues${NC}"
fi

echo
echo -e "${BLUE}🔗 Quick Links:${NC}"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo "Admin: $ADMIN_URL"
echo "API Docs: $API_DOCS_URL"

echo
echo -e "${BLUE}⚡ Response Times:${NC}"
echo "Frontend: $(get_response_time $FRONTEND_URL)"
echo "Backend: $(get_response_time $BACKEND_URL)"
echo "Admin: $(get_response_time $ADMIN_URL)"

echo
echo -e "${BLUE}📝 Last Updated:${NC} $(date)" 