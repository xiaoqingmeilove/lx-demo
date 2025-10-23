import { useCallback, useSyncExternalStore } from 'react';

export interface DictItem {
  dictLabel: string;
  dictValue: string;
  remark?: string;
  color?: string;
}

export interface UserInfo {
  userId?: string | number;
  [key: string]: unknown;
}

interface AppState {
  userInfo: UserInfo | null;
  dict: Record<string, DictItem[]>;
  businessCode: string;
}

interface AppStore extends AppState {
  setUserInfo: (userInfo: UserInfo | null) => void;
  setDict: (dict: Record<string, DictItem[]>, businessCode?: string) => void;
}

const DEFAULT_BUSINESS_CODE = 'LX';

let state: AppState = {
  userInfo: null,
  dict: {},
  businessCode: DEFAULT_BUSINESS_CODE
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppState {
  return state;
}

function setState(partial: Partial<AppState>) {
  state = { ...state, ...partial };
  emitChange();
}

export function useAppStore(): AppStore {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  const setUserInfo = useCallback((userInfo: UserInfo | null) => {
    setState({ userInfo });
  }, []);

  const setDict = useCallback((dict: Record<string, DictItem[]>, businessCode?: string) => {
    setState({
      dict,
      businessCode: businessCode ?? state.businessCode
    });
  }, []);

  return {
    ...snapshot,
    setUserInfo,
    setDict
  };
}

export function getDictOptions(dict: Record<string, DictItem[]>, code: string): DictItem[] {
  return dict[code] ?? [];
}
