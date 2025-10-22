# Quote Journey Implementation

## Overview
The 7-step moving quote journey has been fully implemented in the new Movedin 3.0 frontend, based on the old Movedin 2.0 structure but with the new advanced UI design.

## Journey Flow

### Step 1: Date + Addresses (`/quote`)
**Component:** `DateAddressStep.jsx`
- From address (text input)
- To address (text input)
- Move date (date picker with minimum date validation)
- Move time (dropdown: Morning/Afternoon/Evening)
- All fields are required and synced to FormContext

### Step 2: From Details (`/quote/from-details`)
**Component:** `FromDetailsStep.jsx`
- Home Type (dropdown: House/Townhouse/Condo/Apartment/Commercial)
- Number of Rooms (number input)
- Square Footage (dropdown: <500, 500-1000, 1000-1500, 1500-2000, 2000+)
- **Conditional fields based on Home Type:**
  - House/Townhouse: Number of Floors, Garage, Number of Stairs
  - Condo/Apartment: Floor Number, Elevator, Loading Dock
- Parking notes (text input)
- Heavy items (chips: Piano, Safe, Treadmill)
- Additional services (chips: Packing, Storage, Cleaning, Junk)
- All data synced to FormContext

### Step 3: To Details (`/quote/to-details`)
**Component:** `ToDetailsStep.jsx`
- Same structure as From Details
- Home Type, Rooms, Square Footage
- **Conditional fields based on Home Type:**
  - House/Townhouse: Number of Floors, Garage, Number of Stairs
  - Condo/Apartment: Floor Number, Elevator, Loading Dock
- Parking notes
- All data synced to FormContext

### Step 4: Vendors (`/quote/vendors`)
**Component:** `VendorsStep.jsx`
- Displays mock vendor quotes (4 vendors)
- Each vendor card shows:
  - Vendor name
  - Rating and review count
  - Total cost (prominently displayed)
  - Crew size and truck count
  - Hourly rate and estimated hours (if applicable)
  - Special notes
- User can select a vendor by clicking on the card
- Selected vendor is stored in FormContext
- **Note:** Currently using mock data. Real API integration pending.

### Step 5: Contact Info (`/quote/summary`)
**Component:** `SummaryStep.jsx` (Contact Information)
- First Name (required)
- Last Name (required)
- Email (required, with email format validation)
- Phone (required, with phone format validation)
- All fields have inline error messages
- Data synced to FormContext

### Step 6: Review (`/quote/review`)
**Component:** `ReviewStep.jsx` (Full Quote Review)
- Displays a comprehensive summary of all collected data:
  - Move Details (From, To, Date, Time)
  - From Details (all building information)
  - To Details (all building information)
  - Selected Vendor (name, crew, cost)
  - Contact Information (name, email, phone)
- All data is read-only for review
- Formatted with proper currency display

### Step 7: Payment (`/quote/payment`)
**Component:** `PaymentStep.jsx`
- Order Summary section with:
  - Moving service details
  - Date and addresses
  - Total cost (prominently displayed)
- Payment Method section (Credit Card - currently placeholder)
- Submit button with loading state
- **Note:** Currently a mock payment flow. Real Stripe integration pending.

## State Management

### FormContext (`contexts/FormContext.jsx`)
- Global state management for the entire quote journey
- Stores all form data across steps
- Uses React Context API
- Wrapped around all quote routes in `main.jsx`

### Data Structure
```javascript
{
  from: string,
  to: string,
  date: string,
  time: string,
  fromDetails: {
    homeType: string,
    rooms: number,
    sqft: string,
    floors?: number,
    garage?: boolean,
    stairs?: number,
    floorNumber?: number,
    elevator?: boolean,
    loadingDock?: boolean,
    heavyItems: object,
    additionalServices: object,
    parkingNotes: string
  },
  toDetails: {
    homeType: string,
    rooms: number,
    sqft: string,
    floors?: number,
    garage?: boolean,
    stairs?: number,
    floorNumber?: number,
    elevator?: boolean,
    loadingDock?: boolean,
    parkingNotes: string
  },
  selectedQuote: {
    vendor_slug: string,
    vendor_name: string,
    total_cost: number,
    hourly_rate: number,
    estimated_hours: number,
    crew_size: number,
    truck_count: number,
    rating: number,
    reviews: number,
    special_notes: string
  },
  contact: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
  }
}
```

## Navigation

### WizardContainer
- Manages the overall wizard layout
- Handles navigation between steps
- Provides Back and Continue buttons
- Implements smooth fade transitions
- Determines first/last step for button visibility
- Step array defines the journey flow

### StepSidebar
- Unified left sidebar for all steps
- Shows all 7 steps with icons and titles
- Highlights active step
- Auto-scrolls active step into view on mobile
- Responsive: horizontal scrollable chips on mobile, vertical list on desktop

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Horizontal scrollable step navigation on mobile
- Touch-friendly buttons and inputs
- Proper spacing and padding for all screen sizes

### Visual Feedback
- Active step highlighted with blue border and white background
- Selected vendor card highlighted with purple background
- Smooth fade transitions between steps
- Loading states for async operations
- Inline validation error messages

### Accessibility
- Semantic HTML elements
- Proper label associations
- Keyboard navigation support
- Screen reader friendly

## Pending Integrations

### 1. Address Autocomplete
- **Current:** Plain text inputs for From/To addresses
- **Future:** Integrate Google Maps/MapBox autocomplete
- **API:** Geocoding service for address validation

### 2. Vendor Quotes API
- **Current:** Mock vendor data (4 vendors)
- **Future:** Real-time vendor quote fetching
- **API:** Backend endpoint to fetch available vendors based on move details
- **Expected Response:** Array of vendor quotes with pricing

### 3. Quote Creation API
- **Current:** Data stored only in browser context
- **Future:** Submit quote to backend
- **API:** POST endpoint to create quote with all collected data
- **Response:** Quote ID for tracking

### 4. Payment Processing
- **Current:** Mock payment flow
- **Future:** Stripe integration
- **API:** Stripe Checkout or Payment Intents API
- **Features:** Credit card processing, receipt generation

### 5. Custom Calendar UI
- **Current:** Native HTML5 date picker
- **Future:** Custom calendar component from `calender/` folder
- **Features:** Visual date selection with availability

### 6. Form Validation
- **Current:** Basic validation on Contact Info step
- **Future:** Comprehensive validation on all steps
- **Features:** Disable Continue button until required fields filled, field-level validation

## Testing Checklist

- [ ] All 7 steps render correctly
- [ ] Navigation (Back/Continue) works on all steps
- [ ] Form data persists across steps
- [ ] Mobile responsive on all steps
- [ ] Active step highlights correctly
- [ ] Vendor selection works
- [ ] Contact form validation works
- [ ] Review page displays all data correctly
- [ ] Payment page shows correct total
- [ ] Smooth transitions between steps

## Next Steps

1. **Add form validation** - Disable Continue until required fields are filled
2. **Integrate address autocomplete** - Google Maps or MapBox
3. **Connect vendors API** - Fetch real vendor quotes
4. **Add custom calendar** - Replace native date picker
5. **Implement Stripe** - Real payment processing
6. **Add quote persistence** - Save to database
7. **Email confirmation** - Send quote confirmation email
8. **Error handling** - Proper error messages and retry logic
9. **Loading states** - Better loading indicators
10. **Analytics** - Track user journey and drop-offs

## File Structure

```
frontend/src/
├── components/
│   ├── quote-wizard/
│   │   ├── WizardContainer.jsx       # Main wizard container
│   │   ├── StepSidebar.jsx           # Unified left sidebar
│   │   ├── StepIcon.jsx              # Professional Heroicons
│   │   ├── style.css                 # Wizard styles
│   │   └── steps/
│   │       ├── DateAddressStep.jsx   # Step 1
│   │       ├── FromDetailsStep.jsx   # Step 2
│   │       ├── ToDetailsStep.jsx     # Step 3
│   │       ├── VendorsStep.jsx       # Step 4
│   │       ├── SummaryStep.jsx       # Step 5 (Contact)
│   │       ├── ReviewStep.jsx        # Step 6
│   │       └── PaymentStep.jsx       # Step 7
├── contexts/
│   └── FormContext.jsx               # Global form state
└── main.jsx                          # Routes with FormProvider
```

## Notes

- All components follow the new Movedin 3.0 design system
- Uses the same color scheme, typography, and spacing as the rest of the site
- Maintains consistency with the existing header, footer, and navigation
- Professional Heroicons used for step icons (commercial-free, MIT licensed)
- No dependencies on old Movedin 2.0 components
- Fully functional without backend (mock data for vendors)


