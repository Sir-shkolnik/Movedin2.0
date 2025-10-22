import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [data, setData] = useState(() => {
    // Always start with clean data on page refresh
    return {};
  });

  // Clear sessionStorage and redirect to first step on page refresh
  useEffect(() => {
    // Clear any existing form data
    sessionStorage.removeItem('quoteFormData');
    
    // If we're not on the first step or thank you page, redirect to first step
    if (location.pathname !== '/quote' && 
        location.pathname !== '/quote/thank-you' && 
        location.pathname.startsWith('/quote')) {
      navigate('/quote', { replace: true });
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save to sessionStorage whenever data changes (but only if not empty)
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      sessionStorage.setItem('quoteFormData', JSON.stringify(data));
    }
  }, [data]);

  return (
    <FormContext.Provider value={{ data, setData }}>
      {children}
    </FormContext.Provider>
  );
};


