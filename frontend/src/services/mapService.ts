// mapService.ts
// สำหรับ logic ที่เกี่ยวกับ map API ในอนาคต (placeholder)
export const getMapboxToken = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/map/token`);
  const data = await res.json();
  return data.token;
};
