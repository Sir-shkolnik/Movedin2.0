#!/bin/bash
# Automated Test Runner for MovedIn V3.0
# Runs all test suites and generates reports

echo "🧪 MovedIn V3.0 - Comprehensive Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is running
echo "🔍 Checking if backend server is running..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${RED}❌ Backend server is not running${NC}"
    echo "Please start the backend server first:"
    echo "  cd src/backend && python -m uvicorn main:app --reload"
    exit 1
fi

# Navigate to tests directory
cd "$(dirname "$0")"

# Install test dependencies if needed
echo ""
echo "📦 Checking test dependencies..."
if ! python3 -c "import pytest" 2>/dev/null; then
    echo "Installing test dependencies..."
    pip3 install -r requirements-test.txt
fi

# Create reports directory
mkdir -p reports

echo ""
echo "=========================================="
echo "🧪 Running Test Suites"
echo "=========================================="

# Run unit tests
echo ""
echo -e "${YELLOW}📝 Running Unit Tests...${NC}"
python3 -m pytest unit/ -v --tb=short --cov=../src/backend/app \
    --cov-report=html:reports/coverage \
    --cov-report=term-missing \
    --html=reports/unit-tests.html --self-contained-html

UNIT_EXIT=$?

# Run integration tests
echo ""
echo -e "${YELLOW}🔗 Running Integration Tests...${NC}"
python3 -m pytest integration/ -v --tb=short \
    --html=reports/integration-tests.html --self-contained-html

INTEGRATION_EXIT=$?

# Run E2E tests
echo ""
echo -e "${YELLOW}🎯 Running E2E Tests...${NC}"
python3 -m pytest e2e/ -v --tb=short -s \
    --html=reports/e2e-tests.html --self-contained-html

E2E_EXIT=$?

# Run security tests
echo ""
echo -e "${YELLOW}🔐 Running Security Tests (OWASP)...${NC}"
python3 -m pytest integration/test_security_owasp.py -v --tb=short \
    --html=reports/security-tests.html --self-contained-html

SECURITY_EXIT=$?

# Run performance tests
echo ""
echo -e "${YELLOW}⚡ Running Performance Tests...${NC}"
python3 -m pytest integration/test_performance.py -v --tb=short -s \
    --html=reports/performance-tests.html --self-contained-html

PERFORMANCE_EXIT=$?

# Generate summary
echo ""
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="

# Count total tests and failures
TOTAL_TESTS=0
FAILED_TESTS=0

if [ $UNIT_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Unit Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Unit Tests: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if [ $INTEGRATION_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Integration Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Integration Tests: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if [ $E2E_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ E2E Tests: PASSED${NC}"
else
    echo -e "${RED}❌ E2E Tests: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if [ $SECURITY_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Security Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Security Tests: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if [ $PERFORMANCE_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Performance Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Performance Tests: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "=========================================="
PASSED_TESTS=$((TOTAL_TESTS - FAILED_TESTS))
echo "Total: $PASSED_TESTS/$TOTAL_TESTS test suites passed"
echo ""

# Show reports location
echo "📄 Test reports generated in: tests/reports/"
echo "   - Coverage Report: reports/coverage/index.html"
echo "   - Unit Tests: reports/unit-tests.html"
echo "   - Integration Tests: reports/integration-tests.html"
echo "   - E2E Tests: reports/e2e-tests.html"
echo "   - Security Tests: reports/security-tests.html"
echo "   - Performance Tests: reports/performance-tests.html"
echo ""

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All test suites passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some test suites failed${NC}"
    exit 1
fi

