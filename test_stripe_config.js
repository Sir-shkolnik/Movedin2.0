// Test Stripe Configuration
// Run this in browser console on the frontend to check Stripe setup

console.log('=== STRIPE CONFIGURATION TEST ===');

// Check environment variables
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? '✅ Configured' : '❌ NOT CONFIGURED');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL ? '✅ Configured' : '❌ NOT CONFIGURED');

// Test Stripe.js loading
async function testStripe() {
    try {
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        
        if (stripe) {
            console.log('✅ Stripe.js loaded successfully');
            console.log('Stripe object:', stripe);
        } else {
            console.log('❌ Stripe.js failed to load');
        }
    } catch (error) {
        console.log('❌ Error loading Stripe:', error);
    }
}

// Test backend payment intent creation
async function testPaymentIntent() {
    try {
        const response = await fetch('https://movedin-backend.onrender.com/api/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 100,
                currency: 'cad',
                customer_email: 'test@example.com',
                description: 'Test payment intent'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Payment intent created successfully:', data);
        } else {
            const error = await response.text();
            console.log('❌ Payment intent creation failed:', error);
        }
    } catch (error) {
        console.log('❌ Error testing payment intent:', error);
    }
}

// Run tests
testStripe();
testPaymentIntent();

console.log('=== END TEST ==='); 