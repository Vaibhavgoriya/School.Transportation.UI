import { useLocation, useNavigate, useParams } from "react-router-dom";

// Higher-Order Component to inject the `navigate` function into class components
export const WithRouter = (Component: any) => {
  function ComponentWithRouterProp(props: any) {
    const navigate = useNavigate(); // Get the navigate function
    const params = useParams();
    const location = useLocation();
    return (
      <Component
        {...props}
        router={{
          navigate,
          params,
          location,
        }}
      />
    );
  }

  return ComponentWithRouterProp;
};
