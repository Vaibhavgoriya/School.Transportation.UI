import { useEffect } from "react";

const DriverLiveTracking = () => {

  useEffect(() => {

    const watchId =
      navigator.geolocation.watchPosition(

        (position) => {

          const users = JSON.parse(
            localStorage.getItem("users") || "[]"
          );

          const currentUser =
            JSON.parse(
              localStorage.getItem("currentUser") || "{}"
            );

          const updatedUsers =
            users.map((user: any) => {

              if (
                user.username ===
                currentUser.username
              ) {

                return {
                  ...user,
                  latitude:
                    position.coords.latitude,

                  longitude:
                    position.coords.longitude,
                };
              }

              return user;
            });

          localStorage.setItem(
            "users",
            JSON.stringify(updatedUsers)
          );
        },

        (error) => {
          console.error(error);
        },

        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };

  }, []);

  return null;
};

export default DriverLiveTracking;