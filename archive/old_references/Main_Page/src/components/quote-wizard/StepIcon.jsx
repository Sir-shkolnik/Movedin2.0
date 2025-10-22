import React from "react";

const Box = ({ children }) => (
  <div style={{
    width: 40,
    height: 40,
    borderRadius: 8,
    background: '#FFFFFF',
    boxShadow: '0px 1px 2px rgba(16,24,40,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>{children}</div>
);

export const LocationIcon = () => (
  <Box>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s7-6.163 7-11a7 7 0 10-14 0c0 4.837 7 11 7 11z" stroke="#5340FF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="11" r="2.5" stroke="#5340FF" strokeWidth="1.7"/>
    </svg>
  </Box>
);

export const CalendarIcon = () => (
  <Box>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#344054" strokeWidth="1.7"/>
      <path d="M16 3v4M8 3v4M3 10h18" stroke="#344054" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  </Box>
);

export const ServiceIcon = () => (
  <Box>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#344054" strokeWidth="1.7"/>
      <path d="M8 12h8M8 16h5M8 8h8" stroke="#344054" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  </Box>
);

export const PhoneIcon = () => (
  <Box>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v2a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.09 4.2 2 2 0 014.11 2h2a2 2 0 012 1.72c.13.98.35 1.93.65 2.85a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.23-1.23a2 2 0 012.11-.45c.92.3 1.87.52 2.85.65A2 2 0 0122 16.92z" stroke="#344054" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </Box>
);


