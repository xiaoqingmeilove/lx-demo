import React, { useEffect, useState } from 'react';
import { Button, Drawer, Space, Switch, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import type { ColumnConfig } from '@/types/app';

interface ColumnSettingsDrawerProps {
  open: boolean;
  columns: ColumnConfig[];
  onClose: () => void;
  onChange: (columns: ColumnConfig[]) => void;
}

const ColumnSettingsDrawer: React.FC<ColumnSettingsDrawerProps> = ({ open, columns, onClose, onChange }) => {
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(columns);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const handleToggle = (index: number, visible: boolean) => {
    setLocalColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], visible };
      return next;
    });
  };

  const handleMove = (index: number, direction: number) => {
    setLocalColumns((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) {
        return prev;
      }
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  const handleApply = () => {
    onChange(localColumns);
    onClose();
  };

  return (
    <Drawer
      title="列配置"
      open={open}
      onClose={onClose}
      width={360}
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleApply}>
            应用
          </Button>
        </Space>
      }
    >
      <div className="column-settings__list">
        {localColumns.map((column, index) => (
          <div className="column-settings__item" key={column.dataIndex ?? column.key ?? column.title}>
            <Typography.Text ellipsis style={{ flex: 1 }}>
              {column.title}
            </Typography.Text>
            <Space>
              <Switch
                size="small"
                checked={column.visible !== false}
                onChange={(checked) => handleToggle(index, checked)}
              />
              <Button
                icon={<ArrowUpOutlined />}
                type="text"
                size="small"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
              />
              <Button
                icon={<ArrowDownOutlined />}
                type="text"
                size="small"
                onClick={() => handleMove(index, 1)}
                disabled={index === localColumns.length - 1}
              />
            </Space>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default ColumnSettingsDrawer;
