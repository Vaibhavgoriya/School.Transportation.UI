import React from "react";
import Layout from "../../Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducers";
import UnAuthorized from "../../Shared/UnAuthorized/UnAuthorized";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const userDetail = useSelector(
    (state: RootState) => state.store.currentUserDetails
  );
  const hasAccess = userDetail.role;
  if (!hasAccess || !allowedRoles.includes(hasAccess)) {
    return (
      <Layout showLeftNav={false} showTopNav={true} isAuthorized={false}>
        <UnAuthorized />
      </Layout>
    );
  }
  return <>{children}</>;
};
export default ProtectedRoute;
