import React, { useEffect, useMemo, useState, useCallback } from 'react';
import AmisRenderer from '@/components/AmisRenderer';
import { useAppStore, type DictItem } from '@/store';
import { fetchDictionaries } from '@/services/dictionary';
import { fetchSupplierInviteConfig, type SupplierInviteConfig } from '@/services/supplierInvite';
import { buildSupplierInviteSchema, type StatusOption } from './schemaBuilder';

const MENU_CODE = 'supplier_invitedSupplier';
const DICT_CODES = ['supplier_invite_status', 'supplier_auth_status', 'businessCode'];

const FALLBACK_CONFIG: SupplierInviteConfig = {
  tableColumns: [],
  smsColumns: [],
  searchOptions: []
};

function toStatusOptions(list: DictItem[] | undefined): StatusOption[] {
  return (list ?? []).map((item) => ({
    label: item.dictLabel,
    value: item.dictValue,
    color: item.color ?? item.remark
  }));
}

const SupplierInvitePage: React.FC = () => {
  const { userInfo, dict, businessCode, setDict } = useAppStore();
  const [config, setConfig] = useState<SupplierInviteConfig>(FALLBACK_CONFIG);
  const [dictCache, setDictCache] = useState<Record<string, DictItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dictResponse, configResponse] = await Promise.all([
        fetchDictionaries(DICT_CODES).catch(() => ({})),
        fetchSupplierInviteConfig(MENU_CODE, businessCode).catch(() => FALLBACK_CONFIG)
      ]);

      const businessCodeItems = (dictResponse as Record<string, DictItem[]>).businessCode ?? [];
      const latestBusinessCode = businessCodeItems[0]?.dictValue ?? businessCode;

      const sanitizedDict = Object.fromEntries(
        Object.entries(dictResponse ?? {}).filter(([key]) => key !== 'businessCode')
      );

      if (Object.keys(sanitizedDict).length > 0) {
        setDict(sanitizedDict, latestBusinessCode);
        setDictCache(sanitizedDict);
      }

      setConfig(configResponse ?? FALLBACK_CONFIG);
    } catch (err) {
      const message = err instanceof Error ? err.message : '数据加载失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [businessCode, setDict]);

  useEffect(() => {
    void loadResources();
  }, [loadResources, retryKey]);

  const dictionary = useMemo(() => {
    if (Object.keys(dict).length > 0) {
      return dict;
    }
    return dictCache;
  }, [dict, dictCache]);

  const schema = useMemo(() => {
    const inviteStatus = toStatusOptions(dictionary['supplier_invite_status']);
    const authStatus = toStatusOptions(dictionary['supplier_auth_status']);

    return buildSupplierInviteSchema({
      menuCode: MENU_CODE,
      userInfo,
      tableColumns: config.tableColumns,
      smsColumns: config.smsColumns,
      searchOptions: config.searchOptions,
      inviteStatus,
      authStatus
    });
  }, [dictionary, userInfo, config]);

  if (loading) {
    return <div className="page-loading">正在加载供应商邀请页面...</div>;
  }

  if (error) {
    return (
      <div className="page-error">
        <p>加载失败：{error}</p>
        <button type="button" onClick={() => setRetryKey((key) => key + 1)}>
          重试
        </button>
      </div>
    );
  }

  return <AmisRenderer schema={schema} />;
};

export default SupplierInvitePage;
