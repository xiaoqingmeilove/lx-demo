const columns = [
    { 
        "field": "rowNum", 
        "width": 60,
        "minWidth": 60,
        "title": "序号",
        "align": "center",
        "slots": {"default": 'rowNum'}
    },
    {
        "field": "projectName",
        "width": 140,
        "title": "项目名称",
        "align": "left",
    },
    { 
        "field": "billNo", 
        "minWidth": 120,
        "title": "询价单号",
        "align": "left",
    },
    { 
        "field": "enquiryStateName",  
        "minWidth": 160,
        "title": "状态",
        "align": "left",
    },
    {
        "field": "enquiryTypeName",  
        "minWidth": 120,
        "title": "询价方式",
        "align": "left",
    },
    {
        "field": "enquiryDate", 
        "minWidth": 180,
        "title": "询价日期",
        "align": "center",
    },
    {
        "field": "enquiryDescription", 
        "minWidth": 180,
        "title": "询价说明",
        "align": "right",
    },
    {
        "field": "supplierNum", 
        "minWidth": 100,
        "title": "参与供应商数",
        "align": "right",
    },
    {
        "field": "doing", 
        "minWidth": 180,
        "title": "操作",
        "align": "center",
        "slots": {"default": 'doing'}
    }
]



export {
    columns,
}

