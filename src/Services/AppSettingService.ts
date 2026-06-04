// import BaseService from "./BaseService";

// export default class AppSettingService extends BaseService {
//   public getAppSetting(secret: string): Promise<string | null> {
//     return this.handleApiResponse<string>(
//       this.get<string>(
//         `${this.serviceConstants.GetAppSettingValueAsync}?secret=${secret}`,
//       ),
//     );
//   }
// }

// export default class AppSettingService {

//   public getAppSetting(
//     secret: string
//   ): Promise<string | null> {

//     return Promise.resolve(null);
//   }
// }

export default class AppSettingService {

  public getAppSetting(
    secret: string
  ): Promise<string | null> {

    return Promise.resolve(null);
  }
}