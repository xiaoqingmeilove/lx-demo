import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  //上传
  addCrmFile: resolveUrl('crm-service/file/addCrmFile'),
  //获取crm附件
  getCrmFile: resolveUrl('crm-service/file/selectAll'),


  //获取线索列表分页
  getLeadsList: resolveUrl('crm-service/leads/getAll'),
  //获取线索详情
  getLeadsById: resolveUrl('crm-service/leads/get'),
  //获取线索详情
  getLeadsDetail: resolveUrl('crm-service/leads/getLeadsDetail'),
  //获取所有客户
  getAllCustomers: resolveUrl('crm-service/customer/getAll'),
  //新增线索
  addLeads: resolveUrl('crm-service/leads/add'),
  //修改线索
  updateLeads: resolveUrl('crm-service/leads/update'),
  //更改线索负责人
  changeOwnerUser: resolveUrl('crm-service/leads/change/ownerUser'),
  //修改线索状态
  changeLeadsState: resolveUrl('crm-service/leads/change/state'),
  //删除线索
  deleteLeads: resolveUrl('crm-service/leads/del'),

  /* 线索跟进记录 */
  //获取线索跟进记录列表
  getLeadsFollowList: resolveUrl('crm-service/leads/follow/getAll'),
  //新增线索跟进记录
  addLeadsFollow: resolveUrl('crm-service/leads/follow/add'),
  //修改线索跟进记录
  updateLeadsFollow: resolveUrl('crm-service/leads/follow/update'),
  //删除线索跟进记录
  deleteLeadsFollow: resolveUrl('crm-service/leads/follow/del'),
  //获取最新一条线索跟进记录
  getLastLeadsFollow: resolveUrl('crm-service/leads/follow/get/last'),
  //线索跟进记录签退  逆天
  leadsFollowSignOut: resolveUrl('crm-service/customer/follow/update'),
  //修改跟进记录列表项
  updateLeadsFollowItem: resolveUrl('crm-service/customer/follow/update'),

  /* 线索项目联系人 */
  //获取线索项目关系人列表
  getLeadsProjectContactsList: resolveUrl('crm-service/leads/projectContacts/getAll'),
  //新增线索项目关系人
  addLeadsProjectContacts: resolveUrl('crm-service/leads/projectContacts/add'),
  //修改线索项目关系人
  updateLeadsProjectContacts: resolveUrl('crm-service/leads/projectContacts/update'),
  //删除线索项目关系人
  deleteLeadsProjectContacts: resolveUrl('crm-service/leads/projectContacts/del'),

  /* 线索竞争对手 */
  //获取线索竞争对手列表
  getLeadsCompetitorsList: resolveUrl('crm-service/leads/competitors/getAll'),
  //新增线索竞争对手
  addLeadsCompetitors: resolveUrl('crm-service/leads/competitors/add'),
  //修改线索竞争对手
  updateLeadsCompetitors: resolveUrl('crm-service/leads/competitors/update'),
  //删除线索竞争对手
  deleteLeadsCompetitors: resolveUrl('crm-service/leads/competitors/del'),

  /* 线索业务团队 */
  //获取线索业务团队列表
  getLeadsServiceTeamList: resolveUrl('crm-service/leads/serviceTeam/getAll'),
  //新增线索业务团队
  addLeadsServiceTeam: resolveUrl('crm-service/leads/serviceTeam/add'),
  //修改线索业务团队
  updateLeadsServiceTeam: resolveUrl('crm-service/leads/serviceTeam/update'),
  //删除线索业务团队
  deleteLeadsServiceTeam: resolveUrl('crm-service/leads/serviceTeam/del'),

  //获取线索验证记录列表
  getLeadsVerificationList: resolveUrl('crm-service/leads/verification/getAll'),
  //新增线索验证记录
  addLeadsVerification: resolveUrl('crm-service/leads/verification/add'),
  //修改线索验证记录
  updateLeadsVerification: resolveUrl('crm-service/leads/verification/update'),
  //删除线索验证记录
  deleteLeadsVerification: resolveUrl('crm-service/leads/verification/del'),

  //获取线索支持记录列表
  getLeadsSupportList: resolveUrl('crm-service/leads/support/getAll'),
  //新增线索支持记录
  addLeadsSupport: resolveUrl('crm-service/leads/support/add'),
  //修改线索支持记录
  updateLeadsSupport: resolveUrl('crm-service/leads/support/update'),
  //删除线索支持记录
  deleteLeadsSupport: resolveUrl('crm-service/leads/support/del'),

  //获取线索预测列表
  getLeadsForecastList: resolveUrl('crm-service/leads/forecast/getAll'),
  //新增线索预测
  addLeadsForecast: resolveUrl('crm-service/leads/forecast/add'),
  //修改线索预测
  updateLeadsForecast: resolveUrl('crm-service/leads/forecast/update'),
  //删除线索预测
  deleteLeadsForecast: resolveUrl('crm-service/leads/forecast/del'),

  //获取线索转化结果列表
  getLeadsChangeList: resolveUrl('crm-service/leads/change/getAll'),
  //新增线索转化结果
  addLeadsChange: resolveUrl('crm-service/leads/change/add'),
  //修改线索转化结果
  updateLeadsChange: resolveUrl('crm-service/leads/change/update'),
  //删除线索转化结果
  deleteLeadsChange: resolveUrl('crm-service/leads/change/del'),

  /**************商机**************/
  //获取商机列表
  getBOList: resolveUrl('crm-service/business/getAll'),
  //新增商机
  addBusiness: resolveUrl('crm-service/business/add'),
  //修改商机
  updateBusiness: resolveUrl('crm-service/business/update'),
  //删除商机
  deleteBusiness: resolveUrl('crm-service/business/del'),
  //商机详情
  getBusinessDetails: resolveUrl('crm-service/business/getBusinessDetails'),
  //变更商机负责人
  changeBusinessOwnerUser: resolveUrl('crm-service/business/change/ownerUser'),
  //作废商机
  changeBusinessState: resolveUrl('crm-service/business/change/state'),

  /* 商机跟进记录 */
  //获取商机跟进记录列表
  getBOFollowList: resolveUrl('crm-service/business/follow/getAll'),
  //新增商机跟进记录
  addBOFollow: resolveUrl('crm-service/business/follow/add'),
  //修改商机跟进记录
  updateBOFollow: resolveUrl('crm-service/business/follow/update'),
  //删除商机跟进记录
  deleteBOFollow: resolveUrl('crm-service/business/follow/del'),
  //获取最新一条商机跟进记录
  getLastBOFollow: resolveUrl('crm-service/business/follow/get/last'),
  //商机跟进记录签退  逆天
  boFollowSignOut: resolveUrl('crm-service/customer/follow/update'),
  //修改跟进记录列表项
  updateBOFollowItem: resolveUrl('crm-service/customer/follow/update'),

  //获取商机关系人
  getBusinessProjectContacts: resolveUrl('crm-service/business/projectContacts/getAll'),
  //新增商机关系人
  addBusinessProjectContacts: resolveUrl('crm-service/business/projectContacts/add'),
  //修改商机联系人
  updateBusinessProjectContacts: resolveUrl('crm-service/business/projectContacts/update'),
  //删除商机联系人
  deleteBusinessProjectContacts: resolveUrl('crm-service/business/projectContacts/del'),
  //获取商机竞争对手
  getBusinessCompetitors: resolveUrl('crm-service/business/competitors/getAll'),
  //新增商机竞争对手
  addBusinessCompetitors: resolveUrl('crm-service/business/competitors/add'),
  //修改商机竞争对手
  updateBusinessCompetitors: resolveUrl('crm-service/business/competitors/update'),
  //删除商机竞争对手
  deleteBusinessCompetitors: resolveUrl('crm-service/business/competitors/del'),
  //获取商机业务团队
  getBusinessTeam: resolveUrl('crm-service/business/serviceTeam/getAll'),
  //新增商机业务团队
  addBusinessTeam: resolveUrl('crm-service/business/serviceTeam/add'),
  //修改商机业务团队
  updateBusinessTeam: resolveUrl('crm-service/business/serviceTeam/update'),
  //删除商机业务团队
  deleteBusinessTeam: resolveUrl('crm-service/business/serviceTeam/del'),
  //获取商机支持记录
  getBusinessSupport: resolveUrl('crm-service/business/support/getAll'),
  //新增商机支持记录
  addBusinessSupport: resolveUrl('crm-service/business/support/add'),
  //修改商机支持记录
  updateBusinessSupport: resolveUrl('crm-service/business/support/update'),
  //删除商机支持记录
  deleteBusinessSupport: resolveUrl('crm-service/business/support/del'),
  //获取商机行动方案
  getBusinessPlan: resolveUrl('crm-service/business/plan/getAll'),
  //新增商机行动方案
  addBusinessPlan: resolveUrl('crm-service/business/plan/add'),
  //修改商机行动方案
  updateBusinessPlan: resolveUrl('crm-service/business/plan/update'),
  //删除商机行动方案
  deleteBusinessPlan: resolveUrl('crm-service/business/plan/del'),

  //获取项目投标
  getBusinessChange: resolveUrl('crm-service/business/change/getAll'),

  //获取商机专项报价单
  getBusinessQuoteBill: resolveUrl('crm-service/business/change/getAll'),
  //获取商机操作记录
  getBusinessLog: resolveUrl('crm-service/business/change/getAll'),

  addBusinessBidFee: resolveUrl('crm-service/bid/payment/add'),

  queryBusinessQuoted: resolveUrl('crm-service/business/queryBusinessQuoted'),

  //获取客户列表
  getCustomerList: resolveUrl('crm-service/customer/getAll'),
  //获取客户详情
  getCustomerDetail: resolveUrl('crm-service/customer/get'),
  //新增客户
  addCustomer: resolveUrl('crm-service/customer/add'),
  //修改客户
  updateCustomer: resolveUrl('crm-service/customer/update'),
  //删除客户
  deleteCustomer: resolveUrl('crm-service/customer/del'),
  //客户放入公海
  customerToOpensea: resolveUrl('crm-service/customer/pool/add'),
  //获取客户全局信息
  getCustomerGlobalData: resolveUrl('crm-service/customer/getCustomer'),
  //获取客户项目关系人
  getCustomerProjectContacts: resolveUrl('crm-service/customer/projectContacts/getAll'),
  //新增客户项目关系人
  addCustomerProjectContacts: resolveUrl('crm-service/customer/projectContacts/add'),
  //修改客户项目关系人
  updateCustomerProjectContacts: resolveUrl('crm-service/customer/projectContacts/update'),
  //删除客户项目关系人
  deleteCustomerProjectContacts: resolveUrl('crm-service/customer/projectContacts/del'),
  //获取客户商机列表
  getCustomerBOList: resolveUrl('crm-service/customer/getBusiness'),
  //获取客户支持记录列表
  getCustomerSupportList: resolveUrl('crm-service/customer/support/getAll'),
  //获取客户信用额度申请列表
  getCustomerCreditApplyList: resolveUrl('crm-service/customer/apply/getAll'),
  //新增客户信用额度申请
  addCustomerCreditApply: resolveUrl('crm-service/customer/apply/add'),
  //修改客户信用额度申请
  updateCustomerCreditApply: resolveUrl('crm-service/customer/apply/update'),
  //删除客户信用额度申请
  deleteCustomerCreditApply: resolveUrl('crm-service/customer/apply/del'),
  //获取客户业务团队列表
  getCustomerTeamList: resolveUrl('crm-service/customer/serviceTeam/getAll'),
  //新增客户业务团队
  addCustomerTeam: resolveUrl('crm-service/customer/serviceTeam/add'),
  //修改客户业务团队
  updateCustomerTeam: resolveUrl('crm-service/customer/serviceTeam/update'),
  //删除客户业务团队
  deleteCustomerTeam: resolveUrl('crm-service/customer/serviceTeam/del'),


  /* 客户跟进记录 */
  //获取客户跟进记录列表
  getCustomerFollowList: resolveUrl('crm-service/customer/follow/getAll'),
  //新增客户跟进记录
  addCustomerFollow: resolveUrl('crm-service/customer/follow/add'),
  //修改客户跟进记录
  updateCustomerFollow: resolveUrl('crm-service/customer/follow/update'),
  //删除客户跟进记录
  deleteCustomerFollow: resolveUrl('crm-service/customer/follow/del'),
  //获取最新一条客户跟进记录
  getLastCustomerFollow: resolveUrl('crm-service/customer/follow/get/last'),
  //客户跟进记录签退  逆天
  customerFollowSignOut: resolveUrl('crm-service/customer/follow/update'),
  //修改客户跟进记录列表项
  updateCustomerFollowItem: resolveUrl('crm-service/customer/follow/update'),

  //获取客户关联商机
  getBusinessRelaxing: resolveUrl('/crm-service/business/getBusinessRelaxing'),

  //获取公海类型
  getOpenseaPoolTypes: resolveUrl('crm-service/pool/getAll'),
  //获取公海列表
  getOpenseaPoolList: resolveUrl('crm-service/customer/get/customer'),
  //分配公海
  removeOpensea: resolveUrl('crm-service/pool/remove'),

  //仪表盘销售简报
  saleReport: resolveUrl('crm-service/bi/saleReport'),
  //仪表盘业务预算
  biLeadsBudget: resolveUrl('crm-service/bi/leadsBudget'),
  //仪表盘商业价值分统计-线索
  biLeadsValueScore: resolveUrl('crm-service/bi/leadsValueScore'),
  //仪表盘商业价值分统计-商业
  biBusinessValueScore: resolveUrl('crm-service/bi/businessValueScore'),
  //仪表盘商业价值分统计-客户
  biCustomerValueScore: resolveUrl('crm-service/bi/customerValueScore'),

  //商机支持记录评价
  businessSupportEvaluate: resolveUrl('crm-service/business/supportEvaluate/add'),
  //商机行动方案评价
  businessPlanEvaluate: resolveUrl('crm-service/business/plan/evaluate/update'),

  //获取日志
  getLog: resolveUrl('crm-service/log/list'),

  //线索公海
  leadsOpenseaList: resolveUrl('crm-service/leads/seaAll'),
  //线索放入公海
  leadsAddToOpensea: resolveUrl('crm-service/leads/pool/add'),
  //领取线索

  //商机公海
  boOpenseaList: resolveUrl('crm-service/business/seaAll'),
  //商机放入公海
  boAddToOpensea: resolveUrl('crm-service/business/pool/add'),

  leadsListImport: resolveUrl('/crm-service/leads/import'),
  boListImport: resolveUrl('/crm-service/business/import'),

  /**************商机管理**************/
  //获取商机列表
  getBusList: resolveUrl('crm-center/bus/bus/list'),
  //新增商机
  addBus: resolveUrl('crm-center/bus/bus/add'),
  //修改商机
  updateBus: resolveUrl('crm-center/bus/bus/update'),
  //删除商机
  deleteBus: resolveUrl('crm-center/bus/bus/del'),
  //商机详情
  getBusDetails: resolveUrl('crm-center/bus/bus/getBusinessDetails'),
  //变更商机负责人
  changeBusOwnerUser: resolveUrl('crm-center/bus/bus/change-owner'),
  //作废商机
  changeBusState: resolveUrl('crm-center/bus/bus/change/state'),
}

const addCrmFile = (data) => {
  return request({
    method: 'POST',
    url: URLs.addCrmFile,
    data: {
      ...data
    }
  })
}

const getLeadsList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: URLs.getLeadsList,
    params: {
      ...data,
      page,
      size,
    }
  })
}

const getLeadsById = id => {
  return request({
    method: 'GET',
    url: `${URLs.getLeadsById}/${id}`,
  })
}

const getLeadsDetail = id => {
  return request({
    method: 'GET',
    url: `${URLs.getLeadsDetail}/${id}`,
  })
}

const getAllCustomers = () => {
  return request({
    method: 'GET',
    url: URLs.getAllCustomers,
    params: {
      page: 1,
      size: 300000,
    }
  })
}

const addLeads = (data) => {
  delete data.leadsId
  data.number = new Date().getTime().toString()
  data.projectSubcontractorId = data.projectSubcontractorId || ''
  return request({
    method: 'POST',
    url: URLs.addLeads,
    data: {
      ...data
    }
  })
}

const updateLeads = (id, data) => {
  delete data.leadsId
  data.projectSubcontractorId = data.projectSubcontractorId || ''
  return request({
    method: 'PUT',
    url: `${URLs.updateLeads}/${id}`,
    data: {
      ...data
    }
  })
}

const changeOwnerUser = (id, userId, phone = '') => {
  return request({
    method: 'PUT',
    url: `${URLs.changeOwnerUser}/${id}/${userId}/${phone}`,
  })
}

const cancelLeads = (id) => {
  const state = 'nullify'
  return request({
    method: 'PUT',
    url: `${URLs.changeLeadsState}/${id}/${state}`,
  })
}

const closeLeads = (id) => {
  const state = 'close'
  return request({
    method: 'PUT',
    url: `${URLs.changeLeadsState}/${id}/${state}`,
  })
}

const deleteLeads = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeads}/${id}`,
  })
}

const getLeadsFollowList = id => {
  return request({
    method: 'GET',
    url: URLs.getLeadsFollowList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsFollow = (id, data) => {
  delete data.followId
  return request({
    method: 'POST',
    url: URLs.addLeadsFollow,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
    }
  })
}
const updateLeadsFollow = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsFollow}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsFollow = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsFollow}/${id}`,
  })
}
const getLastLeadsFollow = id => {
  return request({
    method: 'GET',
    url: `${URLs.getLastLeadsFollow}/${id}`,
  })
}
const leadsFollowSignOut = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.leadsFollowSignOut}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const updateLeadsFollowItem = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsFollowItem}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}

const getLeadsProjectContactsList = id => {
  return request({
    method: 'GET',
    url: URLs.getLeadsProjectContactsList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsProjectContacts = (id, data) => {
  return request({
    method: 'POST',
    url: URLs.addLeadsProjectContacts,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
      number: new Date().getTime().toString()
    }
  })
}
const updateLeadsProjectContacts = (id, data) => {
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsProjectContacts}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsProjectContacts = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsProjectContacts}/${id}`,
  })
}

const getLeadsCompetitorsList = id => {
  return request({
    method: 'GET',
    url: URLs.getLeadsCompetitorsList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsCompetitors = (id, data) => {
  return request({
    method: 'POST',
    url: URLs.addLeadsCompetitors,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
      number: new Date().getTime().toString()
    }
  })
}
const updateLeadsCompetitors = (id, data) => {
  delete data.projectContactsId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsCompetitors}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsCompetitors = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsCompetitors}/${id}`,
  })
}

const getLeadsServiceTeamList = (id, userId) => {
  return request({
    method: 'GET',
    url: URLs.getLeadsServiceTeamList,
    params: {
      model: 'Leads',
      modelId: id,
      loginUserId: userId,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsServiceTeam = (id, data) => {
  delete data.teamId
  return request({
    method: 'POST',
    url: URLs.addLeadsServiceTeam,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
      number: new Date().getTime().toString()
    }
  })
}
const updateLeadsServiceTeam = (id, data) => {
  delete data.teamId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsServiceTeam}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsServiceTeam = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsServiceTeam}/${id}`,
  })
}

const getLeadsVerificationList = (id) => {
  return request({
    method: 'GET',
    url: URLs.getLeadsVerificationList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsVerification = (id, data) => {
  return request({
    method: 'POST',
    url: URLs.addLeadsVerification,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
    }
  })
}
const updateLeadsVerification = (id, data) => {
  delete data.verificationId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsVerification}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsVerification = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsVerification}/${id}`,
  })
}

const getLeadsSupportList = (id) => {
  return request({
    method: 'GET',
    url: URLs.getLeadsSupportList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsSupport = (id, data) => {
  delete data.supportId
  return request({
    method: 'POST',
    url: URLs.addLeadsSupport,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
      number: new Date().getTime().toString()
    }
  })
}
const updateLeadsSupport = (id, data) => {
  delete data.supportId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsSupport}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsSupport = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsSupport}/${id}`,
  })
}

const getLeadsForecastList = (id) => {
  return request({
    method: 'GET',
    url: URLs.getLeadsForecastList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsForecast = (id, data) => {
  return request({
    method: 'POST',
    url: URLs.addLeadsForecast,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
    }
  })
}
const updateLeadsForecast = (id, data) => {
  delete data.forecastId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsForecast}/${id}`,
    data: {
      ...data,
      model: 'Leads',
    }
  })
}
const deleteLeadsForecast = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsForecast}/${id}`,
  })
}

const getLeadsChangeList = (id) => {
  return request({
    method: 'GET',
    url: URLs.getLeadsChangeList,
    params: {
      model: 'Leads',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addLeadsChange = (id, data) => {
  return request({
    method: 'POST',
    url: URLs.addLeadsChange,
    data: {
      ...data,
      modelId: id,
      model: 'Leads',
      typeNum: new Date().getTime().toString()
    }
  })
}
const updateLeadsChange = (id, data) => {
  delete data.forecastId
  return request({
    method: 'PUT',
    url: `${URLs.updateLeadsChange}/${id}`,
    data: {
      ...data,
      model: 'Leads'
    }
  })
}
const deleteLeadsChange = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteLeadsChange}/${id}`,
  })
}

/*************商机*************/
const getBOList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: URLs.getBOList,
    params: {
      ...data,
      page,
      size,
    }
  })
}
const addBusiness = (data) => {
  delete data.businessId
  return request({
    method: 'POST',
    url: URLs.addBusiness,
    data: {
      ...data,
      businessNum: new Date().getTime().toString()
    }
  })
}
const updateBusiness = (id, data) => {
  delete data.businessId
  data.competitors = data.competitors || []
  return request({
    method: 'PUT',
    url: `${URLs.updateBusiness}/${id}`,
    data: {
      ...data,
    }
  })
}
const deleteBusiness = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBusiness}/${id}`,
  })
}
const getBusinessDetails = id => {
  return request({
    method: 'GET',
    url: `${URLs.getBusinessDetails}/${id}`,
  })
}
const changeBusinessOwnerUser = (id, userId, phone = '') => {
  return request({
    method: 'PUT',
    url: `${URLs.changeBusinessOwnerUser}/${id}/${userId}/${phone}`,
  })
}
const cancelBusiness = (id) => {
  const state = 'nullify'
  return request({
    method: 'PUT',
    url: `${URLs.changeBusinessState}/${id}/${state}`,
  })
}
const closeBusiness = (id) => {
  const state = 'close'
  return request({
    method: 'PUT',
    url: `${URLs.changeBusinessState}/${id}/${state}`,
  })
}

const getBOFollowList = id => {
  return request({
    method: 'GET',
    url: URLs.getBOFollowList,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addBOFollow = (id, data) => {
  delete data.followId
  return request({
    method: 'POST',
    url: URLs.addBOFollow,
    data: {
      ...data,
      modelId: id,
      model: 'Business',
    }
  })
}
const updateBOFollow = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.updateBOFollow}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}
const deleteBOFollow = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBOFollow}/${id}`,
  })
}
const getLastBOFollow = id => {
  return request({
    method: 'GET',
    url: `${URLs.getLastBOFollow}/${id}`,
  })
}
const boFollowSignOut = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.boFollowSignOut}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}
const updateBOFollowItem = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.updateBOFollowItem}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}


const getBusinessProjectContacts = id => {
  return request({
    method: 'GET',
    url: URLs.getBusinessProjectContacts,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addBusinessProjectContacts = (modelId, data) => {
  delete data.projectContactsId
  return request({
    method: 'POST',
    url: URLs.addBusinessProjectContacts,
    data: {
      ...data,
      model: 'Business',
      modelId,
      number: new Date().getTime().toString()
    }
  })
}
const updateBusinessProjectContacts = (id, data) => {
  delete data.projectContactsId
  return request({
    method: 'PUT',
    url: `${URLs.updateBusinessProjectContacts}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}
const deleteBusinessProjectContacts = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBusinessProjectContacts}/${id}`,
  })
}
const getBusinessCompetitors = id => {
  return request({
    method: 'GET',
    url: URLs.getBusinessCompetitors,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addBusinessCompetitors = (id, data) => {
  delete data.competitorsId
  return request({
    method: 'POST',
    url: URLs.addBusinessCompetitors,
    data: {
      ...data,
      modelId: id,
      model: 'Business',
      number: new Date().getTime().toString()
    }
  })
}
const updateBusinessCompetitors = (id, data) => {
  delete data.competitorsId
  return request({
    method: 'PUT',
    url: `${URLs.updateBusinessCompetitors}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}
const deleteBusinessCompetitors = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBusinessCompetitors}/${id}`,
  })
}
const getBusinessTeam = id => {
  return request({
    method: 'GET',
    url: URLs.getBusinessTeam,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addBusinessTeam = (id, data) => {
  delete data.teamId
  return request({
    method: 'POST',
    url: URLs.addBusinessTeam,
    data: {
      ...data,
      modelId: id,
      model: 'Business',
      number: new Date().getTime().toString()
    }
  })
}
const updateBusinessTeam = (id, data) => {
  delete data.teamId
  return request({
    method: 'PUT',
    url: `${URLs.updateBusinessTeam}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}
const deleteBusinessTeam = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBusinessTeam}/${id}`,
  })
}
const getBusinessSupport = id => {
  return request({
    method: 'GET',
    url: URLs.getBusinessSupport,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addBusinessSupport = (id, data) => {
  delete data.supportId
  return request({
    method: 'POST',
    url: URLs.addBusinessSupport,
    data: {
      ...data,
      modelId: id,
      model: 'Business',
      number: new Date().getTime().toString()
    }
  })
}
const updateBusinessSupport = (id, data) => {
  delete data.supportId
  return request({
    method: 'PUT',
    url: `${URLs.updateBusinessSupport}/${id}`,
    data: {
      ...data,
      model: 'Business'
    }
  })
}
const deleteBusinessSupport = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBusinessSupport}/${id}`,
  })
}
const getBusinessPlan = id => {
  return request({
    method: 'GET',
    url: URLs.getBusinessPlan,
    params: {
      businessId: id,
      page: 1,
      size: 300000
    }
  })
}
const addBusinessPlan = (id, data) => {
  delete data.planId
  return request({
    method: 'POST',
    url: URLs.addBusinessPlan,
    data: {
      ...data,
      businessId: id,
    }
  })
}
const updateBusinessPlan = (id, data) => {
  delete data.planId
  return request({
    method: 'PUT',
    url: `${URLs.updateBusinessPlan}/${id}`,
    data: {
      ...data,
    }
  })
}
const deleteBusinessPlan = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBusinessPlan}/${id}`,
  })
}

const addBusinessBidFee = (businessId, data) => {
  return request({
    method: 'POST',
    url: `${URLs.addBusinessBidFee}`,
    data: {
      ...data,
      businessId
    }
  })
}

const getBusinessChange = id => {
  return request({
    method: 'GET',
    url: URLs.getBusinessChange,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}

const getBusinessQuoteBill = (id) => {
  return request({
    method: 'GET',
    url: `${URLs.getBusinessQuoteBill}`,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}

const getBusinessLog = (id) => {
  return request({
    method: 'GET',
    url: `${URLs.getBusinessLog}`,
    params: {
      model: 'Business',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}

const getOpenseaPoolTypes = () => {
  return request({
    method: 'GET',
    url: `${URLs.getOpenseaPoolTypes}`,
  })
}
const getOpenseaPoolList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: `${URLs.getOpenseaPoolList}`,
    params: {
      ...data,
      page,
      size
    }
  })
}

const getCustomerList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerList}`,
    params: {
      ...data,
      page,
      size
    }
  })
}
const getCustomerDetail = (id) => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerDetail}/${id}`,
  })
}
const addCustomer = data => {
  return request({
    method: 'POST',
    url: `${URLs.addCustomer}`,
    data: {
      ...data,
    }
  })
}
const updateCustomer = (id, data) => {
  delete data.customerId
  return request({
    method: 'PUT',
    url: `${URLs.updateCustomer}/${id}`,
    data: {
      ...data
    }
  })
}
const deleteCustomer = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteCustomer}/${id}`,
  })
}
const customerToOpensea = (id, poolId, model) => {
  return request({
    method: 'POST',
    url: `${URLs.customerToOpensea}`,
    data: {
      modelId: id,
      poolId,
      model
    }
  })
}
const getCustomerGlobalData = id => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerGlobalData}/${id}`,
  })
}
const getCustomerProjectContacts = (id) => {
  return request({
    method: 'GET',
    url: URLs.getCustomerProjectContacts,
    params: {
      model: 'Customer',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addCustomerProjectContacts = (id, data) => {
  delete data.teamId
  return request({
    method: 'POST',
    url: URLs.addCustomerProjectContacts,
    data: {
      ...data,
      modelId: id,
      model: 'Customer',
      number: new Date().getTime().toString()
    }
  })
}
const updateCustomerProjectContacts = (id, data) => {
  return request({
    method: 'PUT',
    url: `${URLs.updateCustomerProjectContacts}/${id}`,
    data: {
      ...data,
      model: 'Customer'
    }
  })
}
const deleteCustomerProjectContacts = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteCustomerProjectContacts}/${id}`,
  })
}
const getCustomerBOList = (id, condition, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerBOList}`,
    params: {
      customerId: id,
      ...condition,
      page,
      size
    }
  })
}
const getCustomerSupportList = id => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerSupportList}`,
    params: {
      customerId: id,
      page: 1,
      size: 300000
    }
  })
}
const getCustomerCreditApplyList = id => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerCreditApplyList}`,
    params: {
      customerId: id,
      page: 1,
      size: 300000
    }
  })
}
const addCustomerCreditApply = (id, data) => {
  delete data.applyId
  return request({
    method: 'POST',
    url: URLs.addCustomerCreditApply,
    data: {
      ...data,
      customerId: id,
      applyNum: new Date().getTime().toString()
    }
  })
}
const updateCustomerCreditApply = (id, data) => {
  delete data.applyId
  return request({
    method: 'PUT',
    url: `${URLs.updateCustomerCreditApply}/${id}`,
    data: {
      ...data,
    }
  })
}
const deleteCustomerCreditApply = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteCustomerCreditApply}/${id}`,
  })
}
const getCustomerTeamList = id => {
  return request({
    method: 'GET',
    url: `${URLs.getCustomerTeamList}`,
    params: {
      modelId: id,
      model: 'Customer',
      page: 1,
      size: 300000
    }
  })
}
const addCustomerTeam = (id, data) => {
  delete data.teamId
  return request({
    method: 'POST',
    url: URLs.addCustomerTeam,
    data: {
      ...data,
      modelId: id,
      model: 'Customer',
      number: new Date().getTime().toString()
    }
  })
}
const updateCustomerTeam = (id, data) => {
  delete data.teamId
  return request({
    method: 'PUT',
    url: `${URLs.updateCustomerTeam}/${id}`,
    data: {
      ...data,
    }
  })
}
const deleteCustomerTeam = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteCustomerTeam}/${id}`,
  })
}

const removeOpensea = (id, poolId, userId, model) => {
  return request({
    method: 'POST',
    url: `${URLs.removeOpensea}`,
    data: {
      modelId: id,
      poolId,
      userId,
      model,
    }
  })
}

const getCustomerFollowList = id => {
  return request({
    method: 'GET',
    url: URLs.getCustomerFollowList,
    params: {
      model: 'Customer',
      modelId: id,
      page: 1,
      size: 300000
    }
  })
}
const addCustomerFollow = (id, data) => {
  delete data.followId
  return request({
    method: 'POST',
    url: URLs.addCustomerFollow,
    data: {
      ...data,
      modelId: id,
      model: 'Customer',
    }
  })
}
const updateCustomerFollow = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.updateCustomerFollow}/${id}`,
    data: {
      ...data,
      model: 'Customer'
    }
  })
}
const deleteCustomerFollow = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteCustomerFollow}/${id}`,
  })
}
const getLastCustomerFollow = id => {
  return request({
    method: 'GET',
    url: `${URLs.getLastCustomerFollow}/${id}`,
  })
}
const customerFollowSignOut = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.customerFollowSignOut}/${id}`,
    data: {
      ...data,
      model: 'Customer'
    }
  })
}
const updateCustomerFollowItem = (id, data) => {
  delete data.followId
  return request({
    method: 'PUT',
    url: `${URLs.updateCustomerFollowItem}/${id}`,
    data: {
      ...data,
      model: 'Customer'
    }
  })
}

const getBusinessRelaxing = id => {
  return request({
    method: 'GET',
    url: `${URLs.getBusinessRelaxing}`,
    params: {
      customerId: id
    }
  })
}

const saleReport = (options) => {
  return request({
    method: 'GET',
    url: `${URLs.saleReport}`,
    params: {
      ...options
    }
  })
}
const biLeadsBudget = options => {
  return request({
    method: 'GET',
    url: `${URLs.biLeadsBudget}`,
    params: {
      ...options
    }
  })
}
const biLeadsValueScore = options => {
  return request({
    method: 'GET',
    url: `${URLs.biLeadsValueScore}`,
    params: {
      ...options
    }
  })
}
const biBusinessValueScore = options => {
  return request({
    method: 'GET',
    url: `${URLs.biBusinessValueScore}`,
    params: {
      ...options
    }
  })
}
const biCustomerValueScore = options => {
  return request({
    method: 'GET',
    url: `${URLs.biCustomerValueScore}`,
    params: {
      ...options
    }
  })
}

const businessSupportEvaluate = (id, data) => {
  delete data.supportId
  return request({
    method: 'POST',
    url: `${URLs.businessSupportEvaluate}/${id}`,
    data: {
      ...data
    }
  })
}
const businessPlanEvaluate = (id, data) => {
  delete data.planId
  return request({
    method: 'PUT',
    url: `${URLs.businessPlanEvaluate}/${id}`,
    data: {
      ...data
    }
  })
}

const getCrmFile = (id, model) => {
  return request({
    method: 'POST',
    url: `${URLs.getCrmFile}`,
    data: {
      modelId: id,
      model,
      page: 1,
      size: 300000
    }
  })
}

const getLog = options => {
  return request({
    method: 'GET',
    url: `${URLs.getLog}`,
    data: {
      ...options,
      page: 1,
      size: 300000
    }
  })
}

const leadsOpenseaList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: `${URLs.leadsOpenseaList}`,
    params: {
      ...data,
      page,
      size
    }
  })
}
const leadsAddToOpensea = id => {
  return request({
    method: 'POST',
    url: `${URLs.leadsAddToOpensea}`,
    data: {
      model: 'Leads',
      modelId: id
    }
  })
}
const pickupLeads = id => {
  return request({
    method: 'POST',
    url: `${URLs.removeOpensea}`,
    data: {
      modelId: id,
      model: 'Leads',
    }
  })
}
const assignLeads = (id, userId) => {
  return request({
    method: 'POST',
    url: `${URLs.removeOpensea}`,
    data: {
      modelId: id,
      ownerUserId: userId,
      model: 'Leads',
    }
  })
}

const boOpenseaList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: `${URLs.boOpenseaList}`,
    params: {
      ...data,
      page,
      size
    }
  })
}
const boAddToOpensea = id => {
  return request({
    method: 'POST',
    url: `${URLs.boAddToOpensea}`,
    data: {
      model: 'Business',
      modelId: id
    }
  })
}
const pickupBO = id => {
  return request({
    method: 'POST',
    url: `${URLs.removeOpensea}`,
    data: {
      modelId: id,
      model: 'Business',
    }
  })
}
const assignBO = (id, userId) => {
  return request({
    method: 'POST',
    url: `${URLs.removeOpensea}`,
    data: {
      modelId: id,
      ownerUserId: userId,
      model: 'Business',
    }
  })
}

const queryBusinessQuoted = businessId => {
  return request({
    method: 'GET',
    url: `${URLs.queryBusinessQuoted}`,
    params: {
      businessId
    }
  })
}

const leadsListImport = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    method: 'POST',
    url: URLs.leadsListImport,
    data: formData,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
}

const boListImport = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    method: 'POST',
    url: URLs.boListImport,
    data: formData,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
}

/*************商机管理*************/
const getBusList = (data, page = 1, size = 20) => {
  return request({
    method: 'GET',
    url: URLs.getBusList,
    params: {
      ...data,
      page,
      size,
    }
  })
}
const addBus = (data) => {
  delete data.businessId
  return request({
    method: 'POST',
    url: URLs.addBus,
    data: {
      ...data,
      businessNum: new Date().getTime().toString()
    }
  })
}
const updateBus = (id, data) => {
  delete data.businessId
  data.competitors = data.competitors || []
  return request({
    method: 'PUT',
    url: `${URLs.updateBus}/${id}`,
    data: {
      ...data,
    }
  })
}
const deleteBus = id => {
  return request({
    method: 'DELETE',
    url: `${URLs.deleteBus}/${id}`,
  })
}
const getBusDetails = id => {
  return request({
    method: 'GET',
    url: `${URLs.getBusDetails}/${id}`,
  })
}
const changeBusOwnerUser = (id, userId, phone = '') => {
  return request({
    method: 'PUT',
    url: `${URLs.changeBusOwnerUser}/${id}/${userId}/${phone}`,
  })
}


export default {
  addCrmFile,
  getCrmFile,

  getLeadsList,
  getLeadsById,
  getLeadsDetail,
  getAllCustomers,
  addLeads,
  updateLeads,
  changeOwnerUser,
  cancelLeads,
  closeLeads,
  deleteLeads,

  getLeadsFollowList,
  addLeadsFollow,
  updateLeadsFollow,
  deleteLeadsFollow,
  getLastLeadsFollow,
  leadsFollowSignOut,
  updateLeadsFollowItem,

  getLeadsProjectContactsList,
  addLeadsProjectContacts,
  updateLeadsProjectContacts,
  deleteLeadsProjectContacts,

  getLeadsCompetitorsList,
  addLeadsCompetitors,
  updateLeadsCompetitors,
  deleteLeadsCompetitors,

  getLeadsServiceTeamList,
  addLeadsServiceTeam,
  updateLeadsServiceTeam,
  deleteLeadsServiceTeam,

  getLeadsVerificationList,
  addLeadsVerification,
  updateLeadsVerification,
  deleteLeadsVerification,

  getLeadsSupportList,
  addLeadsSupport,
  updateLeadsSupport,
  deleteLeadsSupport,

  getLeadsForecastList,
  addLeadsForecast,
  updateLeadsForecast,
  deleteLeadsForecast,

  getLeadsChangeList,
  addLeadsChange,
  updateLeadsChange,
  deleteLeadsChange,

  /******************************************/
  getBOList,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessDetails,
  changeBusinessOwnerUser,
  cancelBusiness,
  closeBusiness,

  getBOFollowList,
  addBOFollow,
  updateBOFollow,
  deleteBOFollow,
  getLastBOFollow,
  boFollowSignOut,
  updateBOFollowItem,

  getBusinessProjectContacts,
  addBusinessProjectContacts,
  updateBusinessProjectContacts,
  deleteBusinessProjectContacts,
  getBusinessCompetitors,
  addBusinessCompetitors,
  updateBusinessCompetitors,
  deleteBusinessCompetitors,
  getBusinessTeam,
  addBusinessTeam,
  updateBusinessTeam,
  deleteBusinessTeam,
  getBusinessSupport,
  addBusinessSupport,
  updateBusinessSupport,
  deleteBusinessSupport,
  getBusinessPlan,
  addBusinessPlan,
  updateBusinessPlan,
  deleteBusinessPlan,

  getBusinessChange,

  getBusinessQuoteBill,
  getBusinessLog,

  addBusinessBidFee,

  getCustomerList,
  getCustomerDetail,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  customerToOpensea,
  getCustomerGlobalData,
  getCustomerProjectContacts,
  addCustomerProjectContacts,
  updateCustomerProjectContacts,
  deleteCustomerProjectContacts,
  getCustomerBOList,
  getCustomerSupportList,
  getCustomerCreditApplyList,
  addCustomerCreditApply,
  updateCustomerCreditApply,
  deleteCustomerCreditApply,
  getCustomerTeamList,
  addCustomerTeam,
  updateCustomerTeam,
  deleteCustomerTeam,

  getCustomerFollowList,
  addCustomerFollow,
  updateCustomerFollow,
  deleteCustomerFollow,
  getLastCustomerFollow,
  customerFollowSignOut,
  updateCustomerFollowItem,

  getBusinessRelaxing,

  getOpenseaPoolTypes,
  getOpenseaPoolList,
  removeOpensea,

  saleReport,
  biLeadsBudget,
  biLeadsValueScore,
  biBusinessValueScore,
  biCustomerValueScore,

  businessSupportEvaluate,
  businessPlanEvaluate,

  getLog,

  leadsOpenseaList,
  leadsAddToOpensea,
  pickupLeads,
  assignLeads,

  boOpenseaList,
  boAddToOpensea,
  pickupBO,
  assignBO,

  queryBusinessQuoted,

  leadsListImport,
  boListImport,
  /******************************************/
  getBusList,
  addBus,
  updateBus,
  deleteBus,
  getBusDetails,
  changeBusOwnerUser

}
