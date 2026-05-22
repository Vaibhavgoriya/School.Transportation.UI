import React, { useState } from "react";
import { ILayoutProps } from "./ILayoutProps";
import { Stack, StackItem } from "@fluentui/react";
// @ts-ignore: CSS module may be missing in some environments/builds
import styles from "./Layout.module.scss";
import TopNav from "./TopNav/TopNav";
import LeftNav from "./LeftNav/LeftNav";
import { LoadingContext } from "../../LoadingContext";
import SharedLoader from "../Shared/SharedLoader/SharedLoader";
import SharedErrorDialog from "../Shared/SharedErrorDialog/SharedErrorDialog";

const Layout: React.FC<
  ILayoutProps & { isLoading: boolean; isError: boolean; errorMessage: string }
> = (props) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      {/* {props.includeMenus ? ( */}
      <Stack className={styles.layoutContainer}>
        {props.showTopNav && (
          <Stack className={styles.topNavContainer}>
            <TopNav onMenuToggle={() => setIsNavOpen(!isNavOpen)} isAuthorized={props.isAuthorized} />
          </Stack>
        )}
        <Stack className={styles.bodySection}>
          {/* Left Navigation */}
          {props.showLeftNav && (
            <StackItem
              className={`${styles.leftNavWrapper} ${isNavOpen ? styles.open : ""}`}
            >
              <LeftNav />
            </StackItem>
          )}

          {/* Page Body */}
          <StackItem
            className={
              props.showLeftNav
                ? styles.bodyContainer
                : styles.fullBodyContainer
            }
          >
            {props.children}
          </StackItem>

          {/* Mobile Overlay */}
          {isNavOpen && (
            <div
              className={styles.mobileOverlay}
              onClick={() => setIsNavOpen(false)}
            />
          )}
        </Stack>
      </Stack>
      {/* ) : (
        <>{props.children}</>
      )} */}
      {props.isLoading && <SharedLoader />}
      {props.isError && props.errorMessage && (
        <SharedErrorDialog errorMessage={props.errorMessage} />
      )}
    </>
  );
};

export default function LayoutWithLoading(props: ILayoutProps) {
  return (
    <LoadingContext.Consumer>
      {(context) => {
        if (!context) return null;
        return (
          <Layout
            {...props}
            isLoading={context.isLoading}
            isError={context.isError}
            errorMessage={context.errorMessage}
          />
        );
      }}
    </LoadingContext.Consumer>
  );
}
