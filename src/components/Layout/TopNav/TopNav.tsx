import React, { useEffect, useRef, useState } from "react";
import { Image, Stack } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import styles from "./TopNav.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducers";
import { ITopNavProps } from "./ITopNavProps";
import AuthSessionManager from "../../../Utils/AuthSessionManager";
import { useTranslation } from "react-i18next";

const TopNav: React.FC<ITopNavProps> = ({ onMenuToggle, isAuthorized }) => {
  const userDetail = useSelector(
    (state: RootState) => state.store.currentUserDetails,
  );

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const signOutClick = () => {
    AuthSessionManager.clearSession();
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Stack className={styles.topNavContainer}>
      {/* Left */}
      <div className={styles.leftSection}>
        {isAuthorized && (
          <Icon
            iconName="GlobalNavButton"
            className={styles.menuIcon}
            onClick={onMenuToggle}
          />
        )}
      </div>

      {/* Center */}

      <div className={styles.centerSection}>
        {isAuthorized && (
          <div className={styles.logoWrapper}>
            <Image
              src="/assets/images/School_Logo.png"
              alt="App Logo"
              className={styles.logoImage}
            />
            <div className={styles.logoText}>{t("Header.Title")}</div>
          </div>
        )}
      </div>

      {/* Right */}
      <div ref={profileRef} className={styles.rightSection}>
        <div
          className={styles.profile}
          onClick={() => setProfileOpen((prev) => !prev)}
        >
          <div className={styles.avatar}>
            {userDetail?.displayName?.charAt(0) || "U"}
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {userDetail?.displayName || "User"}
            </div>
            <div className={styles.userRole}>{userDetail?.role || "Admin"}</div>
          </div>

          <Icon iconName="ChevronDown" className={styles.chevron} />
        </div>

        {profileOpen && (
          <div className={styles.profileDropdown}>
            <div className={styles.dropdownItem} onClick={signOutClick}>
              <Icon iconName="SignOut" />
              <span>Sign Out</span>
            </div>
          </div>
        )}
      </div>
    </Stack>
  );
};

export default TopNav;
