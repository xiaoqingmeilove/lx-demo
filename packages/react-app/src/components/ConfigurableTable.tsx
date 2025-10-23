import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import XEUtils from 'xe-utils';
import ColumnSettingsDrawer from './ColumnSettingsDrawer';
import { useQuotationApi } from '@/services/quotation';
import type { ColumnConfig } from '@/types/app';
import { useColumnsStorage } from '@/hooks/useColumnsStorage';

interface ConfigurableTableProps<RecordType extends object = Record<string, unknown>> {
  menuCode: string;
  tableId: string;
  dataSource: RecordType[];
  rowKey?: string;
  loading?: boolean;
  pagination?: TableProps<RecordType>['pagination'];
  toolbarExtra?: React.ReactNode;
}

const mapColumnToAntd = (column: any): ColumnConfig => ({
  title: column.title,
  dataIndex: column.field ?? column.dataIndex,
  key: column.field ?? column.key ?? column.title,
  align: column.align,
  width: column.width,
  fixed: column.fixed,
  sorter: column.sortable ?? column.sorter ?? false,
  params: column.params,
  renderType: column.cellType ?? column.renderType,
  visible: column.visible !== false,
});

const formatValue = (value: unknown, column: ColumnConfig) => {
  const digits = column.params?.displayDigits;
  if (digits !== undefined && value !== null && value !== undefined && value !== '') {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return XEUtils.toFixed(num, Number(digits));
    }
  }
  return value;
};

const ConfigurableTable = <RecordType extends object>({
  menuCode,
  tableId,
  dataSource,
  rowKey = 'id',
  loading,
  pagination,
  toolbarExtra,
}: ConfigurableTableProps<RecordType>) => {
  const { getColumnsConfig } = useQuotationApi();
  const [rawColumns, setRawColumns] = useState<ColumnConfig[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const { columns, visibleColumns, updateColumns } = useColumnsStorage(tableId, rawColumns);

  useEffect(() => {
    const fetchColumns = async () => {
      setInitializing(true);
      try {
        const response = await getColumnsConfig(menuCode, { code: 'list' });
        if (response.code === 200 && response.data?.columns) {
          const mapped = response.data.columns.map((column: any) => mapColumnToAntd(column));
          setRawColumns(mapped);
        }
      } finally {
        setInitializing(false);
      }
    };
    fetchColumns();
  }, [getColumnsConfig, menuCode]);

  const antdColumns = useMemo(() => {
    return visibleColumns.map((column) => ({
      title: column.title,
      dataIndex: column.dataIndex,
      key: column.key,
      align: column.align,
      width: column.width,
      fixed: column.fixed as any,
      sorter: column.sorter,
      render: (value: unknown) => formatValue(value, column),
    }));
  }, [visibleColumns]);

  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  const handleApplyColumns = (nextColumns: ColumnConfig[]) => {
    updateColumns(nextColumns);
  };

  const handleResetColumns = () => {
    updateColumns(rawColumns.map((column) => ({ ...column, visible: true })));
  };

  return (
    <Card
      className="configurable-page__table-card"
      bordered={false}
      title="模板一览表"
      extra={
        <div className="table-toolbar__actions">
          <Tooltip title="恢复默认列">
            <Button icon={<ReloadOutlined />} onClick={handleResetColumns} disabled={rawColumns.length === 0} />
          </Tooltip>
          <Tooltip title="列设置">
            <Button icon={<SettingOutlined />} onClick={handleOpenSettings} />
          </Tooltip>
          {toolbarExtra}
        </div>
      }
    >
      <Table<RecordType>
        rowKey={rowKey as string}
        columns={antdColumns as TableProps<RecordType>['columns']}
        dataSource={dataSource}
        loading={loading || initializing}
        pagination={pagination ?? { pageSize: 20 }}
        scroll={{ x: visibleColumns.reduce((acc, column) => acc + (column.width ?? 120), 0) }}
      />
      <ColumnSettingsDrawer
        open={settingsOpen}
        columns={columns}
        onClose={handleCloseSettings}
        onChange={handleApplyColumns}
      />
    </Card>
  );
};

export default ConfigurableTable;
