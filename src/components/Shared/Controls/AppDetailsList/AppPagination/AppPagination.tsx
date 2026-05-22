import * as React from "react";
import { Stack, StackItem, IconButton } from "@fluentui/react";
import { IAppPaginationProps } from "./IAppPaginationProps";
import AppDropdown from "../../AppDropdown/AppDropdown";
import styles from "./AppPagination.module.scss";

const AppPagination: React.FC<IAppPaginationProps> = ({
  enabled = true,
  pageNumber,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showFirstLast = true,
  allowShowAll = true,
}: IAppPaginationProps) => {
  const isShowAll = totalItems > 0 && pageSize >= totalItems;
  const totalPages = isShowAll
    ? 1
    : Math.max(1, Math.ceil(totalItems / pageSize));

  if (!enabled) return null;

  const startItem = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(pageNumber * pageSize, totalItems);

  const dropdownOptions = [
    ...pageSizeOptions
      .filter((x) => x < totalItems)
      .map((x) => ({
        key: x,
        text: `${x} / page`,
      })),
    ...(allowShowAll && totalItems > 0
      ? [{ key: "all", text: "Show All" }]
      : []),
  ];

  const pageNumberOptions = Array.from({ length: totalPages }, (_, index) => ({
    key: index + 1,
    text: `Page ${index + 1} of ${totalPages}`,
  }));

  return (
    <Stack
      horizontal
      wrap
      verticalAlign="center"
      horizontalAlign="space-between"
      className={styles.paginationContainer}
      tokens={{ childrenGap: 16 }}
    >
      <StackItem className={styles.paginationLeft}>
        <span>
          {totalItems === 0
            ? "Showing 0 of 0"
            : `Showing ${startItem} - ${endItem} of ${totalItems}`}
        </span>
      </StackItem>

      {!isShowAll && (
        <StackItem className={styles.paginationControls}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
            {showFirstLast && (
              <IconButton
                iconProps={{ iconName: "DoubleChevronLeft" }}
                disabled={pageNumber === 1}
                onClick={() => onPageChange?.(1)}
              />
            )}

            <IconButton
              iconProps={{ iconName: "ChevronLeft" }}
              disabled={pageNumber === 1}
              onClick={() => onPageChange?.(pageNumber - 1)}
            />

            <div className={styles.pageNumber}>
              <AppDropdown
                selectedKey={pageNumber}
                options={pageNumberOptions}
                onChange={(_, option) => {
                  if (!option) return;
                  onPageChange?.(Number(option.key));
                }}
              />
            </div>

            <IconButton
              iconProps={{ iconName: "ChevronRight" }}
              disabled={pageNumber === totalPages}
              onClick={() => onPageChange?.(pageNumber + 1)}
            />

            {showFirstLast && (
              <IconButton
                iconProps={{ iconName: "DoubleChevronRight" }}
                disabled={pageNumber === totalPages}
                onClick={() => onPageChange?.(totalPages)}
              />
            )}
          </Stack>
        </StackItem>
      )}

      <StackItem className={styles.paginationRight}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <span className={styles.pageSizeLabel}>Rows:</span>
          <div className={styles.dropdownWrapper}>
            <AppDropdown
              selectedKey={
                pageSize >= totalItems && totalItems > 0 ? "all" : pageSize
              }
              options={dropdownOptions}
              onChange={(_, option) => {
                if (!option) return;

                if (option.key === "all") {
                  onPageSizeChange?.(totalItems);
                  return;
                }

                onPageSizeChange?.(Number(option.key));
              }}
            />
          </div>
        </Stack>
      </StackItem>
    </Stack>
  );
};

export default AppPagination;
