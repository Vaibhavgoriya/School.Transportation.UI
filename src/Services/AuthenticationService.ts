// import { UserDetails } from "../Models/UserDetails";
// import BaseService from "./BaseService";

// export default class AuthenticationService extends BaseService {
//   public authenticateAndGetCurrentUserDetails(
//     email: string,
//     password: string,
//     organizationId: string,
//   ): Promise<UserDetails> {
//     return this.handleApiResponse<UserDetails>(
//       this.post<UserDetails>(this.serviceConstants.AuthenticateAsync, {
//         Email: email,
//         Password: password,
//         OrganizationId: organizationId,
//       }),
//     );
//   }
// }


// import { UserDetails } from "../Models/UserDetails";

// export default class AuthenticationService {

//   public authenticateAndGetCurrentUserDetails(
//     email: string,
//     password: string,
//     organizationId: string,
//   ): Promise<UserDetails> {

//     return new Promise((resolve, reject) => {

//       const users = JSON.parse(
//         localStorage.getItem("users") || "[]"
//       );

//       const foundUser = users.find(
//         (user: any) =>
//           user.email === email &&
//           user.password === password
//       );

//       if (foundUser) {

//         localStorage.setItem(
//           "currentUser",
//           JSON.stringify(foundUser)
//         );

//         resolve(foundUser);

//       } else {

//         reject({
//           message: "Invalid Email or Password",
//           isI18nKey: false,
//         });

//       }
//     });
//   }
// }



// import { UserDetails } from "../Models/UserDetails";
// import BaseService from "./BaseService";

// export default class AuthenticationService extends BaseService {
//   public authenticateAndGetCurrentUserDetails(
//     email: string,
//     password: string,
//     organizationId: string,
//   ): Promise<UserDetails> {
//     return new Promise((resolve, reject) => {
//       try {
//         const users = JSON.parse(
//           localStorage.getItem("users") || "[]",
//         );

//         const matchedUser = users.find(
//           (user: any) =>
//             (
//               user.email?.toLowerCase() === email.toLowerCase() ||
//               user.username?.toLowerCase() === email.toLowerCase()
//             ) &&
//             user.password === password,
//         );

//         if (!matchedUser) {
//           reject({
//             message: "Invalid Email or Password",
//             isI18nKey: false,
//           });

//           return;
//         }

//         const userDetails: any = {
//           id: matchedUser.id,
//           email: matchedUser.email,
//           username: matchedUser.username,
//           displayName:
//             matchedUser.displayName ||
//             matchedUser.firstName,
//           firstName: matchedUser.firstName,
//           surname: matchedUser.surname,
//           phoneNumber: matchedUser.phoneNumber,
//           role: matchedUser.role,

//           token: "local-auth-token",

//           tokenExpiry: new Date(
//             Date.now() + 24 * 60 * 60 * 1000,
//           ).toISOString(),
//         };

//         localStorage.setItem(
//           this.serviceConstants.LocalStorageCacheName,
//           JSON.stringify(userDetails),
//         );

//         sessionStorage.setItem(
//           this.serviceConstants.SessionStorageAuthenticationTokenKey,
//           "local-auth-token",
//         );

//         resolve(userDetails);
//       } catch (error) {
//         reject({
//           message: "Login Failed",
//           isI18nKey: false,
//         });
//       }
//     });
//   }
// }



// import { UserDetails } from "../Models/UserDetails";
// import BaseService from "./BaseService";

// export default class AuthenticationService extends BaseService {

//   public authenticateAndGetCurrentUserDetails(
//     email: string,
//     password: string,
//     organizationId: string,
//   ): Promise<UserDetails> {

//     return new Promise((resolve, reject) => {

//       try {

//         const users = JSON.parse(
//           localStorage.getItem("users") || "[]",
//         );

//         const matchedUser = users.find(
//           (user: any) =>
//             (
//               user.email?.toLowerCase() === email.toLowerCase() ||
//               user.username?.toLowerCase() === email.toLowerCase()
//             ) &&
//             user.password === password,
//         );

//         if (!matchedUser) {

//           reject({
//             message: "Invalid Email or Password",
//             isI18nKey: false,
//           });

//           return;
//         }

//         // =========================
//         // ROLE BASED USER DETAILS
//         // =========================

//         const userDetails: any = {
//           id: matchedUser.id,

//           email: matchedUser.email,

//           username: matchedUser.username,

//           displayName:
//             matchedUser.displayName ||
//             matchedUser.firstName ||
//             matchedUser.username,

//           firstName: matchedUser.firstName,

//           surname: matchedUser.surname,

//           phoneNumber: matchedUser.phoneNumber,

//           role: matchedUser.role || "Student",

//           // IMPORTANT
//           isActive: true,

//           isApproved: true,

//           token: "local-auth-token",

//           tokenExpiry: new Date(
//             Date.now() + 24 * 60 * 60 * 1000,
//           ).toISOString(),
//         };

//         // =========================
//         // SAVE LOGIN SESSION
//         // =========================

//         localStorage.setItem(
//           this.serviceConstants.LocalStorageCacheName,
//           JSON.stringify(userDetails),
//         );

//         sessionStorage.setItem(
//           this.serviceConstants.SessionStorageAuthenticationTokenKey,
//           "local-auth-token",
//         );

//         resolve(userDetails);

//       } catch (error) {

//         reject({
//           message: "Login Failed",
//           isI18nKey: false,
//         });

//       }
//     });
//   }
// }



import { UserDetails } from "../Models/UserDetails";
import BaseService from "./BaseService";

export default class AuthenticationService extends BaseService {

  public authenticateAndGetCurrentUserDetails(
    email: string,
    password: string,
    organizationId: string,
  ): Promise<UserDetails> {

    return new Promise((resolve, reject) => {

      try {

        const users = JSON.parse(
          localStorage.getItem("users") || "[]",
        );

        const matchedUser = users.find(
          (user: any) =>
            (
              user.email?.toLowerCase() === email.toLowerCase() ||
              user.username?.toLowerCase() === email.toLowerCase()
            ) &&
            user.password === password,
        );

        if (!matchedUser) {

          reject({
            message: "Invalid Email or Password",
            isI18nKey: false,
          });

          return;
        }

        const userDetails: any = {

          id: matchedUser.id,

          email: matchedUser.email,

          username: matchedUser.username,

          displayName:
            matchedUser.displayName ||
            matchedUser.firstName ||
            matchedUser.username,

          firstName: matchedUser.firstName,

          surname: matchedUser.surname,

          phoneNumber: matchedUser.phoneNumber,

          role: matchedUser.role || "Student",

          isActive: true,

          isApproved: true,

          token: "local-auth-token",

          tokenExpiry: new Date(
            Date.now() + 24 * 60 * 60 * 1000,
          ).toISOString(),
        };

        localStorage.setItem(
          this.serviceConstants.LocalStorageCacheName,
          JSON.stringify(userDetails),
        );

        sessionStorage.setItem(
          this.serviceConstants.SessionStorageAuthenticationTokenKey,
          "local-auth-token",
        );

        resolve(userDetails);

      } catch (error) {

        reject({
          message: "Login Failed",
          isI18nKey: false,
        });

      }
    });
  }
}
