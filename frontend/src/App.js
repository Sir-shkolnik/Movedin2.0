import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import Stepper from './components/Stepper/Stepper';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step3 from './components/steps/Step3';
import Step4 from './components/steps/Step4';
import Step5 from './components/steps/Step5';
import Step6 from './components/steps/Step6';
import Step7 from './components/steps/Step7';
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
    return (_jsx(FormProvider, { children: _jsx(AppInner, {}) }));
}

function AppInner() {
    const [currentStep, setCurrentStep] = useState(0);
    const { data } = useForm();
    const goToStep = (stepIndex) => {
        if (stepIndex <= currentStep) {
            setCurrentStep(stepIndex);
        }
    };
    const goNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };
    const goBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return _jsx(Step1, { onNext: goNext });
            case 1:
                return _jsx(Step2, { onNext: goNext, onBack: goBack });
            case 2:
                return _jsx(Step3, { onNext: goNext, onBack: goBack });
            case 3:
                return _jsx(Step4, { onNext: goNext, onBack: goBack });
            case 4:
                return _jsx(Step5, { onNext: goNext, onBack: goBack });
            case 5:
                return _jsx(Step6, { onNext: goNext, onBack: goBack });
            case 6:
                return _jsx(Step7, {});
            default:
                return _jsx(Step1, { onNext: goNext });
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
        continueDisabled = !(firstName && firstName.trim()) || !(lastName && lastName.trim()) || !(email && email.trim()) || !(phone && phone.trim()) || !emailRegex.test(email || 'http://localhost:8000') || (phone || 'http://localhost:8000').length < 10;
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
                const payButton = step6Element.querySelector('.pay-button-modern');
                if (payButton && !payButton.disabled) {
                    payButton.click();
                }
            }
        };
    }

    return (_jsxs("div", { className: "app-root", children: [_jsx(Stepper, { steps: steps, currentStep: currentStep, goToStep: goToStep }), _jsx("div", { className: "step-content", children: renderStep() }), currentStep < 6 && (_jsx(Footer, { onContinue: continueAction, onBack: goBack, showBack: currentStep > 0, showContinue: currentStep < steps.length - 1, disabled: continueDisabled, label: continueButtonText }))] }));
}
export default App;