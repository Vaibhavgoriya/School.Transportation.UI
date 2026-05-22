import { useState, useEffect } from "react";
import {
  DetailsList,
  IDetailsRowProps,
  DetailsRow,
  SelectionMode,
  IconButton,
} from "@fluentui/react";
import { IAppDetailsListProps } from "./IAppDetailsListProps";
// @ts-ignore
import styles from "./AppDetailsList.module.scss";
import AppPagination from "./AppPagination/AppPagination";

const AppDetailsList: React.FC<IAppDetailsListProps> = ({
  items,
  columns,
  mobileColumns,
  breakpoint = 768,
  selectionMode = SelectionMode.none,
  getRowId,
  detailsListProps,
  pagination,
}: IAppDetailsListProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const primaryColumns = columns.filter((col) =>
    mobileColumns.includes(col.key),
  );

  const extraColumns = columns.filter(
    (col) => !mobileColumns.includes(col.key),
  );

  const finalColumns = isMobile
    ? [
        {
          key: "__expand",
          name: "",
          minWidth: 40,
          maxWidth: 40,
          onRender: (item: any) => {
            const id = getRowId(item);
            return (
              <IconButton
                iconProps={{
                  iconName: expandedRows.includes(id)
                    ? "ChevronDown"
                    : "ChevronRight",
                }}
                onClick={() => toggleRow(id)}
              />
            );
          },
        },
        ...primaryColumns,
      ]
    : columns;

  const onRenderRow = (props?: IDetailsRowProps) => {
    if (!props) return null;

    const item = props.item as any;
    const id = getRowId(item);
    const isExpanded = expandedRows.includes(id);

    return (
      <>
        <DetailsRow {...props} />
        {isMobile && isExpanded && (
          <div className={styles.expandSection}>
            {extraColumns.map((col) => (
              <>
                <strong>{col.name}</strong>
                <span>
                  {col.onRender
                    ? col.onRender(item)
                    : item[col.fieldName as keyof any]}
                </span>
              </>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.appDetailsList}>
      <DetailsList
        items={items}
        columns={finalColumns}
        selectionMode={selectionMode}
        onRenderRow={onRenderRow}
        {...detailsListProps}
      />
      {pagination && <AppPagination {...pagination} />}
    </div>
  );
};

export default AppDetailsList;
