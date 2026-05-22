import { IDropdownProps } from "@fluentui/react";

export interface IAppDropdownProps extends Omit<
  IDropdownProps,
  "label" | "errorMessage"
> {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
}
