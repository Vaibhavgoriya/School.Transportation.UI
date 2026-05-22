import React, { useState } from "react";
import { Dropdown, Stack, StackItem } from "@fluentui/react";
import styles from "./AppDropdown.module.scss";
import { IAppDropdownProps } from "./IAppDropdownProps";

const AppDropdown: React.FC<IAppDropdownProps> = ({
  label,
  required,
  error,
  errorMessage,
  ...dropdownProps
}) => {
  const [focused, setFocused] = useState(false);
  const isInValid = !!(error && errorMessage);

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
        <Dropdown
          {...dropdownProps}
          className={isInValid ? styles.errorInput : ""}
          onFocus={(e) => {
            setFocused(true);
            dropdownProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            dropdownProps.onBlur?.(e);
          }}
        />

        <span
          className={`${styles.underline} ${error ? styles.errorLine : ""}`}
        />
      </StackItem>

      {isInValid && (
        <StackItem className={styles.errorText}>{errorMessage}</StackItem>
      )}
    </Stack>
  );
};

export default AppDropdown;
