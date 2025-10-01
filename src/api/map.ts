
interface PassPoint{
  x:number,
  y:number
}
interface RouteRequest{
  startX: number,
  startY:  number,
  endX:  number,
  endY: number,
  viaPoints: PassPoint[],
  transport: "CAR"|"PEDESTRIAN",
}

const api_base = import.meta.env.VITE_API_HOST || "http://localhost:8000"

export const requestRoute = async(body:RouteRequest)=>{
  const res = await fetch(`${api_base}/map/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}