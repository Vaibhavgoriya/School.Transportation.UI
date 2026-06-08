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



import React, { useEffect, useState } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

/// <reference types="azure-maps-control" />

interface RouteInfo {
  student: string;
  routeNo: number;
  distance: string;
  time: number;
  color: string;
  backgroundColor: string;
}

interface UserLocation {
  firstName?: string;
  username?: string;
  latitude?: number;
  longitude?: number;
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

const SCHOOL_POSITION: Position = [70.831, 22.824];

const routeColors = [
  { line: "#dde018", card: "#dbeafe" },
  { line: "#b6b83a", card: "#e5e7eb" },
  { line: "#f3a72d", card: "#dcfce7" },
  { line: "#b8b6a0", card: "#ffedd5" },
  { line: "#5c591e", card: "#f3e8ff" },
];

const controls = [
  new atlas.control.ZoomControl(),
  new atlas.control.CompassControl(),
  new atlas.control.PitchControl(),
  new atlas.control.StyleControl(),
];

const loadUsers = (): UserLocation[] => {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
};

const getRouteUrl = (start: Position, end: Position) => {
  const [startLng, startLat] = start;
  const [endLng, endLat] = end;
  return `https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=${startLat},${startLng}:${endLat},${endLng}&maxAlternatives=4&routeType=shortest&travelMode=car&subscription-key=${import.meta.env.VITE_AZURE_MAPS_KEY}`;
};

const addMarker = (map: atlas.Map, position: Position, text: string) => {
  map.markers.add(new atlas.HtmlMarker({ position, text }));
};

const addRouteLine = (map: atlas.Map, coordinates: Position[], color: string, strokeWidth: number) => {
  const source = new atlas.source.DataSource();
  map.sources.add(source);
  source.add(new atlas.data.Feature(new atlas.data.LineString(coordinates)));
  map.layers.add(new atlas.layer.LineLayer(source, undefined, { strokeColor: color, strokeWidth }));
};

const cardContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  padding: "10px",
};

const mapStyle: React.CSSProperties = { width: "100%", height: "85vh" };

const LiveMap: React.FC = () => {
  const [routeInfos, setRouteInfos] = useState<RouteInfo[]>([]);

  useEffect(() => {
    const map = new atlas.Map("azure-map", {
      center: SCHOOL_POSITION,
      zoom: 13,
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
      },
    });

    map.controls.add(controls, { position: atlas.ControlPosition.TopRight });

    map.events.add("ready", async () => {
      addMarker(map, SCHOOL_POSITION, "🏫");

      const users = loadUsers();
      const positions: Position[] = [SCHOOL_POSITION];
      const nextRouteInfos: RouteInfo[] = [];

      for (const user of users) {
        if (!user.latitude || !user.longitude) continue;

        const studentPosition: Position = [user.longitude, user.latitude];
        positions.push(studentPosition);
        addMarker(map, studentPosition, "🧑");

        try {
          const response = await fetch(getRouteUrl(SCHOOL_POSITION, studentPosition));
          const result = (await response.json()) as RouteResponse;
          if (!result.routes?.length) continue;

          result.routes.forEach((route, index) => {
            const routeColor = routeColors[index % routeColors.length];
            nextRouteInfos.push({
              student: user.firstName || user.username || "Unknown",
              routeNo: index + 1,
              distance: (route.summary.lengthInMeters / 1000).toFixed(2),
              time: Math.round(route.summary.travelTimeInSeconds / 60),
              color: routeColor.line,
              backgroundColor: routeColor.card,
            });

            const points = route.legs?.[0]?.points;
            if (!points?.length) return;

            const coordinates: Position[] = points.map((point) => [point.longitude, point.latitude]);
            addRouteLine(map, coordinates, routeColor.line, index === 0 ? 7 : 5);
          });
        } catch (error) {
          console.error("Route Error:", error);
        }
      }

      setRouteInfos(nextRouteInfos);

      if (positions.length > 1) {
        map.setCamera({
          bounds: atlas.data.BoundingBox.fromPositions(positions),
          padding: 100,
        });
      }
    });

    return () => map.dispose();
  }, []);

  return (
    <div>
      <div style={cardContainerStyle}>
        {routeInfos.map((route, index) => (
          <div
            key={`${route.student}-${route.routeNo}-${index}`}
            style={{
              minWidth: "220px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              borderLeft: `8px solid ${route.color}`,
              background: route.backgroundColor,
            }}
          >
            <div style={{ color: route.color, fontWeight: 700, fontSize: "18px" }}>
              {index === 0 ? "Recommended Route" : `Alternative Route ${index}`}
            </div>
            <div>Student : {route.student}</div>
            <div>Distance : {route.distance} KM</div>
            <div>Time : {route.time} Min</div>
          </div>
        ))}
      </div>

      <div id="azure-map" style={mapStyle} />
    </div>
  );
};

export default LiveMap;