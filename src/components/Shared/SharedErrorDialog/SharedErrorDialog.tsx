/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { useLoading } from "../../../LoadingContext";
import { ISharedErrorDialogProps } from "./ISharedErrorDialogProps";
import SharedConfirmationDialog from "../Dialogs/SharedConfirmationDialog/SharedConfirmationDialog";

function AGAErrorDialog(props: ISharedErrorDialogProps) {
  const { t } = useTranslation();
  const { hideError } = useLoading();
  return (
    <SharedConfirmationDialog
      heading={t("Common.ErrorHeader")}
      isErrorDialog={true}
      onClose={hideError}
      onPrimaryButtonSubmit={hideError}
      onSecondaryButtonSubmit={() => {}}
      primaryButtonText={t("Common.OkButtonText")}
      secondaryButtonText=""
      subText={props.errorMessage}
    />
  );
}
export default AGAErrorDialog;
