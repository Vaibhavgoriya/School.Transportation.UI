// import axios, { AxiosError, AxiosInstance } from "axios";
// import ServiceConstants from "./ServiceConstants";
// import { ApiResponse } from "../Models/ApiResponse";
// import AuthSessionManager from "../Utils/AuthSessionManager";

// export default class BaseService {
//   private axiosInstance: AxiosInstance;
//   public serviceConstants: ServiceConstants;

//   constructor() {
//     this.serviceConstants = new ServiceConstants();
//     let token = sessionStorage.getItem(
//       this.serviceConstants.SessionStorageAuthenticationTokenKey,
//     );

//     this.axiosInstance = axios.create({
//       baseURL: import.meta.env.VITE_API_URL,
//       timeout: 70000,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     });
//   }

//   protected post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
//     return new Promise((resolve, reject) => {
//       this.axiosInstance
//         .post(endpoint, data)
//         .then((response) => resolve(response.data))
//         .catch((error) => reject(this.parseAxiosError(error)));
//     });
//   }

//   protected get<T>(endpoint: string): Promise<ApiResponse<T>> {
//     return new Promise((resolve, reject) => {
//       this.axiosInstance
//         .get(endpoint)
//         .then((response) => resolve(response.data))
//         .catch((error) => reject(this.parseAxiosError(error)));
//     });
//   }

//   protected handleApiResponse<T>(apiCall: Promise<ApiResponse<T>>): Promise<T> {
//     return new Promise<T>((resolve, reject) => {
//       apiCall
//         .then((response) => {
//           if (response?.success) {
//             resolve(response.data);
//           } else {
//             // reject an object instead of string
//             reject({
//               message: response?.message || "API Error",
//               isI18nKey: response?.isI18nKey || false,
//             });
//           }
//         })
//         .catch((error) => {
//           reject(this.parseAxiosError(error));
//         });
//     });
//   }

//   private parseAxiosError(error: AxiosError | any): {
//     message: string;
//     isI18nKey: boolean;
//   } {
//     if (error?.response?.status === 401) {
//        AuthSessionManager.clearSession();
//     }

//     if (error?.response) {
//       const data = error.response.data;
//       if (data) {
//         return {
//           message: data?.message || `Error ${error.response.status}`,
//           isI18nKey: data?.isI18nKey || false,
//         };
//       }
//       return { message: `Error ${error.response.status}`, isI18nKey: false };
//     }

//     if (error?.message) {
//       return { message: error.message, isI18nKey: error?.isI18nKey || false };
//     }

//     return {
//       message: "Network error or no response received.",
//       isI18nKey: false,
//     };
//   }
// }


// import ServiceConstants from "./ServiceConstants";

// export default class BaseService {

//   public serviceConstants: ServiceConstants;

//   constructor() {

//     this.serviceConstants =
//       new ServiceConstants();
//   }

//   protected post<T>(
//     endpoint: string,
//     data?: any
//   ): Promise<T> {

//     return Promise.resolve(data);
//   }

//   protected get<T>(
//     endpoint: string
//   ): Promise<T> {

//     return Promise.resolve([] as T);
//   }

//   protected handleApiResponse<T>(
//     apiCall: Promise<T>
//   ): Promise<T> {

//     return apiCall;
//   }
// }




import ServiceConstants from "./ServiceConstants";

export default class BaseService {

  public serviceConstants: ServiceConstants;

  constructor() {

    this.serviceConstants =
      new ServiceConstants();
  }

  protected post<T>(
    endpoint: string,
    data?: any
  ): Promise<T> {

    return Promise.resolve(data);
  }

  protected get<T>(
    endpoint: string
  ): Promise<T> {

    return Promise.resolve([] as T);
  }

  protected handleApiResponse<T>(
    apiCall: Promise<T>
  ): Promise<T> {

    return apiCall;
  }
}