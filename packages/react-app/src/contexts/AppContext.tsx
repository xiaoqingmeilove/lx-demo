import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import type { MenuItem, UserInfo } from '@/types/app';
import { findMenuByCode as findMenuByCodeUtil, findMenuByPath, normalizeMenus } from '@/utils/menu';
import { requestEvents, setAuthToken } from '@/services/request';

type AppContextState = {
  menus: MenuItem[];
  userInfo: UserInfo | null;
  businessCode: string;
};

type AppContextValue = AppContextState & {
  setMenus: (menus: MenuItem[]) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setBusinessCode: (code: string) => void;
  findMenuByCode: (menuCode: string) => MenuItem | undefined;
  findMenuByPath: (path: string) => MenuItem | undefined;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const defaultState: AppContextState = {
  menus: [],
  userInfo: null,
  businessCode: 'LX',
};

interface AppProviderProps {
  initialMenus?: MenuItem[];
  initialUser?: UserInfo | null;
  initialBusinessCode?: string;
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  initialMenus,
  initialUser,
  initialBusinessCode,
  children,
}) => {
  const [menus, setMenus] = useState<MenuItem[]>(() => normalizeMenus(initialMenus ?? []));
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(initialUser ?? null);
  const [businessCode, setBusinessCode] = useState(initialBusinessCode ?? defaultState.businessCode);

  useEffect(() => {
    setMenus(normalizeMenus(initialMenus ?? []));
  }, [initialMenus]);

  useEffect(() => {
    setUserInfoState(initialUser ?? null);
  }, [initialUser]);

  useEffect(() => {
    setBusinessCode(initialBusinessCode ?? defaultState.businessCode);
  }, [initialBusinessCode]);

  useEffect(() => {
    setAuthToken(userInfo?.token ?? null);
  }, [userInfo?.token]);

  const setUserInfo = useCallback(
    (info: UserInfo | null) => {
      setUserInfoState(info);
      setAuthToken(info?.token ?? null);
    },
    [],
  );

  const logout = useCallback(() => {
    setUserInfo(null);
    message.error('登录状态已过期，请重新登录');
  }, [setUserInfo]);

  useEffect(() => {
    const offUnauthorized = requestEvents.on('unauthorized', logout);
    const offDocumentDeleted = requestEvents.on('document-deleted', (payload) => {
      Modal.error({
        title: '单据已不存在',
        content: typeof payload === 'object' ? JSON.stringify(payload) : String(payload ?? ''),
      });
    });
    return () => {
      offUnauthorized?.();
      offDocumentDeleted?.();
    };
  }, [logout]);

  const findMenuByCode = useCallback(
    (menuCode: string) => findMenuByCodeUtil(menus, menuCode),
    [menus],
  );

  const findMenuByPathValue = useCallback(
    (path: string) => findMenuByPath(menus, path),
    [menus],
  );

  const value: AppContextValue = useMemo(
    () => ({
      menus,
      userInfo,
      businessCode,
      setMenus,
      setUserInfo,
      setBusinessCode,
      findMenuByCode,
      findMenuByPath: findMenuByPathValue,
      logout,
    }),
    [menus, userInfo, businessCode, setUserInfo, logout, findMenuByCode, findMenuByPathValue],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
