// import React, { useEffect } from "react";
// import * as atlas from "azure-maps-control";
// import "azure-maps-control/dist/atlas.min.css";

// const LiveMap: React.FC = () => {

//   useEffect(() => {

//     navigator.geolocation.getCurrentPosition(
//       (position) => {

//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         const map = new atlas.Map("azure-map", {
//           center: [lng, lat],
//           zoom: 15,

//           authOptions: {
//             authType: atlas.AuthenticationType.subscriptionKey,
//             subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
//           },
//         });

//         map.events.add("ready", () => {

//           // =========================
//           // CURRENT LOCATION (School)
//           // =========================

//           const currentMarker =
//             new atlas.HtmlMarker({
//               position: [lng, lat],
//               text: "🏫",
//             });

//           map.markers.add(currentMarker);

//           // =========================
//           // NEW BUS STAND MORBI
//           // =========================

//           const destinationLat = 22.8118;
//           const destinationLng = 70.8385;

//           const destinationMarker =
//             new atlas.HtmlMarker({
//               position: [
//                 destinationLng,
//                 destinationLat,
//               ],
//               text: "🚌",
//             });

//           map.markers.add(destinationMarker);

//           // =========================
//           // LINE BETWEEN BOTH POINTS
//           // =========================

//           const dataSource =
//             new atlas.source.DataSource();

//           map.sources.add(dataSource);

//           dataSource.add(
//             new atlas.data.Feature(
//               new atlas.data.LineString([
//                 [lng, lat],
//                 [destinationLng, destinationLat],
//               ])
//             )
//           );

//           map.layers.add(
//             new atlas.layer.LineLayer(
//               dataSource,
//               undefined,
//               {
//                 strokeColor: "#ff0000",
//                 strokeWidth: 5,
//               }
//             )
//           );

//           // =========================
//           // AUTO FIT MAP
//           // =========================

//           map.setCamera({
//             bounds:
//               atlas.data.BoundingBox.fromPositions([
//                 [lng, lat],
//                 [destinationLng, destinationLat],
//               ]),
//             padding: 100,
//           });

//         });
//       },

//       (error) => {
//         console.error(
//           "Location Error:",
//           error
//         );
//       }
//     );

//   }, []);

//   return (
//     <div
//       id="azure-map"
//       style={{
//         width: "85%",
//         height: "90vh",
//       }}
//     />
//   );
// };

// export default LiveMap;



// import React, { useEffect, useRef, useState } from "react";
// import * as atlas from "azure-maps-control";
// import "azure-maps-control/dist/atlas.min.css";

// /// <reference types="azure-maps-control" />

// interface RouteInfo {
//   student: string;
//   routeNo: number;
//   distance: string;
//   time: number;
//   color: string;
//   backgroundColor: string;
// }

// interface UserLocation {
//   firstName?: string;
//   username?: string;
//   latitude?: number;
//   longitude?: number;
// }

// interface RoutePoint {
//   latitude: number;
//   longitude: number;
// }

// interface RouteSummary {
//   lengthInMeters: number;
//   travelTimeInSeconds: number;
// }

// interface RouteResponse {
//   routes?: Array<{
//     summary: RouteSummary;
//     legs?: Array<{ points?: RoutePoint[] }>;
//   }>;
// }

// type Position = [number, number];

// const SCHOOL_POSITION: Position = [70.831, 22.824];

// const routeColors = [
//   { line: "#dde018", card: "#dbeafe" },
//   { line: "#b6b83a", card: "#e5e7eb" },
// ];

// const busRouteColor = "#1d4ed8";

// const controls = [
//   new atlas.control.ZoomControl(),
//   new atlas.control.CompassControl(),
//   new atlas.control.PitchControl(),
//   new atlas.control.StyleControl(),
// ];

// const loadUsers = (): UserLocation[] => {
//   try {
//     return JSON.parse(localStorage.getItem("users") || "[]");
//   } catch {
//     return [];
//   }
// };

// const getRouteUrl = (start: Position, end: Position, maxAlternatives: number = 1) => {
//   const [startLng, startLat] = start;
//   const [endLng, endLat] = end;
//   return `https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=${startLat},${startLng}:${endLat},${endLng}&maxAlternatives=${maxAlternatives}&routeType=shortest&travelMode=car&subscription-key=${import.meta.env.VITE_AZURE_MAPS_KEY}`;
// };

// const addMarker = (map: atlas.Map, position: Position, text: string) => {
//   map.markers.add(new atlas.HtmlMarker({ position, text }));
// };

// const updateMarker = (
//   markerRef: React.MutableRefObject<atlas.HtmlMarker | null>,
//   map: atlas.Map,
//   position: Position,
//   text: string
// ) => {
//   if (!markerRef.current) {
//     markerRef.current = new atlas.HtmlMarker({ position, text });
//     map.markers.add(markerRef.current);
//     return;
//   }

//   markerRef.current.setOptions({ position, text });
// };

// const addRouteLine = (map: atlas.Map, coordinates: Position[], color: string, strokeWidth: number) => {
//   const source = new atlas.source.DataSource();
//   map.sources.add(source);
//   source.add(new atlas.data.Feature(new atlas.data.LineString(coordinates)));
//   map.layers.add(new atlas.layer.LineLayer(source, undefined, { strokeColor: color, strokeWidth }));
// };

// const cardContainerStyle: React.CSSProperties = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "10px",
//   padding: "10px",
// };

// const mapStyle: React.CSSProperties = { width: "100%", height: "85vh" };

// const LiveMap: React.FC = () => {
//   const [routeInfos, setRouteInfos] = useState<RouteInfo[]>([]);
//   const busMarkerRef = useRef<atlas.HtmlMarker | null>(null);

//   useEffect(() => {
//     const map = new atlas.Map("azure-map", {
//       center: SCHOOL_POSITION,
//       zoom: 13,
//       authOptions: {
//         authType: atlas.AuthenticationType.subscriptionKey,
//         subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
//       },
//     });

//     map.controls.add(controls, { position: atlas.ControlPosition.TopRight });

//     let busWatchId: number | null = null;

//     map.events.add("ready", async () => {
//       addMarker(map, SCHOOL_POSITION, "🏫");

//       const busPosition = await new Promise<Position | null>((resolve) => {
//         if (!navigator.geolocation) {
//           resolve(null);
//           return;
//         }

//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             resolve([position.coords.longitude, position.coords.latitude]);
//           },
//           (error) => {
//             console.error("Bus Location Error:", error);
//             resolve(null);
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 10000,
//           }
//         );
//       });

//       const users = loadUsers();
//       const positions: Position[] = [SCHOOL_POSITION];
//       const nextRouteInfos: RouteInfo[] = [];

//       if (busPosition) {
//         positions.push(busPosition);
//         updateMarker(busMarkerRef, map, busPosition, "🚌");
//       }

//       for (const user of users) {
//         if (user.latitude == null || user.longitude == null) continue;

//         const studentPosition: Position = [user.longitude, user.latitude];
//         positions.push(studentPosition);
//         addMarker(map, studentPosition, "🧑");

//         let busLegDistanceInMeters = 0;
//         let busLegTimeInSeconds = 0;

//         if (busPosition) {
//           try {
//             const busToStudentResponse = await fetch(getRouteUrl(busPosition, studentPosition, 0));
//             const busToStudentResult = (await busToStudentResponse.json()) as RouteResponse;
//             const busRoute = busToStudentResult.routes?.[0];

//             if (busRoute?.summary) {
//               busLegDistanceInMeters = busRoute.summary.lengthInMeters;
//               busLegTimeInSeconds = busRoute.summary.travelTimeInSeconds;
//             }

//             const busToStudentPoints = busRoute?.legs?.[0]?.points;
//             if (busToStudentPoints?.length) {
//               const busCoordinates: Position[] = busToStudentPoints.map((point) => [point.longitude, point.latitude]);
//               addRouteLine(map, busCoordinates, busRouteColor, 4);
//             }
//           } catch (error) {
//             console.error("Bus to Student Route Error:", error);
//           }
//         }

//         try {
//           const response = await fetch(getRouteUrl(SCHOOL_POSITION, studentPosition, 1));
//           const result = (await response.json()) as RouteResponse;
//           if (!result.routes?.length) continue;

//           result.routes.slice(0, 2).forEach((route, index) => {
//             const routeColor = routeColors[index % routeColors.length];
//             const totalDistanceInKm = (route.summary.lengthInMeters + busLegDistanceInMeters) / 1000;
//             const totalTimeInMinutes = Math.round((route.summary.travelTimeInSeconds + busLegTimeInSeconds) / 60);

//             nextRouteInfos.push({
//               student: user.firstName || user.username || "Unknown",
//               routeNo: index + 1,
//               distance: totalDistanceInKm.toFixed(2),
//               time: totalTimeInMinutes,
//               color: routeColor.line,
//               backgroundColor: routeColor.card,
//             });

//             const points = route.legs?.[0]?.points;
//             if (!points?.length) return;

//             const coordinates: Position[] = points.map((point) => [point.longitude, point.latitude]);
//             addRouteLine(map, coordinates, routeColor.line, index === 0 ? 7 : 5);
//           });
//         } catch (error) {
//           console.error("Route Error:", error);
//         }
//       }

//       setRouteInfos(nextRouteInfos);

//       if (positions.length > 1) {
//         map.setCamera({
//           bounds: atlas.data.BoundingBox.fromPositions(positions),
//           padding: 100,
//         });
//       }

//       if (navigator.geolocation) {
//         busWatchId = navigator.geolocation.watchPosition(
//           (position) => {
//             const liveBusPosition: Position = [position.coords.longitude, position.coords.latitude];
//             updateMarker(busMarkerRef, map, liveBusPosition, "🚌");
//           },
//           (error) => {
//             console.error("Bus Location Watch Error:", error);
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 10000,
//           }
//         );
//       }
//     });

//     return () => {
//       if (busWatchId !== null && navigator.geolocation) {
//         navigator.geolocation.clearWatch(busWatchId);
//       }

//       busMarkerRef.current = null;
//       map.dispose();
//     };
//   }, []);

//   return (
//     <div>
//       <div style={cardContainerStyle}>
//         {routeInfos.map((route, index) => (
//           <div
//             key={`${route.student}-${route.routeNo}-${index}`}
//             style={{
//               minWidth: "220px",
//               padding: "12px",
//               borderRadius: "10px",
//               border: "1px solid #ddd",
//               borderLeft: `8px solid ${route.color}`,
//               background: route.backgroundColor,
//             }}
//           >
//             <div style={{ color: route.color, fontWeight: 700, fontSize: "18px" }}>
//               {route.routeNo === 1 ? "Recommended Route" : "Alternative Route 1"}
//             </div>
//             <div>Student : {route.student}</div>
//             <div>Total Distance : {route.distance} KM</div>
//             <div>Total Time : {route.time} Min</div>
//           </div>
//         ))}
//       </div>

//       <div id="azure-map" style={mapStyle} />
//     </div>
//   );
// };

// export default LiveMap;

import React, { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

/// <reference types="azure-maps-control" />

interface RouteInfo {
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

interface UserLocation {
  id: string;
  firstName?: string;
  username?: string;
  latitude?: number;
  longitude?: number;
  role?: string;
}

interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface RouteSummary {
  lengthInMeters: number;
  travelTimeInSeconds: number;
}

interface RouteResponse {
  routes?: Array<{
    summary: RouteSummary;
    legs?: Array<{ points?: RoutePoint[] }>;
  }>;
}

type Position = [number, number];

// ========== EXACT COORDINATES (as provided) ==========
const SCHOOL_POSITION: Position = [70.844912, 22.821692]; // LE College, Morbi
const STUDENT_RADHESH_POSITION: Position = [70.834202, 22.798821];
const DRIVER_LAL_POSITION: Position = [70.815031, 22.800656];

// Traffic colors (only Moderate and Heavy)
const TRAFFIC_COLORS = {
  MODERATE: "#eab308", // Yellow
  HIGH: "#ef4444",     // Red
};

// Map controls (Zoom, Compass, Pitch) – StyleControl removed (custom buttons)
const controls = [
  new atlas.control.ZoomControl(),
  new atlas.control.CompassControl(),
  new atlas.control.PitchControl(),
];

// Traffic control – fixed type errors by casting
const trafficControl = new atlas.control.TrafficControl({
  style: "relative" as any,
  incident: true,
  flow: true as any,
});

// Load users from localStorage or create default with exact locations
const loadUsers = (): UserLocation[] => {
  try {
    const stored = localStorage.getItem("users");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error("Failed to load users");
  }

  // Default users with exact coordinates
  const defaultUsers: UserLocation[] = [
    {
      id: "1",
      firstName: "Radhesh",
      username: "radhesh",
      role: "Student",
      latitude: STUDENT_RADHESH_POSITION[1],
      longitude: STUDENT_RADHESH_POSITION[0],
    },
    {
      id: "2",
      firstName: "Lal",
      username: "lal",
      role: "Driver",
      latitude: DRIVER_LAL_POSITION[1],
      longitude: DRIVER_LAL_POSITION[0],
    },
    // Additional student for demo
    {
      id: "3",
      firstName: "Priya",
      username: "priya",
      role: "Student",
      latitude: 22.810,
      longitude: 70.825,
    },
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
  return defaultUsers;
};

const getCurrentUser = (): UserLocation | null => {
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error("Failed to load current user");
  }
  return null;
};

const getRouteUrl = (start: Position, end: Position, maxAlternatives: number = 1) => {
  const [startLng, startLat] = start;
  const [endLng, endLat] = end;
  return `https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=${startLat},${startLng}:${endLat},${endLng}&maxAlternatives=${maxAlternatives}&routeType=shortest&travelMode=car&subscription-key=${import.meta.env.VITE_AZURE_MAPS_KEY}`;
};

// Get traffic flow (only MODERATE or HIGH)
const getTrafficFlow = async (coordinates: Position[]): Promise<string> => {
  if (!coordinates.length) return "NONE";

  let routeLength = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    routeLength += R * c;
  }

  const currentHour = new Date().getHours();
  const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);

  if (routeLength > 5000) return isPeakHour ? "HIGH" : "MODERATE";
  if (routeLength > 2000) return isPeakHour ? "MODERATE" : "NONE";
  return "NONE";
};

const addMarker = (map: atlas.Map, position: Position, text: string, name?: string, color?: string) => {
  const htmlContent = `<div style="background: ${color || "#ffffff"}; border-radius: 50%; width: 50px; height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 2px solid #333; cursor: pointer;">
    <span style="font-size: 24px;">${text}</span>
    ${name ? `<span style="font-size: 10px; font-weight: bold; background: rgba(0,0,0,0.7); color: white; padding: 2px 5px; border-radius: 10px; margin-top: 2px;">${name}</span>` : ""}
  </div>`;
  map.markers.add(new atlas.HtmlMarker({ position, htmlContent }));
};

const updateDriverMarker = (
  markerRef: React.MutableRefObject<atlas.HtmlMarker | null>,
  map: atlas.Map,
  position: Position,
  name: string
) => {
  const htmlContent = `<div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 50%; width: 60px; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 3px solid #fbbf24; animation: pulse 1.5s infinite; cursor: pointer;">
    <span style="font-size: 32px;">🚌</span>
    <span style="font-size: 11px; font-weight: bold; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 12px; margin-top: 2px;">${name}</span>
  </div>
  <style>
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
      50% { transform: scale(1.15); box-shadow: 0 8px 25px rgba(0,0,0,0.4); }
      100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    }
  </style>`;

  if (!markerRef.current) {
    markerRef.current = new atlas.HtmlMarker({ position, htmlContent });
    map.markers.add(markerRef.current);
  } else {
    markerRef.current.setOptions({ position, htmlContent });
  }
};

// Add route with black base line + optional traffic dashed overlay
const addRouteWithTraffic = async (
  map: atlas.Map,
  coordinates: Position[],
  strokeWidth: number,
  showTraffic: boolean
): Promise<string> => {
  // Base black solid line
  const baseSourceId = `route-base-${Date.now()}-${Math.random()}`;
  const baseSource = new atlas.source.DataSource(baseSourceId);
  map.sources.add(baseSource);
  baseSource.add(new atlas.data.Feature(new atlas.data.LineString(coordinates)));
  map.layers.add(
    new atlas.layer.LineLayer(baseSource, undefined, {
      strokeColor: "#000000",
      strokeWidth: strokeWidth,
      strokeOpacity: 0.9,
    })
  );

  let trafficFlow = "NONE";
  if (showTraffic) {
    trafficFlow = await getTrafficFlow(coordinates);
    if (trafficFlow === "MODERATE" || trafficFlow === "HIGH") {
      const trafficColor = TRAFFIC_COLORS[trafficFlow as keyof typeof TRAFFIC_COLORS];
      const trafficSourceId = `route-traffic-${Date.now()}-${Math.random()}`;
      const trafficSource = new atlas.source.DataSource(trafficSourceId);
      map.sources.add(trafficSource);
      trafficSource.add(new atlas.data.Feature(new atlas.data.LineString(coordinates)));
      map.layers.add(
        new atlas.layer.LineLayer(trafficSource, undefined, {
          strokeColor: trafficColor,
          strokeWidth: strokeWidth - 1,
          strokeOpacity: 0.9,
          strokeDashArray: [10, 8],
        })
      );
    }
  }
  return trafficFlow;
};

const clearRoutes = (map: atlas.Map) => {
  try {
    const sources = map.sources.getSources();
    sources.forEach((source) => {
      if (source.getId()?.startsWith("route-")) {
        map.sources.remove(source);
      }
    });
    const layers = map.layers.getLayers();
    layers.forEach((layer) => {
      if (layer.getId()?.startsWith("route-")) {
        map.layers.remove(layer);
      }
    });
  } catch (error) {
    console.error("Error clearing routes:", error);
  }
};

const cardContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  padding: "10px",
  background: "#f9fafb",
};

const mapStyle: React.CSSProperties = { width: "100%", height: "70vh", position: "relative" };

// Floating map style buttons (right-center) – improved visibility
const floatingButtonContainerStyle: React.CSSProperties = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  zIndex: 1000,
  background: "rgba(255, 255, 255, 0.95)",
  padding: "10px 8px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(0,0,0,0.1)",
};

const styleButtonStyle = (isActive: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "8px 14px",
  background: isActive ? "#3b82f6" : "#ffffff",
  color: isActive ? "white" : "#333",
  border: "1px solid #ddd",
  borderRadius: "40px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "14px",
  transition: "all 0.2s ease",
  boxShadow: isActive ? "0 2px 6px rgba(59,130,246,0.3)" : "none",
});

const LiveMap: React.FC = () => {
  const currentUser = getCurrentUser();
  const [routeInfos, setRouteInfos] = useState<RouteInfo[]>([]);
  const [tripStatus, setTripStatus] = useState<"idle" | "pickup" | "toSchool" | "completed">("idle");
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [students, setStudents] = useState<UserLocation[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [busPosition, setBusPosition] = useState<Position>(DRIVER_LAL_POSITION);
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [mapStyleType, setMapStyleType] = useState<string>("road");

  const driverMarkerRef = useRef<atlas.HtmlMarker | null>(null);
  const mapRef = useRef<atlas.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Load students from localStorage
  useEffect(() => {
    const users = loadUsers();
    const studentList = users.filter((u) => u.role === "Student" && u.id !== currentUser?.id && u.latitude && u.longitude);
    setStudents(studentList);
  }, []);

  // Change map style (Road, Satellite, 3D) – using proper StyleOptions
  const changeMapStyle = (style: string) => {
    if (!mapRef.current) return;
    switch (style) {
      case "satellite":
        mapRef.current.setStyle({ style: "satellite" });
        mapRef.current.setCamera({ pitch: 0, bearing: 0 });
        break;
      case "3d":
        mapRef.current.setStyle({ style: "satellite" });
        mapRef.current.setCamera({ pitch: 60, bearing: 0, zoom: 15 });
        break;
      default:
        mapRef.current.setStyle({ style: "road" });
        mapRef.current.setCamera({ pitch: 0, bearing: 0 });
        break;
    }
    setMapStyleType(style);
  };

  const calculateAndDrawRoutes = async (map: atlas.Map, busPos: Position, student: UserLocation, showTraffic: boolean) => {
    clearRoutes(map);

    const studentPos: Position = [student.longitude!, student.latitude!];
    const routeInfosList: RouteInfo[] = [];
    let totalDist = 0;
    let totalTimeSec = 0;

    // Route 1: Bus to Student
    try {
      const response1 = await fetch(getRouteUrl(busPos, studentPos, 0));
      const result1 = (await response1.json()) as RouteResponse;
      const route1 = result1.routes?.[0];
      if (route1?.summary) {
        totalDist += route1.summary.lengthInMeters;
        totalTimeSec += route1.summary.travelTimeInSeconds;
      }
      const points1 = route1?.legs?.[0]?.points;
      let trafficFlow = "NONE";
      if (points1?.length) {
        const coordinates1: Position[] = points1.map((p) => [p.longitude, p.latitude]);
        trafficFlow = await addRouteWithTraffic(map, coordinates1, 6, showTraffic);
      }
      routeInfosList.push({
        student: student.firstName || student.username || "Unknown",
        studentId: student.id,
        routeNo: 1,
        distance: route1?.summary ? (route1.summary.lengthInMeters / 1000).toFixed(2) : "0",
        time: route1?.summary ? Math.round(route1.summary.travelTimeInSeconds / 60) : 0,
        color: "#000000",
        backgroundColor: "#F3F4F6",
        status: "pending",
        trafficStatus: trafficFlow,
      });
    } catch (error) {
      console.error("Bus to Student Route Error:", error);
    }

    // Route 2: Student to LE College
    try {
      const response2 = await fetch(getRouteUrl(studentPos, SCHOOL_POSITION, 0));
      const result2 = (await response2.json()) as RouteResponse;
      const route2 = result2.routes?.[0];
      if (route2?.summary) {
        totalDist += route2.summary.lengthInMeters;
        totalTimeSec += route2.summary.travelTimeInSeconds;
      }
      const points2 = route2?.legs?.[0]?.points;
      let trafficFlow = "NONE";
      if (points2?.length) {
        const coordinates2: Position[] = points2.map((p) => [p.longitude, p.latitude]);
        trafficFlow = await addRouteWithTraffic(map, coordinates2, 5, showTraffic);
      }
      routeInfosList.push({
        student: student.firstName || student.username || "Unknown",
        studentId: student.id,
        routeNo: 2,
        distance: route2?.summary ? (route2.summary.lengthInMeters / 1000).toFixed(2) : "0",
        time: route2?.summary ? Math.round(route2.summary.travelTimeInSeconds / 60) : 0,
        color: "#000000",
        backgroundColor: "#F3F4F6",
        status: "pending",
        trafficStatus: trafficFlow,
      });
    } catch (error) {
      console.error("Student to LE College Route Error:", error);
    }

    setTotalDistance(totalDist);
    setTotalTime(Math.round(totalTimeSec / 60));
    setRouteInfos(routeInfosList);

    const allPositions = [busPos, studentPos, SCHOOL_POSITION];
    map.setCamera({
      bounds: atlas.data.BoundingBox.fromPositions(allPositions),
      padding: 50,
    });
  };

  const startPickupTrip = async () => {
    if (students.length === 0) {
      alert("No students found for pickup");
      return;
    }
    setTripStatus("pickup");
    setCurrentStudentIndex(0);
    if (mapRef.current) {
      await calculateAndDrawRoutes(mapRef.current, busPosition, students[0], trafficEnabled);
    }
  };

  const resetTrip = () => {
    setTripStatus("idle");
    setCurrentStudentIndex(0);
    setRouteInfos([]);
    setTotalDistance(0);
    setTotalTime(0);
    if (mapRef.current) {
      clearRoutes(mapRef.current);
    }
    alert("Trip reset! Click 'Start Pickup Trip' to begin.");
  };

  const toggleTraffic = async () => {
    const newTrafficState = !trafficEnabled;
    setTrafficEnabled(newTrafficState);
    if (mapRef.current) {
      if (newTrafficState) {
        (mapRef.current as any).setTraffic({ incidents: true, flow: "relative" });
      } else {
        (mapRef.current as any).setTraffic({ incidents: false, flow: "none" });
      }
    }
    if (tripStatus === "pickup" && currentStudentIndex < students.length && mapRef.current) {
      await calculateAndDrawRoutes(mapRef.current, busPosition, students[currentStudentIndex], newTrafficState);
    } else if (tripStatus === "toSchool" && mapRef.current) {
      clearRoutes(mapRef.current);
      try {
        const response = await fetch(getRouteUrl(busPosition, SCHOOL_POSITION, 0));
        const result = await response.json();
        const points = result.routes?.[0]?.legs?.[0]?.points;
        if (points?.length) {
          const coordinates: Position[] = points.map((p: any) => [p.longitude, p.latitude]);
          await addRouteWithTraffic(mapRef.current, coordinates, 6, newTrafficState);
        }
        const summary = result.routes?.[0]?.summary;
        if (summary) {
          setTotalDistance(summary.lengthInMeters);
          setTotalTime(Math.round(summary.travelTimeInSeconds / 60));
        }
      } catch (error) {
        console.error("Route error:", error);
      }
    }
  };

  const checkAndMarkPicked = async (currentBusPos: Position) => {
    if (tripStatus === "pickup" && currentStudentIndex < students.length) {
      const student = students[currentStudentIndex];
      const studentPos: Position = [student.longitude!, student.latitude!];
      const distance = Math.sqrt(Math.pow(currentBusPos[0] - studentPos[0], 2) + Math.pow(currentBusPos[1] - studentPos[1], 2));
      if (distance < 0.0005) {
        const pickedStudent = students[currentStudentIndex];
        setRouteInfos((prev) => prev.map((route) => (route.studentId === pickedStudent.id ? { ...route, status: "picked" } : route)));
        const nextIndex = currentStudentIndex + 1;
        if (nextIndex >= students.length) {
          setTripStatus("toSchool");
          alert(`✅ Picked up ${pickedStudent.firstName}! Now going to LE College.`);
          if (mapRef.current) {
            clearRoutes(mapRef.current);
            try {
              const response = await fetch(getRouteUrl(currentBusPos, SCHOOL_POSITION, 0));
              const result = await response.json();
              const points = result.routes?.[0]?.legs?.[0]?.points;
              if (points?.length) {
                const coordinates: Position[] = points.map((p: any) => [p.longitude, p.latitude]);
                await addRouteWithTraffic(mapRef.current, coordinates, 6, trafficEnabled);
              }
              const summary = result.routes?.[0]?.summary;
              if (summary) {
                setTotalDistance(summary.lengthInMeters);
                setTotalTime(Math.round(summary.travelTimeInSeconds / 60));
              }
              setRouteInfos([]);
            } catch (error) {
              console.error("Route to LE College error:", error);
            }
          }
        } else {
          setCurrentStudentIndex(nextIndex);
          alert(`✅ Picked up ${pickedStudent.firstName}! Going to next student.`);
          if (mapRef.current) {
            await calculateAndDrawRoutes(mapRef.current, currentBusPos, students[nextIndex], trafficEnabled);
          }
        }
      }
    }
    if (tripStatus === "toSchool") {
      const schoolDistance = Math.sqrt(Math.pow(currentBusPos[0] - SCHOOL_POSITION[0], 2) + Math.pow(currentBusPos[1] - SCHOOL_POSITION[1], 2));
      if (schoolDistance < 0.0005) {
        setTripStatus("completed");
        alert("✅ Trip completed! All students delivered to LE College.");
        if (mapRef.current) {
          clearRoutes(mapRef.current);
        }
      }
    }
  };

  // Initialize Map
  useEffect(() => {
    const apiKey = import.meta.env.VITE_AZURE_MAPS_KEY;
    if (!apiKey) {
      console.error("Azure Maps key is missing!");
      return;
    }

    const map = new atlas.Map("azure-map", {
      center: SCHOOL_POSITION,
      zoom: 14,
      zoomControl: true,
      pitchEnabled: true,
      dragPan: true,
      keyboard: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchInteraction: true,
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: apiKey,
      },
    });

    map.controls.add(controls, { position: atlas.ControlPosition.TopRight });
    map.controls.add(trafficControl, { position: atlas.ControlPosition.TopLeft });
    mapRef.current = map;

    map.events.add("ready", async () => {
      map.setStyle({ style: "road" });
      (map as any).setTraffic({ incidents: false, flow: "none" });

      // Add LE College Marker
      addMarker(map, SCHOOL_POSITION, "🏫🎓", "LE College, Morbi", "#EF4444");

      // Add student markers
      const users = loadUsers();
      users.forEach((user) => {
        if (user.latitude && user.longitude && user.id !== currentUser?.id) {
          if (user.role === "Student") {
            addMarker(map, [user.longitude, user.latitude], "🧑‍🎓", user.firstName || user.username, "#3B82F6");
          } else if (user.role === "Teacher") {
            addMarker(map, [user.longitude, user.latitude], "👩‍🏫", user.firstName, "#8B5CF6");
          } else if (user.role === "Parent") {
            addMarker(map, [user.longitude, user.latitude], "👨‍👩‍👧", user.firstName, "#10B981");
          }
        }
      });

      // Add driver marker at initial position
      updateDriverMarker(driverMarkerRef, map, DRIVER_LAL_POSITION, currentUser?.firstName || "Lal");

      // Fit bounds to show all markers
      const positions: Position[] = [SCHOOL_POSITION];
      users.forEach((user) => {
        if (user.latitude && user.longitude) {
          positions.push([user.longitude, user.latitude]);
        }
      });
      if (positions.length > 1) {
        map.setCamera({
          bounds: atlas.data.BoundingBox.fromPositions(positions),
          padding: 50,
        });
      }
    });

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      driverMarkerRef.current = null;
      map.dispose();
    };
  }, []);

  // Start live tracking for driver with smooth updates
  useEffect(() => {
    if (currentUser?.role !== "Driver") return;
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const newPos: Position = [position.coords.longitude, position.coords.latitude];
        setBusPosition(newPos);
        if (mapRef.current) {
          updateDriverMarker(driverMarkerRef, mapRef.current, newPos, currentUser?.firstName || "Lal");
          await checkAndMarkPicked(newPos);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 2000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [currentUser, tripStatus, currentStudentIndex, students]);

  if (!currentUser) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Please login to continue</div>;
  }

  const getTrafficText = (status: string) => {
    if (!trafficEnabled) return "🚦 Traffic OFF";
    switch (status) {
      case "HIGH":
        return "🔴 Heavy Traffic";
      case "MODERATE":
        return "🟡 Moderate Traffic";
      default:
        return "⚫ No Traffic";
    }
  };

  const getTrafficColor = (status: string) => {
    if (!trafficEnabled) return "#6b7280";
    switch (status) {
      case "HIGH":
        return "#ef4444";
      case "MODERATE":
        return "#eab308";
      default:
        return "#000000";
    }
  };

  return (
    <div>
      {/* Control Panel for Driver (without map style buttons) */}
      {currentUser?.role === "Driver" && (
        <div style={{ background: "#f3f4f6", padding: "15px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>📍 Trip Status:</span>
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                background:
                  tripStatus === "idle"
                    ? "#e5e7eb"
                    : tripStatus === "pickup"
                    ? "#F3F4F6"
                    : tripStatus === "toSchool"
                    ? "#F3F4F6"
                    : "#D1FAE5",
                color: tripStatus === "idle" ? "#374151" : tripStatus === "pickup" ? "#1F2937" : tripStatus === "toSchool" ? "#1F2937" : "#065F46",
                fontWeight: "bold",
                border: tripStatus !== "idle" && tripStatus !== "completed" ? "1px solid #000000" : "none",
              }}
            >
              {tripStatus === "idle" && "⚪ Not Started"}
              {tripStatus === "pickup" && `⚫ Picking Up (${currentStudentIndex + 1}/${students.length})`}
              {tripStatus === "toSchool" && "⚫ Going to LE College"}
              {tripStatus === "completed" && "✅ Completed"}
            </span>
            {totalDistance > 0 && (
              <>
                <span>📏 Total: {(totalDistance / 1000).toFixed(2)} km</span>
                <span>⏱️ Time: {totalTime} min</span>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={startPickupTrip}
              disabled={tripStatus !== "idle"}
              style={{
                padding: "10px 20px",
                background: tripStatus !== "idle" ? "#9ca3af" : "#000000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: tripStatus !== "idle" ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              🚀 Start Pickup Trip
            </button>
            <button
              onClick={resetTrip}
              style={{
                padding: "10px 20px",
                background: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔄 Reset Trip
            </button>
            <button
              onClick={toggleTraffic}
              style={{
                padding: "10px 20px",
                background: trafficEnabled ? "#ef4444" : "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {trafficEnabled ? "🚦 Traffic: ON" : "🚦 Traffic: OFF"}
            </button>
          </div>
        </div>
      )}

      {/* Non-driver info */}
      {currentUser?.role !== "Driver" && (
        <div style={{ background: "#f3f4f6", padding: "10px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <span>
            👋 Hello, {currentUser.firstName} ({currentUser.role})
          </span>
        </div>
      )}

      {/* Route Info Cards */}
      <div style={cardContainerStyle}>
        {routeInfos.map((route, index) => (
          <div
            key={`${route.student}-${route.routeNo}-${index}`}
            style={{
              minWidth: "250px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              borderLeft: `8px solid ${route.color}`,
              background: route.backgroundColor,
              opacity: route.status === "picked" ? 0.6 : 1,
            }}
          >
            <div style={{ color: route.color, fontWeight: 700, fontSize: "16px" }}>
              {route.routeNo === 1 ? "🚌 Driver → Student" : "🏫 Student → LE College"}
            </div>
            <div style={{ fontWeight: "bold", marginTop: "5px" }}>Student: {route.student}</div>
            <div>
              Distance: {route.distance} KM | Time: {route.time} Min
            </div>
            <div
              style={{
                fontSize: "12px",
                marginTop: "5px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: getTrafficColor(route.trafficStatus),
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: getTrafficColor(route.trafficStatus),
                }}
              ></span>
              {getTrafficText(route.trafficStatus)}
            </div>
            {route.status === "picked" && (
              <div style={{ color: "#10b981", fontWeight: "bold", marginTop: "5px" }}>✅ Completed</div>
            )}
          </div>
        ))}
      </div>

      {/* Map Container with Floating Map Style Buttons */}
      <div style={{ position: "relative" }}>
        <div id="azure-map" style={mapStyle} />
        {/* Floating panel for map styles (right-center) */}
        <div style={floatingButtonContainerStyle}>
          <button
            onClick={() => changeMapStyle("road")}
            style={styleButtonStyle(mapStyleType === "road")}
            title="Road Map"
          >
            🗺️ Road
          </button>
          <button
            onClick={() => changeMapStyle("satellite")}
            style={styleButtonStyle(mapStyleType === "satellite")}
            title="Satellite"
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => changeMapStyle("3d")}
            style={styleButtonStyle(mapStyleType === "3d")}
            title="3D View"
          >
            🏔️ 3D
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "10px 20px",
          background: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "20px", height: "20px", background: "#EF4444", borderRadius: "50%" }}></div>
          <span>🏫🎓 LE College</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "20px", height: "20px", background: "#3B82F6", borderRadius: "50%" }}></div>
          <span>🧑‍🎓 Student</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
              borderRadius: "50%",
            }}
          ></div>
          <span>🚌 Bus (Live)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "40px", height: "6px", background: "#000000", borderRadius: "3px" }}></div>
          <span>⚫ Route (Black Line)</span>
        </div>
        {trafficEnabled && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "40px",
                  height: "6px",
                  background: "#eab308",
                  borderRadius: "3px",
                  backgroundImage: "repeating-linear-gradient(90deg, #eab308, #eab308 8px, transparent 8px, transparent 16px)",
                }}
              ></div>
              <span>🟡 Moderate Traffic</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "40px",
                  height: "6px",
                  background: "#ef4444",
                  borderRadius: "3px",
                  backgroundImage: "repeating-linear-gradient(90deg, #ef4444, #ef4444 8px, transparent 8px, transparent 16px)",
                }}
              ></div>
              <span>🔴 Heavy Traffic</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveMap;