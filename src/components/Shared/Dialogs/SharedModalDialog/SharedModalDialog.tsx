import React from "react";
import { Modal } from "@fluentui/react/lib/Modal";
// @ts-ignore: SCSS module typings not present
import styles from "./SharedModalDialog.module.scss";
import { ISharedModalDialogProps } from "./ISharedModalDialogProps";
import { Label, Stack, StackItem } from "@fluentui/react";
import { AppButtonVariants, PopupModalSize } from "../../../../Constants";
import AppButton from "../../Controls/AppButton/AppButton";

/* map enum -> scss class */
const sizeClassMap: Record<PopupModalSize, string> = {
  [PopupModalSize.Small]: styles.small,
  [PopupModalSize.Medium]: styles.medium,
  [PopupModalSize.Large]: styles.large,
};

const SharedModalDialog: React.FC<ISharedModalDialogProps> = (props) => {
  const sizeClass = sizeClassMap[props.size ?? PopupModalSize.Medium];

  const containerClass = `${styles.modalRoot} ${sizeClass}`;

  return (
    <>
      <Modal
        titleAriaId={props.titleId}
        isOpen={props.isOpen}
        onDismiss={props.onDismiss}
        isBlocking={props.isBlocking}
        containerClassName={containerClass}
      >
        <Stack
          horizontalAlign="center"
          className={styles.modalContainer}
          gap={20}
        >
          <StackItem className={styles.headingContainer}>
            <Label className={[styles.heading, "caps"].join(" ")}>
              {props.modalHeader}
            </Label>
          </StackItem>
          <StackItem className={styles.childContainer}>
            {props.childComponent}
          </StackItem>
          <StackItem className={styles.buttonContainer}>
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
                    variant={AppButtonVariants.Primary}
                    onClick={props.onPrimaryButtonSubmit}
                    text={props.primaryButtonText}
                  />
                </StackItem>
              )}
            </Stack>
          </StackItem>
        </Stack>
      </Modal>
    </>
  );
};

export default SharedModalDialog;
