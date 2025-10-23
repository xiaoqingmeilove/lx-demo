const SetupVXETable = (VXETable) => {
  VXETable.setup({
    table: {
      scrollX: {
        gt: -1 // 当大于指定条数时自动启用横向虚拟滚动，如果为 -1 则默认关闭虚拟滚动
      },
      scrollY: {
        enabled: false,
        gt: 20 // 当大于指定条数时自动启用纵向虚拟滚动，如果为 -1 则默认关闭虚拟滚动
      },
      border: true,
      round: true,
      resizable: true,
      showOverflow: false,

      stripe: true,
      tooltipConfig:{showAll:true,leaveDelay:0,enterable:true},
      headerAlign: 'center',
      rowConfig: {
        isCurrent: true,
        isHover: false,
        height: 36,
      },
      columnConfig: {
        minWidth: 90,
      },
      checkboxConfig: {
        highlight: true
      },
    },
    pager: {
      border: true,
      layouts: ['Total', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump'],
      pageSizes: [10, 20, 50, 100]
    },
    modal: {
      transfer: true
    }
  })
}

export {
  SetupVXETable
}
