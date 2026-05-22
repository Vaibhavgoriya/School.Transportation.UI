import React from "react";
import { IHomeProps } from "./IHomeProps";
import AllUsers from "../UserManagement/AllUsers/AllUsers";

const Home: React.FC<IHomeProps> = () => {
  return <AllUsers />;
};

export default Home;
