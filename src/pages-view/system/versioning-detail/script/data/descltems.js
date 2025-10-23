const descItems = [
    { label: '版本单号', field: 'versionNumber', type: 'input' },
    { label: '发布类型', field: 'releaseType', type: 'input' },
    { label: '所属版本', field: 'parentId', slot: 'select_tree', source: 'versionList'},
    { label: '发布日期', field: 'releaseDate', type: 'datetime', },
    // { label: '创建时间', field: 'createTime', type: 'datetime' },
    // { label: '更新时间', field: 'updateTime', type: '' },
]
export {
    descItems
}