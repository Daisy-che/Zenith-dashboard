"use client";
import { useState, useRef, useEffect } from 'react';

export interface Sensor {
  latitude: number;
  longitude: number;
  name: string;
  status: 'Active' | 'Inactive';
}

declare global {
  interface Window {
    google: any;
  }
}

interface MapProps {
  sensorData: Sensor[];
}

const Map: React.FC<MapProps> = ({ sensorData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchLocation(searchQuery);
    }
  };

  const searchLocation = (query: string) => {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: query }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        map?.setCenter(location);
        new google.maps.Marker({
          position: location,
          map,
          title: query,
        });
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!googleMapsApiKey) {
        console.error("Google Maps API key is missing.");
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        initMap();
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps script.");
      };
    };

    const initMap = () => {
      if (mapRef.current && sensorData.length > 0) {
        const google = window.google;

        const nairobiBounds = new google.maps.LatLngBounds(
          { lat: -1.4336, lng: 36.6500 },
          { lat: -1.1359, lng: 37.0390 }
        );

        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: -1.2921, lng: 36.8219 },
          zoom: 12,
          restriction: {
            latLngBounds: nairobiBounds,
            strictBounds: true,
          },
        });

        setMap(newMap);

        sensorData.forEach((sensor) => {
          new google.maps.Marker({
            position: { lat: sensor.latitude, lng: sensor.longitude },
            map: newMap,
            title: sensor.name,
            icon: sensor.status === 'Active'
              ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          });
        });
      }
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }
  }, [sensorData, googleMapsApiKey]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search areas within Nairobi..."
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        style={{
          padding: '15px',
          border: '2px solid #008FFF',
          borderRadius: '5px',
          color: '#008FFF',
          outline: 'none',
          marginLeft: '-30%',
          width: '130%',
        }}
      />
      <div
        className='w-full ml-[-30%] '
        ref={mapRef}
        style={{ height: '380px', width: '130%', marginTop: '10px' }}
      />
    </div>
  );
};

export default Map;
