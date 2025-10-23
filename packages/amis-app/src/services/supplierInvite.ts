import { httpClient } from './http';

export interface ColumnConfig {
  field: string;
  title: string;
  width?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  type?: string;
  params?: Record<string, unknown>;
}

export interface SearchOption {
  label: string;
  field: string;
  type: string;
  source?: string;
  options?: Array<{ label: string; value: string | number }>;
  fields?: [string, string];
  isDefault?: boolean;
}

interface ColumnsConfigResponse {
  list?: { columns?: ColumnConfig[] };
  smsList?: { columns?: ColumnConfig[] };
}

interface SearchConfigResponse {
  columns?: SearchOption[];
}

export interface SupplierInviteConfig {
  tableColumns: ColumnConfig[];
  smsColumns: ColumnConfig[];
  searchOptions: SearchOption[];
}

export async function fetchSupplierInviteConfig(
  menuCode: string,
  corpCode?: string
): Promise<SupplierInviteConfig> {
  const [{ data: columnsData }, { data: searchData }] = await Promise.all([
    httpClient.get<ColumnsConfigResponse>('/button/columns-config/getInfos', {
      params: {
        code: 'list,smsList',
        menuCode,
        corpCode
      }
    }),
    httpClient.get<SearchConfigResponse>('/button/columns-config/getInfo', {
      params: {
        code: 'search',
        menuCode,
        corpCode
      }
    })
  ]);

  return {
    tableColumns: columnsData?.list?.columns ?? [],
    smsColumns: columnsData?.smsList?.columns ?? [],
    searchOptions: searchData?.columns ?? []
  };
}
