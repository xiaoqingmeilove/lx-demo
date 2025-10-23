import React, { useEffect, useMemo, useState } from 'react';
import { Card, Space, Typography } from 'antd';
import SearchForm from '@/components/SearchForm';
import ConfigurableTable from '@/components/ConfigurableTable';
import type { SearchFieldOption } from '@/types/app';
import { useQuotationApi } from '@/services/quotation';
import { useAppContext } from '@/contexts/AppContext';
import { request } from '@/services/request';
import { resolveUrl } from '@/utils/resolveUrl';

const TemplateListPage: React.FC = () => {
  const menuCode = 'template';
  const { userInfo, businessCode } = useAppContext();
  const { getSearchConfig } = useQuotationApi();
  const [searchOptions, setSearchOptions] = useState<SearchFieldOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const fetchSearchOptions = async () => {
      const response = await getSearchConfig(menuCode, { code: 'list' });
      if (response.code === 200 && response.data?.columns) {
        setSearchOptions(response.data.columns);
      }
    };
    fetchSearchOptions();
  }, [getSearchConfig]);

  const tableId = useMemo(
    () => `tb_template_list_${userInfo?.userId ?? 'guest'}`,
    [userInfo?.userId],
  );

  const handleSearch = async (values: Record<string, unknown>) => {
    setFilters(values);
    const api = import.meta.env?.VITE_TEMPLATE_LIST_URL ?? resolveUrl('quotation/template/list');
    setSearching(true);
    try {
      const payload = {
        ...values,
        corpCode: businessCode,
      };
      const response = await request.post(api, payload);
      if (response?.code === 200) {
        const list = response?.data?.records ?? response?.data?.list ?? response?.data ?? [];
        setTableData(Array.isArray(list) ? list : []);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('[TemplateListPage] Failed to load table data', error);
      setTableData([]);
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setFilters({});
    setTableData([]);
  };

  return (
    <Space direction="vertical" size={24} className="configurable-page">
      <Card bordered={false} title="搜索条件">
        <SearchForm options={searchOptions} loading={searching} onSearch={handleSearch} onReset={handleReset} />
      </Card>
      <ConfigurableTable
        menuCode={menuCode}
        tableId={tableId}
        dataSource={tableData}
        rowKey="id"
        loading={searching}
        toolbarExtra={<Typography.Text type="secondary">当前筛选：{JSON.stringify(filters)}</Typography.Text>}
      />
    </Space>
  );
};

export default TemplateListPage;
