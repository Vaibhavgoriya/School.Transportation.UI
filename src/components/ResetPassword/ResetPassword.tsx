import React, { useEffect, useRef, useState } from "react";
import { IResetPasswordProps } from "./IResetPasswordProps";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Stack, StackItem } from "@fluentui/react";
// @ts-ignore: SCSS module typings not present
import styles from "./ResetPassword.module.scss";
import { WithRouter } from "../Shared/WithRouter/WithRouter";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import UserService from "../../Services/UserService";
import { useLoading } from "../../LoadingContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducers";
import { AppButtonVariants } from "../../Constants";
import AppButton from "../Shared/Controls/AppButton/AppButton";
import AppTextBox from "../Shared/Controls/AppTextBox/AppTextBox";
import { useTranslation } from "react-i18next";

const ResetPassword: React.FC<IResetPasswordProps> = (_props) => {
  const { t } = useTranslation();
  const userService = new UserService();
  const recaptchaRef = useRef<any>(null);

  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading, showError } = useLoading();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  // const [loginMessage, setLoginMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFormNotValid, setIsFormNotValid] = useState(false);
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const { userId: paramUserId } = useParams<{ userId?: string }>();
  const [userId, setUserId] = useState<string>("");
  const googleCaptchaSiteKey = useSelector(
    (state: RootState) => state.store.googleCaptchaSiteKey,
  );

  const organizationDetail = useSelector(
    (state: RootState) => state.store.organizationDetails,
  );

  /* componentWillMount */
  useEffect(() => {
    if (paramUserId) {
      setUserId(paramUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramUserId]);

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setIsCaptchaVerified(false);
  };

  const handleResendVerificationCode = async () => {
    showLoading();
    try {
      await userService.initiatePasswordResetVerificationAsync(
        userId, //TODO: can be username or userid as we might get set password link with userid for New Users registration
        organizationDetail.id,
      );

      toast.success(t("Common.Message.VerificationSent"));
      setShowPasswordPolicy(false);
      resetCaptcha();
    } catch (err: any) {
      if (err?.isI18nKey) {
        showError(t(err.message));
      } else {
        showError(err?.message);
      }
      setIsSuccess(false);
      resetCaptcha();
      return undefined;
    } finally {
      hideLoading();
    }
  };

  const handleValidateUser = async () => {
    showLoading();
    if (isCaptchaVerified) {
      try {
        const id = await userService.validateUserByEmailAsync(
          userName, //TODO: can be username or userid as we might get set password link with userid for New Users registration
          organizationDetail.id,
        );

        setUserId(id);
        await userService.initiatePasswordResetVerificationAsync(
          id, //TODO: can be username or userid as we might get set password link with userid for New Users registration
          organizationDetail.id,
        );

        toast.success(t("Common.Message.VerificationSent"));
        setShowPasswordPolicy(false);
        resetCaptcha();

        if (id) {
          navigate(`/resetPassword/${id}`); // ✅ use returned id directly
        }
      } catch (err: any) {
        if (err?.isI18nKey) {
          showError(t(err.message));
        } else {
          showError(err?.message);
        }
        setIsSuccess(false);
        resetCaptcha();
        return undefined;
      } finally {
        hideLoading();
      }
    } else {
      showError(t("Common.Error.Captcha"));
      showLoading();
    }
  };

  const handleReset = async () => {
    showLoading();
    if (!isResetFormValid()) return;

    try {
      const response = await userService.resetUserPassword(
        userId,
        password,
        verificationCode,
      );
      if (response) {
        toast.success(t("ResetPassword.Success"));
        setIsSuccess(true);
      }
    } catch (err: any) {
      showError(err);
      setIsSuccess(false);
    } finally {
      hideLoading();
    }
  };

  const isResetFormValid = (): boolean => {
    if (
      password !== confirmPassword ||
      !isCaptchaVerified ||
      !verificationCode
    ) {
      setIsFormNotValid(true);
      hideLoading();
      showError(
        password !== confirmPassword
          ? t("ResetPassword.NotMatch")
          : !isCaptchaVerified
            ? t("Common.Error.Captcha")
            : t("Common.Validation.Message"),
      );
      return false;
    } else {
      setIsFormNotValid(false);
      return true;
    }
  };

  const handleCaptcha = (value: string | null) => {
    setIsCaptchaVerified(!!value);
  };

  const handleCancel = () => {
    resetCaptcha();
    navigate("/login");
    setUserId("");
  };

  if (isSuccess) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <></>;
  }

  return (
    <div className={styles.resetPasswordWrapper}>
      <div className={styles.leftSection}>
        <div className={styles.leftContent}>
          <h1>{t("ResetPassword.Left.Header")}</h1>
          <p>{t("ResetPassword.Left.Description")}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <Stack className={styles.ResetPasswordContainer}>
          <StackItem>
            <h2>{t("ResetPassword.Header")}</h2>
          </StackItem>

          {userId && (
            <StackItem>
              <div
                className={styles.passwordPolicyContainer}
                onClick={() => setShowPasswordPolicy((prev) => !prev)}
              >
                <h4 className={styles.passwordPolicyHeader}>
                  {t("Password.Policy.Header")}{" "}
                  <span>{showPasswordPolicy ? "▲" : "▼"}</span>
                </h4>
                {showPasswordPolicy && (
                  <ul className={styles.passwordPolicyList}>
                    <li>{t("Password.Policy.Char")}</li>
                    <li>{t("Password.Policy.Upper")}</li>
                    <li>{t("Password.Policy.Lower")}</li>
                    <li>{t("Password.Policy.Number")}</li>
                    <li>{t("Password.Policy.SpecChar")}</li>
                  </ul>
                )}
              </div>
            </StackItem>
          )}

          <StackItem>
            <Stack className={styles.fieldContainer}>
              {!userId ? (
                <AppTextBox
                  placeholder={t("Field.Placeholder.Username")}
                  onChange={(e: any) => {
                    setUserName(e.target.value);
                  }}
                />
              ) : (
                <>
                  <AppTextBox
                    placeholder={t("Field.Placeholder.NewPassword")}
                    type="password"
                    error={isFormNotValid && password !== confirmPassword}
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <AppTextBox
                    placeholder={t("Field.Placeholder.ConfirmPassword")}
                    type="password"
                    error={isFormNotValid && password !== confirmPassword}
                    onChange={(e: any) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                  <AppTextBox
                    placeholder={t("Field.Placeholder.VerificationCode")}
                    error={isFormNotValid && !verificationCode}
                    onChange={(e: any) => {
                      setVerificationCode(e.target.value);
                    }}
                  />
                  <StackItem className={styles.resetSendButtonContainer}>
                    <AppButton
                      variant={AppButtonVariants.Outline}
                      onClick={handleResendVerificationCode}
                    >
                      {t("Common.ResendVerificationCodeButtonText")}
                    </AppButton>
                  </StackItem>
                </>
              )}

              {googleCaptchaSiteKey && (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={googleCaptchaSiteKey}
                  onChange={handleCaptcha}
                />
              )}
            </Stack>
          </StackItem>

          <StackItem>
            <Stack className={styles.buttonContainer}>
              <AppButton
                variant={AppButtonVariants.Secondary}
                onClick={handleCancel}
              >
                {t("Common.CancelButtonText")}
              </AppButton>
              {userId ? (
                <AppButton
                  variant={AppButtonVariants.Primary}
                  disabled={!password || !confirmPassword}
                  onClick={handleReset}
                >
                  {t("Common.ResetButtonText")}
                </AppButton>
              ) : (
                <AppButton
                  variant={AppButtonVariants.Primary}
                  disabled={!userName}
                  onClick={handleValidateUser}
                >
                  {t("Common.ValidateUserButtonText")}
                </AppButton>
              )}
            </Stack>
          </StackItem>
        </Stack>
      </div>
    </div>
  );
};

export default WithRouter(ResetPassword);
