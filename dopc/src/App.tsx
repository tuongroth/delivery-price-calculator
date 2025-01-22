import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { calculateDistance, calculateDeliveryFee } from './utils/utils';

const App = () => {
  const [venueSlug, setVenueSlug] = useState('');
  const [cartValue, setCartValue] = useState<string | number>('');
  const [userLatitude, setUserLatitude] = useState<string | number>('');
  const [userLongitude, setUserLongitude] = useState<string | number>('');
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVenueData = async () => {
    try {
      const staticUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
      const dynamicUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;

      const [staticRes, dynamicRes] = await Promise.all([fetch(staticUrl), fetch(dynamicUrl)]);
      if (!staticRes.ok || !dynamicRes.ok) {
        throw new Error('Failed to fetch venue data. Check the venue slug.');
      }

      const staticData = await staticRes.json();
      const dynamicData = await dynamicRes.json();

      calculatePricing(staticData, dynamicData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const calculatePricing = (staticData: any, dynamicData: any) => {
    const venueCoords = staticData.venue_raw.location.coordinates;
    const orderMin = dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
    const basePrice = dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
    const distanceRanges = dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;

    const userCoords = [parseFloat(userLongitude as string), parseFloat(userLatitude as string)];
    const deliveryDistance = calculateDistance(venueCoords, userCoords);

    const distanceFee = calculateDeliveryFee(basePrice, deliveryDistance, distanceRanges);

    const cartCents = parseFloat(cartValue as string) * 100;
    const smallOrderSurcharge = Math.max(0, orderMin - cartCents);

    const totalPrice = cartCents + smallOrderSurcharge + distanceFee;

    setOutput({
      cartValue: cartCents,
      smallOrderSurcharge,
      deliveryFee: distanceFee,
      deliveryDistance,
      totalPrice,
    });
    setError(null);
  };

  return (
    <div className="App">
      <h1>Delivery Order Price Calculator</h1>
      <InputForm
        venueSlug={venueSlug}
        setVenueSlug={setVenueSlug}
        cartValue={cartValue}
        setCartValue={setCartValue}
        userLatitude={userLatitude}
        setUserLatitude={setUserLatitude}
        userLongitude={userLongitude}
        setUserLongitude={setUserLongitude}
        fetchVenueData={fetchVenueData}
      />
      <OutputDisplay output={output} error={error} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
