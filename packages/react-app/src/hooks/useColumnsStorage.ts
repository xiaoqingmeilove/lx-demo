import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnConfig } from '@/types/app';

const STORAGE_KEY = 'REACT_TABLE_CUSTOM_COLUMN_ORDERLIST';

type PersistedColumn = Pick<ColumnConfig, 'dataIndex' | 'title' | 'fixed'> & {
  visible?: boolean;
};

const getColumnKey = (column: ColumnConfig) => column.dataIndex ?? column.key ?? column.title;

const applyStorage = (tableId: string, columns: ColumnConfig[]) => {
  if (!tableId) {
    return columns.map((column) => ({ ...column, visible: column.visible ?? true }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return columns.map((column) => ({ ...column, visible: column.visible ?? true }));
    }
    const storage = JSON.parse(raw) as Record<string, PersistedColumn[]>;
    const persisted = storage?.[tableId] ?? [];
    const remaining = new Map(columns.map((column) => [getColumnKey(column), { ...column }]));
    const ordered: ColumnConfig[] = [];
    persisted.forEach((item) => {
      const key = item.dataIndex ?? item.title;
      const column = remaining.get(key);
      if (column) {
        column.fixed = item.fixed;
        column.visible = item.visible ?? true;
        ordered.push(column);
        remaining.delete(key);
      }
    });
    remaining.forEach((column) => {
      column.visible = column.visible ?? true;
      ordered.push(column);
    });
    return ordered;
  } catch (error) {
    console.warn('[useColumnsStorage] Failed to parse storage', error);
    return columns.map((column) => ({ ...column, visible: column.visible ?? true }));
  }
};

const persist = (tableId: string, columns: ColumnConfig[]) => {
  if (!tableId) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const storage = raw ? (JSON.parse(raw) as Record<string, PersistedColumn[]>) : {};
    storage[tableId] = columns.map((column) => ({
      dataIndex: column.dataIndex,
      title: column.title,
      fixed: column.fixed,
      visible: column.visible,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.warn('[useColumnsStorage] Failed to persist storage', error);
  }
};

export const useColumnsStorage = (tableId: string, columns: ColumnConfig[]) => {
  const [orderedColumns, setOrderedColumns] = useState<ColumnConfig[]>(() => applyStorage(tableId, columns));

  useEffect(() => {
    setOrderedColumns(applyStorage(tableId, columns));
  }, [columns, tableId]);

  const updateColumns = useCallback(
    (updater: ColumnConfig[] | ((prev: ColumnConfig[]) => ColumnConfig[])) => {
      setOrderedColumns((prev) => {
        const next = typeof updater === 'function' ? (updater as (prev: ColumnConfig[]) => ColumnConfig[])(prev) : updater;
        persist(tableId, next);
        return next;
      });
    },
    [tableId],
  );

  const visibleColumns = useMemo(
    () => orderedColumns.filter((column) => column.visible !== false),
    [orderedColumns],
  );

  return { columns: orderedColumns, visibleColumns, updateColumns };
};
