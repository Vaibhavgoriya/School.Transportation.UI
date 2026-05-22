import { useState } from "react";
import { IWelcomePageProps } from "./IWelcomePageProps";
import { Stack, StackItem } from "@fluentui/react";
// @ts-ignore: SCSS module typings not present
import styles from "./WelcomePage.module.scss";
import PopupModal from "../Shared/Dialogs/SharedModalDialog/SharedModalDialog";
import RegisterUserForm from "../UserManagement/RegisterUserForm/RegisterUserForm";
import { Navigate, useNavigate } from "react-router-dom";
import { useLoading } from "../../LoadingContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducers";
import { useTranslation } from "react-i18next";
import { AppButtonVariants, PopupModalSize, RoutePaths } from "../../Constants";
import AppButton from "../Shared/Controls/AppButton/AppButton";

const WelcomePage: React.FC<IWelcomePageProps> = () => {
  const { t } = useTranslation();
  const { isLoading } = useLoading();
  const navigate = useNavigate();

  const [isShowNewUserModal, setIsShowNewUserModal] = useState(false);
  const organizationDetail = useSelector(
    (state: RootState) => state.store.organizationDetails,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.store.isAuthenticated,
  );

  const onLoginClick = () => {
    sessionStorage.setItem("redirectURL", window.location.pathname);
    navigate("/login");
  };

  const onCloseNewUserModal = () => {
    setIsShowNewUserModal(false);
  };

  // If already logged in, redirect
  if (isAuthenticated) {
    const redirectURL =
      sessionStorage.getItem("redirectURL") || RoutePaths.Root;
    return <Navigate to={redirectURL} replace />;
  }

  const getNewUserComponent = (): JSX.Element => {
    if (isLoading) return <></>;

    return (
      <Stack>
        <StackItem>
          <RegisterUserForm onClose={onCloseNewUserModal} />
        </StackItem>
      </Stack>
    );
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      {isShowNewUserModal && (
        <PopupModal
          titleId="newUserRegister"
          isOpen={isShowNewUserModal}
          isBlocking={true}
          onDismiss={onCloseNewUserModal}
          size={PopupModalSize.Small}
          modalHeader={t("RegisterUser.Header")}
          childComponent={getNewUserComponent()}
          onPrimaryButtonSubmit={() => {}}
          primaryButtonText=""
          onSecondaryButtonSubmit={() => {}}
          secondaryButtonText=""
        />
      )}

      <div className={styles.welcomeContainer}>
        <div className={styles.background}></div>
        <div className={styles.leftSection}>
          <h1>
            {t("WelcomePage.WelcomeTo")} {organizationDetail.name}
          </h1>
          <p>{t("WelcomePage.Description")}</p>
        </div>

        <div className={styles.rightSection}>
          <Stack>
            <StackItem className={styles.welcomeMainLabelContainer}>
              <h2>{t("WelcomePage.PortalAccess")}</h2>
            </StackItem>

            <StackItem className={styles.loginControlContainer}>
              <AppButton
                variant={AppButtonVariants.Primary}
                onClick={onLoginClick}
              >
                {t("WelcomePage.Login")}
              </AppButton>
            </StackItem>

            <StackItem className={styles.registerNewUserContainer}>
              <AppButton
                variant={AppButtonVariants.Link}
                onClick={() => {
                  setIsShowNewUserModal(true);
                }}
              >
                {t("WelcomePage.RegisterNewUser")}
              </AppButton>
            </StackItem>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
