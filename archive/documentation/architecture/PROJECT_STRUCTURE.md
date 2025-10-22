# MovedIn 3.0 - Project Structure & Organization

## 📁 Project Overview

This is the complete MovedIn 3.0 frontend application, rebuilt from Figma designs with a modern React + Vite architecture.

**Main Application**: `Main_Page/` - The primary working application  
**Design References**: All other folders contain Figma-exported components for reference and integration

---

## 🗂️ Folder Structure

```
MovedinV3.0/
├── Main_Page/                    # ⭐ MAIN APPLICATION (Working App)
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Layout/           # Main layout wrapper
│   │   │   ├── SharedHeader/     # Header with logo, nav, hamburger
│   │   │   ├── SharedFooter/     # Footer component
│   │   │   ├── Logo/             # Logo component
│   │   │   ├── Navigation/       # Desktop navigation
│   │   │   ├── TrustedBy/        # Trusted by section
│   │   │   ├── MainPageContent/  # Homepage content
│   │   │   ├── HeroSection/      # Hero section
│   │   │   ├── BlogsContent/     # Blog listing page
│   │   │   ├── BlogPost/         # Individual blog post
│   │   │   ├── HowItWorksContent/# How it works page
│   │   │   ├── AboutUsContent/   # About us page
│   │   │   └── quote-wizard/     # 🎯 Quote Wizard System
│   │   │       ├── WizardContainer.jsx    # Main wizard layout
│   │   │       ├── StepSidebar.jsx        # Step navigation
│   │   │       ├── StepIcon.jsx           # SVG icons
│   │   │       ├── style.css              # Wizard styles
│   │   │       └── steps/                 # Individual step pages
│   │   │           ├── DateAddressStep.jsx    # Step 1: Date + Addresses
│   │   │           ├── FromDetailsStep.jsx    # Step 2: From details
│   │   │           ├── ToDetailsStep.jsx      # Step 3: To details
│   │   │           ├── VendorsStep.jsx        # Step 4: Vendors
│   │   │           ├── SummaryStep.jsx        # Step 5: Full quote
│   │   │           └── PaymentStep.jsx        # Step 6: Payment
│   │   ├── api/                  # API integration (future)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── main.jsx              # App entry point
│   │   ├── index.css             # Global styles
│   │   ├── mockData.js           # Mock data
│   │   └── theme.js              # Theme configuration
│   ├── public/                   # Static assets
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite configuration
│
├── FrontEndCalculator/           # 📐 FIGMA REFERENCE: Desktop Quote Wizard
│   ├── src/components/           # Desktop wizard components
│   ├── mobile NAVBAR/            # Mobile navbar reference
│   └── README.md                 # Desktop calculator docs
│
├── Hero Mobile/                  # 📱 FIGMA REFERENCE: Mobile Hero & Location Step
│   ├── css/src/components/       # CSS components
│   ├── html/                     # HTML reference
│   └── src/components/           # React components
│
├── left menu/                    # 📋 FIGMA REFERENCE: Left Sidebar Menu
│   └── src/components/           # Sidebar components
│
├── calender/                     # 📅 FIGMA REFERENCE: Calendar Component
│   └── src/components/           # Calendar components
│
├── footer/                       # 🦶 FIGMA REFERENCE: Footer Component
│   └── src/components/           # Footer components
│
├── mobile footer/                # 📱 FIGMA REFERENCE: Mobile Footer
│   └── src/components/           # Mobile footer components
│
├── All Blogs Pages/              # 📝 FIGMA REFERENCE: Blog Pages
│   └── src/components/           # Blog components
│
├── INTEGRATION_PLAN.md           # Integration strategy
├── FOLDER_STRUCTURE_ANALYSIS.md  # Folder analysis
└── PROJECT_STRUCTURE.md          # 📄 This file
```

---

## 🎯 Main Application: Main_Page/

### **Purpose**
The primary working application where all Figma designs have been integrated and made functional.

### **Key Features**

#### 1. **Routing System** (`src/main.jsx`)
- Homepage: `/`
- Blogs: `/blogs` & `/blog/:id`
- How it Works: `/how-it-works`
- About Us: `/about`
- Quote Wizard: `/quote` → `/quote/from-details` → `/quote/to-details` → `/quote/vendors` → `/quote/summary` → `/quote/payment`

#### 2. **Layout Components**
- **Layout**: Wraps all pages with header/footer
- **SharedHeader**: Responsive header with hamburger menu (mobile)
- **SharedFooter**: Footer with trusted by section
- **Logo**: Reusable logo component

#### 3. **Quote Wizard System** (`src/components/quote-wizard/`)

**Architecture:**
```
WizardContainer (Layout Manager)
├── StepSidebar (Navigation)
│   ├── Desktop: Vertical sidebar on left
│   └── Mobile: Horizontal chips at top
├── Step Content (Dynamic)
└── Bottom Navigation Bar
    ├── Back button (outlined purple)
    └── Continue button (solid purple)
```

**Steps:**
1. **DateAddressStep**: Date + Time + From/To addresses
2. **FromDetailsStep**: Building details (unit, floor, elevator, etc.)
3. **ToDetailsStep**: Destination building details
4. **VendorsStep**: Vendor selection with pricing
5. **SummaryStep**: Review full quote
6. **PaymentStep**: Payment processing

**Features:**
- ✅ Responsive design (mobile + desktop)
- ✅ Smooth transitions between steps
- ✅ Auto-scroll to active step (mobile)
- ✅ State management ready
- ✅ API integration ready

---

## 📐 Design Reference Folders

### **FrontEndCalculator/**
**Purpose**: Desktop quote wizard reference from Figma  
**Use Case**: Reference for desktop layout, styling, and component structure  
**Status**: ✅ Integrated into Main_Page

**Key Components:**
- Desktop wizard layout
- Step navigation
- Form components
- Vendor cards

---

### **Hero Mobile/**
**Purpose**: Mobile hero section and location step reference  
**Use Case**: Mobile layout, header, and step navigation styling  
**Status**: ✅ Integrated into Main_Page

**Key Components:**
- Mobile header (72px height)
- Hamburger menu
- Horizontal step chips
- Location input forms

---

### **mobile NAVBAR/**
**Purpose**: Mobile navigation bar reference  
**Use Case**: Slide-out menu styling and behavior  
**Status**: ✅ Integrated into SharedHeader

**Key Components:**
- 239px width menu
- Dark overlay (rgba(3, 1, 20, 0.3))
- Navigation items
- CTA button

---

### **left menu/**
**Purpose**: Desktop sidebar menu reference  
**Use Case**: Desktop wizard sidebar styling  
**Status**: ✅ Integrated into StepSidebar

---

### **calender/**
**Purpose**: Calendar component reference  
**Use Case**: Date picker styling (to be integrated)  
**Status**: ⏳ Pending integration

---

### **footer/** & **mobile footer/**
**Purpose**: Footer components reference  
**Use Case**: Footer styling and content  
**Status**: ✅ Partially integrated

---

### **All Blogs Pages/**
**Purpose**: Blog pages reference  
**Use Case**: Blog layout and styling  
**Status**: ✅ Integrated into BlogsContent & BlogPost

---

## 🎨 Design System

### **Colors**
```css
Primary Purple:     #5340FF
Dark Gray:          #344054
Light Gray:         #627193
Border Gray:        #EAECF0
Background:         #F9F9FD
White:              #FFFFFF
```

### **Typography**
```css
Font Family: Lexend
Weights: 300, 400, 500, 600, 700, 800

Headings:    700 22px
Titles:      500 20px
Body:        400 16px
Labels:      600 14px
Small:       500 12px
Mobile:      600 10px
```

### **Spacing**
```css
Mobile Gaps:  4px (between chips)
Desktop Gaps: 12px (between elements)
Padding:      16px (mobile), 24px (desktop)
```

### **Borders & Shadows**
```css
Border Radius: 8px (inputs), 16px (cards)
Border:        1px solid #EAECF0
Shadow:        0px 1px 2px rgba(16, 24, 40, 0.05)
```

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Desktop: ≥ 768px
```

### **Mobile Features**
- Hamburger menu (slide-out from left)
- Horizontal step navigation (chips at top)
- Compact spacing (4px gaps)
- Touch-friendly buttons (44px+ height)

### **Desktop Features**
- Full navigation menu
- Vertical sidebar (264px width)
- Expanded spacing (12px gaps)
- Larger content area

---

## 🚀 Getting Started

### **Development**
```bash
cd Main_Page
npm install
npm run dev
```

**Server**: http://localhost:5175

### **Build for Production**
```bash
npm run build
npm run preview
```

---

## 📋 Integration Status

| Component | Source | Status | Notes |
|-----------|--------|--------|-------|
| Header | Hero Mobile | ✅ Complete | Mobile hamburger menu added |
| Logo | Hero Mobile | ✅ Complete | Responsive sizing |
| Navigation | mobile NAVBAR | ✅ Complete | Slide-out menu |
| Quote Wizard | FrontEndCalculator | ✅ Complete | All 6 steps |
| Step Navigation | left menu + Hero Mobile | ✅ Complete | Responsive |
| Footer | footer/ | ✅ Complete | Trusted by section |
| Calendar | calender/ | ⏳ Pending | Native date picker for now |
| Blog Pages | All Blogs Pages | ✅ Complete | Listing + detail |
| Mobile Footer | mobile footer/ | ⏳ Pending | Not yet needed |

---

## 🔧 Technical Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.20
- **Routing**: React Router DOM
- **UI Components**: MUI Base
- **Styling**: CSS Modules
- **Icons**: SVG (inline)
- **Fonts**: Lexend (Google Fonts)

---

## 📝 Next Steps

### **Immediate**
1. ✅ Mobile responsive design
2. ✅ Quote wizard flow
3. ✅ Navigation system
4. ✅ Component structure

### **Future Enhancements**
1. ⏳ Calendar component integration
2. ⏳ API integration for vendors
3. ⏳ Form validation
4. ⏳ Payment processing
5. ⏳ State management (Context/Redux)
6. ⏳ Error handling
7. ⏳ Loading states
8. ⏳ Accessibility improvements

---

## 📞 Component Dependencies

```
Main_Page/
└── src/main.jsx
    └── Layout
        ├── SharedHeader
        │   ├── Logo
        │   └── Navigation
        ├── [Page Content]
        └── SharedFooter
            └── TrustedBy

Quote Wizard:
└── WizardContainer
    ├── StepSidebar
    │   └── StepIcon
    ├── [Step Component]
    └── Bottom Bar
```

---

## 🎯 File Naming Conventions

- **Components**: PascalCase (`SharedHeader.jsx`)
- **Styles**: kebab-case (`style.css`)
- **Hooks**: camelCase with `use` prefix (`useQuote.js`)
- **Utils**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

---

## 📖 Documentation Files

- `PROJECT_STRUCTURE.md` - This file (overview)
- `INTEGRATION_PLAN.md` - Integration strategy
- `FOLDER_STRUCTURE_ANALYSIS.md` - Detailed folder analysis
- `Main_Page/REFACTORING_SUMMARY.md` - Refactoring notes

---

## ✨ Key Achievements

1. ✅ **Pixel-perfect mobile design** matching Figma
2. ✅ **Responsive quote wizard** with 6 steps
3. ✅ **Smooth transitions** and animations
4. ✅ **Auto-centering** active step on mobile
5. ✅ **Slide-out menu** with dark overlay
6. ✅ **Unified component structure**
7. ✅ **Clean separation** of concerns
8. ✅ **Scalable architecture** for future features

---

**Last Updated**: January 2025  
**Version**: 3.0  
**Status**: ✅ Production Ready (UI/UX Complete)


