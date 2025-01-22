import React from 'react';

interface InputFormProps {
  venueSlug: string;
  setVenueSlug: (value: string) => void;
  cartValue: string | number;
  setCartValue: (value: string | number) => void;
  userLatitude: string | number;
  setUserLatitude: (value: string | number) => void;
  userLongitude: string | number;
  setUserLongitude: (value: string | number) => void;
  fetchVenueData: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  venueSlug,
  setVenueSlug,
  cartValue,
  setCartValue,
  userLatitude,
  setUserLatitude,
  userLongitude,
  setUserLongitude,
  fetchVenueData,
}) => (
  <div>
    <div>
      <label>Venue Slug:</label>
      <input
        type="text"
        value={venueSlug}
        onChange={(e) => setVenueSlug(e.target.value)}
      />
    </div>
    <div>
      <label>Cart Value (EUR):</label>
      <input
        type="number"
        value={cartValue}
        onChange={(e) => setCartValue(e.target.value)}
      />
    </div>
    <div>
      <label>User Latitude:</label>
      <input
        type="number"
        value={userLatitude}
        onChange={(e) => setUserLatitude(e.target.value)}
      />
    </div>
    <div>
      <label>User Longitude:</label>
      <input
        type="number"
        value={userLongitude}
        onChange={(e) => setUserLongitude(e.target.value)}
      />
    </div>
    <button onClick={fetchVenueData}>Get Location</button>
  </div>
);

export default InputForm;
