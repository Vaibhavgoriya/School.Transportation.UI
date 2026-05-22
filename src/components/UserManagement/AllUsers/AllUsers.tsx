import { useEffect, useState } from "react";
import { IColumn, Label, Stack } from "@fluentui/react";
// @ts-ignore: SCSS module typings not present
import styles from "./AllUsers.module.scss";
import { IAllUsersProps } from "./IAllUsersProps";
import UserService from "../../../Services/UserService";
import { toast } from "react-toastify";
import { GetAllUserDetails } from "../../../Models/ResponseModels/GetAllUserDetails";
import { useLoading } from "../../../LoadingContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducers";
import { useTranslation } from "react-i18next";
import SharedConfirmationDialog from "../../Shared/Dialogs/SharedConfirmationDialog/SharedConfirmationDialog";
import AppDetailsList from "../../Shared/Controls/AppDetailsList/AppDetailsList";
import { AppButtonVariants } from "../../../Constants";
import AppButton from "../../Shared/Controls/AppButton/AppButton";

const AllUsers: React.FC<IAllUsersProps> = () => {
  const userService = new UserService();

  const { isLoading, showLoading, hideLoading, showError } = useLoading();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [userToDelete, setUserToDelete] = useState<
    GetAllUserDetails | undefined
  >(undefined);
  const [users, setUsers] = useState<GetAllUserDetails[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const userDetail = useSelector(
    (state: RootState) => state.store.currentUserDetails,
  );

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "displayName",
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
    },
    { key: "email", name: "Email", fieldName: "email", minWidth: 150, isResizable: true },
    { key: "username", name: "UserName", fieldName: "username", minWidth: 120 },
    { key: "rolename", name: "Role", fieldName: "roleName", minWidth: 150 },
    { key: "status", name: "Status", fieldName: "status", minWidth: 150 },
    {
      key: "createdAt",
      name: "Created At",
      fieldName: "createdAt",
      minWidth: 150,
      onRender: (item: GetAllUserDetails) => {
        if (!item.createdAt) return "-";

        return new Date(item.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: 160,
      onRender: (item: GetAllUserDetails) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          {item.status === "Pending Approval" && !isLoading && (
            <>
              <AppButton
                variant={AppButtonVariants.Outline}
                iconProps={{ iconName: "Cancel" }}
                title="Reject"
                ariaLabel="Reject"
                className={styles.gridBtn}
              />

              <AppButton
                variant={AppButtonVariants.Success} // better semantic than Accent
                iconProps={{ iconName: "CheckMark" }}
                title="Approve"
                ariaLabel="Approve"
                onClick={() => handleApprove(item)}
                className={styles.gridBtn}
              />
            </>
          )}

          {item.roleName !== "Admin" && (
            <AppButton
              variant={AppButtonVariants.Danger}
              iconProps={{ iconName: "Delete" }}
              title="Delete"
              ariaLabel="Delete"
              onClick={() => {
                setShowDeleteConfirmationModal(true);
                setUserToDelete(item);
              }}
              className={styles.gridBtn}
            />
          )}
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    if (userDetail?.id) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail?.id]);

  const loadUsers = () => {
    showLoading();
    userService.getAllUsersAsync().then((res: GetAllUserDetails[]) => {
      setUsers(res);
      hideLoading();
    });
  };

  const handleApprove = (user: GetAllUserDetails) => {
    showLoading();
    userService
      .approveUserAsync(user.email)
      .then((res: string) => {
        toast.success(res);
        loadUsers();
        hideLoading();
      })
      .catch((error) => {
        if (error?.isI18nKey) {
          showError(t(error.message));
        } else {
          showError(error?.message);
        }
        hideLoading();
      });
  };

  const handleDelete = () => {
    showLoading();

    if (!userToDelete) {
      hideLoading();
      return;
    }

    userService
      .deleteUserAsync(userToDelete?.email)
      .then(() => {
        setShowDeleteConfirmationModal(false);
        setUserToDelete(undefined);
        hideLoading();
        toast.error(`Deleted user: ${userToDelete.displayName}`);
        loadUsers();
      })
      .catch((error) => {
        setShowDeleteConfirmationModal(false);
        if (error?.isI18nKey) {
          showError(t(error.message));
        } else {
          showError(error?.message);
        }
        hideLoading();
      });
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      {showDeleteConfirmationModal && userToDelete && (
        <SharedConfirmationDialog
          heading={"Confirm Delete"}
          subText={"Are you sure you want to delete this user?"}
          onClose={() => setShowDeleteConfirmationModal(false)}
          onPrimaryButtonSubmit={handleDelete}
          onSecondaryButtonSubmit={() => setShowDeleteConfirmationModal(false)}
          primaryButtonText={"Delete"}
          secondaryButtonText={"Cancel"}
        />
      )}

      <div className={styles.allUsersContainer}>
        <Label className={styles.title}>{t("AllUsers.MainHeader")}</Label>

        <AppDetailsList
          columns={columns}
          items={users}
          getRowId={(user) => user.id}
          mobileColumns={["name", "actions"]}
          pagination={{
            enabled: true,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalItems: 200,
            onPageChange: (page) => {
              setPageNumber(page);
              // loadUsers(page, pageSize);
            },
            onPageSizeChange: (size) => {
              setPageSize(size);
              setPageNumber(1);
              // loadUsers(1, size);
            },
          }}
        />
      </div>
    </>
  );
};

export default AllUsers;
