# Delivery Price Calculator

## Purpose
This application calculates the delivery cost of an order based on factors such as:
- **Venue Slug**: The unique identifier of the restaurant or delivery location.
- **Cart Value**: The value of the order (in Euros).
- **User Latitude and Longitude**: The geographic coordinates of the user.
- **Delivery Fee Calculation**: Includes delivery fees based on distance and other factors.

## Key Sections in the Application

### 1. Input Information:
- **Venue Slug**: The unique identifier for a restaurant, which is provided by the API.
- **Cart Value (Order Value)**: The user enters the order value in Euros.
- **User Latitude and Longitude**: The user enters their geographical coordinates to calculate the delivery distance from their location to the restaurant.

### 2. Calculations and Results:
- The application calculates the distance between the user's location and the restaurant.
- The delivery fee is calculated based on the distance, order value, and other factors such as small order surcharges.

## How to Use

1. **Enter Venue Slug**: Enter the restaurant’s slug in the "Venue Slug" field. This slug can be provided by the API.
2. **Enter Cart Value**: Enter the order value in Euros.
3. **Enter User Latitude and Longitude**: Enter the user’s geographical coordinates (or use tools like Google Maps to retrieve the coordinates).
4. **Click the "Get Location" Button**: This button sends a request to the API and calculates the delivery price based on the entered information.

## Results Analysis

Once the user enters the required information and clicks "Get Location", the application performs the following steps:

### 1. Fetch Data from the API:
- The application sends requests to fetch static and dynamic data for the restaurant based on the entered `venueSlug`.

### 2. Calculate Distance:
- The distance between the user’s location and the restaurant is calculated using the **Haversine formula**. This formula calculates the distance between two points on a sphere based on their latitude and longitude.

### 3. Calculate Delivery Fee:
- The delivery fee is calculated based on the distance between the user and the restaurant, as well as the pricing ranges provided by the API.
- Delivery fees may vary depending on the distance (some distance ranges may have different fees).

### 4. Surcharge:
- If the order value is below the restaurant’s minimum order amount, a surcharge will be added to meet the required minimum order value.

### 5. Final Results:
- **Cart Value**: The value of the order.
- **Small Order Surcharge**: The surcharge for small orders (if applicable).
- **Delivery Fee**: The cost of delivery.
- **Delivery Distance**: The distance in meters from the user to the restaurant.
- **Total Price**: The final price of the order, which includes the delivery fee and any surcharges.

## Example

Let’s assume the following:
- The order value is 25 EUR.
- The user's location is at `latitude: 59.3293`, `longitude: 18.0686`.
- The restaurant's slug is `restaurant-slug`.

After entering this information, the application will return the following results:
- **Cart Value**: 25 EUR
- **Small Order Surcharge**: 2 EUR (if the order is smaller than the restaurant’s minimum order value)
- **Delivery Fee**: 3.50 EUR
- **Delivery Distance**: 5 km
- **Total Price**: 30.50 EUR (including surcharge and delivery fee).

## Formulas Used in the Application

### 1. Distance Calculation Formula:
The **Haversine formula** is used to calculate the distance between two points based on their geographical coordinates. This formula is essential for calculating the distance between two points on the globe in meters.

```ts
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
