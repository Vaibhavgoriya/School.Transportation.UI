// LeftNav.tsx
import React from "react";
import { Stack, StackItem } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import styles from "./LeftNav.module.scss";
import { AppButtonVariants } from "../../../Constants";
import AppButton from "../../Shared/Controls/AppButton/AppButton";

const menuItems = [
  { title: "Live Map", icon: "MapPin", isActive: true },
  { title: "Routes", icon: "MapLayers", isActive: false },
  { title: "Students", icon: "People", isActive: false },
  { title: "Reports", icon: "ReportDocument", isActive: false },
  { title: "Settings", icon: "Settings", isActive: false },
];

const LeftNav: React.FC = () => {
  return (
    <Stack className={styles.leftNavContainer}>
      {menuItems.map((item) => (
        <StackItem
          key={item.title}
          className={`${styles.navItem} ${item.isActive ? styles.active : ""}`}
        >
          <Icon iconName={item.icon} className={styles.navIcon} />
          <span className={styles.navText}>{item.title}</span>
        </StackItem>
      ))}
      <StackItem className={styles.addButtonWrapper}>
        <AppButton
          variant={AppButtonVariants.Primary}
          text="Add New Item"
          // iconProps={{ iconName: "Add" }}
          fullWidth
          onClick={() => {
            console.log("Add new item");
          }}
        />
      </StackItem>
    </Stack>
  );
};

export default LeftNav;
