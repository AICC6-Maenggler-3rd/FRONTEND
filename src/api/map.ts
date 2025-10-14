
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

interface MapPoint{
  lng: number,
  lat: number,
}
interface PathRequest{
  waypoints: MapPoint[],
  transport: "CAR"|"PEDESTRIAN",
}
interface PathResponse{
  start_point: MapPoint,
  end_point: MapPoint,
  path: MapPoint[],
  distance: number,
  duration: number,
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

export const requestPath = async(body:PathRequest):Promise<PathResponse>=>{
  const res = await fetch(`${api_base}/map/path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}

