// All interfaces and types used in the LiveMap component

export interface RouteInfo {
  student: string;
  studentId: string;
  routeNo: number;
  distance: string;
  time: number;
  color: string;
  backgroundColor: string;
  status: "pending" | "picked";
  trafficStatus: string;
}

export interface UserLocation {
  id: string;
  firstName?: string;
  displayName?: string;
  email?: string;
  username?: string;
  latitude?: number;
  longitude?: number;
  role?: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface RouteSummary {
  lengthInMeters: number;
  travelTimeInSeconds: number;
}

export interface RouteResponse {
  routes?: Array<{
    summary: RouteSummary;
    legs?: Array<{ points?: RoutePoint[] }>;
  }>;
}

export type Position = [number, number];