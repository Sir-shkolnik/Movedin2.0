import React, { useState, useEffect, useRef } from "react";
import { useForm } from "../../../contexts/FormContext";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VwcG9ydG1vdmVkaW4iLCJhIjoiY21kZmdxdHh6MGQ2aDJqcHE2YTIwbTFrMiJ9.I1xkq82JXLMlgB02xT8LMw';

function ReviewStep() {
  const { data } = useForm();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapContainer.current && !map.current && data.from && data.to) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      // Use real user addresses from form data
      const fromAddress = data.from;
      const toAddress = data.to;
      
      // Geocode addresses to get coordinates
      const geocodeAddress = async (address) => {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
        );
        const json = await response.json();
        if (json.features && json.features.length > 0) {
          return json.features[0].center; // [lng, lat]
        }
        return null;
      };
      
      // Default fallback coordinates (Toronto area)
      let fromCoords = [-79.3796, 43.8563];
      let toCoords = [-79.5332, 43.6532];
      
      // Initialize map centered between the two points with 3D perspective
      // Using dark theme for better road visibility and modern look
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark theme for better road visibility
        center: [-79.4564, 43.75475], // Center between the two points
        zoom: 11,
        pitch: 50, // Increased pitch for better 3D view
        bearing: -17.6 // Rotate map slightly for better view
      });

      map.current.on('load', async () => {
        try {
          // Geocode the addresses
          const geocodedFrom = await geocodeAddress(fromAddress);
          const geocodedTo = await geocodeAddress(toAddress);
          
          if (geocodedFrom) fromCoords = geocodedFrom;
          if (geocodedTo) toCoords = geocodedTo;
          
          // Get dispatcher location from selected quote
          const dispatcherName = data.selectedQuote?.dispatcher_info?.name || 'Toronto';
          const dispatcherCoords = await geocodeAddress(dispatcherName + ', ON');
          
          // Center map on the "from" location
          map.current.setCenter(fromCoords);
          map.current.setZoom(10); // Zoom level to show the journey
          
          // Get 3-legged route with traffic-aware routing: Dispatcher → From → To → Dispatcher
          // Using 'driving-traffic' profile for realistic traffic-aware routing
          const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${dispatcherCoords[0]},${dispatcherCoords[1]};${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]};${dispatcherCoords[0]},${dispatcherCoords[1]}?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_TOKEN}`
          );
          const json = await query.json();
          const route = json.routes[0].geometry.coordinates;
          
          // Extract traffic congestion data if available
          const trafficData = json.routes[0].legs.map(leg => 
            leg.steps.map(step => ({
              congestion: step.congestion || [],
              duration: step.duration,
              distance: step.distance
            }))
          );
          
          setMapLoaded(true);
          
          // Add route layer with actual road coordinates
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            }
          });

          // Add route layer with thicker line for better visibility on dark theme
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#10B981', // Green color for better visibility on dark theme
              'line-width': 6, // Thicker line
              'line-opacity': 0.9,
              'line-dasharray': [2, 2] // Dashed line for animated effect
            }
          });
          
          // Add route outline for better visibility
          map.current.addLayer({
            id: 'route-outline',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 8,
              'line-opacity': 0.3
            }
          }, 'route');

          // Add dispatcher marker
          new mapboxgl.Marker({ color: '#5340FF' })
            .setLngLat(dispatcherCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>Dispatcher</strong><br>${dispatcherName}`))
            .addTo(map.current);

          // Add from marker
          new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat(fromCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>From</strong><br>${fromAddress}`))
            .addTo(map.current);

          // Add to marker
          new mapboxgl.Marker({ color: '#EF4444' })
            .setLngLat(toCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>To</strong><br>${toAddress}`))
            .addTo(map.current);

          // Create truck marker with PNG image
          // Make it smaller (30px) for better visibility and realistic size
          const createTruckMarker = (imagePath, initialRotation) => {
            const truckEl = document.createElement('div');
            const img = document.createElement('img');
            img.src = imagePath;
            img.style.width = '30px'; // Smaller size for realistic appearance
            img.style.height = '30px'; // Smaller size for realistic appearance
            img.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))';
            img.style.transformOrigin = 'center center';
            img.style.transform = `rotate(${initialRotation}deg)`; // Initial rotation to align truck front
            truckEl.appendChild(img);
            truckEl.style.transformOrigin = 'center center';
            return { marker: new mapboxgl.Marker(truckEl), img: img };
          };

          // Create 1 truck (empty truck going to pickup)
          // Truck image front faces right, so we need to rotate it to face north (0°)
          // The truck image is oriented to the right, so we need -90° to make it face up
          const truck1 = createTruckMarker('/trucks/empty truck.png', -90);
          
          // Add truck to map starting at dispatcher
          truck1.marker.setLngLat(dispatcherCoords).addTo(map.current);

          // Animate truck along the route using proper interpolation
          const turf = await import('@turf/turf');
          
          // Create a LineString from the route coordinates
          const line = turf.lineString(route);
          
          // Calculate total distance of the route
          const lineDistance = turf.length(line, { units: 'kilometers' });
          
          // Create interpolated points along the route
          const steps = 1000; // More steps for smoother animation
          const arc = [];
          
          for (let i = 0; i <= steps; i++) {
            const segment = turf.along(line, (lineDistance / steps) * i, { units: 'kilometers' });
            arc.push(segment.geometry.coordinates);
          }
          
          // Animate truck along interpolated points
          // Much slower animation for better visibility (200ms between each point)
          const speedFactor = 200; // Slower animation - 200ms between each point
          
          const animateTruck = (truckData, counter, initialRotation, routeArray) => {
            if (counter >= routeArray.length) {
              counter = 0; // Loop the animation
            }
            
            const currentPoint = routeArray[counter];
            truckData.marker.setLngLat(currentPoint);
            
            // Calculate bearing for rotation and add initial rotation offset
            // Look ahead a few points for smoother rotation
            const lookAhead = Math.min(5, routeArray.length - counter - 1);
            if (lookAhead > 0) {
              const start = routeArray[counter];
              const end = routeArray[counter + lookAhead];
              const bearing = turf.bearing(turf.point(start), turf.point(end));
              
              // Apply bearing + initial rotation to keep truck facing forward
              // Add smooth CSS transition for rotation
              truckData.img.style.transition = 'transform 0.3s ease-out';
              truckData.img.style.transform = `rotate(${bearing + initialRotation}deg)`;
            }
            
            counter++;
            setTimeout(() => animateTruck(truckData, counter, initialRotation, routeArray), speedFactor);
          };
          
          // Start truck animation after 1 second
          setTimeout(() => {
            animateTruck(truck1, 0, -90, arc); // -90° initial rotation to face north
          }, 1000);
          
        } catch (error) {
          console.error('Error loading map:', error);
          setMapLoaded(true); // Still show the map even if route fails
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Simple text-based PDF download
    const content = `
MOVING QUOTE
============

Vendor: ${data.selectedQuote?.vendor_name || 'N/A'}
Total Cost: ${formatPrice(data.selectedQuote?.total_cost || 0)}
Move Date: ${data.date || 'N/A'}
Move Time: ${data.time || 'N/A'}

FROM ADDRESS
${data.from || 'N/A'}

TO ADDRESS
${data.to || 'N/A'}

BREAKDOWN
---------
Hourly Rate: ${formatPrice(data.selectedQuote?.hourly_rate || 0)}/hr
Estimated Hours: ${data.selectedQuote?.estimated_hours || 0}
Crew Size: ${data.selectedQuote?.crew_size || 0} people
Truck Count: ${data.selectedQuote?.truck_count || 0}

CONTACT
-------
${data.contact?.name || 'N/A'}
${data.contact?.email || 'N/A'}
${data.contact?.phone || 'N/A'}

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moving-quote.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="qw-inner-content">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 className="qw-title" style={{ margin: 0, marginBottom: '8px' }}>Review Your Quote</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              Review all details and confirm your move
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '10px 20px',
                background: 'white',
                border: '2px solid #5340FF',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#5340FF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#5340FF';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#5340FF';
              }}
            >
              🖨️ Print
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                padding: '10px 20px',
                background: 'white',
                border: '2px solid #5340FF',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#5340FF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#5340FF';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#5340FF';
              }}
            >
              📄 Download
            </button>
          </div>
        </div>
        {/* Map Section - Always render container */}
        <div style={{ 
          marginBottom: '32px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          background: '#F9FAFB',
          minHeight: '400px',
          position: 'relative'
        }}>
          <div 
            ref={mapContainer} 
            style={{ 
              width: '100%', 
              height: '400px',
              minHeight: '300px',
              borderRadius: '12px'
            }} 
            className="map-responsive"
          />
          {!mapLoaded && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#6B7280'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #E5E7EB',
                borderTop: '3px solid #5340FF',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px'
              }}></div>
              <div>Loading map...</div>
            </div>
          )}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        {/* Quote Summary - Prominent */}
        {data.selectedQuote && (
          <section style={{ 
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #5340FF 0%, #4230dd 100%)',
            padding: '32px',
            borderRadius: '16px',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'white' }}>
              Your Moving Quote
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total Cost</div>
                <div style={{ fontSize: '42px', fontWeight: 700 }}>{formatPrice(data.selectedQuote.total_cost)}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Hourly Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatPrice(data.selectedQuote.hourly_rate)}/hr</div>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              padding: '16px', 
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Estimated Hours</div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>{data.selectedQuote.estimated_hours} hours</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Crew Size</div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>{data.selectedQuote.crew_size} people</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Moving Company</div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>{data.selectedQuote.vendor_name}</div>
              </div>
            </div>
          </section>
        )}

        {/* Move Details */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📍</span>
            Move Details
          </h3>
          <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>FROM</div>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.from || 'Not specified'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>TO</div>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.to || 'Not specified'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>DATE</div>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.date || 'Not specified'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>TIME</div>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.time || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* From Details */}
        {data.fromDetails && (
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🏠</span>
              From Details
            </h3>
            <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>HOME TYPE</div>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.fromDetails.homeType || 'Not specified'}</div>
                </div>
                {data.fromDetails.rooms && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>ROOMS</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.fromDetails.rooms}</div>
                  </div>
                )}
                {data.fromDetails.sqft && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>SQUARE FOOTAGE</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.fromDetails.sqft}</div>
                  </div>
                )}
                {data.fromDetails.floors && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>FLOORS</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.fromDetails.floors}</div>
                  </div>
                )}
                {data.fromDetails.garage !== undefined && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>GARAGE</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.fromDetails.garage ? 'Yes' : 'No'}</div>
                  </div>
                )}
                {data.fromDetails.stairs !== undefined && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>STAIRS</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.fromDetails.stairs}</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* To Details */}
        {data.toDetails && (
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🏡</span>
              To Details
            </h3>
            <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>HOME TYPE</div>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.toDetails.homeType || 'Not specified'}</div>
                </div>
                {data.toDetails.rooms && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>ROOMS</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.toDetails.rooms}</div>
                  </div>
                )}
                {data.toDetails.sqft && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>SQUARE FOOTAGE</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.toDetails.sqft}</div>
                  </div>
                )}
                {data.toDetails.floors && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>FLOORS</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.toDetails.floors}</div>
                  </div>
                )}
                {data.toDetails.garage !== undefined && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>GARAGE</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.toDetails.garage ? 'Yes' : 'No'}</div>
        </div>
                )}
                {data.toDetails.stairs !== undefined && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>STAIRS</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.toDetails.stairs}</div>
        </div>
                )}
        </div>
        </div>
      </section>
        )}


        {/* Contact Info */}
        {data.contact && (
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📧</span>
              Contact Information
            </h3>
            <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>NAME</div>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.contact.firstName} {data.contact.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>EMAIL</div>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.contact.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>PHONE</div>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>{data.contact.phone}</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ReviewStep;


