import App from "./components/App/App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// @ts-ignore: allow importing CSS without type declarations
import "react-toastify/dist/ReactToastify.css";
import { initializeIcons } from "@fluentui/react";
// @ts-ignore: allow importing CSS without type declarations
import "./Stylesheets/custom.css";
import { LoadingProvider } from "./LoadingContext";
import SharedLoader from "./components/Shared/SharedLoader/SharedLoader";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import { RoutePaths } from "./Constants";

initializeIcons(); // <- Initialize Fluent UI icons here

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element with id "root" not found');
}
const root = createRoot(rootElement);

root.render(
  <BrowserRouter
    basename={document.querySelector("base")?.getAttribute("href") ?? RoutePaths.Root}
  >
    <ToastContainer />
    <Provider store={store}>
      <LoadingProvider>
        <SharedLoader />
        <App />        
      </LoadingProvider>
    </Provider>
  </BrowserRouter>
);