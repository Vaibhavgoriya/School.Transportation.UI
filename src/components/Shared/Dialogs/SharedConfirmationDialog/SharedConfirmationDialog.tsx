/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Label, Stack, StackItem } from "@fluentui/react";
import styles from "./SharedConfirmationDialog.module.scss";
import { ISharedConfirmationDialogProps } from "./ISharedConfirmationDialogProps";
import { AppButtonVariants } from "../../../../Constants";
import AppButton from "../../Controls/AppButton/AppButton";

const SharedConfirmationDialog: React.FC<ISharedConfirmationDialogProps> = (
  props,
) => {
  return (
    <Dialog
      hidden={false}
      onDismiss={() => {
        props.onClose();
      }}
      dialogContentProps={{
        title: "",
        showCloseButton: false,
      }}
      modalProps={{
        isBlocking: false,
        styles: {
          main: {
            border: props.isErrorDialog
              ? "1px solid var(--color-error)"
              : "1px solid var(--color-primary)",
            borderRadius: "10px",
          },
        },
      }}
      styles={{
        root: {
          selectors: {
            ".ms-Dialog-title": { display: "none" },
            ".ms-Dialog-main": { maxWidth: 450 },
          },
        },
        main: { paddingTop: 20 },
      }}
    >
      <Stack horizontalAlign="center" gap={20}>
        <StackItem className={styles.headingContainer}>
          <Label
            className={[
              styles.heading,
              "caps",
              props.isErrorDialog ? styles.errorHeading : "",
            ].join(" ")}
          >
            {props.heading}
          </Label>
        </StackItem>
        <StackItem>
          <Label className={styles.dialogText}>{props.subText}</Label>
        </StackItem>
        <StackItem>
          <Stack
            horizontal
            horizontalAlign="center"
            tokens={{ childrenGap: 20 }}
          >
            {props.secondaryButtonText && (
              <StackItem>
                <AppButton
                  variant={AppButtonVariants.Secondary}
                  onClick={props.onSecondaryButtonSubmit}
                  text={props.secondaryButtonText}
                />
              </StackItem>
            )}
            {props.primaryButtonText && (
              <StackItem>
                <AppButton
                  variant={
                    props.isErrorDialog
                      ? AppButtonVariants.Danger
                      : AppButtonVariants.Primary
                  }
                  onClick={props.onPrimaryButtonSubmit}
                  text={props.primaryButtonText}
                />
              </StackItem>
            )}
          </Stack>
        </StackItem>
      </Stack>
    </Dialog>
  );
};
export default SharedConfirmationDialog;
