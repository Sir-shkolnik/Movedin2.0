import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Stepper from './components/Stepper/Stepper';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step3 from './components/steps/Step3';
import Step4 from './components/steps/Step4';
// Import all step components
import Step5 from './components/steps/Step5';
import Step6 from './components/steps/Step6';
import Step7 from './components/steps/Step7';
import PaymentRedirect from './pages/PaymentRedirect';
import { FormProvider, useForm } from './contexts/FormContext';

const steps = [
    { label: 'Move Details', subtitle: 'Where and when are you moving?' },
    { label: 'Origin Home', subtitle: 'Tell us about your current home' },
    { label: 'Destination', subtitle: 'Tell us about your new home' },
    { label: 'Choose Mover', subtitle: 'Select your moving company' },
    { label: 'Contact Info', subtitle: 'Your contact information' },
    { label: 'Review & Pay', subtitle: 'Review quote and complete booking' },
    { label: 'Confirmation', subtitle: 'Your move is booked!' }
];

function App() {
    return (
        <>
            <FormProvider>
                <AppInner />
            </FormProvider>
        </>
    );
}

function AppInner() {
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = useForm();
    
    // Check if we're on the payment redirect path
    const isPaymentRedirect = location.pathname === '/payment-redirect';
    
    // If we're on payment redirect, render the PaymentRedirect component
    if (isPaymentRedirect) {
        return <PaymentRedirect />;
    }
    
    // Get current step from URL or default to 0
    const getCurrentStepFromURL = () => {
        const path = location.pathname;
        const hash = location.hash;
        const fullPath = path + hash;
        
        // Check both pathname and hash for step routing
        if (path === '/step7' || hash === '#/step7' || fullPath.includes('step7')) return 6;
        if (path === '/step6' || hash === '#/step6' || fullPath.includes('step6')) return 5;
        if (path === '/step5' || hash === '#/step5' || fullPath.includes('step5')) return 4;
        if (path === '/step4' || hash === '#/step4' || fullPath.includes('step4')) return 3;
        if (path === '/step3' || hash === '#/step3' || fullPath.includes('step3')) return 2;
        if (path === '/step2' || hash === '#/step2' || fullPath.includes('step2')) return 1;
        return 0; // Default to step 1
    };

    const [currentStep, setCurrentStep] = useState(getCurrentStepFromURL());

    // Update current step when URL changes
    useEffect(() => {
        const stepFromURL = getCurrentStepFromURL();
        setCurrentStep(stepFromURL);
    }, [location.pathname, location.hash]);

    const goToStep = (stepIndex: number) => {
        if (stepIndex <= currentStep) {
            setCurrentStep(stepIndex);
            if (stepIndex === 0) {
                navigate('/');
            } else {
                navigate(`#/step${stepIndex + 1}`);
            }
        }
    };

    const goNext = () => {
        const nextStep = Math.min(currentStep + 1, steps.length - 1);
        setCurrentStep(nextStep);
        if (nextStep === 6) {
            navigate('#/step7');
        } else if (nextStep === 0) {
            navigate('/');
        } else {
            navigate(`#/step${nextStep + 1}`);
        }
    };

    const goBack = () => {
        const prevStep = Math.max(currentStep - 1, 0);
        setCurrentStep(prevStep);
        if (prevStep === 0) {
            navigate('/');
        } else {
            navigate(`#/step${prevStep + 1}`);
        }
    };



    // Determine if continue button should be disabled
    let continueDisabled = false;
    if (currentStep === 0) {
        continueDisabled = !data.from || !data.to || !data.date || !data.time;
    } else if (currentStep === 1) {
        const { homeType } = data.fromDetails || {};
        continueDisabled = !homeType;
    } else if (currentStep === 2) {
        const { homeType } = data.toDetails || {};
        continueDisabled = !homeType;
    } else if (currentStep === 3) {
        continueDisabled = !data.vendor;
    } else if (currentStep === 4) {
        // Step 5 validation - contact information
        const { firstName, lastName, email, phone } = data.contact || {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        continueDisabled = !(firstName && firstName.trim()) || !(lastName && lastName.trim()) || !(email && email.trim()) || !(phone && phone.trim()) || !emailRegex.test(email || '') || (phone || '').length < 10;
    }

    // Custom button text and actions for different steps
    let continueButtonText = "Continue";
    let continueAction = goNext;

    if (currentStep === 3 && data.vendor) {
        const selectedVendor = data.vendor.vendor_name || data.vendor;
        continueButtonText = `Continue with ${selectedVendor} →`;
    } else if (currentStep === 3) {
        continueButtonText = "Select a Moving Company";
    } else if (currentStep === 5) {
        // Step 6 - Payment
        continueButtonText = "Pay $1.00 CAD Deposit";
        continueAction = () => {
            // Trigger payment action in Step6 component
            const step6Element = document.querySelector('.step6-modern');
            if (step6Element) {
                const payButton = step6Element.querySelector('.pay-button-modern') as HTMLButtonElement;
                if (payButton && !payButton.disabled) {
                    payButton.click();
                }
            }
        };
    }

        return (
        <div className="app">
            <div className="app-content">
                <Stepper 
                    steps={steps} 
                    currentStep={currentStep} 
                    goToStep={goToStep}
                />
                <div className="step-container">
                    {currentStep === 0 && <Step1 onNext={goNext} />}
                    {currentStep === 1 && <Step2 onNext={goNext} onBack={goBack} />}
                    {currentStep === 2 && <Step3 onNext={goNext} onBack={goBack} />}
                    {currentStep === 3 && <Step4 onNext={goNext} onBack={goBack} />}
                    {currentStep === 4 && <Step5 onNext={goNext} onBack={goBack} />}
                    {currentStep === 5 && <Step6 onNext={goNext} onBack={goBack} />}
                    {currentStep === 6 && (
                        data.selectedQuote || sessionStorage.getItem('paymentSuccess') ? 
                        <Step7 /> : 
                        <div className="step-card">
                            <h2>Redirecting...</h2>
                            <p>Please complete the booking process to access the confirmation page.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer 
                onContinue={continueAction}
                onBack={currentStep > 0 ? goBack : undefined}
                showBack={currentStep > 0}
                disabled={continueDisabled}
                label={continueButtonText}
            />
        </div>
    );
}

export default App; // Force rebuild Sat Aug  2 17:21:33 EDT 2025
// Force rebuild Sat Aug  2 17:24:48 EDT 2025 - cache cleared
// Build timestamp: Sat Aug  2 17:34:35 EDT 2025 - React Router fixes
// Force cache clear - Mon Sep  1 21:42:42 EDT 2025
