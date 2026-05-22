// export default class ServiceConstants {
//   //#region School Authentication
//   public AuthenticateAsync: string = "SchoolAuthentication/AuthenticateAsync";
//   //#endregion

//   //#region Languages
//   public GetLanguagesAsync: string = "Languages/GetLanguagesAsync";
//   public GetLanguagesTranslationsAsync: string =
//     "Languages/GetLanguagesTranslationsAsync";
//   //#endregion

//   //#region School User
//   public InitiatePasswordResetVerificationAsync: string =
//     "SchoolUser/InitiatePasswordResetVerificationAsync";
//   public ValidateUserByEmailAsync: string =
//     "SchoolUser/ValidateUserByEmailAsync";
//   public PasswordResetAsync: string = "SchoolUser/PasswordResetAsync";
//   public GetUserRoleByEmailAsync: string = "SchoolUser/GetUserRoleByEmailAsync";
//   public GetOrganizationBySolutionUrlAsync: string =
//     "SchoolUser/GetOrganizationBySolutionUrlAsync";
//   public AddUserAsync: string = "SchoolUser/AddUserAsync";
//   public ApproveUserAsync: string = "SchoolUser/ApproveUserAsync";
//   public DeleteUserAsync: string = "SchoolUser/DeleteUserAsync";
//   public GetAllUsersAsync: string = "SchoolUser/GetAllUsersAsync";
//   //#endregion

//   //#region App Settings
//   public GetAppSettingValueAsync: string =
//     "SchoolAppSetting/GetAppSettingValueAsync";
//   //#endregion

//   public SessionStorageAuthenticationTokenKey: string = "School-Transportaion";
//   public LocalStorageCacheName: string = "School-Transportation-UserDetails";
// }

export default class ServiceConstants {

  //#region School Authentication
  public AuthenticateAsync: string =
    "SchoolAuthentication/AuthenticateAsync";
  //#endregion

  //#region Languages
  public GetLanguagesAsync: string =
    "Languages/GetLanguagesAsync";

  public GetLanguagesTranslationsAsync: string =
    "Languages/GetLanguagesTranslationsAsync";
  //#endregion

  //#region School User
  public InitiatePasswordResetVerificationAsync: string =
    "SchoolUser/InitiatePasswordResetVerificationAsync";

  public ValidateUserByEmailAsync: string =
    "SchoolUser/ValidateUserByEmailAsync";

  public PasswordResetAsync: string =
    "SchoolUser/PasswordResetAsync";

  public GetUserRoleByEmailAsync: string =
    "SchoolUser/GetUserRoleByEmailAsync";

  public GetOrganizationBySolutionUrlAsync: string =
    "SchoolUser/GetOrganizationBySolutionUrlAsync";

  public AddUserAsync: string =
    "SchoolUser/AddUserAsync";

  public ApproveUserAsync: string =
    "SchoolUser/ApproveUserAsync";

  public DeleteUserAsync: string =
    "SchoolUser/DeleteUserAsync";

  public GetAllUsersAsync: string =
    "SchoolUser/GetAllUsersAsync";
  //#endregion

  //#region App Settings
  public GetAppSettingValueAsync: string =
    "SchoolAppSetting/GetAppSettingValueAsync";
  //#endregion

  public SessionStorageAuthenticationTokenKey: string =
    "School-Transportaion";

  public LocalStorageCacheName: string =
    "School-Transportation-UserDetails";
}