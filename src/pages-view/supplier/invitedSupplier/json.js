[
    { "label": "供应商名称", "field": "supplierName", "type": "input", "isDefault": true }, 
    { "label": "手机号/邮箱", "field": "contactInfo", "type": "input", "isDefault": true }, 
    { "label": "邀请状态", "field": "inviteStatusList", "field": "billStates", "type": "selectmulti", "output": "string", "source": "inviteStatusList", "isDefault": true }, 
    {"label":"操作时间","fields":["beginUpdateTime","endUpdateTime"],"type":"datePicker","isDefault":true},
    { "label": "邀请次数", "fields": ["beginInviteTimes", "beginInviteTimes"], "type": "numberRange" }, 
    { "label": "入驻认证状态", "field": "authStatusList", "type": "selectmulti", "output": "string", "source": "authStatusList"}
]
// {"field":"rowNum","title":"序号","width":80,"align":"center","slots":{"default":"rowNum"}},

[
    {"title": "选择","type": "checkbox","width": "80","align": "center"},
    {"field":"supplierName","title":"供应商名称","minWidth":100,"align":"left"},
    {"field":"contactInfo","title":"手机号/邮箱","minWidth":100,"align":"left"},
    {"field":"inviteStatus","title":"邀请状态","width":120,"minWidth":100,"align":"left","slots":{"default":"inviteStatus"}},
    {"field":"remark","title":"备注","minWidth":100,"align":"left"},
    {"field":"updateTime","title":"操作时间","width":190,"minWidth":100,"align":"left"},
    {"field":"inviteTimes","title":"邀请次数","width":100,"minWidth":100,"align":"center"},
    {"field":"authStatus","title":"入驻认证状态","width":120,"minWidth":100,"align":"left","slots":{"default":"authStatus"}},
    {"field":"action","title":"操作","width":160,"minWidth":100,"align":"center", "slots": { "default": "action" } }
]



[
    {"field":"phone","title":"手机号","width":190,"minWidth":100,"align":"left"},
    {"field":"type","title":"短信类型","width":100,"align":"left"},
    {"field":"content","title":"短信内容","minWidth":100,"align":"left"},
    {"field":"statusMsg","title":"状态","width":100,"align":"left"},
    {"field":"sendTime","title":"发送时间","width":190,"minWidth":100,"align":"left"}
]