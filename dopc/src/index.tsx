import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
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

  const calculateDistance = ([lng1, lat1]: number[], [lng2, lat2]: number[]): number => {
    const R = 6371e3; // Earth radius in meters
    const rad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLng = rad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const calculateDeliveryFee = (basePrice: number, distance: number, ranges: any[]): number => {
    for (const range of ranges) {
      if (distance >= range.min && (range.max === 0 || distance < range.max)) {
        return basePrice + range.a + Math.round((range.b * distance) / 10);
      }
    }
    throw new Error('Delivery not available for this distance.');
  };

  return (
    <div className="App">
      <h1>Delivery Order Price Calculator</h1>
      <div>
        <label>Venue Slug:</label>
        <input
          type="text"
          data-test-id="venueSlug"
          value={venueSlug}
          onChange={(e) => setVenueSlug(e.target.value)}
        />
      </div>
      <div>
        <label>Cart Value (EUR):</label>
        <input
          type="number"
          data-test-id="cartValue"
          value={cartValue}
          onChange={(e) => setCartValue(e.target.value)}
        />
      </div>
      <div>
        <label>User Latitude:</label>
        <input
          type="number"
          data-test-id="userLatitude"
          value={userLatitude}
          onChange={(e) => setUserLatitude(e.target.value)}
        />
      </div>
      <div>
        <label>User Longitude:</label>
        <input
          type="number"
          data-test-id="userLongitude"
          value={userLongitude}
          onChange={(e) => setUserLongitude(e.target.value)}
        />
      </div>
      <button data-test-id="getLocation" onClick={fetchVenueData}>
        Get Location
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {output && (
        <div>
          <h2>Price Breakdown</h2>
          <p>
            Cart Value: <span data-raw-value={output.cartValue}>{(output.cartValue / 100).toFixed(2)} EUR</span>
          </p>
          <p>
            Small Order Surcharge:{' '}
            <span data-raw-value={output.smallOrderSurcharge}>
              {(output.smallOrderSurcharge / 100).toFixed(2)} EUR
            </span>
          </p>
          <p>
            Delivery Fee: <span data-raw-value={output.deliveryFee}>{(output.deliveryFee / 100).toFixed(2)} EUR</span>
          </p>
          <p>
            Delivery Distance: <span data-raw-value={output.deliveryDistance}>{output.deliveryDistance.toFixed(0)} m</span>
          </p>
          <p>
            Total Price: <span data-raw-value={output.totalPrice}>{(output.totalPrice / 100).toFixed(2)} EUR</span>
          </p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
