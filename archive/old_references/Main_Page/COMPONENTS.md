# MovedIn 3.0 - Component Documentation

## 📦 Component Library

---

## 🎨 Layout Components

### **Layout**
**Location**: `src/components/Layout/`  
**Purpose**: Main layout wrapper for all pages  
**Props**: `children` - Page content

```jsx
<Layout>
  <YourPageContent />
</Layout>
```

**Features**:
- Wraps pages with header and footer
- Hides footer on quote wizard route
- Responsive container

---

### **SharedHeader**
**Location**: `src/components/SharedHeader/`  
**Purpose**: Global header with navigation

**Desktop**:
- Logo (left)
- Navigation menu (center)
- Get a Quote button (right)

**Mobile**:
- Logo (left)
- Hamburger menu (right)
- Slide-out menu with dark overlay

**Features**:
- ✅ Responsive design
- ✅ Mobile hamburger menu
- ✅ Smooth transitions
- ✅ Sticky positioning

---

### **SharedFooter**
**Location**: `src/components/SharedFooter/`  
**Purpose**: Global footer

**Components**:
- Trusted by section
- Copyright notice

---

### **Logo**
**Location**: `src/components/Logo/`  
**Purpose**: Reusable logo component

**Features**:
- Clickable (navigates to home)
- Responsive sizing
- Purple truck icon + "MOVEDIN." text

---

### **Navigation**
**Location**: `src/components/Navigation/`  
**Purpose**: Desktop navigation links

**Links**:
- How it works
- Tips & Guides
- About Us

**Features**:
- Active state highlighting
- Smooth hover effects
- Click to navigate

---

### **TrustedBy**
**Location**: `src/components/TrustedBy/`  
**Purpose**: Trusted by partner logos section

---

## 📄 Page Components

### **MainPageContent**
**Location**: `src/components/MainPageContent/`  
**Route**: `/`  
**Purpose**: Homepage content

---

### **HeroSection**
**Location**: `src/components/HeroSection/`  
**Purpose**: Hero section with CTA

**Features**:
- "Get a moving quote" button
- Links to `/quote`

---

### **BlogsContent**
**Location**: `src/components/BlogsContent/`  
**Route**: `/blogs`  
**Purpose**: Blog listing page

---

### **BlogPost**
**Location**: `src/components/BlogPost/`  
**Route**: `/blog/:id`  
**Purpose**: Individual blog post

---

### **HowItWorksContent**
**Location**: `src/components/HowItWorksContent/`  
**Route**: `/how-it-works`  
**Purpose**: How it works page

---

### **AboutUsContent**
**Location**: `src/components/AboutUsContent/`  
**Route**: `/about`  
**Purpose**: About us page

---

## 🎯 Quote Wizard System

### **WizardContainer**
**Location**: `src/components/quote-wizard/WizardContainer.jsx`  
**Purpose**: Main wizard layout manager

**Features**:
- Manages step navigation
- Handles Back/Continue buttons
- Controls transitions
- Responsive layout

**Props**: `children` - Current step component

**State**:
- `isTransitioning` - Controls fade animation
- `currentStepIndex` - Current step position
- `isFirst` - First step flag
- `isLast` - Last step flag

**Methods**:
- `handleBack()` - Navigate to previous step
- `handleNext()` - Navigate to next step

---

### **StepSidebar**
**Location**: `src/components/quote-wizard/StepSidebar.jsx`  
**Purpose**: Step navigation

**Desktop**: Vertical sidebar (left)  
**Mobile**: Horizontal chips (top)

**Features**:
- ✅ Auto-scroll to active step (mobile)
- ✅ Smooth transitions
- ✅ Active state highlighting
- ✅ Responsive design

**Props**: `isTransitioning` - Controls scroll timing

**Steps**:
1. Date + addresses
2. From details
3. To details
4. Vendors
5. Full quote
6. Payment

---

### **StepIcon**
**Location**: `src/components/quote-wizard/StepIcon.jsx`  
**Purpose**: SVG icons for steps

**Icons**:
- `CalendarIcon` - Date/calendar
- `ServiceIcon` - Services/document
- `PhoneIcon` - Contact/payment

---

## 📝 Wizard Steps

### **DateAddressStep**
**Location**: `src/components/quote-wizard/steps/DateAddressStep.jsx`  
**Route**: `/quote`  
**Step**: 1 of 6

**Fields**:
- Date (date picker)
- Time of day (dropdown: Morning/Afternoon)
- From address (text input)
- To address (text input)

---

### **FromDetailsStep**
**Location**: `src/components/quote-wizard/steps/FromDetailsStep.jsx`  
**Route**: `/quote/from-details`  
**Step**: 2 of 6

**Fields**:
- Unit number
- Floor
- Elevator (dropdown)
- Stairs
- Parking notes (textarea)
- Special items (text input)

---

### **ToDetailsStep**
**Location**: `src/components/quote-wizard/steps/ToDetailsStep.jsx`  
**Route**: `/quote/to-details`  
**Step**: 3 of 6

**Fields**:
- Unit number
- Floor
- Elevator (dropdown)
- Stairs
- Parking notes (textarea)

---

### **VendorsStep**
**Location**: `src/components/quote-wizard/steps/VendorsStep.jsx`  
**Route**: `/quote/vendors`  
**Step**: 4 of 6

**Purpose**: Display and select vendors

**Features** (Future):
- Vendor cards with pricing
- ETA display
- Ratings
- Selection functionality

---

### **SummaryStep**
**Location**: `src/components/quote-wizard/steps/SummaryStep.jsx`  
**Route**: `/quote/summary`  
**Step**: 5 of 6

**Purpose**: Review full quote before payment

**Features** (Future):
- Summary of all details
- Total pricing
- Review all selections

---

### **PaymentStep**
**Location**: `src/components/quote-wizard/steps/PaymentStep.jsx`  
**Route**: `/quote/payment`  
**Step**: 6 of 6

**Purpose**: Complete payment

**Features** (Future):
- Payment form
- Stripe integration
- Confirmation

---

## 🎨 Styling

### **Global Styles**
**Location**: `src/index.css`

**Features**:
- CSS reset
- Global variables
- Typography
- Color scheme

---

### **Component Styles**
Each component has its own `style.css` file:
- Scoped to component
- Mobile-first approach
- Responsive breakpoints

**Example**:
```css
/* Mobile */
@media (max-width: 768px) {
  .component {
    /* Mobile styles */
  }
}

/* Desktop */
@media (min-width: 769px) {
  .component {
    /* Desktop styles */
  }
}
```

---

## 🔄 State Management

### **Current**: Local component state
- `useState` for simple state
- `useLocation` for routing
- `useNavigate` for navigation

### **Future**: Global state (Context/Redux)
- Quote data
- User selections
- API responses
- Loading states

---

## 🎯 Component Patterns

### **Layout Pattern**
```jsx
function Component() {
  return (
    <div className="component">
      <h2 className="component-title">Title</h2>
      <div className="component-content">
        {/* Content */}
      </div>
    </div>
  );
}
```

### **Form Pattern**
```jsx
function FormStep() {
  return (
    <div className="qw-inner-content">
      <h2 className="qw-title">Step Title</h2>
      <div className="qw-field">
        <label className="qw-label">Label</label>
        <input className="qw-input" type="text" />
      </div>
    </div>
  );
}
```

---

## 📱 Responsive Patterns

### **Mobile-First CSS**
```css
/* Base (Mobile) */
.component {
  padding: 16px;
}

/* Desktop */
@media (min-width: 769px) {
  .component {
    padding: 24px;
  }
}
```

### **Conditional Rendering**
```jsx
function Component() {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

---

## 🚀 Best Practices

1. **Component Structure**
   - One component per file
   - Co-located styles
   - Clear prop types

2. **Naming Conventions**
   - Components: PascalCase
   - Files: match component name
   - Styles: kebab-case

3. **Styling**
   - Mobile-first approach
   - Use design system colors
   - Consistent spacing

4. **Performance**
   - Lazy load routes
   - Optimize images
   - Minimize re-renders

---

## 📖 Related Documentation

- `README.md` - Quick start guide
- `../PROJECT_STRUCTURE.md` - Project overview
- `../INTEGRATION_PLAN.md` - Integration strategy

---

**Last Updated**: January 2025  
**Version**: 3.0

