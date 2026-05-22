/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // Spinner,
  Stack,
  StackItem,
  Image,
  // SpinnerSize,
  Label,
  Dialog,
  ResponsiveMode,
} from "@fluentui/react";
import styles from "./SharedLoader.module.scss";
import { useLoading } from "../../../LoadingContext";

const SharedLoader: React.FC = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <Dialog
      hidden={false}
      // onDismiss={() => {
      //   props.onClose();
      // }}
      dialogContentProps={{
        title: "",
        showCloseButton: false,
      }}
      modalProps={{
        isBlocking: true,
        styles: { main: { border: "3px solid var(--color-primary)" } },
      }}
      styles={{
        root: { selectors: { ".ms-Dialog-title": { display: "none" } } },
        main: { padding: 20, borderRadius: 16 },
      }}
      // minWidth={"850px"}
      responsiveMode={ResponsiveMode.small}
    >
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
          <Image
            src="/assets/images/School_Logo.png"
            className={styles.logoBigimage}
          />
          <Label className={styles.label}>SCHOOL TRANSPORTATION</Label>
          <Image
            src="/assets/images/loader.gif"
            className={styles.loaderImage}
          />
        </Stack>
      </StackItem>
    </Stack>
    </Dialog>
  );
};

export default SharedLoader;
