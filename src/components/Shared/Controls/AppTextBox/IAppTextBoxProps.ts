import { ITextFieldProps } from "@fluentui/react";

export interface IAppTextBoxProps
  extends Omit<ITextFieldProps, "errorMessage" | "label"> {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
}
