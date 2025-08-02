#!/bin/bash

# MovedIn 2.0 Enhanced Deployment Script
# Includes validation, health checks, and monitoring

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/Sir-shkolnik/Movedin2.0"
FRONTEND_URL="https://movedin-frontend.onrender.com"
BACKEND_URL="https://movedin-backend.onrender.com"
ADMIN_URL="https://movedin-frontend.onrender.com/admin"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate environment
validate_environment() {
    log "Validating deployment environment..."
    
    # Check required tools
    local missing_tools=()
    
    if ! command_exists git; then
        missing_tools+=("git")
    fi
    
    if ! command_exists curl; then
        missing_tools+=("curl")
    fi
    
    if ! command_exists python3; then
        missing_tools+=("python3")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        error "Missing required tools: ${missing_tools[*]}"
        return 1
    fi
    
    success "All required tools are available"
    
    # Check if we're in the right directory
    if [ ! -f "render.yaml" ]; then
        error "render.yaml not found. Please run this script from the project root."
        return 1
    fi
    
    success "Project structure validated"
    
    # Run environment validation script if it exists
    if [ -f "scripts/validate_env.py" ]; then
        log "Running environment validation..."
        python3 scripts/validate_env.py
    fi
}

# Function to check git status
check_git_status() {
    log "Checking git status..."
    
    # Check if we have uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        warning "You have uncommitted changes:"
        git status --short
        read -p "Do you want to commit these changes? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Auto-commit before deployment"
            success "Changes committed"
        else
            error "Please commit or stash your changes before deploying"
            return 1
        fi
    else
        success "Working directory is clean"
    fi
    
    # Check if we're on main branch
    local current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        warning "You're on branch '$current_branch'. Deployments should be from 'main'"
        read -p "Do you want to continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
}

# Function to trigger deployment
trigger_deployment() {
    log "Triggering deployment..."
    
    # Create a deployment commit
    git commit --allow-empty -m "🚀 DEPLOY: $(date +'%Y-%m-%d %H:%M:%S') - Automated deployment"
    
    # Push to trigger Render deployment
    log "Pushing to GitHub..."
    git push origin main
    
    success "Deployment triggered successfully"
    log "Render will now build and deploy your application"
}

# Function to wait for deployment
wait_for_deployment() {
    log "Waiting for deployment to complete..."
    log "This may take 5-10 minutes..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Checking deployment status (attempt $attempt/$max_attempts)..."
        
        # Check backend health
        if curl -s -f "$BACKEND_URL/health" >/dev/null 2>&1; then
            success "Backend is responding"
            
            # Check frontend
            if curl -s -f "$FRONTEND_URL" >/dev/null 2>&1; then
                success "Frontend is responding"
                
                # Check admin panel
                if curl -s -f "$ADMIN_URL" >/dev/null 2>&1; then
                    success "Admin panel is accessible"
                    success "🎉 Deployment completed successfully!"
                    return 0
                else
                    warning "Admin panel not yet accessible"
                fi
            else
                warning "Frontend not yet responding"
            fi
        else
            warning "Backend not yet responding"
        fi
        
        # Wait before next check
        sleep 20
        ((attempt++))
    done
    
    error "Deployment timeout. Please check Render dashboard for status."
    return 1
}

# Function to run health checks
run_health_checks() {
    log "Running comprehensive health checks..."
    
    local checks_passed=0
    local total_checks=0
    
    # Backend health check
    ((total_checks++))
    if curl -s -f "$BACKEND_URL/health" >/dev/null 2>&1; then
        success "Backend health check passed"
        ((checks_passed++))
    else
        error "Backend health check failed"
    fi
    
    # Frontend availability check
    ((total_checks++))
    if curl -s -f "$FRONTEND_URL" >/dev/null 2>&1; then
        success "Frontend availability check passed"
        ((checks_passed++))
    else
        error "Frontend availability check failed"
    fi
    
    # Admin panel check
    ((total_checks++))
    if curl -s -f "$ADMIN_URL" >/dev/null 2>&1; then
        success "Admin panel check passed"
        ((checks_passed++))
    else
        error "Admin panel check failed"
    fi
    
    # API documentation check
    ((total_checks++))
    if curl -s -f "$BACKEND_URL/docs" >/dev/null 2>&1; then
        success "API documentation check passed"
        ((checks_passed++))
    else
        error "API documentation check failed"
    fi
    
    # Summary
    log "Health check summary: $checks_passed/$total_checks checks passed"
    
    if [ $checks_passed -eq $total_checks ]; then
        success "All health checks passed!"
        return 0
    else
        warning "Some health checks failed. Please investigate."
        return 1
    fi
}

# Function to show deployment info
show_deployment_info() {
    echo
    log "Deployment Information:"
    echo "======================"
    echo "Repository: $REPO_URL"
    echo "Frontend: $FRONTEND_URL"
    echo "Backend: $BACKEND_URL"
    echo "Admin Panel: $ADMIN_URL"
    echo "API Docs: $BACKEND_URL/docs"
    echo
    log "Next steps:"
    echo "1. Monitor deployment in Render dashboard"
    echo "2. Test the application functionality"
    echo "3. Check admin panel for data"
    echo "4. Verify payment flow works"
    echo
}

# Function to show help
show_help() {
    echo "MovedIn 2.0 Deployment Script"
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  deploy     - Full deployment process (validate, deploy, wait, health check)"
    echo "  validate   - Validate environment and configuration"
    echo "  health     - Run health checks on deployed services"
    echo "  info       - Show deployment information"
    echo "  help       - Show this help message"
    echo
    echo "Examples:"
    echo "  $0 deploy    # Full deployment"
    echo "  $0 validate  # Just validate environment"
    echo "  $0 health    # Just run health checks"
}

# Main function
main() {
    local command=${1:-deploy}
    
    case $command in
        "deploy")
            log "Starting full deployment process..."
            validate_environment
            check_git_status
            trigger_deployment
            wait_for_deployment
            run_health_checks
            show_deployment_info
            ;;
        "validate")
            validate_environment
            check_git_status
            ;;
        "health")
            run_health_checks
            ;;
        "info")
            show_deployment_info
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 