"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search, X } from "lucide-react";
import CustomButton from "../custom-button/custom-button.component";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

function MapClickHandler({ onMapClick }) {
  if (typeof window === "undefined") return null;
  
  const { useMapEvents, useMap } = require("react-leaflet");
  const map = useMap();
  
  useEffect(() => {
    const timeouts = [];
    [100, 300, 500].forEach((delay) => {
      const timeout = setTimeout(() => {
        map.invalidateSize();
      }, delay);
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [map]);
  
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function AddressPicker({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "Search or click on map to select location",
  required = false,
}) {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (value && !selectedLocation) {
      geocodeAddress(value);
    }
  }, [value]);

  const geocodeAddress = async (address) => {
    if (!address || address.trim() === "") {
      setSelectedLocation(null);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`,
        {
          headers: {
            "User-Agent": "OpsCore Logistics App",
          },
        }
      );

      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const location = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name,
        };
        setSelectedLocation(location);
        setSearchQuery(location.address);
        onChange(location.address);
      } else {
        setSelectedLocation(null);
      }
    } catch (error) {
      setSelectedLocation(null);
    } finally {
      setIsSearching(false);
    }
  };

  const searchAddresses = async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            "User-Agent": "OpsCore Logistics App",
          },
        }
      );

      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        searchAddresses(query);
      } else {
        setSearchResults([]);
      }
    }, 500);
  };

  const handleMapClick = async (latlng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
        {
          headers: {
            "User-Agent": "OpsCore Logistics App",
          },
        }
      );

      const data = await response.json();
      if (data && data.display_name) {
        const location = {
          lat: latlng.lat,
          lng: latlng.lng,
          address: data.display_name,
        };
        setSelectedLocation(location);
        setSearchQuery(location.address);
        onChange(location.address);
        setSearchResults([]);
      }
    } catch (error) {
      // Silently handle reverse geocoding errors
    }
  };

  const handleSelectResult = (result) => {
    const location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    setSelectedLocation(location);
    setSearchQuery(location.address);
    onChange(location.address);
    setSearchResults([]);
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setSearchQuery("");
    onChange("");
    setSearchResults([]);
  };

  const defaultCenter = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [40.7128, -74.006];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <CustomButton
          type="button"
          text={showMap ? "Hide Map" : "Show Map"}
          variant="outline"
          size="sm"
          onClick={() => setShowMap(!showMap)}
        />
      </div>

      <div className="relative address-picker-input">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-gray-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          onFocus={(e) => e.target.style.outline = 'none'}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {searchResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 focus:outline-none focus:ring-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {result.display_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.type} • {result.class}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {showMap && typeof window !== "undefined" && (
        <div className="mt-4 rounded-lg border border-gray-300" style={{ overflow: "visible", width: "100%" }}>
          <div 
            className="relative w-full"
            style={{ height: "450px", minHeight: "450px", width: "100%", position: "relative", overflow: "hidden" }}
            id={`map-container-${name}`}
          >
            <MapContainer
              center={defaultCenter}
              zoom={selectedLocation ? 15 : 10}
              style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              className="address-picker-map"
              whenReady={(map) => {
                setTimeout(() => map.target.invalidateSize(), 100);
                setTimeout(() => map.target.invalidateSize(), 300);
                setTimeout(() => map.target.invalidateSize(), 500);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedLocation && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                />
              )}
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          </div>
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
            <MapPin className="h-3 w-3 inline mr-1" />
            Click on the map to select a location
          </div>
        </div>
      )}

      <input type="hidden" name={name} value={searchQuery} />
    </div>
  );
}

