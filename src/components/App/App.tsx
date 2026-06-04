// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useRef } from "react";
// import { IAppProps } from "./IAppProps";
// import AppSettingService from "../../Services/AppSettingService";
// import ServiceConstants from "../../Services/ServiceConstants";
// import Layout from "../../components/Layout/Layout";
// import { Navigate, Route, Routes } from "react-router-dom";
// import LoginPage from "../../components/LoginPage/LoginPage";
// import WelcomePage from "../../components/WelcomePage/WelcomePage";
// import ResetPassword from "../../components/ResetPassword/ResetPassword";
// import UserService from "../../Services/UserService";
// import { OrganizationDetails } from "../../Models/OrganizationDetails";
// import { useLoading } from "../../LoadingContext";
// import {
//   ALL_LANGUAGES,
//   CURRENT_ORGANIZATION_DETAILS,
//   CURRENT_USER_DETAILS,
//   GOOGLE_CAPTCHA_SITE_KEY,
//   IS_AUTHENTICATED,
//   ORGANIZATION_LOADED,
// } from "../../Redux/Actions";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../Redux/Reducers";
// import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
// import { LanguagesResponse } from "../../Models/ResponseModels/LanguagesResponse";
// import { LanguageTranslationsResponse } from "../../Models/ResponseModels/LanguageTranslationsResponse";
// import LanguagesService from "../../Services/LanguagesService";
// import { initializeI18n } from "../../LangugaeSetup";
// import { APPSettingsName, RoutePaths, UserRoles } from "../../Constants";
// import Home from "../Home/Home";
// import { LanguageChangeButton } from "../Shared/LanguageChangeButton/LanguageChangeButton";
// import OrganizationGuard from "./ProtectedRoute/OrganizationGuard";
// import AllUsers from "../UserManagement/AllUsers/AllUsers";
// import AuthListener from "../Shared/AuthProvider/AuthListener";

// const App: React.FC<IAppProps> = () => {
//   const dispatch = useDispatch();
//   const { showLoading, hideLoading } = useLoading();
//   const appSettingService = useRef(new AppSettingService()).current;
//   const serviceConstants = useRef(new ServiceConstants()).current;
//   const userService = useRef(new UserService()).current;
//   const languagesService: LanguagesService = new LanguagesService();
//   const [isLoading, setIsLoading] = React.useState<boolean>(false);
//   const [isI18nReady, setIsI18nReady] = React.useState(false);

//   const isAuthenticated = useSelector(
//     (state: RootState) => state.store.isAuthenticated,
//   );

//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         showLoading();
//         setIsLoading(true);

//         // 1️⃣ Load Organization
//         const organizationDetails =
//           await userService.getOrganizationDetailsAsync();

//         dispatch({
//           type: CURRENT_ORGANIZATION_DETAILS,
//           payload: organizationDetails ?? new OrganizationDetails(),
//         });

//         dispatch({
//           type: ORGANIZATION_LOADED,
//           payload: true,
//         });

//         // 2️⃣ Load Languages (do not block org)
//         initiateAndGetLanguages();

//         // 3️⃣ Restore Session only if org is active
//         if (organizationDetails?.isActive) {
//           await loadCaptchaKey();
//           restoreSession();
//         }
//       } catch (error) {
//         console.error("Bootstrap failed", error);

//         dispatch({
//           type: CURRENT_ORGANIZATION_DETAILS,
//           payload: new OrganizationDetails(),
//         });

//         dispatch({
//           type: ORGANIZATION_LOADED,
//           payload: true,
//         });
//       } finally {
//         hideLoading();
//         setIsLoading(false);
//       }
//     };

//     bootstrap();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function initiateAndGetLanguages(): Promise<{
//     languages: LanguagesResponse[];
//     translations: LanguageTranslationsResponse[];
//   }> {
//     let languages: LanguagesResponse[] = [];
//     let languagesTranslations: LanguageTranslationsResponse[] = [];
//     try {
//       languages = await languagesService.getLanguages();
//       languagesTranslations = await languagesService.GetLanguagesTranslations();
//       await initializeI18n(languagesTranslations);
//       dispatch({ type: ALL_LANGUAGES, payload: languages });
//       setIsI18nReady(true);
//     } catch (err) {
//       console.log(err);
//     }
//     return {
//       languages: languages,
//       translations: languagesTranslations,
//     };
//   }

//   const loadCaptchaKey = async () => {
//     try {
//       const secret = await appSettingService.getAppSetting(
//         APPSettingsName.GoogleCaptchaSiteKey,
//       );

//       dispatch({
//         type: GOOGLE_CAPTCHA_SITE_KEY,
//         payload: secret,
//       });
//     } catch (err) {
//       console.error("Captcha load failed", err);
//     }
//   };

//   const restoreSession = () => {
//     const userDetails = localStorage.getItem(
//       serviceConstants.LocalStorageCacheName,
//     );

//     if (!userDetails || isAuthenticated) return;

//     const userAccount = JSON.parse(userDetails);

//     if (userAccount?.token) {
//       sessionStorage.setItem(
//         serviceConstants.SessionStorageAuthenticationTokenKey,
//         userAccount.token,
//       );
//     }

//     dispatch({ type: CURRENT_USER_DETAILS, payload: userAccount });
//     dispatch({ type: IS_AUTHENTICATED, payload: true });
//   };

//   if (isLoading || !isI18nReady) {
//     return <></>;
//   }

//   return (
//     <>
//       {isI18nReady && <LanguageChangeButton />}

//       <OrganizationGuard>
//         <AuthListener />
//         <Routes>
//           {!isAuthenticated && (
//             <>
//               <Route
//                 path={RoutePaths.Login}
//                 element={
//                   <Layout showLeftNav={false} showTopNav={false} isAuthorized={false}>
//                     <LoginPage />
//                   </Layout>
//                 }
//               />
//               <Route
//                 path={`${RoutePaths.ResetPassword}`}
//                 element={
//                   <Layout showLeftNav={false} showTopNav={false} isAuthorized={false}>
//                     <ResetPassword />
//                   </Layout>
//                 }
//               />
//             </>
//           )}
//           {isAuthenticated && (
//             <>
//               <Route
//                 path={RoutePaths.Login}
//                 element={<Navigate to={RoutePaths.Root} replace />}
//               />
//               <Route
//                 path={`${RoutePaths.ResetPassword}`}
//                 element={<Navigate to={RoutePaths.Root} replace />}
//               />
//               <Route
//                 path={RoutePaths.Root}
//                 element={
//                   <ProtectedRoute allowedRoles={[UserRoles.Admin]}>
//                     <Layout showLeftNav={true} showTopNav={true} isAuthorized={true}>
//                       <Home />
//                     </Layout>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path={RoutePaths.AllUsers}
//                 element={
//                   <ProtectedRoute allowedRoles={[UserRoles.Admin]}>
//                     <Layout showLeftNav={true} showTopNav={true} isAuthorized={true}>
//                       <AllUsers />
//                     </Layout>
//                   </ProtectedRoute>
//                 }
//               />
//             </>
//           )}
//           <Route
//             path={RoutePaths.AnyPage}
//             element={
//               <Layout showLeftNav={false} showTopNav={false} isAuthorized={false}>
//                 <WelcomePage />
//               </Layout>
//             }
//           />
//         </Routes>
//       </OrganizationGuard>
//     </>
//   );
// };

// export default App;


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useRef } from "react";
// import { IAppProps } from "./IAppProps";
// import AppSettingService from "../../Services/AppSettingService";
// import ServiceConstants from "../../Services/ServiceConstants";
// import Layout from "../../components/Layout/Layout";
// import { Navigate, Route, Routes } from "react-router-dom";
// import LoginPage from "../../components/LoginPage/LoginPage";
// import WelcomePage from "../../components/WelcomePage/WelcomePage";
// import ResetPassword from "../../components/ResetPassword/ResetPassword";
// import { OrganizationDetails } from "../../Models/OrganizationDetails";
// import { useLoading } from "../../LoadingContext";
// import {
//   ALL_LANGUAGES,
//   CURRENT_ORGANIZATION_DETAILS,
//   CURRENT_USER_DETAILS,
//   GOOGLE_CAPTCHA_SITE_KEY,
//   IS_AUTHENTICATED,
//   ORGANIZATION_LOADED,
// } from "../../Redux/Actions";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../Redux/Reducers";
// import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
// import { LanguagesResponse } from "../../Models/ResponseModels/LanguagesResponse";
// import { LanguageTranslationsResponse } from "../../Models/ResponseModels/LanguageTranslationsResponse";
// import LanguagesService from "../../Services/LanguagesService";
// import { initializeI18n } from "../../LangugaeSetup";
// import { APPSettingsName, RoutePaths, UserRoles } from "../../Constants";
// import Home from "../Home/Home";
// import { LanguageChangeButton } from "../Shared/LanguageChangeButton/LanguageChangeButton";
// import OrganizationGuard from "./ProtectedRoute/OrganizationGuard";
// import AllUsers from "../UserManagement/AllUsers/AllUsers";
// import AuthListener from "../Shared/AuthProvider/AuthListener";

// const App: React.FC<IAppProps> = () => {
//   const dispatch = useDispatch();
//   const { showLoading, hideLoading } = useLoading();

//   const appSettingService = useRef(new AppSettingService()).current;
//   const serviceConstants = useRef(new ServiceConstants()).current;

//   const languagesService: LanguagesService = new LanguagesService();

//   const [isLoading, setIsLoading] =
//     React.useState<boolean>(false);

//   const [isI18nReady, setIsI18nReady] =
//     React.useState(false);

//   const isAuthenticated = useSelector(
//     (state: RootState) =>
//       state.store.isAuthenticated,
//   );

//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         showLoading();

//         setIsLoading(true);

//         // LOCAL ORGANIZATION MOCK
//         const organizationDetails =
//           new OrganizationDetails();

//         organizationDetails.id = "1";
//         organizationDetails.name =
//           "School Transportation";
//         organizationDetails.isActive = true;

//         dispatch({
//           type: CURRENT_ORGANIZATION_DETAILS,
//           payload: organizationDetails,
//         });

//         dispatch({
//           type: ORGANIZATION_LOADED,
//           payload: true,
//         });

//         // LOAD LANGUAGES
//         await initiateAndGetLanguages();

//         // LOCAL CAPTCHA
//         await loadCaptchaKey();

//         // RESTORE SESSION
//         restoreSession();
//       } catch (error) {
//         console.error("Bootstrap failed", error);

//         dispatch({
//           type: CURRENT_ORGANIZATION_DETAILS,
//           payload: new OrganizationDetails(),
//         });

//         dispatch({
//           type: ORGANIZATION_LOADED,
//           payload: true,
//         });
//       } finally {
//         hideLoading();

//         setIsLoading(false);
//       }
//     };

//     bootstrap();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function initiateAndGetLanguages(): Promise<{
//     languages: LanguagesResponse[];
//     translations: LanguageTranslationsResponse[];
//   }> {
//     let languages: LanguagesResponse[] = [];

//     let languagesTranslations:
//       LanguageTranslationsResponse[] = [];

//     try {
//       languages =
//         await languagesService.getLanguages();

//       languagesTranslations =
//         await languagesService.GetLanguagesTranslations();

//       await initializeI18n(
//         languagesTranslations,
//       );

//       dispatch({
//         type: ALL_LANGUAGES,
//         payload: languages,
//       });

//       setIsI18nReady(true);
//     } catch (err) {
//       console.log(err);

//       setIsI18nReady(true);
//     }

//     return {
//       languages: languages,
//       translations: languagesTranslations,
//     };
//   }

//   const loadCaptchaKey = async () => {
//     try {
//       // LOCAL CAPTCHA KEY
//       dispatch({
//         type: GOOGLE_CAPTCHA_SITE_KEY,
//         payload: "local-captcha-key",
//       });
//     } catch (err) {
//       console.error(
//         "Captcha load failed",
//         err,
//       );
//     }
//   };

//   const restoreSession = () => {
//     const userDetails =
//       localStorage.getItem(
//         serviceConstants.LocalStorageCacheName,
//       );

//     if (
//       !userDetails ||
//       isAuthenticated
//     )
//       return;

//     const userAccount =
//       JSON.parse(userDetails);

//     if (userAccount?.token) {
//       sessionStorage.setItem(
//         serviceConstants.SessionStorageAuthenticationTokenKey,
//         userAccount.token,
//       );
//     }

//     dispatch({
//       type: CURRENT_USER_DETAILS,
//       payload: userAccount,
//     });

//     dispatch({
//       type: IS_AUTHENTICATED,
//       payload: true,
//     });
//   };

//   if (
//     isLoading ||
//     !isI18nReady
//   ) {
//     return <></>;
//   }

//   return (
//     <>
//       {isI18nReady && (
//         <LanguageChangeButton />
//       )}

//       <OrganizationGuard>
//         <AuthListener />

//         <Routes>
//           {!isAuthenticated && (
//             <>
//               <Route
//                 path={RoutePaths.Login}
//                 element={
//                   <Layout
//                     showLeftNav={false}
//                     showTopNav={false}
//                     isAuthorized={false}
//                   >
//                     <LoginPage />
//                   </Layout>
//                 }
//               />

//               <Route
//                 path={`${RoutePaths.ResetPassword}`}
//                 element={
//                   <Layout
//                     showLeftNav={false}
//                     showTopNav={false}
//                     isAuthorized={false}
//                   >
//                     <ResetPassword />
//                   </Layout>
//                 }
//               />
//             </>
//           )}

//           {isAuthenticated && (
//             <>
//               <Route
//                 path={RoutePaths.Login}
//                 element={
//                   <Navigate
//                     to={RoutePaths.Root}
//                     replace
//                   />
//                 }
//               />

//               <Route
//                 path={`${RoutePaths.ResetPassword}`}
//                 element={
//                   <Navigate
//                     to={RoutePaths.Root}
//                     replace
//                   />
//                 }
//               />

//               <Route
//                 path={RoutePaths.Root}
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={[
//                       UserRoles.Admin,
//                     ]}
//                   >
//                     <Layout
//                       showLeftNav={true}
//                       showTopNav={true}
//                       isAuthorized={true}
//                     >
//                       <Home />
//                     </Layout>
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path={RoutePaths.AllUsers}
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={[
//                       UserRoles.Admin,
//                     ]}
//                   >
//                     <Layout
//                       showLeftNav={true}
//                       showTopNav={true}
//                       isAuthorized={true}
//                     >
//                       <AllUsers />
//                     </Layout>
//                   </ProtectedRoute>
//                 }
//               />
//             </>
//           )}

//           <Route
//             path={RoutePaths.AnyPage}
//             element={
//               <Layout
//                 showLeftNav={false}
//                 showTopNav={false}
//                 isAuthorized={false}
//               >
//                 <WelcomePage />
//               </Layout>
//             }
//           />
//         </Routes>
//       </OrganizationGuard>
//     </>
//   );
// };

// export default App;



import React, { useEffect, useRef } from "react";
import { IAppProps } from "./IAppProps";
import AppSettingService from "../../Services/AppSettingService";
import ServiceConstants from "../../Services/ServiceConstants";
import Layout from "../../components/Layout/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../../components/LoginPage/LoginPage";
import WelcomePage from "../../components/WelcomePage/WelcomePage";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import { OrganizationDetails } from "../../Models/OrganizationDetails";
import { useLoading } from "../../LoadingContext";
import {
  ALL_LANGUAGES,
  CURRENT_ORGANIZATION_DETAILS,
  CURRENT_USER_DETAILS,
  GOOGLE_CAPTCHA_SITE_KEY,
  IS_AUTHENTICATED,
  ORGANIZATION_LOADED,
} from "../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducers";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { LanguagesResponse } from "../../Models/ResponseModels/LanguagesResponse";
import { LanguageTranslationsResponse } from "../../Models/ResponseModels/LanguageTranslationsResponse";
import LanguagesService from "../../Services/LanguagesService";
import { initializeI18n } from "../../LangugaeSetup";
import { APPSettingsName, RoutePaths, UserRoles } from "../../Constants";
import Home from "../Home/Home";
import { LanguageChangeButton } from "../Shared/LanguageChangeButton/LanguageChangeButton";
import OrganizationGuard from "./ProtectedRoute/OrganizationGuard";
import AllUsers from "../UserManagement/AllUsers/AllUsers";
import AuthListener from "../Shared/AuthProvider/AuthListener";

const App: React.FC<IAppProps> = () => {

  const dispatch = useDispatch();

  const { showLoading, hideLoading } =
    useLoading();

  const appSettingService =
    useRef(
      new AppSettingService()
    ).current;

  const serviceConstants =
    useRef(
      new ServiceConstants()
    ).current;

  const languagesService:
    LanguagesService =
      new LanguagesService();

  const [isLoading, setIsLoading] =
    React.useState<boolean>(false);

  const [isI18nReady, setIsI18nReady] =
    React.useState(false);

  const isAuthenticated = useSelector(
    (state: RootState) =>
      state.store.isAuthenticated,
  );

  // =========================
  // CURRENT USER
  // =========================

  const currentUser = useSelector(
    (state: RootState) =>
      state.store.currentUserDetails,
  ) as any;

  const currentRole =
    currentUser?.role || "";

  useEffect(() => {

    const bootstrap = async () => {

      try {

        showLoading();

        setIsLoading(true);

        // =========================
        // LOCAL ORGANIZATION
        // =========================

        const organizationDetails =
          new OrganizationDetails();

        organizationDetails.id = "1";

        organizationDetails.name =
          "School Transportation";

        organizationDetails.isActive =
          true;

        dispatch({
          type:
            CURRENT_ORGANIZATION_DETAILS,
          payload: organizationDetails,
        });

        dispatch({
          type: ORGANIZATION_LOADED,
          payload: true,
        });

        // =========================
        // LANGUAGES
        // =========================

        await initiateAndGetLanguages();

        // =========================
        // CAPTCHA
        // =========================

        await loadCaptchaKey();

        // =========================
        // RESTORE SESSION
        // =========================

        //restoreSession();

      } catch (error) {

        console.error(
          "Bootstrap failed",
          error,
        );

        dispatch({
          type:
            CURRENT_ORGANIZATION_DETAILS,
          payload:
            new OrganizationDetails(),
        });

        dispatch({
          type: ORGANIZATION_LOADED,
          payload: true,
        });

      } finally {

        hideLoading();

        setIsLoading(false);
      }
    };

    bootstrap();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  async function initiateAndGetLanguages(): Promise<{
    languages: LanguagesResponse[];
    translations: LanguageTranslationsResponse[];
  }> {

    let languages:
      LanguagesResponse[] = [];

    let languagesTranslations:
      LanguageTranslationsResponse[] = [];

    try {

      languages =
        await languagesService.getLanguages();

      languagesTranslations =
        await languagesService.GetLanguagesTranslations();

      await initializeI18n(
        languagesTranslations,
      );

      dispatch({
        type: ALL_LANGUAGES,
        payload: languages,
      });

      setIsI18nReady(true);

    } catch (err) {

      console.log(err);

      setIsI18nReady(true);
    }

    return {
      languages: languages,
      translations:
        languagesTranslations,
    };
  }

  const loadCaptchaKey = async () => {

    try {

      dispatch({
        type:
          GOOGLE_CAPTCHA_SITE_KEY,
        payload:
          "local-captcha-key",
      });

    } catch (err) {

      console.error(
        "Captcha load failed",
        err,
      );
    }
  };

  const restoreSession = () => {

    const userDetails =
      localStorage.getItem(
        serviceConstants.LocalStorageCacheName,
      );

    if (
      !userDetails ||
      isAuthenticated
    ) {
      return;
    }

    const userAccount =
      JSON.parse(userDetails);

    if (userAccount?.token) {

      sessionStorage.setItem(
        serviceConstants.SessionStorageAuthenticationTokenKey,
        userAccount.token,
      );
    }

    dispatch({
      type:
        CURRENT_USER_DETAILS,
      payload: userAccount,
    });

    dispatch({
      type:
        IS_AUTHENTICATED,
      payload: true,
    });
  };

  if (
    isLoading ||
    !isI18nReady
  ) {
    return <></>;
  }

  return (
    <>

      {isI18nReady && (
        <LanguageChangeButton />
      )}

      <OrganizationGuard>

        <AuthListener />

        <Routes>

          {/* ========================= */}
          {/* NOT AUTHENTICATED */}
          {/* ========================= */}

          {!isAuthenticated && (
            <>

              <Route
                path={RoutePaths.Login}
                element={
                  <Layout
                    showLeftNav={false}
                    showTopNav={false}
                    isAuthorized={false}
                  >
                    <LoginPage />
                  </Layout>
                }
              />

              <Route
                path={`${RoutePaths.ResetPassword}`}
                element={
                  <Layout
                    showLeftNav={false}
                    showTopNav={false}
                    isAuthorized={false}
                  >
                    <ResetPassword />
                  </Layout>
                }
              />

            </>
          )}

          {/* ========================= */}
          {/* AUTHENTICATED */}
          {/* ========================= */}

          {isAuthenticated && (
            <>

              <Route
                path={RoutePaths.Login}
                element={
                  <Navigate
                    to={RoutePaths.Root}
                    replace
                  />
                }
              />

              <Route
                path={`${RoutePaths.ResetPassword}`}
                element={
                  <Navigate
                    to={RoutePaths.Root}
                    replace
                  />
                }
              />

              {/* ========================= */}
              {/* DASHBOARD */}
              {/* ========================= */}

              <Route
                path={RoutePaths.Root}
                element={
                  <Layout
                    showLeftNav={true}
                    showTopNav={true}
                    isAuthorized={true}
                  >

                    {/* ========================= */}
                    {/* ADMIN */}
                    {/* ========================= */}

                    {currentRole ===
                      UserRoles.Admin ? (
                      <Home />
                    ) : (
                      // =========================
                      // TEACHER / PARENT / STUDENT
                      // =========================
                      <Home />
                    )}

                  </Layout>
                }
              />

              {/* ========================= */}
              {/* ALL USERS ONLY ADMIN */}
              {/* ========================= */}

              <Route
                path={RoutePaths.AllUsers}
                element={

                  currentRole ===
                    UserRoles.Admin ? (

                    <ProtectedRoute
                      allowedRoles={[
                        UserRoles.Admin,
                      ]}
                    >
                      <Layout
                        showLeftNav={true}
                        showTopNav={true}
                        isAuthorized={true}
                      >
                        <AllUsers />
                      </Layout>
                    </ProtectedRoute>

                  ) : (

                    <Navigate
                      to={RoutePaths.Root}
                      replace
                    />

                  )
                }
              />

            </>
          )}

          {/* ========================= */}
          {/* DEFAULT */}
          {/* ========================= */}

          <Route
            path={RoutePaths.AnyPage}
            element={
              <Layout
                showLeftNav={false}
                showTopNav={false}
                isAuthorized={false}
              >
                <WelcomePage />
              </Layout>
            }
          />

        </Routes>

      </OrganizationGuard>

    </>
  );
};

export default App;
