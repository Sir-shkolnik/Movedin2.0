# 🗂️ MovedIn V3.0 Project Structure

## 📁 **Organized Directory Structure**

```
MovedinV3.0/
├── 📁 src/                          # Main source code
│   ├── 📁 frontend/                 # React frontend application
│   │   ├── 📁 src/                  # React source code
│   │   ├── 📁 public/               # Static assets
│   │   ├── 📁 node_modules/         # Dependencies
│   │   ├── package.json             # Frontend dependencies
│   │   └── vite.config.js           # Vite configuration
│   └── 📁 backend/                  # Python backend application
│       ├── 📁 app/                  # FastAPI application
│       │   ├── 📁 api/              # API routes
│       │   ├── 📁 core/             # Core configuration
│       │   ├── 📁 models/           # Database models
│       │   ├── 📁 services/         # Business logic
│       │   └── 📁 schemas/          # Pydantic schemas
│       ├── main.py                  # FastAPI main application
│       └── requirements.txt         # Python dependencies
├── 📁 docs/                         # All documentation
│   ├── 📁 architecture/             # System architecture docs
│   │   ├── SIMPLIFIED_DATA_FLOW_ANALYSIS.md
│   │   └── SMART_SECURE_IMPLEMENTATION.md
│   ├── 📁 implementation/           # Implementation guides
│   │   ├── BACKEND_IMPLEMENTATION_PLAN.md
│   │   ├── COMPLETE_JOURNEY_SUMMARY.md
│   │   ├── COMPLETE_STATUS_REPORT.md
│   │   ├── EMAIL_SYSTEM_COMPLETE.md
│   │   ├── ENABLE_REAL_EMAILS.md
│   │   ├── IMPLEMENTATION_GUIDE.md
│   │   ├── INTEGRATION_COMPLETE.md
│   │   ├── QUICK_BACKEND_SETUP.md
│   │   └── STRIPE_PAYMENT_INTEGRATION_GUIDE.md
│   ├── 📁 testing/                  # Test documentation
│   │   ├── COMPREHENSIVE_TEST_SUITE.md
│   │   └── TEST_RESULTS.md
│   ├── 📁 deployment/               # Deployment guides
│   └── 📁 api/                      # API documentation
├── 📁 logs/                         # All log files
│   ├── 📁 backend/                  # Backend logs
│   │   ├── backend.log
│   │   ├── backend_new.log
│   │   ├── backend_output.log
│   │   ├── backend_server.log
│   │   ├── server.log
│   │   ├── simple_backend.log
│   │   ├── start_output.log
│   │   ├── test_results.txt
│   │   ├── test_run.log
│   │   ├── test_server_output.log
│   │   └── uvicorn.log
│   ├── 📁 frontend/                 # Frontend logs
│   │   ├── frontend.log
│   │   └── frontend_new.log
│   └── 📁 system/                   # System logs
├── 📁 scripts/                      # All scripts
│   ├── 📁 deployment/               # Deployment scripts
│   ├── 📁 testing/                  # Test scripts
│   └── 📁 utilities/                # Utility scripts
│       ├── init_db.py               # Database initialization
│       └── start_server.sh         # Server startup script
├── 📁 config/                       # Configuration files
│   ├── 📁 environment/              # Environment configs
│   │   └── .env                     # Environment variables
│   └── 📁 deployment/               # Deployment configs
├── 📁 assets/                       # Static assets
│   ├── 📁 images/                   # Images and logos
│   ├── 📁 templates/                # Email templates
│   │   ├── customer_confirmation_perfect.html
│   │   ├── vendor_notification_perfect.html
│   │   ├── support_notification_perfect.html
│   │   └── README.md
│   └── 📁 data/                     # Data files
│       └── movedin.db               # SQLite database
├── 📁 tests/                        # Test files
│   ├── 📁 unit/                     # Unit tests
│   ├── 📁 integration/              # Integration tests
│   ├── 📁 e2e/                      # End-to-end tests
│   ├── test_complete_journey.py     # Complete journey test
│   ├── test_email_direct.py         # Email test
│   └── test_import.py               # Import test
│   └── 📁 utilities/                # Test utilities
│       └── quick_test.py            # Quick test utility
├── 📁 archive/                       # Archived files
│   ├── 📁 Main_Page/                # Old main page
│   ├── 📁 documentation/             # Old documentation
│   ├── 📁 old_main_page/             # Old main page files
│   └── 📁 old_references/            # Old reference files
├── README.md                        # Main project README
├── START_HERE.md                    # Getting started guide
└── ORGANIZATION_PLAN.md              # Organization plan
```

## 🔧 **Updated Code References**

### **Backend Configuration Updates:**
- **Database Path**: `sqlite:///../../assets/data/movedin.db`
- **Environment File**: `../../config/environment/.env`
- **Email Templates**: `../../assets/templates/`

### **Frontend Configuration:**
- **API Endpoints**: Still use `http://localhost:8000` (server port)
- **Build Output**: `dist/` directory
- **Development Server**: `http://localhost:5173`

### **Scripts and Utilities:**
- **Database Init**: `scripts/utilities/init_db.py`
- **Server Start**: `scripts/utilities/start_server.sh`
- **Tests**: `tests/` directory with organized test files

## 📋 **File Organization Benefits**

### ✅ **Clean Root Directory**
- No scattered documentation files
- No log files in root
- Clear project structure

### ✅ **Logical Grouping**
- **Source Code**: `src/frontend/` and `src/backend/`
- **Documentation**: `docs/` with categorized subdirectories
- **Logs**: `logs/` with backend/frontend/system separation
- **Scripts**: `scripts/` with deployment/testing/utilities
- **Config**: `config/` with environment/deployment
- **Assets**: `assets/` with images/templates/data
- **Tests**: `tests/` with unit/integration/e2e

### ✅ **Easy Maintenance**
- Find specific file types quickly
- Clear separation of concerns
- Professional project appearance
- Easy to navigate for new developers

## 🚀 **Development Workflow**

### **Frontend Development:**
```bash
cd src/frontend
npm install
npm run dev
```

### **Backend Development:**
```bash
cd src/backend
pip install -r requirements.txt
python main.py
```

### **Database Management:**
```bash
python scripts/utilities/init_db.py
```

### **Testing:**
```bash
python tests/test_complete_journey.py
```

## 📁 **Key Directories**

- **`src/`**: Main application code
- **`docs/`**: All project documentation
- **`logs/`**: All log files organized by component
- **`scripts/`**: All executable scripts
- **`config/`**: Configuration files
- **`assets/`**: Static assets and data files
- **`tests/`**: Test files and utilities
- **`archive/`**: Archived and old files

## 🎯 **Next Steps**

1. **Update Documentation**: Update all cross-references in documentation
2. **Test Functionality**: Verify all paths work correctly
3. **Update CI/CD**: Update any deployment scripts
4. **Team Onboarding**: Update onboarding documentation
5. **Maintenance**: Regular cleanup of logs and temporary files

**The project is now properly organized with a clean, professional structure!** 🎉
