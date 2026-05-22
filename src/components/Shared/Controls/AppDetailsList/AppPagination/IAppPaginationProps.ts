export interface IAppPaginationProps {
  enabled?: boolean;

  pageNumber: number;
  pageSize: number;
  totalItems: number;

  pageSizeOptions?: number[];

  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  showFirstLast?: boolean;
  allowShowAll?: boolean;
}
