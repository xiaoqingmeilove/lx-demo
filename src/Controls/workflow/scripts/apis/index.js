import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  getWorkflowByBillNo: resolveUrl('workflow-service/workflow/wprocess'),
  start: resolveUrl('workflow-service/workflow/start-instance-process'),
  handle: resolveUrl('workflow-service/workflow/handle'),
  nodes: resolveUrl('workflow-service/workflow/wfprocess-nodes'),
  users: resolveUrl('workflow-service/workflow/group/user'),
  delegateAssginee: resolveUrl('workflow-service/workflow/delegateAssginee'),
  submit: resolveUrl('workflow-service/workflow/submit'),

  getConfig: resolveUrl('workflow-service/workflow/configs'),
  getRoleUsers: resolveUrl('sys/system/role/getRole-user-workflow'),

  addComment: resolveUrl('calendar/bill_comment/addComment'),
  getComment: resolveUrl('calendar/bill_comment/getComment'),
  withdrawComment: resolveUrl('calendar/bill_comment/withdrawComment'),
  getCommentUser: resolveUrl('calendar/bill_comment/getCommentUser'),

}

class ApiInstance {

  getWorkflowByBillNo(billNo) {
    return request({
    	method: 'GET',
    	url: URLs.getWorkflowByBillNo,
      params: {
        billNo
      }
    })
  }
  start(defaultKey, menuComponent, billId, billNo) {
    return request({
    	method: 'POST',
    	url: URLs.start,
      data: {
        defaultKey,
        menuComponent,
        billId,
        billNo
      }
    })
  }
  submit(code, billId, billNo, userName) {
    return request({
    	method: 'POST',
    	url: URLs.submit,
      data: {
        menuComponent: code,
        billId,
        billNo,
        userName
      }
    })
  }

  handle(operStatus, billId, billNo, conditionParm, userIds, opinion) {
    return request({
    	method: 'POST',
    	url: URLs.handle,
      data: {
        operStatus,
        billId,
        billNo,
        conditionParm,
        userIds,
        opinion
      }
    })
  }
  pass(billId, billNo, conditionParm, userIds, opinion) {
    return this.handle(40, billId, billNo, conditionParm, userIds, opinion)
  }
  nopass(billId, billNo, conditionParm, userIds, opinion) {
    return this.handle(41, billId, billNo, conditionParm, userIds, opinion)
  }
  reject(billId, billNo, conditionParm, userIds, opinion) {
    return this.handle(3, billId, billNo, conditionParm, userIds, opinion)
  }

  delegateAssginee(data) {
    return request({
    	method: 'POST',
    	url: URLs.delegateAssginee,
      data
    })
  }

  nodes(nodeId, billNo) {
    return request({
    	method: 'GET',
    	url: URLs.nodes,
      params: {
        nodeId,
        billNo
      }
    })
  }
  users(code, billNo, type,menuComponent) {
    return request({
    	method: 'GET',
    	url: URLs.users,
      params: {
        code,
        type,
        menuComponent
      }
    })
  }

  getConfig(code) {
    return request({
    	method: 'GET',
    	url: URLs.getConfig,
      params: {
        menuComponent: code,
      }
    })
  }

  getRoleUsers(key) {
    return request({
    	method: 'GET',
    	url: URLs.getRoleUsers,
      params: {
        key
      }
    })
  }

  addComment(data) {
    return request({
    	method: 'POST',
    	url: URLs.addComment,
      data,
      timeout: 20000
    })
  }
  getComment(id, type) {
    return request({
    	method: 'GET',
    	url: URLs.getComment,
      params: {
        masterId: id,
        masterType: type
      }
    })
  }
  withdrawComment(data) {
    return request({
    	method: 'post',
    	url: URLs.withdrawComment,
      data: {
        ...data
      }
    })
  }
  getCommentUser(id, type) {
    return request({
    	method: 'POST',
    	url: URLs.getCommentUser,
      data: {
        masterId: id,
        masterType: type
      }
    })
  }
}

export default ApiInstance
