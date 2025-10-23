const fakeData = {
  "nodeParam": "dyngroupuser",
  "totalTime": "10小时8分钟",
  "wfLinks": [
    {
      "isApplicat": 1,
      "isEnd": 0,
      "nodeId": "Activity_01",
      "nodeName": "申请人",
      "operDate": "2023-03-27 17:22:04",
      "operResult": 40,
      "operStatus": 21,
      "operStatusName": "已审核",
      "opinion": "",
      "taskId": "48f28759-cd13-11ed-9fed-220956caba3a",
      "timeDifference": 0,
      "users":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }],
      "readships":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }]
    },
    {
      "isApplicat": 1,
      "isEnd": 0,
      "nodeId": "Activity_02",
      "nodeName": "专管员审批",
      "operDate": "2023-03-27 17:23:04",
      "operResult": 40,
      "operStatus": 21,
      "operStatusName": "已审核",
      "opinion": "统一",
      "taskId": "48f28759-cd13-11ed-9fed-220956caba3b",
      "timeDifference": "5小时2分钟",
      "users":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }],
      "readships":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }]
    },
    {
      "isApplicat": 1,
      "isEnd": 0,
      "nodeId": "Activity_03",
      "nodeName": "专管员审批",
      "operDate": "2023-03-27 17:23:04",
      "operResult": 40,
      "operStatus": 21,
      "operStatusName": "已审核",
      "opinion": "verygood",
      "taskId": "48f28759-cd13-11ed-9fed-220956caba3b",
      "timeDifference": "2小时2分钟",
      "users":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }],
      "readships":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }]
    },
    {
      "isApplicat": 1,
      "isEnd": 0,
      "nodeId": "Activity_04",
      "nodeName": "专管员审批",
      "operDate": "2023-03-27 17:23:04",
      "operResult": null,
      "operStatus": 20,
      "operStatusName": "未审核",
      "opinion": "",
      "taskId": "48f28759-cd13-11ed-9fed-220956caba3b",
      "timeDifference": 0,
      "users":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }],
      "readships":[{
         "userName":"demo1",
         "nickName":"模拟1"
      }]
    }
  ]
}

const auditors = [
  {
    name: '定价员',
    persons: [
      { nickName: '高级用户', userId: 146 },
      { nickName: '卢文玲', userId: 161 },
      { nickName: '游德辉', userId: 163 },
    ]
  },
].map(item => {
  return {
    label: item.name,
    options: (item.persons ?? []).map(i => {
      return {
        label: i.nickName,
        value: i.userId
      }
    })
  }
})

const circulations = [...auditors]

const rejectNodes = [
  {
    "nodeName": "申请人",
    "procdefId": "",
    "groupType": "mainprocess",
    "procdefKey": "",
    "id": 490,
    "nodeParam": "nodeId",
    "nodeId": "Activity_01"
  }
]

const delegations = [...auditors]

export {
  fakeData,
  auditors,
  circulations,
  rejectNodes,
  delegations
}
