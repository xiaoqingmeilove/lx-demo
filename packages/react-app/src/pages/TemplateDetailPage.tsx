import React from 'react';
import { Card, Descriptions } from 'antd';
import { useLocation } from 'react-router-dom';

const TemplateDetailPage: React.FC = () => {
  const location = useLocation();
  const record = (location.state as Record<string, unknown>) ?? {};

  return (
    <Card title="模板详情" bordered={false}>
      <Descriptions column={1} bordered>
        {Object.entries(record).map(([key, value]) => (
          <Descriptions.Item label={key} key={key}>
            {String(value ?? '')}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};

export default TemplateDetailPage;
