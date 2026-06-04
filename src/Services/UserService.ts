// import { AddNewUser } from "../Models/AddNewUser";
// import { OrganizationDetails } from "../Models/OrganizationDetails";
// import { GetAllUserDetails } from "../Models/ResponseModels/GetAllUserDetails";
// import BaseService from "./BaseService";

// export default class UserService extends BaseService {
//   public getCurrentUserRolename(email: string): Promise<string> {
//     return this.handleApiResponse<string>(
//       this.get<string>(
//         `${this.serviceConstants.GetUserRoleByEmailAsync}?email=${email}`,
//       ),
//     );
//   }

//   public getOrganizationDetailsAsync(): Promise<OrganizationDetails> {
//     return this.handleApiResponse<OrganizationDetails>(
//       this.get<OrganizationDetails>(
//         `${this.serviceConstants.GetOrganizationBySolutionUrlAsync}?solutionUrl=${window.location.origin}`,
//       ),
//     );
//   }

//   public initiatePasswordResetVerificationAsync(
//     userId: string,
//     organizationId: string,
//   ): Promise<string> {
//     return this.handleApiResponse<string>(
//       this.post<string>(
//         this.serviceConstants.InitiatePasswordResetVerificationAsync,
//         {
//           UserId: userId,
//           OrganizationId: organizationId,
//         },
//       ),
//     );
//   }

//   public validateUserByEmailAsync(
//     email: string,
//     organizationId: string,
//   ): Promise<string> {
//     return this.handleApiResponse<{ id: string }>(
//       this.post<{ id: string }>(
//         this.serviceConstants.ValidateUserByEmailAsync,
//         {
//           Email: email,
//           OrganizationId: organizationId,
//         },
//       ),
//     ).then((res) => res.id);
//   }

//   public resetUserPassword(
//     userId: string,
//     password: string,
//     verificationCode: string,
//   ): Promise<string> {
//     return this.handleApiResponse<string>(
//       this.post<string>(this.serviceConstants.PasswordResetAsync, {
//         UserId: userId,
//         Password: password,
//         VerificationCode: verificationCode,
//       }),
//     );
//   }

//   public addNewUserAsync(newUserDetails: AddNewUser): Promise<string> {
//     return this.handleApiResponse<string>(
//       this.post<string>(this.serviceConstants.AddUserAsync, newUserDetails),
//     );
//   }

//   public approveUserAsync(emailAddress: string): Promise<string> {
//     return this.handleApiResponse<string>(
//       this.post<string>(this.serviceConstants.ApproveUserAsync, {
//         Email: emailAddress,
//       }),
//     );
//   }

//   public deleteUserAsync(emailAddress: string): Promise<string> {
//     return this.handleApiResponse<string>(
//       this.post<string>(this.serviceConstants.DeleteUserAsync, {
//         Email: emailAddress,
//       }),
//     );
//   }

//   public getAllUsersAsync(): Promise<GetAllUserDetails[]> {
//     return this.handleApiResponse<GetAllUserDetails[]>(
//       this.post<GetAllUserDetails[]>(
//         this.serviceConstants.GetAllUsersAsync,
//         {},
//       ),
//     ).then((result) =>
//       result.map((item) => Object.assign(new GetAllUserDetails(), item)),
//     );
//   }
// }


// import { AddNewUser } from "../Models/AddNewUser";
// import { GetAllUserDetails } from "../Models/ResponseModels/GetAllUserDetails";

// export default class UserService {

//   public getCurrentUserRolename(email: string): Promise<string> {

//     return new Promise((resolve, reject) => {

//       const users = JSON.parse(
//         localStorage.getItem("users") || "[]"
//       );

//       const foundUser = users.find(
//         (user: any) => user.email === email
//       );

//       if (foundUser) {
//         resolve(foundUser.role);
//       } else {
//         reject("User not found");
//       }
//     });
//   }

//   public addNewUserAsync(
//     newUserDetails: AddNewUser
//   ): Promise<string> {

//     return new Promise((resolve, reject) => {

//       const users = JSON.parse(
//         localStorage.getItem("users") || "[]"
//       );

//       const alreadyExists = users.find(
//         (user: any) =>
//           user.email === newUserDetails.Email
//       );

//       if (alreadyExists) {

//         reject({
//           message: "User already exists",
//           isI18nKey: false,
//         });

//         return;
//       }

//       const newUser = {
//         id: Date.now().toString(),
//         email: newUserDetails.Email,
//         username: newUserDetails.Username,
//         password: "123456",
//         displayName: newUserDetails.DisplayName,
//         firstName: newUserDetails.FirstName,
//         surname: newUserDetails.Surname,
//         phoneNumber: newUserDetails.PhoneNumber,
//         role: newUserDetails.Role,
//       };

//       users.push(newUser);

//       localStorage.setItem(
//         "users",
//         JSON.stringify(users)
//       );

//       resolve("User Registered Successfully");
//     });
//   }

//   public getAllUsersAsync(): Promise<GetAllUserDetails[]> {

//     return new Promise((resolve) => {

//       const users = JSON.parse(
//         localStorage.getItem("users") || "[]"
//       );

//       resolve(users);
//     });
//   }

//   public deleteUserAsync(
//     emailAddress: string
//   ): Promise<string> {

//     return new Promise((resolve) => {

//       const users = JSON.parse(
//         localStorage.getItem("users") || "[]"
//       );

//       const updatedUsers = users.filter(
//         (user: any) =>
//           user.email !== emailAddress
//       );

//       localStorage.setItem(
//         "users",
//         JSON.stringify(updatedUsers)
//       );

//       resolve("User Deleted Successfully");
//     });
//   }

//   public approveUserAsync(
//     emailAddress: string
//   ): Promise<string> {

//     return Promise.resolve(
//       "User Approved Successfully"
//     );
//   }

//   public getOrganizationDetailsAsync(): Promise<any> {

//     return Promise.resolve({
//       organizationName: "School Transportation",
//     });
//   }

//   public initiatePasswordResetVerificationAsync(
//     userId: string,
//     organizationId: string,
//   ): Promise<string> {

//     return Promise.resolve("Verification Sent");
//   }

//   public validateUserByEmailAsync(
//     email: string,
//     organizationId: string,
//   ): Promise<string> {

//     return Promise.resolve("validated-user-id");
//   }

//   public resetUserPassword(
//     userId: string,
//     password: string,
//     verificationCode: string,
//   ): Promise<string> {

//     return Promise.resolve("Password Reset Successfully");
//   }
// }



import { AddNewUser } from "../Models/AddNewUser";
import { GetAllUserDetails } from "../Models/ResponseModels/GetAllUserDetails";

export default class UserService {

  public getCurrentUserRolename(email: string): Promise<string> {

    return new Promise((resolve, reject) => {

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const foundUser = users.find(
        (user: any) => user.email === email
      );

      if (foundUser) {
        resolve(foundUser.role);
      } else {
        reject("User not found");
      }
    });
  }

  public addNewUserAsync(
    newUserDetails: AddNewUser
  ): Promise<string> {

    return new Promise((resolve, reject) => {

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const alreadyExists = users.find(
        (user: any) =>
          user.email === newUserDetails.Email
      );

      if (alreadyExists) {

        reject({
          message: "User already exists",
          isI18nKey: false,
        });

        return;
      }

      const newUser = {

        id: Date.now().toString(),

        email: newUserDetails.Email,

        username: newUserDetails.Username,

        password: "123456",

        displayName: newUserDetails.DisplayName,

        firstName: newUserDetails.FirstName,

        surname: newUserDetails.Surname,

        phoneNumber: newUserDetails.PhoneNumber,

        role: newUserDetails.Role || "Student",

        isActive: true,

        isApproved: true,
      };

      users.push(newUser);

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );

      resolve("User Registered Successfully");
    });
  }

  public getAllUsersAsync(): Promise<GetAllUserDetails[]> {

    return new Promise((resolve) => {

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      resolve(users);
    });
  }

  public deleteUserAsync(
    emailAddress: string
  ): Promise<string> {

    return new Promise((resolve) => {

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const updatedUsers = users.filter(
        (user: any) =>
          user.email !== emailAddress
      );

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      resolve("User Deleted Successfully");
    });
  }

  public approveUserAsync(
    emailAddress: string
  ): Promise<string> {

    return Promise.resolve(
      "User Approved Successfully"
    );
  }

  public getOrganizationDetailsAsync(): Promise<any> {

    return Promise.resolve({

      id: "1",

      organizationName: "School Transportation",

      solutionUrl: window.location.origin,

      isActive: true,

      isDeleted: false,

      createdDate: new Date().toISOString(),
    });
  }

  public initiatePasswordResetVerificationAsync(
    userId: string,
    organizationId: string,
  ): Promise<string> {

    return Promise.resolve("Verification Sent");
  }

  public validateUserByEmailAsync(
    email: string,
    organizationId: string,
  ): Promise<string> {

    return Promise.resolve("validated-user-id");
  }

  public resetUserPassword(
    userId: string,
    password: string,
    verificationCode: string,
  ): Promise<string> {

    return Promise.resolve("Password Reset Successfully");
  }
}