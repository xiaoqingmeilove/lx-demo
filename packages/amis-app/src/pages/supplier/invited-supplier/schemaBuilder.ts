import type { SchemaNode, Schema } from 'amis';
import type { ColumnConfig, SearchOption } from '@/services/supplierInvite';
import type { UserInfo } from '@/store';

export interface StatusOption {
  label: string;
  value: string | number;
  color?: string;
}

export interface SupplierInviteSchemaConfig {
  menuCode: string;
  userInfo: UserInfo | null;
  tableColumns: ColumnConfig[];
  smsColumns: ColumnConfig[];
  searchOptions: SearchOption[];
  inviteStatus: StatusOption[];
  authStatus: StatusOption[];
}

export interface NormalizedSearchItem {
  type: string;
  label: string;
  name: string;
  multiple?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  source?: string;
  placeholder?: string;
  inputFormat?: string;
  outputFormat?: string;
  minLength?: number;
  maxLength?: number;
}

export interface NormalizedColumn {
  name: string;
  label: string;
  type?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

const FALLBACK_SEARCH_OPTIONS: SearchOption[] = [
  { label: '供应商名称', field: 'supplierName', type: 'input' },
  { label: '手机号/邮箱', field: 'contactInfo', type: 'input' },
  { label: '邀请状态', field: 'inviteStatus', type: 'select', source: 'inviteStatus' },
  { label: '认证状态', field: 'authStatus', type: 'select', source: 'authStatus' },
  { label: '邀请时间', field: 'inviteTime', type: 'dateRange', fields: ['beginInviteTime', 'endInviteTime'] }
];

const FALLBACK_TABLE_COLUMNS: ColumnConfig[] = [
  { field: 'billNo', title: '单据号', width: 160 },
  { field: 'supplierName', title: '供应商名称', minWidth: 160 },
  { field: 'contactInfo', title: '手机号/邮箱', minWidth: 160 },
  { field: 'inviteStatus', title: '邀请状态', minWidth: 120 },
  { field: 'authStatus', title: '认证状态', minWidth: 120 },
  { field: 'remark', title: '备注', minWidth: 200 }
];

const FALLBACK_SMS_COLUMNS: ColumnConfig[] = [
  { field: 'sendTime', title: '发送时间', minWidth: 160 },
  { field: 'content', title: '短信内容', minWidth: 200 },
  { field: 'status', title: '状态', minWidth: 120 }
];

function normalizeSearchType(type: string): NormalizedSearchItem['type'] {
  switch (type) {
    case 'input':
      return 'input-text';
    case 'select':
      return 'select';
    case 'selectmulti':
      return 'select';
    case 'datePicker':
    case 'dateRange':
    case 'daterange':
      return 'input-date-range';
    case 'inputRange':
      return 'input-range';
    default:
      return 'input-text';
  }
}

export function normalizeSearchOptions(options: SearchOption[] | undefined): NormalizedSearchItem[] {
  const finalOptions = options && options.length > 0 ? options : FALLBACK_SEARCH_OPTIONS;

  return finalOptions.map((item) => {
    const normalizedType = normalizeSearchType(item.type);
    const result: NormalizedSearchItem = {
      type: normalizedType,
      label: item.label,
      name: item.field
    };

    if (item.type === 'selectmulti') {
      result.multiple = true;
    }

    if (item.options) {
      result.options = item.options.map((option) => ({
        label: option.label,
        value: option.value
      }));
    } else if (item.source) {
      result.source = `statusOptions.${item.source}`;
    }

    if (item.type === 'datePicker' || item.type === 'dateRange' || item.type === 'daterange') {
      result.inputFormat = 'YYYY-MM-DD';
      result.outputFormat = 'YYYY-MM-DD';
      if (item.fields && item.fields.length === 2) {
        result.name = item.fields.join(',');
      }
    }

    return result;
  });
}

function mapColumn(column: ColumnConfig): NormalizedColumn | null {
  if (column.type === 'checkbox') {
    return null;
  }

  return {
    name: column.field,
    label: column.title,
    width: column.width ?? column.minWidth,
    align: column.align
  };
}

export function normalizeColumns(columns: ColumnConfig[] | undefined): NormalizedColumn[] {
  const finalColumns = columns && columns.length > 0 ? columns : FALLBACK_TABLE_COLUMNS;
  return finalColumns.map(mapColumn).filter((item): item is NormalizedColumn => Boolean(item));
}

export function normalizeSmsColumns(columns: ColumnConfig[] | undefined): NormalizedColumn[] {
  const finalColumns = columns && columns.length > 0 ? columns : FALLBACK_SMS_COLUMNS;
  return finalColumns.map(mapColumn).filter((item): item is NormalizedColumn => Boolean(item));
}

function createFilterSchema(items: NormalizedSearchItem[]): Schema {
  return {
    title: '',
    body: {
      type: 'form',
      wrapWithPanel: false,
      mode: 'inline',
      submitText: '',
      body: [
        ...items.map((item) => ({
          type: item.type,
          name: item.name,
          label: item.label,
          multiple: item.multiple,
          options: item.options,
          source: item.source,
          inputFormat: item.inputFormat,
          outputFormat: item.outputFormat,
          placeholder: item.placeholder,
          clearable: true
        })),
        {
          type: 'button-group',
          buttons: [
            { type: 'submit', label: '查询', level: 'primary' },
            { type: 'reset', label: '重置' }
          ]
        }
      ]
    }
  };
}

function createSmsTable(columns: NormalizedColumn[]): SchemaNode {
  return {
    type: 'table',
    source: '$items',
    columns: columns.map((column) => ({
      name: column.name,
      label: column.label,
      width: column.width,
      align: column.align
    }))
  };
}

function createOperationColumn(smsColumns: NormalizedColumn[]): SchemaNode {
  return {
    type: 'operation',
    label: '操作',
    width: 200,
    buttons: [
      {
        type: 'button',
        label: '邀请',
        level: 'link',
        actionType: 'ajax',
        api: {
          method: 'put',
          url: '/basic-data/supplier-invite/invite',
          data: {
            record: '$$'
          },
          requestAdaptor:
            "const record = api.data?.record || {}; api.data = [record.id]; return api;",
          adaptor:
            "const code = payload?.code ?? payload?.status ?? 0; return { status: code === 0 || code === 200 ? 0 : code, msg: payload?.message ?? '' };"
        },
        confirmText: '确认邀请该供应商？'
      },
      {
        type: 'button',
        label: '查看短信记录',
        level: 'link',
        actionType: 'dialog',
        dialog: {
          title: '短信记录',
          size: 'lg',
          body: {
            type: 'service',
            api: {
              method: 'get',
              url: '/basic-data/supplier-invite/sms-list',
              data: {
                id: '$id'
              },
              adaptor:
                "const code = payload?.code ?? payload?.status ?? 0; const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.records ?? []; return { status: code === 0 || code === 200 ? 0 : code, data: { items: list } };"
            },
            body: createSmsTable(smsColumns)
          }
        }
      }
    ]
  };
}

function createInviteDialogSchema(): SchemaNode {
  return {
    title: '邀请供应商',
    size: 'lg',
    body: {
      type: 'form',
      mode: 'horizontal',
      wrapWithPanel: false,
      body: [
        {
          type: 'alert',
          level: 'info',
          body: '备注信息不会发送给供应商，建议填写供应商企业名称，便于企业标识。'
        },
        {
          type: 'combo',
          name: 'invites',
          label: false,
          multiple: true,
          addButtonText: '新增一行',
          removable: true,
          minLength: 1,
          items: [
            {
              type: 'input-text',
              name: 'contactInfo',
              label: '手机号/邮箱',
              required: true,
              validations: {
                matchRegexp: '/(^1[3-9]\\d{9}$)|(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$)/'
              },
              validationErrors: {
                matchRegexp: '请输入有效的手机号码或邮箱地址'
              }
            },
            {
              type: 'input-text',
              name: 'supplierName',
              label: '供应商名称',
              required: true
            },
            {
              type: 'textarea',
              name: 'remark',
              label: '备注',
              minRows: 1,
              maxRows: 3
            }
          ]
        }
      ],
      api: {
        method: 'post',
        url: '/basic-data/supplier-invite/save-batch',
        data: {
          invites: '$invites'
        },
        requestAdaptor:
          "const list = Array.isArray(api.data?.invites) ? api.data.invites : []; api.data = list.map(item => ({ contactInfo: item.contactInfo, supplierName: item.supplierName, remark: item.remark })); return api;",
        adaptor:
          "const code = payload?.code ?? payload?.status ?? 0; return { status: code === 0 || code === 200 ? 0 : code, msg: payload?.message ?? '' };"
      },
      closeOnSubmit: false,
      actions: []
    },
    actions: [
      { type: 'button', label: '取消', actionType: 'cancel' },
      {
        type: 'button',
        label: '邀请',
        level: 'primary',
        actionType: 'submit'
      }
    ]
  };
}

export function buildSupplierInviteSchema(config: SupplierInviteSchemaConfig): SchemaNode {
  const searchItems = normalizeSearchOptions(config.searchOptions);
  const tableColumns = normalizeColumns(config.tableColumns);
  const smsColumns = normalizeSmsColumns(config.smsColumns);

  const filterSchema = createFilterSchema(searchItems);

  const columns: SchemaNode[] = [
    {
      type: 'text',
      name: 'rowNumber',
      label: '序号',
      width: 60,
      align: 'center'
    },
    ...tableColumns.map((column) => {
      if (column.name === 'inviteStatus') {
        return {
          type: 'status-badge',
          name: column.name,
          label: column.label,
          statusKey: 'inviteStatus',
          width: column.width,
          align: column.align
        };
      }

      if (column.name === 'authStatus') {
        return {
          type: 'status-badge',
          name: column.name,
          label: column.label,
          statusKey: 'authStatus',
          width: column.width,
          align: column.align
        };
      }

      return {
        type: 'text',
        name: column.name,
        label: column.label,
        width: column.width,
        align: column.align
      };
    }),
    createOperationColumn(smsColumns)
  ];

  const inviteDialog = createInviteDialogSchema();

  return {
    type: 'page',
    title: '供应商邀请',
    body: [
      {
        type: 'crud',
        name: 'supplierInviteCrud',
        api: {
          method: 'get',
          url: '/basic-data/supplier-invite/page-list',
          data: {
            page: '$page',
            size: '$perPage'
          },
          requestAdaptor:
            "const data = { ...api.data }; if (data.filter) { Object.assign(data, data.filter); delete data.filter; } return { ...api, data };",
          adaptor:
            "const success = payload?.code === 0 || payload?.code === 200 || payload?.success === true; const raw = payload?.data ?? {}; const records = raw?.records ?? raw?.items ?? []; const total = raw?.total ?? raw?.count ?? 0; const current = raw?.current ?? raw?.page ?? api.data?.page ?? 1; const size = raw?.size ?? raw?.pageSize ?? api.data?.size ?? 20; const offset = (current - 1) * size; const items = records.map((item, index) => ({ ...item, rowNumber: offset + index + 1 })); return { status: success ? 0 : payload?.code ?? 1, msg: payload?.message ?? '', data: { items, total } };"
        },
        filter: filterSchema,
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        primaryField: 'id',
        pageField: 'page',
        perPageField: 'size',
        headerToolbar: [
          {
            type: 'button',
            label: '邀请供应商',
            level: 'primary',
            actionType: 'dialog',
            dialog: inviteDialog
          },
          {
            type: 'button',
            label: '批量邀请',
            actionType: 'ajax',
            level: 'link',
            disabledOn: '!selectedItems || selectedItems.length === 0',
            api: {
              method: 'put',
              url: '/basic-data/supplier-invite/invite',
              data: {
                selectedItems: '$selectedItems'
              },
              requestAdaptor:
                "const items = Array.isArray(api.data?.selectedItems) ? api.data.selectedItems : []; api.data = items.map(item => item.id); return api;",
              adaptor:
                "const code = payload?.code ?? payload?.status ?? 0; return { status: code === 0 || code === 200 ? 0 : code, msg: payload?.message ?? '' };"
            },
            confirmText: '确认邀请选中的供应商？'
          },
          'bulkActions',
          'filter-toggler'
        ],
        bulkActions: [
          {
            label: '批量邀请',
            actionType: 'ajax',
            level: 'primary',
            api: {
              method: 'put',
              url: '/basic-data/supplier-invite/invite',
              data: {
                selectedItems: '$selectedItems'
              },
              requestAdaptor:
                "const items = Array.isArray(api.data?.selectedItems) ? api.data.selectedItems : []; api.data = items.map(item => item.id); return api;",
              adaptor:
                "const code = payload?.code ?? payload?.status ?? 0; return { status: code === 0 || code === 200 ? 0 : code, msg: payload?.message ?? '' };"
            },
            confirmText: '确认邀请选中的供应商？'
          }
        ],
        columns,
        footerToolbar: ['statistics', 'pagination']
      }
    ],
    data: {
      statusOptions: {
        inviteStatus: config.inviteStatus.map((item) => ({
          label: item.label,
          value: item.value,
          color: item.color
        })),
        authStatus: config.authStatus.map((item) => ({
          label: item.label,
          value: item.value,
          color: item.color
        }))
      },
      userInfo: config.userInfo ?? { userId: 'current' },
      menuCode: config.menuCode
    }
  };
}

export const __internal = {
  FALLBACK_SEARCH_OPTIONS,
  FALLBACK_TABLE_COLUMNS,
  FALLBACK_SMS_COLUMNS,
  createInviteDialogSchema,
  createOperationColumn,
  createFilterSchema
};
