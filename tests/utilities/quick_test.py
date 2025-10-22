#!/usr/bin/env python3
print("Starting test...")
import sys
print(f"Python version: {sys.version}")

try:
    from app.main import app
    print("✓ App imported successfully!")
    print("Starting server...")
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

