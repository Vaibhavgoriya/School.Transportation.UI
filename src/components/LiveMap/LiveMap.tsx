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

import { RouteInfo, UserLocation, RouteResponse, Position } from "./ILiveMapProps";
import styles from "./LiveMap.module.scss";
import ServiceConstants from "../../Services/ServiceConstants";

/// <reference types="azure-maps-control" />

// ========== EXACT COORDINATES ==========
const SCHOOL_POSITION: Position = [70.844912, 22.821692];
const STUDENT_RADHESH_POSITION: Position = [70.834202, 22.798821];
const DRIVER_LAL_POSITION: Position = [70.815031, 22.800656];

// Traffic colors
const TRAFFIC_COLORS = {
  MODERATE: "#eab308",
  HIGH: "#ef4444",
};

const controls = [
  new atlas.control.ZoomControl(),
  new atlas.control.CompassControl(),
  new atlas.control.PitchControl(),
];

const trafficControl = new atlas.control.TrafficControl({
  style: "relative" as any,
  incident: true,
  flow: true as any,
});

const serviceConstants = new ServiceConstants();

const normalizeRole = (role?: string) => role?.trim().toLowerCase() || "";

const normalizeKey = (value?: string) => value?.trim().toLowerCase() || "";

const canonicalUserGroups: Record<string, string[]> = {
  lal: ["lal", "lal bhai", "lalbhai"],
  bhuro: ["bhuro", "bhuru"],
  radhesh: ["radhesh", "rj"],
  jenil: ["jenil"],
  nishant: ["nishant", "nt"],
  vg: ["vg"],
  admin: ["admin"],
};

const getUserAliases = (user?: Partial<UserLocation> | null) =>
  [user?.username, user?.firstName, user?.displayName, user?.email]
    .map(normalizeKey)
    .filter(Boolean);

const getUserKey = (user?: Partial<UserLocation> | null) => {
  const aliases = getUserAliases(user);
  for (const [canonicalKey, canonicalAliases] of Object.entries(canonicalUserGroups)) {
    if (aliases.some((alias) => canonicalAliases.includes(alias) || alias === canonicalKey)) {
      return canonicalKey;
    }
  }

  return aliases[0] || "";
};

const driverAssignments: Record<string, string[]> = {
  lal: ["radhesh", "jenil"],
  bhuro: ["nishant"],
};

const getAssignedStudentKeysForDriver = (driverKey: string) => driverAssignments[driverKey] || [];

const getAssignedDriverKeyForStudent = (studentKey: string) => {
  if (studentKey === "radhesh") return "lal";
  if (studentKey === "jenil") return "lal";
  if (studentKey === "nishant") return "bhuro";
  return "";
};

const getUserPosition = (user?: UserLocation | null): Position | null => {
  if (user?.longitude == null || user?.latitude == null) {
    return null;
  }

  return [user.longitude, user.latitude];
};

const findMatchingUser = (users: UserLocation[], currentUser?: UserLocation | null) => {
  if (!currentUser) {
    return null;
  }

  return (
    users.find((user) => user.id === currentUser.id) ||
    users.find((user) => user.email?.trim().toLowerCase() === currentUser.email?.trim().toLowerCase()) ||
    users.find((user) => getUserKey(user) === getUserKey(currentUser)) ||
    null
  );
};

const isVisibleUserForViewer = (viewer: UserLocation | null, user: UserLocation) => {
  if (!viewer) {
    return false;
  }

  const viewerRole = normalizeRole(viewer.role);
  const userRole = normalizeRole(user.role);
  const viewerKey = getUserKey(viewer);
  const userKey = getUserKey(user);

  if (viewerRole === "admin") {
    return true;
  }

  if (viewerRole === "student") {
    if (userKey === viewerKey) {
      return true;
    }

    if (userRole === "driver") {
      return getAssignedDriverKeyForStudent(viewerKey) === userKey;
    }

    return false;
  }

  if (viewerRole === "driver") {
    if (userRole === "student") {
      return getAssignedStudentKeysForDriver(viewerKey).includes(userKey);
    }

    return false;
  }

  return false;
};

const getAdminOverviewDrivers = (users: UserLocation[]) =>
  users.filter((user) => normalizeRole(user.role) === "driver");

const getAdminOverviewStudents = (users: UserLocation[]) =>
  users.filter((user) => normalizeRole(user.role) === "student");

const driverRouteColors: Record<string, string> = {
  lal: "#fbbf24",
  bhuro: "#2563eb",
};

const getDriverRouteColor = (driverKey: string) => driverRouteColors[driverKey] || "#7c3aed";

const liveBusPositionStorageKey = (driverKey: string) =>
  `School-Transportation-LiveBusPosition:${driverKey}`;

const getLiveBusPosition = (driverKey: string): Position | null => {
  try {
    const stored = localStorage.getItem(liveBusPositionStorageKey(driverKey));
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length < 2) return null;

    const [lng, lat] = parsed;
    if (typeof lng !== "number" || typeof lat !== "number") return null;

    return [lng, lat];
  } catch {
    return null;
  }
};

const setLiveBusPosition = (driverKey: string, position: Position) => {
  localStorage.setItem(liveBusPositionStorageKey(driverKey), JSON.stringify(position));
};

const getAssignedStudentsForDriver = (users: UserLocation[], driverKey: string) =>
  users.filter(
    (user) =>
      normalizeRole(user.role) === "student" &&
      getAssignedStudentKeysForDriver(driverKey).includes(getUserKey(user)) &&
      user.latitude != null &&
      user.longitude != null
  );

const getStudentRouteViewDriver = (users: UserLocation[], studentKey: string) => {
  const driverKey = getAssignedDriverKeyForStudent(studentKey);
  if (!driverKey) return null;

  return (
    users.find((user) => normalizeRole(user.role) === "driver" && getUserKey(user) === driverKey) ||
    null
  );
};

const drawStudentRouteView = async (
  map: atlas.Map,
  users: UserLocation[],
  viewer: UserLocation | null,
  showTraffic: boolean
) : Promise<StudentRouteSummary | null> => {
  if (!viewer) {
    return null;
  }

  clearRoutes(map);

  const viewerKey = getUserKey(viewer);
  const studentUser = findMatchingUser(users, viewer) || viewer;
  const studentPosition = getUserPosition(studentUser);
  const assignedDriver = getStudentRouteViewDriver(users, viewerKey);
  const driverKey = getUserKey(assignedDriver);
  const driverPosition = getLiveBusPosition(driverKey) || getUserPosition(assignedDriver) || DRIVER_LAL_POSITION;
  const routeColor = getDriverRouteColor(driverKey);

  if (!studentPosition) {
    return null;
  }

  const positions: Position[] = [SCHOOL_POSITION, studentPosition, driverPosition];
  let totalDistance = 0;
  let totalTime = 0;

  try {
    const driverToStudent = await fetch(getRouteUrl(driverPosition, studentPosition, 0));
    const driverToStudentResult = (await driverToStudent.json()) as RouteResponse;
    const driverToStudentRoute = driverToStudentResult.routes?.[0];
    const driverToStudentPoints = driverToStudentRoute?.legs?.[0]?.points;

    if (driverToStudentPoints?.length) {
      const coordinates: Position[] = driverToStudentPoints.map((point) => [point.longitude, point.latitude]);
      await addRouteWithTraffic(map, coordinates, 6, showTraffic, routeColor, false);
      if (driverToStudentRoute?.summary) {
        totalDistance += driverToStudentRoute.summary.lengthInMeters;
        totalTime += driverToStudentRoute.summary.travelTimeInSeconds;
      }
    }

    const driverToSchool = await fetch(getRouteUrl(studentPosition, SCHOOL_POSITION, 0));
    const driverToSchoolResult = (await driverToSchool.json()) as RouteResponse;
    const driverToSchoolRoute = driverToSchoolResult.routes?.[0];
    const driverToSchoolPoints = driverToSchoolRoute?.legs?.[0]?.points;

    if (driverToSchoolPoints?.length) {
      const coordinates: Position[] = driverToSchoolPoints.map((point) => [point.longitude, point.latitude]);
      await addRouteWithTraffic(map, coordinates, 5, showTraffic, "#111827", false);
      if (driverToSchoolRoute?.summary) {
        totalDistance += driverToSchoolRoute.summary.lengthInMeters;
        totalTime += driverToSchoolRoute.summary.travelTimeInSeconds;
      }
    }
  } catch (error) {
    console.error("Student route error:", error);
  }

  map.setCamera({
    bounds: atlas.data.BoundingBox.fromPositions(positions),
    padding: 60,
  });

  return {
    driverKey,
    driverName: assignedDriver?.firstName || assignedDriver?.username || driverKey,
    distanceKm: (totalDistance / 1000).toFixed(2),
    timeMin: Math.round(totalTime / 60),
    routeColor,
  };
};

const ensureLiveDriverMarkers = (users: UserLocation[]) => {
  users
    .filter((user) => normalizeRole(user.role) === "driver")
    .forEach((driver) => {
      const driverKey = getUserKey(driver);
      const driverPosition = getLiveBusPosition(driverKey) || getUserPosition(driver);
      if (driverPosition) {
        setLiveBusPosition(driverKey, driverPosition);
      }
    });
};

type AdminRouteSummary = {
  driverKey: string;
  driverName: string;
  assignedCount: number;
  pickedCount: number;
  remainingCount: number;
  distanceKm: string;
  timeMin: number;
  routeColor: string;
};

type StudentRouteSummary = {
  driverKey: string;
  driverName: string;
  distanceKm: string;
  timeMin: number;
  routeColor: string;
};

const drawAdminRoutes = async (
  map: atlas.Map,
  users: UserLocation[],
  showTraffic: boolean
): Promise<AdminRouteSummary[]> => {
  clearRoutes(map);

  const summaries: AdminRouteSummary[] = [];
  const positions: Position[] = [SCHOOL_POSITION];
  const drivers = getAdminOverviewDrivers(users);

  for (const driver of drivers) {
    const driverKey = getUserKey(driver);
    const driverPosition = getLiveBusPosition(driverKey) || getUserPosition(driver);
    const routeColor = getDriverRouteColor(driverKey);

    if (!driverPosition) {
      summaries.push({
        driverKey,
        driverName: driver.firstName || driver.username || driverKey,
        assignedCount: 0,
        pickedCount: 0,
        remainingCount: 0,
        distanceKm: "N/A",
        timeMin: 0,
        routeColor,
      });
      continue;
    }

    const assignedStudents = getAssignedStudentsForDriver(users, driverKey);
    const orderedStudents: UserLocation[] = [];
    let currentPos = driverPosition;
    const remaining = [...assignedStudents];

    while (remaining.length > 0) {
      const nearest = getNearestStudent(currentPos, remaining);
      if (!nearest) break;
      orderedStudents.push(nearest);
      const index = remaining.findIndex((student) => student.id === nearest.id);
      if (index !== -1) remaining.splice(index, 1);
      currentPos = [nearest.longitude!, nearest.latitude!];
    }

    const routePoints: Position[] = [driverPosition];
    let totalDistance = 0;
    let totalTime = 0;

    const addLeg = async (start: Position, end: Position, width: number) => {
      const response = await fetch(getRouteUrl(start, end, 0));
      const result = (await response.json()) as RouteResponse;
      const route = result.routes?.[0];
      const points = route?.legs?.[0]?.points;
      const summary = route?.summary;

      if (!summary || !points?.length) {
        return;
      }

      const coordinates: Position[] = points.map((point) => [point.longitude, point.latitude]);
      await addRouteWithTraffic(map, coordinates, width, showTraffic, routeColor, false);
      totalDistance += summary.lengthInMeters;
      totalTime += summary.travelTimeInSeconds;
    };

    try {
      if (orderedStudents.length > 0) {
        const firstStudent = orderedStudents[0];
        const firstPos: Position = [firstStudent.longitude!, firstStudent.latitude!];
        await addLeg(driverPosition, firstPos, 6);
        routePoints.push(firstPos);

        for (let i = 0; i < orderedStudents.length - 1; i++) {
          const from = orderedStudents[i];
          const to = orderedStudents[i + 1];
          const fromPos: Position = [from.longitude!, from.latitude!];
          const toPos: Position = [to.longitude!, to.latitude!];
          await addLeg(fromPos, toPos, 5);
          routePoints.push(toPos);
        }

        const lastStudent = orderedStudents[orderedStudents.length - 1];
        const lastPos: Position = [lastStudent.longitude!, lastStudent.latitude!];
        await addLeg(lastPos, SCHOOL_POSITION, 5);
        routePoints.push(SCHOOL_POSITION);
      }
    } catch (error) {
      console.error(`Admin route error for ${driverKey}`, error);
    }

    summaries.push({
      driverKey,
      driverName: driver.firstName || driver.username || driverKey,
      assignedCount: assignedStudents.length,
      pickedCount: orderedStudents.length,
      remainingCount: Math.max(assignedStudents.length - orderedStudents.length, 0),
      distanceKm: (totalDistance / 1000).toFixed(2),
      timeMin: Math.round(totalTime / 60),
      routeColor,
    });

    positions.push(...routePoints);
  }

  if (positions.length > 1) {
    map.setCamera({
      bounds: atlas.data.BoundingBox.fromPositions(positions),
      padding: 60,
    });
  }

  return summaries;
};

// ----- Helper functions (unchanged) -----
const loadUsers = (): UserLocation[] => {
  try {
    const stored = localStorage.getItem("users");
    if (stored) return JSON.parse(stored);
  } catch {
    console.error("Failed to load users");
  }
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
    const stored =
      localStorage.getItem(serviceConstants.LocalStorageCacheName) ||
      localStorage.getItem("currentUser");
    if (stored) return JSON.parse(stored);
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
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    routeLength += R * c;
  }
  const currentHour = new Date().getHours();
  const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
  if (routeLength > 5000) return isPeakHour ? "HIGH" : "MODERATE";
  if (routeLength > 2000) return isPeakHour ? "MODERATE" : "NONE";
  return "NONE";
};

const addMarker = (
  map: atlas.Map,
  position: Position,
  text: string,
  name?: string,
  color?: string
) => {
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

const addRouteWithTraffic = async (
  map: atlas.Map,
  coordinates: Position[],
  strokeWidth: number,
  showTraffic: boolean,
  color: string = "#000000",
  dashed: boolean = false
): Promise<string> => {
  const sourceId = `route-${Date.now()}-${Math.random()}`;
  const source = new atlas.source.DataSource(sourceId);
  map.sources.add(source);
  source.add(new atlas.data.Feature(new atlas.data.LineString(coordinates)));
  map.layers.add(
    new atlas.layer.LineLayer(source, undefined, {
      strokeColor: color,
      strokeWidth: strokeWidth,
      strokeOpacity: 0.9,
      strokeDashArray: dashed ? [10, 8] : undefined,
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

// ----- Helpers for traffic display -----
const getTrafficText = (status: string, trafficEnabled: boolean) => {
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

const getTrafficColor = (status: string, trafficEnabled: boolean) => {
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

// ----- Nearest student helper -----
const getNearestStudent = (busPos: Position, students: UserLocation[]): UserLocation | null => {
  if (students.length === 0) return null;
  let nearest = students[0];
  let minDist = Infinity;
  for (const s of students) {
    if (s.latitude == null || s.longitude == null) continue;
    const dx = busPos[0] - s.longitude;
    const dy = busPos[1] - s.latitude;
    const dist = dx * dx + dy * dy;
    if (dist < minDist) {
      minDist = dist;
      nearest = s;
    }
  }
  return nearest;
};

// ----- Main Component -----
const LiveMap: React.FC = () => {
  const currentUser = getCurrentUser();
  const [students, setStudents] = useState<UserLocation[]>([]);
  const [orderedStudents, setOrderedStudents] = useState<UserLocation[]>([]); // pickup order
  const [currentLegIndex, setCurrentLegIndex] = useState(0); // index into orderedStudents
  const [legsInfo, setLegsInfo] = useState<RouteInfo[]>([]); // info for each leg (bus->student1, student1->student2, ..., last->school)

  const [tripStatus, setTripStatus] = useState<"idle" | "pickup" | "toSchool" | "completed">("idle");
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [busPosition, setBusPosition] = useState<Position>(() => getUserPosition(currentUser) ?? DRIVER_LAL_POSITION);
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [mapStyleType, setMapStyleType] = useState<string>("road");
  const [adminRouteSummaries, setAdminRouteSummaries] = useState<AdminRouteSummary[]>([]);
  const [studentRouteSummary, setStudentRouteSummary] = useState<StudentRouteSummary | null>(null);

  const driverMarkerRef = useRef<atlas.HtmlMarker | null>(null);
  const mapRef = useRef<atlas.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Refs for latest values in callbacks
  const orderedStudentsRef = useRef<UserLocation[]>([]);
  const currentLegIndexRef = useRef(0);
  const legsInfoRef = useRef<RouteInfo[]>([]);
  const tripStatusRef = useRef<"idle" | "pickup" | "toSchool" | "completed">("idle");

  useEffect(() => {
    orderedStudentsRef.current = orderedStudents;
  }, [orderedStudents]);
  useEffect(() => {
    currentLegIndexRef.current = currentLegIndex;
  }, [currentLegIndex]);
  useEffect(() => {
    legsInfoRef.current = legsInfo;
  }, [legsInfo]);
  useEffect(() => {
    tripStatusRef.current = tripStatus;
  }, [tripStatus]);

  // Load students from localStorage
  useEffect(() => {
    const users = loadUsers();
    const studentList = users.filter(
      (u) =>
        normalizeRole(u.role) === "student" &&
        u.latitude != null &&
        u.longitude != null &&
        isVisibleUserForViewer(currentUser, u)
    );
    setStudents(studentList);
  }, [currentUser]);

  useEffect(() => {
    if (normalizeRole(currentUser?.role) !== "admin") {
      setAdminRouteSummaries([]);
    }

    if (normalizeRole(currentUser?.role) !== "student") {
      setStudentRouteSummary(null);
    }
  }, [currentUser]);

  // Change map style
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

  // Draw all legs on the map (full route)
  const drawFullRoute = async (
    map: atlas.Map,
    busPos: Position,
    ordered: UserLocation[],
    showTraffic: boolean
  ) => {
    clearRoutes(map);
    if (ordered.length === 0) return;

    const legs: RouteInfo[] = [];
    let totalDist = 0;
    let totalTimeSec = 0;

    // Legs: bus -> student1, student1 -> student2, ..., last -> school
    const allPoints: Position[] = [busPos];
    const legCoordinates: Position[][] = [];

    // 1. Bus to first student
    const firstStudentPos: Position = [ordered[0].longitude!, ordered[0].latitude!];
    try {
      const resp = await fetch(getRouteUrl(busPos, firstStudentPos, 0));
      const result = (await resp.json()) as RouteResponse;
      const route = result.routes?.[0];
      const points = route?.legs?.[0]?.points;
      if (points?.length) {
        const coords: Position[] = points.map((p) => [p.longitude, p.latitude]);
        legCoordinates.push(coords);
        allPoints.push(firstStudentPos);
        const traffic = await addRouteWithTraffic(map, coords, 6, showTraffic, "#000000", false);
        const dist = route?.summary?.lengthInMeters || 0;
        const time = route?.summary?.travelTimeInSeconds || 0;
        totalDist += dist;
        totalTimeSec += time;
        legs.push({
          student: ordered[0].firstName || ordered[0].username || "Unknown",
          studentId: ordered[0].id,
          routeNo: 1,
          distance: (dist / 1000).toFixed(2),
          time: Math.round(time / 60),
          color: "#000000",
          backgroundColor: "#F3F4F6",
          status: "pending",
          trafficStatus: traffic,
        });
      }
    } catch (e) { console.error("Route error bus->first student", e); }

    // 2. Student to student (subsequent)
    for (let i = 0; i < ordered.length - 1; i++) {
      const from = ordered[i];
      const to = ordered[i + 1];
      const fromPos: Position = [from.longitude!, from.latitude!];
      const toPos: Position = [to.longitude!, to.latitude!];
      try {
        const resp = await fetch(getRouteUrl(fromPos, toPos, 0));
        const result = (await resp.json()) as RouteResponse;
        const route = result.routes?.[0];
        const points = route?.legs?.[0]?.points;
        if (points?.length) {
          const coords: Position[] = points.map((p) => [p.longitude, p.latitude]);
          legCoordinates.push(coords);
          allPoints.push(toPos);
          const traffic = await addRouteWithTraffic(map, coords, 5, showTraffic, "#000000", false);
          const dist = route?.summary?.lengthInMeters || 0;
          const time = route?.summary?.travelTimeInSeconds || 0;
          totalDist += dist;
          totalTimeSec += time;
          legs.push({
            student: to.firstName || to.username || "Unknown",
            studentId: to.id,
            routeNo: i + 2,
            distance: (dist / 1000).toFixed(2),
            time: Math.round(time / 60),
            color: "#000000",
            backgroundColor: "#F3F4F6",
            status: "pending",
            trafficStatus: traffic,
          });
        }
      } catch (e) { console.error("Route error student->student", e); }
    }

    // 3. Last student to school
    const lastStudent = ordered[ordered.length - 1];
    const lastPos: Position = [lastStudent.longitude!, lastStudent.latitude!];
    try {
      const resp = await fetch(getRouteUrl(lastPos, SCHOOL_POSITION, 0));
      const result = (await resp.json()) as RouteResponse;
      const route = result.routes?.[0];
      const points = route?.legs?.[0]?.points;
      if (points?.length) {
        const coords: Position[] = points.map((p) => [p.longitude, p.latitude]);
        legCoordinates.push(coords);
        allPoints.push(SCHOOL_POSITION);
        const traffic = await addRouteWithTraffic(map, coords, 5, showTraffic, "#000000", false);
        const dist = route?.summary?.lengthInMeters || 0;
        const time = route?.summary?.travelTimeInSeconds || 0;
        totalDist += dist;
        totalTimeSec += time;
        legs.push({
          student: "School",
          studentId: "school",
          routeNo: ordered.length + 1,
          distance: (dist / 1000).toFixed(2),
          time: Math.round(time / 60),
          color: "#000000",
          backgroundColor: "#F3F4F6",
          status: "pending",
          trafficStatus: traffic,
        });
      }
    } catch (e) { console.error("Route error last->school", e); }

    setLegsInfo(legs);
    setTotalDistance(totalDist);
    setTotalTime(Math.round(totalTimeSec / 60));

    // Fit map to all points
    if (allPoints.length > 1) {
      map.setCamera({
        bounds: atlas.data.BoundingBox.fromPositions(allPoints),
        padding: 50,
      });
    }
  };

  // Start pickup trip: order students by nearest first, then draw full route
  const startPickupTrip = async () => {
    if (students.length === 0) {
      alert("No students found for pickup");
      return;
    }

    // Build order: repeatedly pick nearest from current position
    const ordered: UserLocation[] = [];
    let currentPos = busPosition;
    const remaining = [...students];
    while (remaining.length > 0) {
      const nearest = getNearestStudent(currentPos, remaining);
      if (!nearest) break;
      ordered.push(nearest);
      const idx = remaining.findIndex((s) => s.id === nearest.id);
      if (idx !== -1) remaining.splice(idx, 1);
      currentPos = [nearest.longitude!, nearest.latitude!];
    }

    if (ordered.length === 0) {
      alert("No valid students found");
      return;
    }

    setOrderedStudents(ordered);
    setCurrentLegIndex(0);
    setTripStatus("pickup");
    tripStatusRef.current = "pickup";
    if (mapRef.current) {
      await drawFullRoute(mapRef.current, busPosition, ordered, trafficEnabled);
    }
  };

  // Reset trip
  const resetTrip = () => {
    setTripStatus("idle");
    tripStatusRef.current = "idle";
    setOrderedStudents([]);
    setCurrentLegIndex(0);
    setLegsInfo([]);
    setTotalDistance(0);
    setTotalTime(0);
    if (mapRef.current) {
      clearRoutes(mapRef.current);
    }
    alert("Trip reset! Click 'Start Pickup Trip' to begin.");
  };

  // Toggle traffic
  const toggleTraffic = async () => {
    const newState = !trafficEnabled;
    setTrafficEnabled(newState);
    if (mapRef.current) {
      if (newState) {
        (mapRef.current as any).setTraffic({ incidents: true, flow: "relative" });
      } else {
        (mapRef.current as any).setTraffic({ incidents: false, flow: "none" });
      }
    }
    // Redraw with new traffic setting
    if (normalizeRole(currentUser?.role) === "admin" && mapRef.current) {
      const users = loadUsers();
      const adminSummaries = await drawAdminRoutes(mapRef.current, users, newState);
      setAdminRouteSummaries(adminSummaries);
      return;
    }

    if (tripStatusRef.current !== "idle" && orderedStudentsRef.current.length > 0 && mapRef.current) {
      await drawFullRoute(mapRef.current, busPosition, orderedStudentsRef.current, newState);
    }
  };

  // Check if bus reached the current leg's destination (student or school)
  const checkAndAdvance = async (currentBusPos: Position) => {
    const status = tripStatusRef.current;
    const ordered = orderedStudentsRef.current;
    const legIndex = currentLegIndexRef.current;
    const legs = legsInfoRef.current;

    if (status !== "pickup" && status !== "toSchool") return;
    if (ordered.length === 0) return;

    // Determine target for current leg
    let targetPos: Position | null = null;
    if (legIndex < ordered.length) {
      // current leg is bus->student or student->student
      const targetStudent = ordered[legIndex];
      targetPos = [targetStudent.longitude!, targetStudent.latitude!];
    } else if (legIndex === ordered.length) {
      // last leg is last student -> school
      targetPos = SCHOOL_POSITION;
    } else {
      return; // all done
    }

    if (!targetPos) return;

    const dist = Math.sqrt(
      Math.pow(currentBusPos[0] - targetPos[0], 2) +
      Math.pow(currentBusPos[1] - targetPos[1], 2)
    );
    if (dist < 0.0005) {
      // Mark this leg as completed
      const updatedLegs = legs.map((leg, idx) =>
        idx === legIndex ? { ...leg, status: "picked" as const } : leg
      );
      setLegsInfo(updatedLegs);
      legsInfoRef.current = updatedLegs;

      const nextIndex = legIndex + 1;
      if (nextIndex <= ordered.length) {
        // There is a next leg (could be to next student or to school)
        setCurrentLegIndex(nextIndex);
        currentLegIndexRef.current = nextIndex;
        if (nextIndex === ordered.length) {
          // All students picked, now going to school
          setTripStatus("toSchool");
          tripStatusRef.current = "toSchool";
          alert("✅ All students picked! Now heading to LE College.");
        } else {
          // Continue pickup
          alert(`✅ Picked up ${ordered[legIndex].firstName}! Moving to next.`);
        }
      } else {
        // All legs completed -> trip finished
        setTripStatus("completed");
        tripStatusRef.current = "completed";
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

      addMarker(map, SCHOOL_POSITION, "🏫🎓", "LE College, Morbi", "#EF4444");

      const users = loadUsers();
      ensureLiveDriverMarkers(users);
      const activeDriver = normalizeRole(currentUser?.role) === "driver" ? findMatchingUser(users, currentUser) : null;
      const activeDriverPosition = getUserPosition(activeDriver || currentUser) ?? DRIVER_LAL_POSITION;

      users.forEach((user) => {
        if (user.latitude == null || user.longitude == null || !isVisibleUserForViewer(currentUser, user)) {
          return;
        }

        const position: Position = [user.longitude, user.latitude];
        const role = normalizeRole(user.role);

        if (role === "student") {
          addMarker(map, position, user.id === currentUser?.id ? "🧑‍🎓" : "🧑‍🎓", user.firstName || user.username, user.id === currentUser?.id ? "#2563EB" : "#3B82F6");
        } else if (role === "driver") {
          addMarker(map, position, "🚌", user.firstName || user.username || "Driver", "#F59E0B");
        } else if (role === "teacher") {
          addMarker(map, position, "👩‍🏫", user.firstName, "#8B5CF6");
        } else if (role === "parent") {
          addMarker(map, position, "👨‍👩‍👧", user.firstName, "#10B981");
        }
      });

      if (normalizeRole(currentUser?.role) === "driver") {
        updateDriverMarker(
          driverMarkerRef,
          map,
          activeDriverPosition,
          activeDriver?.firstName || activeDriver?.username || currentUser?.firstName || "Lal"
        );
      }

      const positions: Position[] = [SCHOOL_POSITION];
      users.forEach((user) => {
        if (user.latitude != null && user.longitude != null && isVisibleUserForViewer(currentUser, user)) {
          positions.push([user.longitude, user.latitude]);
        }
      });
      if (positions.length > 1) {
        map.setCamera({
          bounds: atlas.data.BoundingBox.fromPositions(positions),
          padding: 50,
        });
      }

      if (normalizeRole(currentUser?.role) === "admin") {
        const adminSummaries = await drawAdminRoutes(map, users, trafficEnabled);
        setAdminRouteSummaries(adminSummaries);
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

  // Live tracking for driver (real GPS)
  useEffect(() => {
    if (normalizeRole(currentUser?.role) !== "driver") return;
    if (!navigator.geolocation) {
      alert("Geolocation not supported. Please use a device with GPS.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const newPos: Position = [position.coords.longitude, position.coords.latitude];
        setBusPosition(newPos);
        setLiveBusPosition(getUserKey(currentUser), newPos);
        if (mapRef.current) {
          updateDriverMarker(driverMarkerRef, mapRef.current, newPos, currentUser?.firstName || currentUser?.username || "Lal");
          await checkAndAdvance(newPos);
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
  }, [currentUser]);

  if (!currentUser) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Please login to continue</div>;
  }

  // Helper for status display
  const getStatusClass = () => {
    if (tripStatus === "idle") return styles.statusBadgeIdle;
    if (tripStatus === "pickup" || tripStatus === "toSchool") return styles.statusBadgePickup;
    if (tripStatus === "completed") return styles.statusBadgeCompleted;
    return "";
  };

  const statusLabel =
    tripStatus === "idle"
      ? "⚪ Not Started"
      : tripStatus === "pickup"
      ? `⚫ Picking up ${orderedStudents[currentLegIndex]?.firstName || "..."} (${orderedStudents.length - currentLegIndex} left)`
      : tripStatus === "toSchool"
      ? "⚫ Going to LE College"
      : "✅ Completed";

  const overviewUsers = loadUsers();
  const adminDrivers = getAdminOverviewDrivers(overviewUsers);
  const adminStudents = getAdminOverviewStudents(overviewUsers);

  return (
    <div>
      {normalizeRole(currentUser?.role) === "student" && (
        <div className={styles.dashboardShell} style={{ marginBottom: 16 }}>
          <div className={styles.dashboardHeader}>
            <div>
              <div className={styles.dashboardTitle}>Student Route</div>
              <div className={styles.dashboardSubtitle}>
                Bus to student pickup to school routing with live bus tracking
              </div>
            </div>
            <div
              className={styles.dashboardBadge}
              style={{ background: studentRouteSummary?.routeColor || "#2563eb" }}
            >
              🚌 {studentRouteSummary?.driverName || "Assigned Bus"}
            </div>
          </div>
          <div className={styles.metricGrid}>
            <div className={styles.metricChip}>Route: Bus → Student → School</div>
            <div className={styles.metricChip}>
              Distance: {studentRouteSummary ? `${studentRouteSummary.distanceKm} km` : "N/A"}
            </div>
            <div className={styles.metricChip}>
              Time: {studentRouteSummary ? `${studentRouteSummary.timeMin} min` : "N/A"}
            </div>
            <div className={styles.metricChip}>Pickup flow: Active</div>
          </div>
        </div>
      )}

      {normalizeRole(currentUser?.role) === "admin" && (
        <div className={styles.dashboardShell} style={{ marginBottom: 16 }}>
          <div className={styles.dashboardHeader}>
            <div>
              <div className={styles.dashboardTitle}>Admin Route Overview</div>
              <div className={styles.dashboardSubtitle}>
                Live route summary for all buses, students, and school reach time
              </div>
            </div>
            <div className={styles.metricGrid}>
              <div className={styles.metricChip}>Students: {adminStudents.length}</div>
              <div className={styles.metricChip}>Drivers: {adminDrivers.length}</div>
              <div className={styles.metricChip}>School: LE College</div>
            </div>
          </div>
          <div className={styles.dashboardCardGrid}>
            {adminDrivers.map((driver) => {
              const driverKey = getUserKey(driver);
              const assignedStudents = overviewUsers.filter(
                (user) =>
                  normalizeRole(user.role) === "student" &&
                  getAssignedStudentKeysForDriver(driverKey).includes(getUserKey(user))
              );
              const driverPosition = getUserPosition(driver);
              const summary = adminRouteSummaries.find((item) => item.driverKey === driverKey);

              return (
                <div key={driver.id} className={styles.dashboardCard}>
                  <div className={styles.dashboardCardTop}>
                    <div className={styles.driverTitleWrap}>
                      <span
                        className={styles.routeColorDot}
                        style={{ background: summary?.routeColor || getDriverRouteColor(driverKey) }}
                      />
                      <div>
                        <div className={styles.driverName}>{driver.firstName || driver.username || "Driver"}</div>
                        <div className={styles.driverMeta}>Bus route assigned</div>
                      </div>
                    </div>
                    <div className={styles.dashboardBadge} style={{ background: summary?.routeColor || getDriverRouteColor(driverKey) }}>
                      {summary ? `${summary.timeMin} min` : "Routing"}
                    </div>
                  </div>

                  <div className={styles.metricGrid}>
                    <div className={styles.metricChip}>
                      Assigned: {assignedStudents.map((student) => student.firstName || student.username).join(", ") || "None"}
                    </div>
                    <div className={styles.metricChip}>
                      Location: {driverPosition ? `${driverPosition[1].toFixed(5)}, ${driverPosition[0].toFixed(5)}` : "N/A"}
                    </div>
                    <div className={styles.metricChip}>
                      School: {summary ? `${summary.distanceKm} km` : "N/A"}
                    </div>
                    <div className={styles.metricChip}>
                      Picked: {summary ? summary.pickedCount : 0}/{summary ? summary.assignedCount : assignedStudents.length}
                    </div>
                    <div className={styles.metricChip}>
                      Remaining: {summary ? summary.remainingCount : assignedStudents.length}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Control Panel for Driver */}
      {normalizeRole(currentUser?.role) === "driver" && (
        <div className={styles.controlPanel}>
          <div className={styles.controlRow}>
            <span style={{ fontWeight: "bold" }}>📍 Trip Status:</span>
            <span className={`${styles.statusBadge} ${getStatusClass()}`}>{statusLabel}</span>
            {totalDistance > 0 && (
              <>
                <span>📏 Total: {(totalDistance / 1000).toFixed(2)} km</span>
                <span>⏱️ Time: {totalTime} min</span>
              </>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <button
              onClick={startPickupTrip}
              disabled={tripStatus !== "idle"}
              className={styles.primaryButton}
            >
              🚀 Start Pickup Trip
            </button>
            <button onClick={resetTrip} className={styles.resetButton}>
              🔄 Reset Trip
            </button>
            <button
              onClick={toggleTraffic}
              className={`${styles.trafficButton} ${
                trafficEnabled ? styles.trafficOn : styles.trafficOff
              }`}
            >
              {trafficEnabled ? "🚦 Traffic: ON" : "🚦 Traffic: OFF"}
            </button>
          </div>
        </div>
      )}

      {normalizeRole(currentUser?.role) !== "driver" && (
        <div className={styles.userInfo}>
          <span>
            👋 Hello, {currentUser.firstName} ({currentUser.role})
          </span>
        </div>
      )}

      {/* Route Info Cards for each leg */}
      {normalizeRole(currentUser?.role) === "driver" && (
        <div className={styles.cardContainer}>
          {legsInfo.map((leg, idx) => {
            const isCompleted = leg.status === "picked";
            const isCurrent = idx === currentLegIndex && tripStatus !== "completed";
            return (
              <div
                key={`leg-${idx}`}
                className={`${styles.routeCard} ${isCompleted ? styles.routeCardPicked : ""}`}
                style={{
                  borderLeftColor: isCompleted ? "#10b981" : leg.color,
                  background: isCurrent ? "#e0f2fe" : leg.backgroundColor,
                }}
              >
                <div className={styles.routeTitle} style={{ color: isCompleted ? "#10b981" : leg.color }}>
                  {idx === 0 && "🚌 Bus → Student"}
                  {idx > 0 && idx < orderedStudents.length && "👨‍🎓 Student → Student"}
                  {idx === orderedStudents.length && "🏫 Student → LE College"}
                  {isCompleted && " ✅ Completed"}
                </div>
                <div className={styles.routeStudent}>
                  {idx < orderedStudents.length
                    ? `Student: ${leg.student}`
                    : "Destination: LE College"}
                </div>
                <div className={styles.routeDetail}>
                  Distance: {leg.distance} KM | Time: {leg.time} Min
                </div>
                <div
                  className={styles.trafficStatus}
                  style={{ color: getTrafficColor(leg.trafficStatus, trafficEnabled) }}
                >
                  <span
                    className={styles.trafficDot}
                    style={{ background: getTrafficColor(leg.trafficStatus, trafficEnabled) }}
                  ></span>
                  {getTrafficText(leg.trafficStatus, trafficEnabled)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Map Container */}
      <div className={styles.mapWrapper}>
        <div id="azure-map" className={styles.mapContainer} />
        <div className={styles.floatingButtons}>
          <button
            onClick={() => changeMapStyle("road")}
            className={`${styles.styleButton} ${
              mapStyleType === "road" ? styles.styleButtonActive : ""
            }`}
            title="Road Map"
          >
            🗺️ Road
          </button>
          <button
            onClick={() => changeMapStyle("satellite")}
            className={`${styles.styleButton} ${
              mapStyleType === "satellite" ? styles.styleButtonActive : ""
            }`}
            title="Satellite"
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => changeMapStyle("3d")}
            className={`${styles.styleButton} ${
              mapStyleType === "3d" ? styles.styleButtonActive : ""
            }`}
            title="3D View"
          >
            🏔️ 3D
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: "#EF4444" }}></div>
          <span>🏫🎓 LE College</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: "#3B82F6" }}></div>
          <span>🧑‍🎓 Student</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendBus}></div>
          <span>🚌 Bus (Live)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendLine}></div>
          <span>⚫ Route</span>
        </div>
        {trafficEnabled && (
          <>
            <div className={styles.legendItem}>
              <div className={styles.legendTrafficModerate}></div>
              <span>🟡 Moderate Traffic</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendTrafficHeavy}></div>
              <span>🔴 Heavy Traffic</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveMap;