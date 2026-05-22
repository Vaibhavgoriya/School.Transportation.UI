import React, { useState } from "react";
import { ILoginPageProps } from "./ILoginPageProps";
import ServiceConstants from "../../Services/ServiceConstants";
import { Navigate, useNavigate } from "react-router-dom";
import { Stack, StackItem } from "@fluentui/react";
// @ts-ignore: SCSS module typings not present
import styles from "./LoginPage.module.scss";
import AuthenticationService from "../../Services/AuthenticationService";
import { toast } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import { CURRENT_USER_DETAILS, IS_AUTHENTICATED } from "../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducers";
import { useTranslation } from "react-i18next";
import { AppButtonVariants, RoutePaths } from "../../Constants";
import AppButton from "../Shared/Controls/AppButton/AppButton";
import AppTextBox from "../Shared/Controls/AppTextBox/AppTextBox";
import AuthSessionManager from "../../Utils/AuthSessionManager";

const LoginPage: React.FC<ILoginPageProps> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const serviceConstants = new ServiceConstants();
  const authenticationService = new AuthenticationService();
  const isAuthenticated = useSelector(
    (state: RootState) => state.store.isAuthenticated,
  );

  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isLoading, showLoading, hideLoading, showError } = useLoading();
  const organizationDetail = useSelector(
    (state: RootState) => state.store.organizationDetails,
  );

  const handleLogin = async () => {
    showLoading();
    try {
      const response =
        await authenticationService.authenticateAndGetCurrentUserDetails(
          userName,
          password,
          organizationDetail.id,
        );

      const expiryTime = new Date(response.tokenExpiry).getTime();
      const now = new Date().getTime();

      const timeout = expiryTime - now;

      if (timeout > 0) {
        AuthSessionManager.startSessionTimeout(timeout);
      } else {
        AuthSessionManager.clearSession();
      }

      if (response && response.id) {
        toast.success(`${t("LoginPage.WelcomeBack")} ${response.displayName}`);

        if (response && response.token) {
          sessionStorage.setItem(
            serviceConstants.SessionStorageAuthenticationTokenKey,
            response.token,
          );
          localStorage.setItem(
            serviceConstants.LocalStorageCacheName,
            JSON.stringify(response),
          );
        }

        dispatch({ type: CURRENT_USER_DETAILS, payload: response });
        dispatch({ type: IS_AUTHENTICATED, payload: true });
      }
      hideLoading();
    } catch (err: any) {
      if (err?.isI18nKey) {
        showError(t(err.message));
      } else {
        showError(err?.message);
      }
    }
  };

  const handleCancel = () => {
    navigate(RoutePaths.Root);
  };

  // If already logged in, redirect
  if (isAuthenticated) {
    const redirectURL =
      sessionStorage.getItem("redirectURL") || RoutePaths.Root;
    return <Navigate to={redirectURL} replace />;
  }

  if (isLoading) {
    return <></>;
  }

  return (
    <div className={styles.loginPageWrapper}>
      {/* Left half with background image */}
      <div className={styles.leftSection}>
        <div className={styles.leftContent}>
          <h1>{t("LoginPage.WelcomeBack")}</h1>
          <p>{t("LoginPage.Description")}</p>
        </div>
      </div>

      {/* Right half with highlighted background & login card */}
      <div className={styles.rightSection}>
        <Stack className={styles.loginFormContainer}>
          <StackItem>
            <h2>{t("LoginPage.Login")}</h2>
          </StackItem>
          <StackItem>
            <Stack className={styles.fieldContainer}>
              <StackItem>
                <AppTextBox
                  required
                  placeholder={t("LoginPage.PlaceHolder.Username")}
                  value={userName}
                  onChange={(_e, newValue) => {
                    setUserName(newValue || "");
                  }}
                />
              </StackItem>
              <StackItem>
                <AppTextBox
                  required
                  placeholder={t("LoginPage.PlaceHolder.Password")}
                  value={password}
                  type="password"
                  onChange={(e: any) => {
                    setPassword(e.target.value);
                  }}
                />
              </StackItem>
            </Stack>
          </StackItem>

          <StackItem>
            <Stack className={styles.buttonContainer} horizontal>
              <StackItem>
                <AppButton
                  variant={AppButtonVariants.Secondary}
                  onClick={handleCancel}
                >
                  {t("Common.CancelButtonText")}
                </AppButton>
              </StackItem>
              <StackItem>
                <AppButton
                  variant={AppButtonVariants.Primary}
                  disabled={!userName || !password}
                  onClick={handleLogin}
                >
                  {t("LoginPage.Login")}
                </AppButton>
              </StackItem>
            </Stack>
          </StackItem>

          <StackItem className={styles.resetUserContainer}>
            <AppButton
              variant={AppButtonVariants.Outline}
              onClick={() => navigate("/resetPassword")}
            >
              {t("LoginPage.ForgotPassword")}
            </AppButton>
          </StackItem>
        </Stack>
      </div>
    </div>
  );
};

export default LoginPage;
