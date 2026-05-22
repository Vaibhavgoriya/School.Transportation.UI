import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducers";
import { MessageBar, MessageBarType, Stack, StackItem } from "@fluentui/react";
import { useTranslation } from "react-i18next";

interface OrganizationGuardProps {
  children: React.ReactNode;
}

const OrganizationGuard: React.FC<OrganizationGuardProps> = ({ children }) => {
  const organizationDetail = useSelector(
    (state: RootState) => state.store.organizationDetails
  );
  const organizationLoaded = useSelector(
    (state: RootState) => state.store.organizationLoaded
  );

  const { t } = useTranslation();

  if (!organizationLoaded) {
    return null;
  }

  if (!organizationDetail?.isActive) {
    return (
      <>
        <Stack verticalAlign="center">
          <StackItem>
            <MessageBar messageBarType={MessageBarType.blocked} isMultiline>
              <b>{t("Organization.Message.InActive")}</b>
            </MessageBar>
          </StackItem>
        </Stack>
      </>
    );
  }

  return <>{children}</>;
};

export default OrganizationGuard;
