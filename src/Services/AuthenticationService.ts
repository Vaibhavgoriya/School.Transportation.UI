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


import { UserDetails } from "../Models/UserDetails";

export default class AuthenticationService {

  public authenticateAndGetCurrentUserDetails(
    email: string,
    password: string,
    organizationId: string,
  ): Promise<UserDetails> {

    return new Promise((resolve, reject) => {

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const foundUser = users.find(
        (user: any) =>
          user.email === email &&
          user.password === password
      );

      if (foundUser) {

        localStorage.setItem(
          "currentUser",
          JSON.stringify(foundUser)
        );

        resolve(foundUser);

      } else {

        reject({
          message: "Invalid Email or Password",
          isI18nKey: false,
        });

      }
    });
  }
}
