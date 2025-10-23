import { useCallback } from 'react';
import { request } from './request';
import { resolveUrl } from '@/utils/resolveUrl';
import type { ApiResponse, ColumnConfig, SearchFieldOption } from '@/types/app';
import { useAppContext } from '@/contexts/AppContext';

interface ColumnsResponse {
  columns: ColumnConfig[];
}

interface SearchResponse {
  columns: SearchFieldOption[];
}

const URLs = {
  columns: resolveUrl('button/columns-config/getInfo'),
  columnsMulti: resolveUrl('button/columns-config/getInfos'),
  search: resolveUrl('button/columns-config/getInfo'),
  buttons: resolveUrl('button/button-control/getWebButton'),
};

export const useQuotationApi = () => {
  const { findMenuByCode, businessCode } = useAppContext();

  const withMenu = useCallback(
    (menuCode: string) => {
      const menu = findMenuByCode(menuCode);
      return menu?.menuId;
    },
    [findMenuByCode],
  );

  const getColumnsConfig = useCallback(
    async (menuCode: string, params: Record<string, unknown> = {}) => {
      const menuId = withMenu(menuCode);
      const response = (await request.get<ApiResponse<ColumnsResponse>>(URLs.columns, {
        params: {
          ...params,
          corpCode: params?.corpCode ?? businessCode,
          menuId,
          configType: 'table',
        },
      })) as ApiResponse<ColumnsResponse>;
      return response;
    },
    [businessCode, withMenu],
  );

  const getSearchConfig = useCallback(
    async (menuCode: string, params: Record<string, unknown> = {}) => {
      const menuId = withMenu(menuCode);
      const response = (await request.get<ApiResponse<SearchResponse>>(URLs.search, {
        params: {
          ...params,
          corpCode: params?.corpCode ?? businessCode,
          menuId,
          configType: 'search',
        },
      })) as ApiResponse<SearchResponse>;
      return response;
    },
    [businessCode, withMenu],
  );

  const getDetailButtons = useCallback(
    async (menuCode: string, payload: Record<string, unknown> = {}) => {
      const menuId = withMenu(menuCode);
      const response = await request.post(URLs.buttons, {
        ...payload,
        menuId,
      });
      return response;
    },
    [withMenu],
  );

  return { getColumnsConfig, getSearchConfig, getDetailButtons };
};
