import React, { useState } from "react";
import { TextField, Stack, StackItem } from "@fluentui/react";
import styles from "./AppTextBox.module.scss";
import { IAppTextBoxProps } from "./IAppTextBoxProps";

const AppTextBox: React.FC<IAppTextBoxProps> = ({
  label,
  required,
  error,
  errorMessage,
  ...textFieldProps
}) => {
  const [focused, setFocused] = useState(false);
  const isInValid = !!(error || errorMessage);

  return (
    <Stack className={styles.root}>
      {label && (
        <StackItem className={styles.labelRow}>
          {label}
          {required && <span className={styles.mandatory}>*</span>}
        </StackItem>
      )}

      <StackItem
        className={`${styles.fieldWrap} ${focused ? styles.focused : ""}`}
      >
        <TextField
          {...textFieldProps}
          borderless
          className={isInValid ? styles.errorInput : ""}
          onFocus={(e) => {
            setFocused(true);
            textFieldProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            textFieldProps.onBlur?.(e);
          }}
        />

        <span
          className={`${styles.underline} ${error ? styles.errorLine : ""}`}
        />
      </StackItem>

      {isInValid && (
        <StackItem className={styles.errorText}>
          {errorMessage}
        </StackItem>
      )}
    </Stack>
  );
};

export default AppTextBox;
