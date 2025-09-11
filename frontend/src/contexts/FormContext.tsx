import React, { createContext, useContext, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

export interface FromDetails {
  homeType?: 'house' | 'townhouse' | 'condo' | 'apartment' | 'commercial';
  rooms: number;
  sqft?: string;
  heavyItems: { piano: number; safe: number; treadmill: number };
  additionalServices?: { packing?: boolean; storage?: boolean; cleaning?: boolean; junk?: boolean };
  // House
  floors?: number;
  garage?: boolean;
  stairs?: number;
  // Condo/Apartment
  floorNumber?: number;
  elevator?: boolean;
  loadingDock?: boolean;
}

export interface ToDetails {
  homeType?: 'house' | 'townhouse' | 'condo' | 'apartment' | 'commercial';
  rooms?: number;
  sqft?: string;
  stairs?: number;
  elevator?: boolean;
  floorNumber?: number;
  loadingDock?: boolean;
}

export interface MoveDetails {
  from: string;
  to: string;
  date: string;
  time: string;
  fromDetails: FromDetails;
  toDetails: ToDetails;
  vendor: any;
  quote: any;
  selectedQuote: any; // Add this field for Step4
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentSuccess: boolean;
}

const defaultMoveDetails: MoveDetails = {
  from: '',
  to: '',
  date: '',
  time: '',
  fromDetails: {
    homeType: 'house',
    rooms: 1,
    sqft: '',
    heavyItems: { piano: 0, safe: 0, treadmill: 0 },
    additionalServices: { packing: false, storage: false, cleaning: false, junk: false },
    floors: 1,
    garage: false,
    stairs: 0,
    floorNumber: 1,
    elevator: false,
    loadingDock: false,
  },
  toDetails: {
    stairs: 0,
    elevator: false,
    floorNumber: 1,
    loadingDock: false,
  },
  vendor: null,
  quote: null,
  selectedQuote: null,
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  paymentSuccess: false,
};

const FormContext = createContext<{
  data: MoveDetails;
  setData: Dispatch<SetStateAction<MoveDetails>>;
}>({ data: defaultMoveDetails, setData: () => {} });

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<MoveDetails>(defaultMoveDetails);
  return (
    <FormContext.Provider value={{ data, setData }}>
      {children}
    </FormContext.Provider>
  );
}; 