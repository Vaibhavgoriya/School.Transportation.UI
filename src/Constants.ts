export const DefaultLanguage: string = "en-US";

export class RoutePaths {
  public static Root: string = "/";

  public static Login: string = "/login";
  public static AnyPage: string = "/*";
  public static ResetPassword: string = "/resetPassword/:userId?";

  public static AllUsers: string = "/users";
}

export class UserRoles {
  public static TransportCoordinator = "TransportCoordinator";
  public static Admin = "Admin";
  public static Driver = "Driver";
  public static Student = "Student";
  public static Dispatcher = "Dispatcher";
  public static Finance = "Finance";
  public static Manager = "Manager";
  public static ITSupport = "ITSupport";
  public static SuperAdmin = "SuperAdmin";
  public static Teacher = "Teacher";
  public static Receptionist = "Receptionist";
  public static Parent = "Parent";
}

export enum AppButtonVariants {
  Primary = "primary",
  Secondary = "secondary",
  Accent = "accent",
  Outline = "outline",
  Ghost = "ghost",
  Success = "success",
  Danger = "danger",
  Link = "link",
}

export enum PopupModalSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export class APPSettingsName {
  public static GoogleCaptchaSiteKey = "Google:CaptchaSiteKey";
}

//#region Session/Local Storage Names
export const SessionStorage_RequestedPage: string = "RequestedPage";
export const LocalStorage_Lanaguage: string = "AGA-language";
//#endregion
