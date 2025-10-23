# LX 平台 React 重构版

该目录包含基于 React 18 + Ant Design 5 + Vite 的全新前端实现，重点保留了原系统中基于后端配置动态渲染的核心逻辑。

## 特性概览

- 🚀 使用 Vite 构建，开发体验更佳。
- 🎨 引入 Ant Design 5，统一视觉与交互体验。
- 🧩 通过 `useQuotationApi` + `ConfigurableTable`/`SearchForm` 组件，实现与后端列配置、查询条件配置的对接。
- 💾 内置列显隐、顺序持久化能力，与旧版 `handleStorageColumns` 行为保持一致。
- 📦 提供 `AppProvider` 上下文，集中管理用户信息、菜单、业务代码等全局数据，便于后续扩展。

## 目录结构

```
packages/react-app
├── src
│   ├── App.tsx               # 应用布局框架
│   ├── main.tsx              # 入口文件
│   ├── components            # 可复用组件（搜索表单、动态表格等）
│   ├── contexts              # 全局上下文（用户、菜单、业务代码）
│   ├── hooks                 # 自定义 Hook（列配置持久化等）
│   ├── mock                  # 演示数据，可替换为真实接口
│   ├── pages                 # 页面视图（模板列表、详情）
│   ├── router                # 路由配置
│   ├── services              # 接口封装，与后端交互
│   ├── styles                # 全局样式
│   ├── types                 # TypeScript 类型定义
│   └── utils                 # 工具方法（菜单查找、URL 拼接等）
└── vite.config.ts            # Vite 配置，包含 `/api` 代理
```

## 启动与构建

```bash
pnpm install       # 或 npm install / yarn install
pnpm --filter lx-platform-react dev   # 启动开发环境
pnpm --filter lx-platform-react build # 构建生产包
```

若未启用 pnpm workspace，也可进入 `packages/react-app` 目录后直接执行 `npm install && npm run dev`。

## 与后端联调

- `useQuotationApi`：对接后端的列配置、查询配置、按钮等接口。
- `ConfigurableTable`：自动读取列配置，并支持列顺序 / 显隐持久化。
- `SearchForm`：根据后端返回的搜索配置动态渲染表单。
- `TemplateListPage`：示例页面，演示如何组合上述能力，并预留 `VITE_TEMPLATE_LIST_URL` 环境变量用于定制数据接口。

接入真实后端时，可在 `AppProvider` 中替换默认菜单、用户信息获取逻辑，并在 `.env` 文件中配置接口地址。

## 下一步改造建议

1. **接入实际登录 / 权限体系**：在 `AppProvider` 中对接认证接口，并注入真实 token。
2. **菜单来源**：在应用启动时请求菜单接口，替换当前的 mock 数据。
3. **页面扩展**：参考 `TemplateListPage`，为其它业务模块实现 React 页面，复用同一套配置化能力。
4. **微前端接入**：若需与旧系统共存，可将该项目通过 qiankun 或其他方案嵌入原平台。
