import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './Stepper.css';
const iconNames = [
    'location.svg',
    'home.svg',
    'destination.svg',
    'movers.svg',
    'contact.svg',
    'review.svg',
    'thankyou.svg'
];
const fallbackIcon = '/icons/location.svg';
const Stepper = ({ steps, currentStep, goToStep }) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return (_jsx("aside", {
        className: "stepper-sidebar",
        children: steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (_jsxs("div", {
                className: `stepper-step${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}${isCompleted && goToStep ? ' clickable' : ''}`,
                onClick: isCompleted && goToStep ? () => goToStep(idx) : undefined,
                children: [_jsx("div", {
                    className: "stepper-icon",
                    children: _jsx("img", {
                        src: `/icons/${iconNames[idx]}`,
                        alt: step.label,
                        height: 24,
                        width: 24,
                        onError: e => {
                            e.target.src = fallbackIcon;
                        }
                    })
                }), !isMobile && (_jsxs("div", { className: "stepper-content", children: [_jsxs("div", { className: "stepper-label", children: [_jsxs("span", { className: "stepper-number", children: [idx + 1, "."] }), " ", step.label] }), _jsx("div", { className: "stepper-subtitle", children: step.subtitle })] }))]
            }, step.label));
        })
    }));
};
export default Stepper;