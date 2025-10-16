type PagingResponse<T> = PagingBody & {
    data: T[];
    hasPrev: boolean;
    hasNext: boolean;
    isComplteted: boolean;
    totalItem: number
}

type PagingBody = {
    pageIndex: number;
    pageSize: number;
}
type PagingFormatBody = {
    nativePageIndex: number;
    nativePageSize: number;
    serverPageIndex: number;
    serverPageSize: number;
    clientPageIndex: number;
    clientPageSize: number;
    start: number;
    end: number;
}

type SortType = 'increasing version' | 'descending version'
type SortFilterBody = {
    filter: Record<string, any>;
    sort?: SortType
}
type SortFilterFormatBody = {
    hasFilter: boolean;
    hasSort:boolean;
    filters: Record<string, any>;
    sort?: SortType
}

export type { PagingResponse, PagingBody, PagingFormatBody, SortFilterBody, SortType, SortFilterFormatBody }