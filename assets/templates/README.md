# 📧 MovedIn 3.0 Email Templates

Beautiful, professional email templates for the MovedIn 3.0 system with amazing UI/UX design.

## 🎨 Template Features

### ✨ Design Elements
- **Modern Gradient Headers** - Beautiful color schemes for each email type
- **Responsive Design** - Mobile-friendly layouts
- **Professional Typography** - Clean, readable fonts
- **Visual Hierarchy** - Clear information structure
- **Brand Consistency** - MovedIn colors and styling
- **Interactive Elements** - Hover effects and visual feedback

### 🎯 Template Types

#### 1. Customer Confirmation Email (`customer_confirmation.html`)
**Recipients:** Customer's email address
**Purpose:** Confirm booking and provide move details

**Features:**
- 🎉 Celebration header with gradient background
- ✅ Success confirmation banner
- 📅 Complete move details section
- 🚚 Vendor information with pricing
- 📞 Clear next steps
- 💡 Pro tips for moving day
- 📱 Mobile-responsive design

**Template Variables:**
- `{{lead_id}}` - Lead reference number
- `{{customer_name}}` - Customer's name
- `{{move_from}}` - Pickup address
- `{{move_to}}` - Delivery address
- `{{move_date}}` - Move date
- `{{move_time}}` - Preferred time
- `{{vendor_name}}` - Moving company
- `{{total_cost}}` - Total cost
- `{{balance_due}}` - Remaining balance

#### 2. Vendor Notification Email (`vendor_notification.html`)
**Recipients:** support@movedin.com
**Purpose:** Alert support team of new vendor order

**Features:**
- 🚨 Urgent action banner
- 👤 Customer contact details
- 🏠 Complete move information
- 🚚 Vendor assignment details
- 📞 Required actions checklist
- ⚡ High priority indicators

**Template Variables:**
- `{{lead_id}}` - Lead reference number
- `{{customer_name}}` - Customer's name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone
- `{{move_from}}` - Pickup address
- `{{move_to}}` - Delivery address
- `{{move_date}}` - Move date
- `{{move_time}}` - Preferred time
- `{{vendor_name}}` - Moving company
- `{{total_cost}}` - Total cost
- `{{balance_due}}` - Remaining balance
- `{{payment_status}}` - Payment status
- `{{created_at}}` - Creation timestamp

#### 3. Support Notification Email (`support_notification.html`)
**Recipients:** udi.shkolnik@alicesolutions.com
**Purpose:** System alert and revenue tracking

**Features:**
- 📊 System health dashboard
- 📈 Lead summary with metrics
- 🗺️ Move details overview
- 💰 Revenue tracking
- ⚙️ System metrics
- 🔒 Security indicators

**Template Variables:**
- `{{lead_id}}` - Lead reference number
- `{{customer_name}}` - Customer's name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone
- `{{move_from}}` - Pickup address
- `{{move_to}}` - Delivery address
- `{{move_date}}` - Move date
- `{{move_time}}` - Preferred time
- `{{vendor_name}}` - Moving company
- `{{total_cost}}` - Total cost
- `{{deposit_paid}}` - Deposit amount
- `{{balance_due}}` - Remaining balance
- `{{payment_status}}` - Payment status
- `{{payment_intent_id}}` - Payment intent ID
- `{{created_at}}` - Creation timestamp

## 🛠️ Technical Implementation

### Template Service
The `EmailTemplateService` class handles:
- Template loading from files
- Variable substitution
- Fallback template generation
- Error handling

### Usage Example
```python
from app.services.email_template_service import EmailTemplateService

template_service = EmailTemplateService()

# Prepare data
data = {
    'lead_id': 123,
    'customer_name': 'John Doe',
    'customer_email': 'john@example.com',
    # ... other variables
}

# Render template
html_content = template_service.render_template('customer_confirmation', data)
```

### Template Loading
Templates are automatically loaded from the `email_templates/` directory:
- `customer_confirmation.html`
- `vendor_notification.html`
- `support_notification.html`

## 🎨 Color Scheme

### Primary Colors
- **MovedIn Blue:** `#5340FF` to `#4230dd`
- **Success Green:** `#28a745` to `#20c997`
- **Warning Orange:** `#ff6b35` to `#f7931e`
- **Info Purple:** `#667eea` to `#764ba2`

### Accent Colors
- **Success:** `#d4edda` with `#c3e6cb` border
- **Warning:** `#fff3cd` with `#ffeaa7` border
- **Info:** `#e3f2fd` with `#f3e5f5` gradient

## 📱 Responsive Design

### Mobile Optimizations
- Flexible grid layouts
- Touch-friendly buttons
- Readable font sizes
- Optimized spacing
- Stacked information on small screens

### Desktop Features
- Multi-column layouts
- Hover effects
- Detailed information display
- Professional spacing

## 🔧 Customization

### Adding New Templates
1. Create new HTML file in `email_templates/` directory
2. Add template name to `EmailTemplateService`
3. Update template loading logic
4. Test with sample data

### Modifying Existing Templates
1. Edit the HTML file directly
2. Update template variables as needed
3. Test with different data sets
4. Verify responsive design

### Styling Guidelines
- Use consistent color scheme
- Maintain professional appearance
- Ensure mobile compatibility
- Include proper spacing
- Use semantic HTML structure

## 📊 Template Performance

### Loading Speed
- Templates are cached after first load
- Minimal file I/O operations
- Efficient variable substitution
- Fallback templates for reliability

### Error Handling
- Graceful fallback to simple templates
- Detailed error logging
- Template validation
- Variable safety checks

## 🚀 Future Enhancements

### Planned Features
- Template versioning
- A/B testing support
- Dynamic content blocks
- Multi-language support
- Template preview system

### Integration Options
- Email service providers
- Template editors
- Analytics tracking
- Performance monitoring

## 📝 Maintenance

### Regular Updates
- Review template effectiveness
- Update branding elements
- Optimize for new email clients
- Test across devices and browsers

### Quality Assurance
- Test all template variables
- Verify responsive design
- Check email client compatibility
- Validate HTML structure

---

**Created:** 2025-10-21  
**Version:** 3.0.0  
**Maintainer:** MovedIn Development Team  
**Status:** Production Ready ✅
