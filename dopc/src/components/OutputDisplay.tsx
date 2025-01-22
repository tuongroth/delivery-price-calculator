import React from 'react';

interface OutputDisplayProps {
  output: any;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, error }) => (
  <div>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {output && (
      <div>
        <h2>Price Breakdown</h2>
        <p>
          Cart Value: {(output.cartValue / 100).toFixed(2)} EUR
        </p>
        <p>
          Small Order Surcharge: {(output.smallOrderSurcharge / 100).toFixed(2)} EUR
        </p>
        <p>
          Delivery Fee: {(output.deliveryFee / 100).toFixed(2)} EUR
        </p>
        <p>
          Delivery Distance: {output.deliveryDistance.toFixed(0)} m
        </p>
        <p>
          Total Price: {(output.totalPrice / 100).toFixed(2)} EUR
        </p>
      </div>
    )}
  </div>
);

export default OutputDisplay;
