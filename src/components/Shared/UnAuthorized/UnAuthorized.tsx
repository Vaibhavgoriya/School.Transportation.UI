/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, StackItem, Label, Image } from "@fluentui/react";
import styles from "./UnAuthorized.module.scss";
import { useTranslation } from "react-i18next";
function UnAuthorized() {
  const { t } = useTranslation();
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      className={styles.container}
    >
      <StackItem>
        <Stack
          gap={20}
          horizontalAlign="center"
          verticalAlign="center"
          className={styles.innerContainer}
        >
          <StackItem className={styles.logoBigimage}>
            <Image
              src="/assets/images/School_Logo.png"
              alt="App Logo"
            />
          </StackItem>
          <StackItem className={styles.labelContainer}>
            <Label className={styles.label}>{t("Header.Title")}</Label>
          </StackItem>
          <StackItem>
            <Label className={styles.labelError}>
              {t("Common.Unauthorized")}
            </Label>
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
}
export default UnAuthorized;
