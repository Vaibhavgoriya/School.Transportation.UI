import React from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import styles from "./AppButton.module.scss";
import { IAppButtonProps } from "./IAppButtonProps";
import { AppButtonVariants } from "../../../../Constants";

const AppButton: React.FC<IAppButtonProps> = ({
  variant = AppButtonVariants.Primary,
  className,
  fullWidth,
  ...props
}) => {
  const combinedClassName = `
    ${styles.button}
    ${styles[variant]}
    ${fullWidth ? styles.fullWidth : ""}
    ${className || ""}
  `;

  switch (variant) {
    case AppButtonVariants.Primary:
      return <PrimaryButton {...props} className={combinedClassName} />;

    case AppButtonVariants.Link:
      return <DefaultButton {...props} className={combinedClassName} />;

    default:
      return <DefaultButton {...props} className={combinedClassName} />;
  }
};

export default AppButton;
