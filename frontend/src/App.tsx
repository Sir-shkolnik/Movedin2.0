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
    { label: 'Review Quote', subtitle: 'Review your moving details and quote' },
    { label: 'Contact & Pay', subtitle: 'Your contact information and payment' },
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
    
    // Debug logging function
    const logDebugStep = async (step: string, data: any) => {
        try {
            await fetch('https://movedin-backend.onrender.com/api/debug-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step,
                    data: {
                        ...data,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    }
                })
            });
        } catch (error) {
            console.error('Failed to log debug step:', error);
        }
    };

    // Get current step from URL or default to 0
    const getCurrentStepFromURL = () => {
        const path = location.pathname;
        const hash = location.hash;
        const fullPath = path + hash;
        const search = location.search;
        
        // Only log debug info in development and when URL changes
        if (process.env.NODE_ENV === 'development') {
            const debugData = {
                path,
                hash,
                fullPath,
                search,
                includesStep7: fullPath.includes('step7'),
                includesSessionId: search.includes('session_id'),
                sessionIdInHash: hash.includes('session_id'),
                leadIdInHash: hash.includes('lead_id')
            };
            
            // Only log if URL has changed (use a simple cache)
            if (!getCurrentStepFromURL.lastUrl || getCurrentStepFromURL.lastUrl !== fullPath) {
                console.log('🔍 getCurrentStepFromURL Debug:', debugData);
                getCurrentStepFromURL.lastUrl = fullPath;
                
                // Log to backend only on URL change
                logDebugStep('URL_ANALYSIS', debugData);
            }
        }
        
        // Check both pathname and hash for step routing
        if (path === '/step7' || hash === '#/step7' || fullPath.includes('step7') || search.includes('session_id') || hash.includes('session_id')) {
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Detected Step7 - returning 6');
                logDebugStep('STEP7_DETECTED', { path, hash, fullPath, search, routing_detected: true });
            }
            return 6;
        }
        // Handle /quote route - start at Step 1
        if (path === '/quote' && !hash) {
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Detected /quote route - returning 0 (Step 1)');
                logDebugStep('QUOTE_ROUTE_DETECTED', { path, hash, fullPath, search, routing_detected: true });
            }
            return 0;
        }
        if (path === '/step6' || hash === '#/step6' || fullPath.includes('step6')) {
            if (process.env.NODE_ENV === 'development') {
                logDebugStep('STEP6_DETECTED', { path, hash, fullPath, search });
            }
            return 5;
        }
        if (path === '/step5' || hash === '#/step5' || fullPath.includes('step5')) {
            if (process.env.NODE_ENV === 'development') {
                logDebugStep('STEP5_DETECTED', { path, hash, fullPath, search });
            }
            return 4;
        }
        if (path === '/step4' || hash === '#/step4' || fullPath.includes('step4')) {
            if (process.env.NODE_ENV === 'development') {
                logDebugStep('STEP4_DETECTED', { path, hash, fullPath, search });
            }
            return 3;
        }
        if (path === '/step3' || hash === '#/step3' || fullPath.includes('step3')) {
            if (process.env.NODE_ENV === 'development') {
                logDebugStep('STEP3_DETECTED', { path, hash, fullPath, search });
            }
            return 2;
        }
        if (path === '/step2' || hash === '#/step2' || fullPath.includes('step2')) {
            if (process.env.NODE_ENV === 'development') {
                logDebugStep('STEP2_DETECTED', { path, hash, fullPath, search });
            }
            return 1;
        }
        if (process.env.NODE_ENV === 'development') {
            console.log('❌ No step detected - returning 0');
            logDebugStep('NO_STEP_DETECTED', { path, hash, fullPath, search });
        }
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
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🚀 Step 6 - Footer button clicked!');
                        console.log('🔍 Step 6 - Current step:', currentStep);
                    }
                    
                    // Add a small delay to ensure the component is fully rendered
                    setTimeout(() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('🔍 Step 6 - Looking for .step6-modern element...');
                        }
                        
                        // Try multiple selectors
                        const step6Element = document.querySelector('.step6-modern') || 
                                            document.querySelector('[class*="step6"]') ||
                                            document.querySelector('.step-card');
                        
                        if (process.env.NODE_ENV === 'development') {
                            console.log('🔍 Step 6 - Found step6 element:', step6Element);
                            console.log('🔍 Step 6 - Element classes:', step6Element?.className);
                        }
                        
                        if (step6Element) {
                            if (process.env.NODE_ENV === 'development') {
                                console.log('🔍 Step 6 - Looking for .pay-button-modern...');
                            }
                            const payButton = step6Element.querySelector('.pay-button-modern') as HTMLButtonElement;
                            if (process.env.NODE_ENV === 'development') {
                                console.log('🔍 Step 6 - Found pay button:', payButton);
                                console.log('🔍 Step 6 - Button disabled:', payButton?.disabled);
                                console.log('🔍 Step 6 - Button style:', payButton?.style?.display);
                            }
                            
                            if (payButton && !payButton.disabled) {
                                if (process.env.NODE_ENV === 'development') {
                                    console.log('🚀 Step 6 - Clicking payment button...');
                                }
                                payButton.click();
                            } else {
                                if (process.env.NODE_ENV === 'development') {
                                    console.log('❌ Step 6 - Payment button not found or disabled');
                                    console.log('🔍 Step 6 - All buttons in step6:', step6Element.querySelectorAll('button'));
                                }
                            }
                        } else {
                            if (process.env.NODE_ENV === 'development') {
                                console.log('❌ Step 6 - Step6 element not found');
                                console.log('🔍 Step 6 - All elements with step6:', document.querySelectorAll('[class*="step6"]'));
                            }
                        }
                    }, 100); // 100ms delay
                };
            }

    // Debug continueAction (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('🔍 App - continueAction:', continueAction);
        console.log('🔍 App - continueButtonText:', continueButtonText);
        console.log('🔍 App - continueDisabled:', continueDisabled);
        console.log('🔍 App - currentStep:', currentStep);
    }

        return (
        <div className="app-root">
            <Stepper 
                steps={steps} 
                currentStep={currentStep} 
                goToStep={goToStep}
            />
            <div className="step-content">
                {currentStep === 0 && <Step1 onNext={goNext} />}
                {currentStep === 1 && <Step2 onNext={goNext} onBack={goBack} />}
                {currentStep === 2 && <Step3 onNext={goNext} onBack={goBack} />}
                {currentStep === 3 && <Step4 onNext={goNext} onBack={goBack} />}
                {currentStep === 4 && <Step5 onNext={goNext} onBack={goBack} />}
                {currentStep === 5 && <Step6 onNext={goNext} onBack={goBack} />}
                {currentStep === 6 && (() => {
                    // Check for payment redirect URL parameters first (most reliable after Stripe redirect)
                    const hasPaymentRedirect = location.hash.includes('#/step7') && 
                                             (location.hash.includes('session_id') || location.search.includes('session_id'));
                    
                    const shouldRenderStep7 = hasPaymentRedirect || 
                                             data.selectedQuote || 
                                             sessionStorage.getItem('paymentSuccess') || 
                                             location.search.includes('session_id') || 
                                             location.hash.includes('session_id');
                    
                    const debugInfo = {
                        currentStep,
                        hasData: !!data,
                        hasSelectedQuote: !!data?.selectedQuote,
                        paymentSuccess: sessionStorage.getItem('paymentSuccess'),
                        hash: location.hash,
                        search: location.search,
                        hashIncludesStep7: location.hash.includes('#/step7'),
                        searchIncludesSessionId: location.search.includes('session_id'),
                        hashIncludesSessionId: location.hash.includes('session_id'),
                        hasPaymentRedirect,
                        shouldRenderStep7
                    };
                    
                    // Log Step7 rendering decision
                    logDebugStep('STEP7_RENDERING_DECISION', {
                        ...debugInfo,
                        step7_rendered: shouldRenderStep7
                    });
                    
                    return shouldRenderStep7 ? 
                        <Step7 /> : 
                        <div className="step-card">
                            <h2>Redirecting...</h2>
                            <p>Please complete the booking process to access the confirmation page.</p>
                            <div style={{marginTop: '20px', fontSize: '12px', color: '#666'}}>
                                <p>Debug Info:</p>
                                <p>currentStep: {currentStep}</p>
                                <p>hasData: {data ? 'yes' : 'no'}</p>
                                <p>hasSelectedQuote: {data?.selectedQuote ? 'yes' : 'no'}</p>
                                <p>paymentSuccess: {sessionStorage.getItem('paymentSuccess')}</p>
                                <p>hash: {location.hash}</p>
                                <p>search: {location.search}</p>
                                <p>hash includes step7: {location.hash.includes('#/step7') ? 'yes' : 'no'}</p>
                                <p>search includes session_id: {location.search.includes('session_id') ? 'yes' : 'no'}</p>
                                <p>shouldRenderStep7: {shouldRenderStep7 ? 'yes' : 'no'}</p>
                            </div>
                        </div>;
                })()}
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
// FORCE DEPLOYMENT - Fri Sep 12 14:10:00 EDT 2025 - Fix Step 5 payment UI
// DEPLOYMENT TIMESTAMP: 2025-09-12T18:15:00Z - Force cache bust
// EMERGENCY FIX: Step 5 payment UI removal - 2025-09-12T18:20:00Z
