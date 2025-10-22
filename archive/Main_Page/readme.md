# MovedIn 3.0 - Main Application

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development Server**: http://localhost:5175

---

## 📁 Project Structure

```
Main_Page/
├── src/
│   ├── components/          # React components
│   │   ├── Layout/          # Main layout wrapper
│   │   ├── SharedHeader/    # Header with mobile menu
│   │   ├── SharedFooter/    # Footer component
│   │   ├── Logo/            # Logo component
│   │   ├── Navigation/      # Desktop navigation
│   │   ├── TrustedBy/       # Trusted by section
│   │   ├── MainPageContent/ # Homepage
│   │   ├── HeroSection/     # Hero section
│   │   ├── BlogsContent/    # Blog listing
│   │   ├── BlogPost/        # Blog detail
│   │   ├── HowItWorksContent/# How it works
│   │   ├── AboutUsContent/  # About us
│   │   └── quote-wizard/    # 🎯 Quote wizard system
│   │       ├── WizardContainer.jsx
│   │       ├── StepSidebar.jsx
│   │       ├── StepIcon.jsx
│   │       ├── style.css
│   │       └── steps/
│   │           ├── DateAddressStep.jsx
│   │           ├── FromDetailsStep.jsx
│   │           ├── ToDetailsStep.jsx
│   │           ├── VendorsStep.jsx
│   │           ├── SummaryStep.jsx
│   │           └── PaymentStep.jsx
│   ├── api/                 # API integration
│   ├── hooks/               # Custom hooks
│   ├── main.jsx             # App entry
│   ├── index.css            # Global styles
│   ├── mockData.js          # Mock data
│   └── theme.js             # Theme config
├── public/                  # Static assets
├── package.json
└── vite.config.js
```

---

## 🎯 Features

### **Pages**
- ✅ Homepage with hero section
- ✅ Blog listing & detail pages
- ✅ How it works page
- ✅ About us page
- ✅ Quote wizard (6 steps)

### **Quote Wizard Steps**
1. **Date + Addresses** - Pick date, time, and addresses
2. **From Details** - Building info (unit, floor, elevator, etc.)
3. **To Details** - Destination building info
4. **Vendors** - Select a mover with pricing
5. **Summary** - Review full quote
6. **Payment** - Complete payment

### **Responsive Design**
- ✅ Mobile (< 768px)
  - Hamburger menu
  - Horizontal step chips
  - Compact spacing
- ✅ Desktop (≥ 768px)
  - Full navigation
  - Vertical sidebar
  - Expanded layout

### **Components**
- ✅ Header with mobile menu
- ✅ Footer with trusted by section
- ✅ Responsive navigation
- ✅ Smooth transitions
- ✅ Auto-scrolling active step

---

## 🎨 Design System

### **Colors**
```css
Primary:    #5340FF (Purple)
Dark Gray:  #344054
Light Gray: #627193
Border:     #EAECF0
Background: #F9F9FD
```

### **Typography**
```css
Font: Lexend
Weights: 300, 400, 500, 600, 700, 800
```

### **Breakpoints**
```css
Mobile:  < 768px
Desktop: ≥ 768px
```

---

## 🔧 Tech Stack

- **React** 18.2.0
- **Vite** 5.4.20
- **React Router DOM** 6.x
- **MUI Base** (UI components)
- **CSS Modules** (styling)

---

## 📝 Development Notes

### **Adding a New Page**
1. Create component in `src/components/`
2. Add route in `src/main.jsx`
3. Update navigation if needed

### **Adding a Wizard Step**
1. Create step component in `src/components/quote-wizard/steps/`
2. Add route in `src/main.jsx`
3. Update `StepSidebar.jsx` steps array
4. Add icon if needed in `StepIcon.jsx`

### **Styling Guidelines**
- Use CSS modules for component styles
- Follow design system colors
- Mobile-first approach
- Test on both mobile and desktop

---

## 🐛 Known Issues

- Favicon missing (404 error - can be ignored)
- Calendar uses native date picker (custom component pending)

---

## 📖 Related Documentation

- `../PROJECT_STRUCTURE.md` - Full project overview
- `../INTEGRATION_PLAN.md` - Integration strategy
- `REFACTORING_SUMMARY.md` - Refactoring notes

---

## ✅ Status

**UI/UX**: ✅ Complete  
**Responsive**: ✅ Complete  
**Quote Wizard**: ✅ Complete  
**API Integration**: ⏳ Pending  
**Form Validation**: ⏳ Pending  

---

**Version**: 3.0  
**Last Updated**: January 2025
