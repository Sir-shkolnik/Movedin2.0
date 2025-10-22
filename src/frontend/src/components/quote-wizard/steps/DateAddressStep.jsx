import React, { useState, useEffect, useRef } from "react";
import { useForm } from "../../../contexts/FormContext";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VwcG9ydG1vdmVkaW4iLCJhIjoiY21kZmdxdHh6MGQ2aDJqcHE2YTIwbTFrMiJ9.I1xkq82JXLMlgB02xT8LMw';

function DateAddressStep() {
  const { data, setData } = useForm();
  
  const [from, setFrom] = useState(data.from || '');
  const [to, setTo] = useState(data.to || '');
  const [date, setDate] = useState(data.date || '');
  const [time, setTime] = useState(data.time || '');

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromGeocoderRef = useRef(null);
  const toGeocoderRef = useRef(null);

  // Initialize Mapbox Geocoder for "From" address
  useEffect(() => {
    if (fromInputRef.current && !fromGeocoderRef.current) {
      fromGeocoderRef.current = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        placeholder: 'Enter address or postal code',
        types: 'address,poi',
        countries: 'ca', // Canada only
      });

      fromGeocoderRef.current.on('result', (e) => {
        setFrom(e.result.place_name);
      });

      fromInputRef.current.appendChild(fromGeocoderRef.current.onAdd());
    }
  }, []);

  // Initialize Mapbox Geocoder for "To" address
  useEffect(() => {
    if (toInputRef.current && !toGeocoderRef.current) {
      toGeocoderRef.current = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        placeholder: 'Enter new home address',
        types: 'address,poi',
        countries: 'ca', // Canada only
      });

      toGeocoderRef.current.on('result', (e) => {
        setTo(e.result.place_name);
      });

      toInputRef.current.appendChild(toGeocoderRef.current.onAdd());
    }
  }, []);

  // Sync local state to global form context
  useEffect(() => {
    setData(prev => ({
      ...prev,
      from,
      to,
      date,
      time
    }));
  }, [from, to, date, time, setData]);

  return (
    <div className="qw-inner-content">
      <h2 className="qw-title">Move Details</h2>
      
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="date-address-grid">
          <div className="qw-field">
            <label className="qw-label">
              From<span className="required">*</span>
            </label>
            <div ref={fromInputRef}></div>
          </div>
          
          <div className="qw-field">
            <label className="qw-label">
              To<span className="required">*</span>
            </label>
            <div ref={toInputRef}></div>
          </div>

          <div className="qw-field">
            <label className="qw-label">
              Date<span className="required">*</span>
            </label>
            <input 
              className="qw-input" 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="qw-field">
            <label className="qw-label">
              Time<span className="required">*</span>
            </label>
            <select 
              className="qw-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Select time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateAddressStep;


