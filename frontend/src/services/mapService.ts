// mapService.ts
// สำหรับ logic ที่เกี่ยวกับ map API ในอนาคต (placeholder)
export const getMapboxToken = async () => {
  const res = await fetch('http://localhost:3000/v1/map/token');
  const data = await res.json();
  return data.token;
};
