export interface UserInfo {
  userId: string;
  name: string;
  corpCode: string;
  token?: string;
}

export interface MenuItem {
  menuId: string;
  title: string;
  path: string;
  icon?: string;
  menuCode?: string;
  children?: MenuItem[];
}

export interface ColumnConfig {
  title: string;
  dataIndex: string;
  key?: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean;
  params?: Record<string, unknown>;
  renderType?: string;
  visible?: boolean;
}

export interface SearchFieldOption {
  label: string;
  field: string;
  type: string;
  defaultValue?: unknown;
  placeholder?: string;
  rules?: Record<string, unknown>;
  options?: { label: string; value: string | number }[];
  params?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  data?: T;
}
