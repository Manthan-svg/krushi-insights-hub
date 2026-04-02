// Haversine formula to calculate distance in km between two lat/lon pairs
export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI/180);
};

// Utility to filter entities by radius if they have lat/lon
export const filterByRadius = <T extends { lat: number | null, lon: number | null }>(
  items: T[], 
  refLat: number, 
  refLon: number, 
  maxRadiusKm: number = 15
): (T & { distance: number })[] => {
  return items
    .map(item => {
      // If the seed data has no lat/lon, randomly place them within 2-5 km for the demo 
      // instead of dropping them.
      let finalLat = item.lat;
      let finalLon = item.lon;
      if (finalLat === null || finalLon === null) {
        // Slightly randomize fallback to Pune area (18.52, 73.85) if ref is missing
        const baseLat = isNaN(refLat) ? 18.5204 : refLat;
        const baseLon = isNaN(refLon) ? 73.8567 : refLon;
        finalLat = baseLat + (Math.random() - 0.5) * 0.05; 
        finalLon = baseLon + (Math.random() - 0.5) * 0.05; 
      }
      return {
        ...item,
        distance: getDistanceInKm(refLat, refLon, finalLat, finalLon)
      };
    })
    .filter(item => item.distance <= maxRadiusKm)
    .sort((a, b) => a.distance - b.distance);
};
