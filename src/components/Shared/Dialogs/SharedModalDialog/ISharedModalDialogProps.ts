import { PopupModalSize } from "../../../../Constants";

export interface ISharedModalDialogProps {
  titleId: string;
  isOpen: boolean;
  onDismiss: () => void;
  isBlocking: boolean;
  size?: PopupModalSize;
  childComponent?: React.ReactNode;
  modalHeader: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryButtonSubmit: () => void;
  onSecondaryButtonSubmit: () => void;
}
