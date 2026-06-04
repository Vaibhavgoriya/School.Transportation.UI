// import { useRef, useState } from "react";
// import { Stack, IDropdownOption, StackItem } from "@fluentui/react";
// // @ts-ignore: SCSS module typings not present
// import styles from "./RegisterUserForm.module.scss";
// import { IRegisterUserFormProps } from "./IRegisterUserFormProps";
// import UserService from "../../../Services/UserService";
// import { AddNewUser } from "../../../Models/AddNewUser";
// import { toast } from "react-toastify";
// import AppTextBox from "../../Shared/Controls/AppTextBox/AppTextBox";
// import AppDropdown from "../../Shared/Controls/AppDropdown/AppDropdown";
// import AppButton from "../../Shared/Controls/AppButton/AppButton";
// import { AppButtonVariants } from "../../../Constants";
// import React from "react";
// import SharedConfirmationDialog from "../../Shared/Dialogs/SharedConfirmationDialog/SharedConfirmationDialog";
// import { useLoading } from "../../../LoadingContext";
// import { useTranslation } from "react-i18next";

// const roleOptions: IDropdownOption[] = [
//   { key: "Student", text: "Student" },
//   { key: "Parent", text: "Parent" },
//   { key: "Teacher", text: "Teacher" },
//   { key: "Admin", text: "Admin" },
// ];

// const RegisterUserForm: React.FC<IRegisterUserFormProps> = (props) => {
//   const { t } = useTranslation();
//   const userService = useRef(new UserService()).current;

//   /* -------------------- State -------------------- */
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [surname, setSurname] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [role, setRole] = useState("");

//   const [isFormNotValid, setIsFormNotValid] = useState(false);
//   const [showValidationDialog, setShowValidationDialog] = useState(false);
//   const { showLoading, showError, hideLoading } = useLoading();

//   /* -------------------- Handlers -------------------- */

//   const handleRoleChange = (_: any, option?: IDropdownOption) => {
//     if (option) setRole(option.key as string);
//   };

//   const isFormValid = (): boolean => {
//     if (!email || !username || !firstName || !surname || !role) {
//       setIsFormNotValid(true);
//       setShowValidationDialog(true);
//       hideLoading();
//       return false;
//     } else {
//       setIsFormNotValid(false);
//       return true;
//     }
//   };

//   const handleSubmit = async () => {
//     showLoading();

//     if (!isFormValid()) return;

//     const userDetails: AddNewUser = {
//       Email: email,
//       Username: username,
//       DisplayName: displayName,
//       FirstName: firstName,
//       Surname: surname,
//       PhoneNumber: phoneNumber,
//       Role: role,
//     };

//     userService
//       .addNewUserAsync(userDetails)
//       .then((response) => {
//         toast.success(t(response));
//         hideLoading();
//         props.onClose();
//       })
//       .catch((error) => {
//         if (error?.isI18nKey) {
//           showError(t(error.message));
//         } else {
//           showError(error?.message);
//         }
//         toast.error(error);
//         hideLoading();
//       });
//   };

//   return (
//     <div>
//       <Stack tokens={{ childrenGap: 15 }}>
//         <AppTextBox
//           label={t("Field.Email.Header")}
//           required
//           errorMessage={isFormNotValid && !email ? t("Field.Error.Email") : ""}
//           error={isFormNotValid && !email}
//           placeholder={t("Field.Placeholder.Email")}
//           onChange={(e: any) => setEmail(e.target.value)}
//         />
//         <AppTextBox
//           label={t("Field.Username.Header")}
//           required
//           errorMessage={
//             isFormNotValid && !username ? t("Field.Error.Username") : ""
//           }
//           error={isFormNotValid && !username}
//           value={username}
//           placeholder={t("Field.Placeholder.Username")}
//           onChange={(e: any) => setUsername(e.target.value)}
//         />

//         <AppTextBox
//           label={t("Field.DisplayName.Header")}
//           placeholder={t("Field.Placeholder.DisplayName")}
//           value={displayName}
//           onChange={(e: any) => setDisplayName(e.target.value)}
//         />

//         <AppTextBox
//           label={t("Field.FirstName.Header")}
//           required
//           errorMessage={
//             isFormNotValid && !firstName ? t("Field.Error.FirstName") : ""
//           }
//           error={isFormNotValid && !firstName}
//           placeholder={t("Field.Placeholder.FirstName")}
//           value={firstName}
//           onChange={(e: any) => setFirstName(e.target.value)}
//         />

//         <AppTextBox
//           label={t("Field.Surname.Header")}
//           required
//           errorMessage={
//             isFormNotValid && !surname ? t("Field.Error.Surname") : ""
//           }
//           error={isFormNotValid && !surname}
//           placeholder={t("Field.Placeholder.Surname")}
//           value={surname}
//           onChange={(e: any) => setSurname(e.target.value)}
//         />

//         <AppTextBox
//           label={t("Field.PhoneNumber.Header")}
//           placeholder={t("Field.Placeholder.PhoneNumber")}
//           value={phoneNumber}
//           onChange={(e: any) => setPhoneNumber(e.target.value)}
//         />

//         <AppDropdown
//           label={t("Field.Role.Header")}
//           required
//           errorMessage={isFormNotValid && !role ? t("Field.Error.Role") : ""}
//           error={isFormNotValid && !role}
//           placeholder={t("Field.Placeholder.Role")}
//           options={roleOptions}
//           selectedKey={role || undefined}
//           onChange={handleRoleChange}
//         />

//         <StackItem className={styles.buttonContainer}>
//           <Stack
//             horizontal
//             horizontalAlign="center"
//             tokens={{ childrenGap: 20 }}
//           >
//             <StackItem>
//               <AppButton
//                 variant={AppButtonVariants.Secondary}
//                 onClick={props.onClose}
//                 text={t("Common.CancelButtonText")}
//               />
//             </StackItem>

//             <StackItem>
//               <AppButton
//                 variant={AppButtonVariants.Primary}
//                 onClick={handleSubmit}
//                 text={t("Common.RegisterUserButtonText")}
//               />
//             </StackItem>
//           </Stack>
//         </StackItem>
//       </Stack>
//       {isFormNotValid && showValidationDialog && (
//         <SharedConfirmationDialog
//           heading={t("Common.ValidationErrorHeading")}
//           onClose={() => setShowValidationDialog(false)}
//           subText={t("Common.Validation.Message")}
//           primaryButtonText={t("Common.OkButtonText")}
//           onPrimaryButtonSubmit={() => {
//             setShowValidationDialog(false);
//           }}
//           secondaryButtonText=""
//           onSecondaryButtonSubmit={() => {}}
//           isErrorDialog={true}
//         />
//       )}
//     </div>
//   );
// };

// export default RegisterUserForm;


import { useState } from "react";

import {
  Stack,
  IDropdownOption,
  StackItem,
} from "@fluentui/react";

// @ts-ignore
import styles from "./RegisterUserForm.module.scss";

import { IRegisterUserFormProps } from "./IRegisterUserFormProps";

import { toast } from "react-toastify";

import AppTextBox from "../../Shared/Controls/AppTextBox/AppTextBox";

import AppDropdown from "../../Shared/Controls/AppDropdown/AppDropdown";

import AppButton from "../../Shared/Controls/AppButton/AppButton";

import {
  AppButtonVariants,
} from "../../../Constants";

import React from "react";

import SharedConfirmationDialog from "../../Shared/Dialogs/SharedConfirmationDialog/SharedConfirmationDialog";

import { useLoading } from "../../../LoadingContext";

import { useTranslation } from "react-i18next";

const roleOptions: IDropdownOption[] = [
  {
    key: "Student",
    text: "Student",
  },
  {
    key: "Parent",
    text: "Parent",
  },
  {
    key: "Teacher",
    text: "Teacher",
  },
  {
    key: "Admin",
    text: "Admin",
  },
];

const RegisterUserForm: React.FC<
  IRegisterUserFormProps
> = (props) => {

  const { t } = useTranslation();

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [displayName, setDisplayName] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [surname, setSurname] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [role, setRole] =
    useState("");

  const [isFormNotValid, setIsFormNotValid] =
    useState(false);

  const [showValidationDialog, setShowValidationDialog] =
    useState(false);

  const {
    showLoading,
    hideLoading,
  } = useLoading();

  const handleRoleChange = (
    _: any,
    option?: IDropdownOption
  ) => {

    if (option)
      setRole(option.key as string);
  };

  const isFormValid = (): boolean => {

    if (
      !email ||
      !username ||
      !password ||
      !firstName ||
      !surname ||
      !role
    ) {

      setIsFormNotValid(true);

      setShowValidationDialog(true);

      hideLoading();

      return false;
    }

    setIsFormNotValid(false);

    return true;
  };

  const handleSubmit = async () => {

    showLoading();

    if (!isFormValid()) return;

    setTimeout(() => {

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      // Username already exists check
      const existingUser = users.find(
        (user: any) =>
          user.username === username
      );

      if (existingUser) {

        toast.error(
          "Username already exists"
        );

        hideLoading();

        return;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        username,
        password,
        displayName,
        firstName,
        surname,
        phoneNumber,
        role,
      };

      users.push(newUser);

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );

      toast.success(
        "User Registered Successfully"
      );

      hideLoading();

      props.onClose();

    }, 3000); // Loader 3 seconds
  };

  return (
    <div>
      <Stack
        tokens={{
          childrenGap: 15,
        }}
      >

        <AppTextBox
          label={t("Field.Email.Header")}
          required
          errorMessage={
            isFormNotValid && !email
              ? t("Field.Error.Email")
              : ""
          }
          error={
            isFormNotValid && !email
          }
          placeholder={t(
            "Field.Placeholder.Email"
          )}
          value={email}
          onChange={(e: any) =>
            setEmail(e.target.value)
          }
        />

        <AppTextBox
          label={t("Field.Username.Header")}
          required
          errorMessage={
            isFormNotValid && !username
              ? t("Field.Error.Username")
              : ""
          }
          error={
            isFormNotValid && !username
          }
          value={username}
          placeholder={t(
            "Field.Placeholder.Username"
          )}
          onChange={(e: any) =>
            setUsername(e.target.value)
          }
        />

        <AppTextBox
          label="Password"
          required
          type="password"
          errorMessage={
            isFormNotValid && !password
              ? "Password is required"
              : ""
          }
          error={
            isFormNotValid && !password
          }
          value={password}
          placeholder="Enter password"
          onChange={(e: any) =>
            setPassword(e.target.value)
          }
        />

        <AppTextBox
          label={t(
            "Field.DisplayName.Header"
          )}
          placeholder={t(
            "Field.Placeholder.DisplayName"
          )}
          value={displayName}
          onChange={(e: any) =>
            setDisplayName(
              e.target.value
            )
          }
        />

        <AppTextBox
          label={t(
            "Field.FirstName.Header"
          )}
          required
          errorMessage={
            isFormNotValid &&
            !firstName
              ? t(
                  "Field.Error.FirstName"
                )
              : ""
          }
          error={
            isFormNotValid &&
            !firstName
          }
          placeholder={t(
            "Field.Placeholder.FirstName"
          )}
          value={firstName}
          onChange={(e: any) =>
            setFirstName(
              e.target.value
            )
          }
        />

        <AppTextBox
          label={t(
            "Field.Surname.Header"
          )}
          required
          errorMessage={
            isFormNotValid &&
            !surname
              ? t(
                  "Field.Error.Surname"
                )
              : ""
          }
          error={
            isFormNotValid &&
            !surname
          }
          placeholder={t(
            "Field.Placeholder.Surname"
          )}
          value={surname}
          onChange={(e: any) =>
            setSurname(
              e.target.value
            )
          }
        />

        <AppTextBox
          label={t(
            "Field.PhoneNumber.Header"
          )}
          placeholder={t(
            "Field.Placeholder.PhoneNumber"
          )}
          value={phoneNumber}
          onChange={(e: any) =>
            setPhoneNumber(
              e.target.value
            )
          }
        />

        <AppDropdown
          label={t("Field.Role.Header")}
          required
          errorMessage={
            isFormNotValid && !role
              ? t("Field.Error.Role")
              : ""
          }
          error={
            isFormNotValid && !role
          }
          placeholder={t(
            "Field.Placeholder.Role"
          )}
          options={roleOptions}
          selectedKey={
            role || undefined
          }
          onChange={
            handleRoleChange
          }
        />

        <StackItem
          className={
            styles.buttonContainer
          }
        >
          <Stack
            horizontal
            horizontalAlign="center"
            tokens={{
              childrenGap: 20,
            }}
          >

            <StackItem>
              <AppButton
                variant={
                  AppButtonVariants.Secondary
                }
                onClick={
                  props.onClose
                }
                text={t(
                  "Common.CancelButtonText"
                )}
              />
            </StackItem>

            <StackItem>
              <AppButton
                variant={
                  AppButtonVariants.Primary
                }
                onClick={
                  handleSubmit
                }
                text={t(
                  "Common.RegisterUserButtonText"
                )}
              />
            </StackItem>

          </Stack>
        </StackItem>

      </Stack>

      {isFormNotValid &&
        showValidationDialog && (
          <SharedConfirmationDialog
            heading={t(
              "Common.ValidationErrorHeading"
            )}
            onClose={() =>
              setShowValidationDialog(
                false
              )
            }
            subText={t(
              "Common.Validation.Message"
            )}
            primaryButtonText={t(
              "Common.OkButtonText"
            )}
            onPrimaryButtonSubmit={() => {
              setShowValidationDialog(
                false
              );
            }}
            secondaryButtonText=""
            onSecondaryButtonSubmit={() => {}}
            isErrorDialog={true}
          />
        )}
    </div>
  );
};

export default RegisterUserForm;

