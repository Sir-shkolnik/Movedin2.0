#!/bin/bash

# MovedIn 2.0 Deployment Script
# This script handles deployment to Render and local development

set -e

echo "🚀 MovedIn 2.0 Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Frontend build may fail."
    fi
    
    if ! command -v python3 &> /dev/null; then
        print_warning "Python 3 is not installed. Backend tests may fail."
    fi
    
    print_success "Dependencies check completed"
}

# Build and test the application
build_and_test() {
    print_status "Building and testing application..."
    
    # Test backend
    print_status "Testing backend..."
    cd backend
    if command -v python3 &> /dev/null; then
        python3 -m pytest tests/ -v || print_warning "Backend tests failed, but continuing..."
    fi
    cd ..
    
    # Test frontend
    print_status "Testing frontend..."
    cd frontend
    if command -v npm &> /dev/null; then
        npm run lint || print_warning "Frontend linting failed, but continuing..."
    fi
    cd ..
    
    print_success "Build and test completed"
}

# Deploy to Render
deploy_render() {
    print_status "Deploying to Render..."
    
    if [ ! -f "render.yaml" ]; then
        print_error "render.yaml not found. Please ensure the deployment configuration exists."
        exit 1
    fi
    
    print_status "Pushing to Render..."
    # Note: This requires Render CLI or manual deployment through Render dashboard
    print_warning "Please deploy manually through Render dashboard or use Render CLI"
    print_status "1. Go to https://dashboard.render.com"
    print_status "2. Connect your GitHub repository"
    print_status "3. Use render.yaml for configuration"
    
    print_success "Render deployment instructions provided"
}

# Local development setup
setup_local() {
    print_status "Setting up local development environment..."
    
    # Create .env files if they don't exist
    if [ ! -f "backend/.env" ]; then
        print_status "Creating backend .env file..."
        cat > backend/.env << EOF
DATABASE_URL=postgresql://movedin:movedin@localhost:5432/movedin
REDIS_URL=redis://localhost:6379
DEBUG=true
ZOHO_CLIENT_ID=1000.GXDHGOMA40H9WBM20CIJ8U0UGNTKTL
ZOHO_CLIENT_SECRET=77a9aa4bd323fa083a41543e6302875582d61d5d10
ZOHO_REDIRECT_URI=http://localhost:8000/api/zoho/callback
ZOHO_AUTH_URL=https://accounts.zoho.com/oauth/v2/auth
ZOHO_TOKEN_URL=https://accounts.zoho.com/oauth/v2/token
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v3
EOF
    fi
    
    if [ ! -f "frontend/.env" ]; then
        print_status "Creating frontend .env file..."
        cat > frontend/.env << EOF
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibW92ZWRpbiIsImEiOiJjbGV4YW1wbGUifQ.example
EOF
    fi
    
    print_success "Local environment setup completed"
}

# Start local development
start_local() {
    print_status "Starting local development environment..."
    
    setup_local
    
    # Start Docker services
    print_status "Starting Docker services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    print_status "Checking service health..."
    
    # Check backend
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend may still be starting up"
    fi
    
    print_success "Local development environment started"
    print_status "Backend: http://localhost:8000"
    print_status "Frontend: http://localhost:5173"
    print_status "Database: localhost:5432"
    print_status "Redis: localhost:6379"
}

# Stop local development
stop_local() {
    print_status "Stopping local development environment..."
    docker-compose down
    print_success "Local development environment stopped"
}

# Clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Show status
show_status() {
    print_status "Checking system status..."
    
    # Check Docker containers
    if docker-compose ps | grep -q "Up"; then
        print_success "Docker services are running"
        docker-compose ps
    else
        print_warning "No Docker services are running"
    fi
    
    # Check backend health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
        curl -s http://localhost:8000/health | jq .
    else
        print_error "Backend is not responding"
    fi
}

# Main script logic
case "${1:-help}" in
    "deploy")
        check_dependencies
        build_and_test
        deploy_render
        ;;
    "start")
        check_dependencies
        start_local
        ;;
    "stop")
        stop_local
        ;;
    "restart")
        stop_local
        start_local
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "setup")
        setup_local
        ;;
    "test")
        build_and_test
        ;;
    "help"|*)
        echo "Usage: $0 {deploy|start|stop|restart|status|cleanup|setup|test|help}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy to Render"
        echo "  start    - Start local development environment"
        echo "  stop     - Stop local development environment"
        echo "  restart  - Restart local development environment"
        echo "  status   - Show system status"
        echo "  cleanup  - Clean up Docker resources"
        echo "  setup    - Setup local environment"
        echo "  test     - Build and test application"
        echo "  help     - Show this help message"
        ;;
esac 