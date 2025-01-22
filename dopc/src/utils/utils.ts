export const calculateDistance = ([lng1, lat1]: number[], [lng2, lat2]: number[]): number => {
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

export const calculateDeliveryFee = (basePrice: number, distance: number, ranges: any[]): number => {
  for (const range of ranges) {
    if (distance >= range.min && (range.max === 0 || distance < range.max)) {
      return basePrice + range.a + Math.round((range.b * distance) / 10);
    }
  }
  throw new Error('Delivery not available for this distance.');
};
