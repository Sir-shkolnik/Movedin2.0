#!/bin/bash
cd "/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0/backend"

echo "Starting MovedIn 3.0 Backend..."
echo ""

# Kill any existing processes on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Start the server
python3 run.py 2>&1

