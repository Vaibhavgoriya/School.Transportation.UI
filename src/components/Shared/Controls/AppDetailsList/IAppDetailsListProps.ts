import { IColumn, IDetailsListProps, SelectionMode } from "@fluentui/react";
import { IAppPaginationProps } from "./AppPagination/IAppPaginationProps";

export interface IAppDetailsListProps {
  items: any[];
  columns: IColumn[];
  mobileColumns: string[]; // column keys that should remain visible on mobile
  breakpoint?: number;
  selectionMode?: SelectionMode;
  getRowId: (item: any) => string | number;
  detailsListProps?: Partial<IDetailsListProps>;

  pagination?: IAppPaginationProps;
}
