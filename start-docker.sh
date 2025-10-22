#!/bin/bash

# MovedIn 3.0 - Full Stack Docker Startup Script
echo "🚀 Starting MovedIn 3.0 - Full Stack Smart & Secure System"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove any existing containers to ensure clean start
echo "🧹 Cleaning up old containers..."
docker-compose rm -f

# Build and start the services
echo "🔨 Building and starting full stack services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check if backend is healthy
echo "🔍 Checking backend health..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy and running on http://localhost:8000"
    echo "📧 Email system: Configured (check logs for details)"
    echo "🔒 Security: Production mode enabled"
    echo "📊 API Docs: http://localhost:8000/docs"
else
    echo "❌ Backend health check failed"
    echo "📋 Checking backend logs..."
    docker-compose logs movedin-backend
fi

# Check if frontend is healthy
echo "🔍 Checking frontend health..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Frontend is healthy and running on http://localhost:3000"
    echo "🌐 Web App: http://localhost:3000"
else
    echo "❌ Frontend health check failed"
    echo "📋 Checking frontend logs..."
    docker-compose logs movedin-frontend
fi

echo ""
echo "🎉 MovedIn 3.0 Full Stack is ready!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔍 Backend Health: http://localhost:8000/health"
echo "🔍 Frontend Health: http://localhost:3000/health"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "📋 To view backend logs: docker-compose logs movedin-backend"
echo "📋 To view frontend logs: docker-compose logs movedin-frontend"
echo "🛑 To stop: docker-compose down"
echo ""
echo "🚀 Ready for GitHub and Render deployment!"
