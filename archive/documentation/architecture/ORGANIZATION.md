# MovedIn 3.0 - Project Organization

## 📂 Folder Structure Overview

```
MovedinV3.0/
│
├── frontend/                    # ⭐ MAIN WORKING APPLICATION
│   ├── src/                     # Source code
│   ├── public/                  # Static assets
│   ├── package.json             # Dependencies
│   ├── README.md                # Quick start guide
│   ├── COMPONENTS.md            # Component docs
│   └── vite.config.js           # Vite config
│
├── archive/                     # 📦 OLD REFERENCES (Backed up)
│   └── old_references/          # Figma exports (no longer needed)
│       ├── All Blogs Pages/
│       ├── calender/
│       ├── footer/
│       ├── FrontEndCalculator/
│       ├── Hero Mobile/
│       ├── left menu/
│       ├── Main_Page/           # Old version
│       └── mobile footer/
│
├── Main_Page/                   # 📋 MINIMAL (Core components only)
│   ├── src/components/          # Essential components
│   │   ├── Layout/
│   │   ├── SharedHeader/
│   │   ├── SharedFooter/
│   │   ├── Logo/
│   │   ├── Navigation/
│   │   ├── TrustedBy/
│   │   ├── HeroSection/
│   │   └── quote-wizard/
│   └── src/main.jsx
│
├── PROJECT_STRUCTURE.md         # 📄 Full project overview
├── INTEGRATION_PLAN.md          # 📄 Integration strategy
├── FOLDER_STRUCTURE_ANALYSIS.md # 📄 Folder analysis
└── ORGANIZATION.md              # 📄 This file
```

---

## 🎯 What's Where?

### **✅ WORKING APPLICATION: `frontend/`**

**Purpose**: The complete, functional MovedIn 3.0 application

**Contains**:
- ✅ All React components
- ✅ Complete quote wizard (6 steps)
- ✅ All pages (home, blogs, how-it-works, about)
- ✅ Responsive design (mobile + desktop)
- ✅ Mobile hamburger menu
- ✅ Smooth transitions
- ✅ All assets and images

**Status**: ✅ **PRODUCTION READY**

**To Run**:
```bash
cd frontend
npm install
npm run dev
```

---

### **📦 ARCHIVE: `archive/old_references/`**

**Purpose**: Backup of all Figma-exported components

**Contains**:
- Figma design exports (no longer needed)
- Old component references
- Design system examples
- Original Figma code

**Status**: ⏳ **ARCHIVED** (kept for reference only)

**Note**: These are backup files. The designs have been integrated into `frontend/`

---

### **📋 CORE: `Main_Page/`**

**Purpose**: Minimal core components

**Contains**:
- Essential component files only
- No node_modules
- No build artifacts
- Core component structure

**Status**: ✅ **REFERENCE ONLY**

**Note**: This is a minimal version for reference. Use `frontend/` for development.

---

## 🚀 Quick Start Guide

### **For Development**

```bash
# Navigate to frontend
cd MovedinV3.0/frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:5175
```

### **For Production**

```bash
cd MovedinV3.0/frontend

# Build for production
npm run build

# Preview build
npm run preview
```

---

## 📁 File Organization

### **Source Code** (`frontend/src/`)

```
src/
├── components/              # All React components
│   ├── Layout/             # Layout wrapper
│   ├── SharedHeader/       # Header with mobile menu
│   ├── SharedFooter/       # Footer
│   ├── Logo/               # Logo component
│   ├── Navigation/         # Desktop nav
│   ├── TrustedBy/          # Trusted by section
│   ├── MainPageContent/    # Homepage
│   ├── HeroSection/        # Hero
│   ├── BlogsContent/       # Blog listing
│   ├── BlogPost/           # Blog detail
│   ├── HowItWorksContent/  # How it works
│   ├── AboutUsContent/     # About us
│   └── quote-wizard/       # Quote wizard
│       ├── WizardContainer.jsx
│       ├── StepSidebar.jsx
│       ├── StepIcon.jsx
│       ├── style.css
│       └── steps/
│           ├── DateAddressStep.jsx
│           ├── FromDetailsStep.jsx
│           ├── ToDetailsStep.jsx
│           ├── VendorsStep.jsx
│           ├── SummaryStep.jsx
│           └── PaymentStep.jsx
├── api/                    # API integration (future)
├── hooks/                  # Custom hooks (future)
├── main.jsx                # App entry point
├── index.css               # Global styles
├── mockData.js             # Mock data
└── theme.js                # Theme config
```

### **Assets** (`frontend/public/`)

```
public/
└── assets/
    ├── image_*.png         # All images
    └── image_*.jpeg        # All photos
```

---

## 🎨 Component Organization

### **Layout Components**
- `Layout/` - Main wrapper
- `SharedHeader/` - Header
- `SharedFooter/` - Footer
- `Logo/` - Logo
- `Navigation/` - Nav menu

### **Page Components**
- `MainPageContent/` - Homepage
- `HeroSection/` - Hero
- `BlogsContent/` - Blog listing
- `BlogPost/` - Blog detail
- `HowItWorksContent/` - How it works
- `AboutUsContent/` - About us

### **Wizard Components**
- `quote-wizard/WizardContainer` - Layout manager
- `quote-wizard/StepSidebar` - Navigation
- `quote-wizard/StepIcon` - Icons
- `quote-wizard/steps/*` - Step pages

---

## 📊 Integration Status

| Component | Status | Location |
|-----------|--------|----------|
| Header | ✅ Complete | `frontend/src/components/SharedHeader/` |
| Footer | ✅ Complete | `frontend/src/components/SharedFooter/` |
| Logo | ✅ Complete | `frontend/src/components/Logo/` |
| Navigation | ✅ Complete | `frontend/src/components/Navigation/` |
| Quote Wizard | ✅ Complete | `frontend/src/components/quote-wizard/` |
| Mobile Menu | ✅ Complete | `frontend/src/components/SharedHeader/` |
| Step Navigation | ✅ Complete | `frontend/src/components/quote-wizard/StepSidebar.jsx` |
| All Pages | ✅ Complete | `frontend/src/components/*Content/` |
| Responsive Design | ✅ Complete | All components |
| Transitions | ✅ Complete | Wizard & Navigation |

---

## 🔧 Development Workflow

### **1. Start Development**
```bash
cd frontend
npm run dev
```

### **2. Make Changes**
- Edit files in `frontend/src/`
- Hot reload will update automatically
- Check browser at http://localhost:5175

### **3. Test Responsive**
- Test mobile (< 768px)
- Test desktop (≥ 768px)
- Test all pages
- Test quote wizard flow

### **4. Build for Production**
```bash
npm run build
npm run preview
```

---

## 📝 Naming Conventions

### **Components**
- PascalCase: `SharedHeader.jsx`
- One component per file
- Co-located styles: `style.css`

### **Files**
- Match component name
- Lowercase with hyphens: `quote-wizard/`
- Descriptive names: `DateAddressStep.jsx`

### **Styles**
- kebab-case: `.shared-header`
- BEM-like naming: `.qw-step-item`
- Mobile-first: `@media (max-width: 768px)`

---

## 🎯 Best Practices

### **Component Structure**
```jsx
// Component.jsx
import "./style.css";

function Component() {
  return (
    <div className="component">
      {/* Content */}
    </div>
  );
}

export default Component;
```

### **Styling**
```css
/* style.css */
.component {
  /* Base styles (mobile-first) */
}

@media (min-width: 769px) {
  .component {
    /* Desktop styles */
  }
}
```

### **Routing**
```jsx
// main.jsx
<Route path="/page" element={<Layout><PageContent /></Layout>} />
```

---

## 🚨 Important Notes

### **DO NOT DELETE**
- ✅ `frontend/` - Main working application
- ✅ `archive/` - Backup of old files
- ✅ Documentation files (*.md)

### **CAN BE IGNORED**
- ⏳ `Main_Page/` - Minimal reference only
- ⏳ `archive/old_references/` - Old Figma exports

### **FOR DEVELOPMENT**
- ✅ Use `frontend/` folder
- ✅ Run `npm run dev` from `frontend/`
- ✅ All changes in `frontend/src/`

---

## 📖 Documentation

- `frontend/README.md` - Quick start guide
- `frontend/COMPONENTS.md` - Component documentation
- `PROJECT_STRUCTURE.md` - Full project overview
- `INTEGRATION_PLAN.md` - Integration strategy
- `ORGANIZATION.md` - This file

---

## ✨ Key Features

1. ✅ **Clean Structure** - Everything organized
2. ✅ **Working Application** - Fully functional
3. ✅ **Responsive Design** - Mobile + Desktop
4. ✅ **Complete Wizard** - 6-step flow
5. ✅ **Smooth Transitions** - Professional UX
6. ✅ **Well Documented** - Clear docs
7. ✅ **Production Ready** - Build ready

---

## 🎉 Summary

**Main Application**: `frontend/`  
**Status**: ✅ Production Ready  
**Documentation**: ✅ Complete  
**Organization**: ✅ Clean & Organized  

**To Start**: `cd frontend && npm run dev`

---

**Version**: 3.0  
**Last Updated**: January 2025  
**Status**: ✅ Complete & Organized


