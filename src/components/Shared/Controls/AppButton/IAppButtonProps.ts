import { IButtonProps } from "@fluentui/react";
import { AppButtonVariants } from "../../../../Constants";

export interface IAppButtonProps extends IButtonProps {
  variant?: AppButtonVariants;
  fullWidth?: boolean;
}
