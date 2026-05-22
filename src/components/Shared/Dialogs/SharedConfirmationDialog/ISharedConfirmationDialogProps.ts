export interface ISharedConfirmationDialogProps {
    heading: string;
    subText: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    isErrorDialog?: boolean;
    onClose: () => void;
    onPrimaryButtonSubmit: () => void;
    onSecondaryButtonSubmit: () => void;
}
  