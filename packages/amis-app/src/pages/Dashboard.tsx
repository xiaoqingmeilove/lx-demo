import React from 'react';
import type { SchemaNode } from 'amis';
import AmisRenderer from '@/components/AmisRenderer';

const dashboardSchema: SchemaNode = {
  type: 'page',
  title: '控制台',
  body: [
    {
      type: 'app-title',
      title: '欢迎使用 AMis React 脚手架'
    },
    {
      type: 'grid',
      columns: [
        {
          type: 'panel',
          title: '快速开始',
          body: [
            {
              type: 'tpl',
              tpl: '<p>使用左侧导航切换页面，通过 amis Schema 快速搭建业务。</p>'
            }
          ]
        },
        {
          type: 'panel',
          title: '实时数据',
          body: [
            {
              type: 'crud',
              api: {
                method: 'get',
                url: '/api/example/list'
              },
              syncLocation: false,
              columns: [
                { name: 'id', label: 'ID' },
                { name: 'name', label: '名称' },
                { name: 'status', label: '状态' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const Dashboard: React.FC = () => {
  return <AmisRenderer schema={dashboardSchema} />;
};

export default Dashboard;
