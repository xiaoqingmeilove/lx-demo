import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";
import qs from "qs";

const URLs = {
  // 公告管理
  getProclamationListExportUrl: resolveUrl("basic-data/msg-announcement/export"), //一览表导出
  getProclamationListUrl: resolveUrl("basic-data/msg-announcement/page"),//一览表
  getProclamationDetailUrl: resolveUrl("basic-data/msg-announcement/get-info"), //详情接口
  putProclamationUrl: resolveUrl("basic-data/msg-announcement/release"),// 发布公告
  deleteProclamationUrl: resolveUrl("basic-data/msg-announcement/del"),// 删除公告
  getProclamationHomeListUrl: resolveUrl("basic-data/msg-announcement/find-announcement"),//首页公告查询
  postAddProclamationUrl: resolveUrl("basic-data/msg-announcement/save"),// 新增公告
  putEditProclamationUrl: resolveUrl("basic-data/msg-announcement/edit"),// 修改公告


  //系统管理
  getSysTree: resolveUrl("sys/hierarchical/getHierarchicalTree"), //查看系统树

  //部门管理
  getDeptTree: resolveUrl("sys/sys/dept/getDeptTree"), //查看部门树
  getDeepDeptTree: resolveUrl("sys/sys/dept/getListUntilDept"), //全结构部门树
  getDeptList: resolveUrl("sys/sys/dept/getDeptList"), //部门列表
  addDept: resolveUrl("sys/sys/dept/save"), //添加
  editDept: resolveUrl("sys/sys/dept/edit"), //编辑
  deleteDept: resolveUrl("sys/sys/dept/delete"), //删除
  detailDept: resolveUrl("sys/sys/dept/view"), //详情

  //企业管理
  getApsTree: resolveUrl("sys/sys/enteriprise/tree"), //查看
  addAps: resolveUrl("sys/sys/enteriprise/save"), //新增
  editAps: resolveUrl("sys/sys/enteriprise/edit"), //编辑
  detailAps: resolveUrl("sys/sys/enteriprise/view"), //详情
  deleteAps: resolveUrl("sys/sys/enteriprise/delete"), //删除
  getAps: resolveUrl("sys/sys/enteriprise/list"), //查询
  getLocation: resolveUrl("sys/sys/enteriprise/query-product-list"), //场地信息
  addLocation: resolveUrl("sys/sys/enteriprise/save-product-address"),
  editLocation: resolveUrl("sys/sys/enteriprise/edit-product-address"),
  delLocation: resolveUrl("sys/sys/enteriprise/del-product-address"),
  getTradeLic: resolveUrl("sys/sys/enteriprise/query-trade_license"), //营业执照
  addTradeLic: resolveUrl("sys/sys/enteriprise/save-trade_license"),
  editTradeLic: resolveUrl("sys/sys/enteriprise/edit-trade_license"),
  delTradeLic: resolveUrl("sys/sys/enteriprise/del-trade_license"),
  getProductLic: resolveUrl("sys/sys/enteriprise/query-product-license"), //生产许可证
  addProductLic: resolveUrl("sys/sys/enteriprise/save-product-license"),
  editProductLic: resolveUrl("sys/sys/enteriprise/edit-product-license"),
  delProductLic: resolveUrl("sys/sys/enteriprise/del-product-license"),
  getProductCert: resolveUrl("sys/sys/enteriprise/query-product-cert"), //3C证书
  addProductCert: resolveUrl("sys/sys/enteriprise/save-product-cert"),
  editProductCert: resolveUrl("sys/sys/enteriprise/edit-product-cert"),
  delProductCert: resolveUrl("sys/sys/enteriprise/del-product-cert"),
  getProductOtherCert: resolveUrl(
    "sys/sys/enteriprise/query-product-other-cert"
  ), //其他资质
  addProductOtherCert: resolveUrl(
    "sys/sys/enteriprise/save-product-other-cert"
  ),
  editProductOtherCert: resolveUrl(
    "sys/sys/enteriprise/edit-product-other-cert"
  ),
  delProductOtherCert: resolveUrl("sys/sys/enteriprise/del-product-other-cert"),

  //组织管理
  getOrgTree: resolveUrl("sys/sys-organization/getList"), //查看
  getOrgAps: resolveUrl("sys/sys-organization/queryEnterpriseByOrganize"), //查看组织企业
  addOrg: resolveUrl("sys/sys-organization/save"), //添加
  editOrg: resolveUrl("sys/sys-organization/edit"), //编辑
  deleteOrg: resolveUrl("sys/sys-organization/del"), //删除
  detailOrg: resolveUrl("sys/sys-organization/getById"), //详情

  // 区域管理
  getRegionTree: resolveUrl("sys/sys-freight/tree-list"), //查看
  getRegionDatails: resolveUrl("sys/sys-freight/tree-details"), //查看
  addRegionDatails: resolveUrl("sys/sys-freight/fee-add"), //新增
  deleteRegionDatails: resolveUrl("sys/sys-freight/fee-delete"), //删除
  editRegionDatails: resolveUrl("sys/sys-freight/fee-edit"), //修改
  postimportRegionDetailUrl: resolveUrl("sys/sys-freight/import-fee"), //execl导入
  postRegionDetailExport: resolveUrl("sys/sys-freight/export-fee"), //execl导出

  //岗位管理
  getPostTree: resolveUrl("sys/sys/post/list"), //查看
  getDeepPostTree: resolveUrl("sys/sys/post/getListUntilPost"), //全结构部门树
  addPost: resolveUrl("sys/sys/post/save"), //添加
  editPost: resolveUrl("sys/sys/post/edit"), //编辑
  deletePost: resolveUrl("sys/sys/post/delete"), //删除
  detailPost: resolveUrl("sys/sys/post/view"), //详情
  getApsPost: resolveUrl("sys/employee/getPostList"), //企业岗位
  getDeptPost: resolveUrl("sys/sys/dept/getPostList"), //部门->岗位

  //字典管理
  getDictTree: resolveUrl("sys/sys-dictionaries/dictionariesTree"), //字典树
  addDict: resolveUrl("sys/sys-dictionaries/saveDictionaries"), //新增
  editDict: resolveUrl("sys/sys-dictionaries/editDictionaries"), //修改
  detailDict: resolveUrl("sys/sys-dictionaries/viewDictionaries"), //详情
  deleteDict: resolveUrl("sys/sys-dictionaries/deleteDictionaries"), //删除
  getApplyDict: resolveUrl("sys/sys-dictionaries/viewDictionariesList"), //应用字典
  getDictItem: resolveUrl("sys/sys-dictionaries-detail/viewDictionDetailList"), //字典树
  addDictItem: resolveUrl("sys/sys-dictionaries-detail/saveDictionDetail"), //新增
  editDictItem: resolveUrl("sys/sys-dictionaries-detail/editDictionDetail"), //修改
  detailDictItem: resolveUrl("sys/sys-dictionaries-detail/viewDictionDetail"), //详情
  deleteDictItem: resolveUrl("sys/sys-dictionaries-detail/deleteDictionDetail"), //删除

  //应用管理
  getApplyTree: resolveUrl("sys/apply/getListTree"), //全部应用列表
  getCheckApply: resolveUrl("sys/apply/getCheckApplyList"), //已选应用列表
  getUnCheckApply: resolveUrl("sys/apply/getUnCheckApplyList"), //可选应用列表
  saveCheckApply: resolveUrl("sys/apply/saveEnterpriseApply"), //添加应用
  saveApply: resolveUrl("sys/apply/save"), //新增
  editApply: resolveUrl("sys/apply/edit"), //维护
  deleteApply: resolveUrl("sys/apply/del"), //删除
  detailApply: resolveUrl("sys/apply/getById"), //详情

  //用户权限
  getUserRoles: resolveUrl("sys/system-user-management/getUserRole"), //查看成员角色
  getEmpTree: resolveUrl("sys/employee/getListUnitEmployee"), //查看成员
  getUserMenu: resolveUrl("sys/user-menu/getUserMenu"), //获取用户权限
  saveUserMenu: resolveUrl("sys/user-menu/saveUserMenu"), //保存用户权限

  //菜单管理
  getAllMenuTree: resolveUrl("sys/system/menu/treeselect"), //获取带权限菜单树
  getMenuTree: resolveUrl("sys/system/menu/treeselect-no-M"), //获取菜单树
  getMenuApp: resolveUrl("sys/apply/getListTree"), //获取应用
  getAppList: resolveUrl("sys/apply/getList"), //获取应用列表
  getMenuList: resolveUrl("sys/system/menu/getListTree"), //获取平级菜单树
  getMenuNoPerm: resolveUrl("sys/system/menu/treeselect-no-perm"), //获取无权限菜单树
  addMenu: resolveUrl("sys/system/menu"), //新增
  editMenu: resolveUrl("sys/system/menu"), //修改
  deleteMenu: resolveUrl("sys/system/menu/"), //删除
  detailMenu: resolveUrl("sys/system/menu/"), //详情

  //角色管理
  getRolePerms: resolveUrl("sys/system/menu/getPermMenuId"), //获取角色权限
  getRoleTree: resolveUrl("sys/role-group/getRoleTree"), //查看
  addRoleTree: resolveUrl("sys/role-group/save"), //添加
  editRoleTree: resolveUrl("sys/role-group/edit"), //编辑
  delRoleTree: resolveUrl("sys/role-group/delById"), //删除
  changeRoleGroup: resolveUrl("sys/role-group/editRole"), //角色换组
  getRoleGroupTree: resolveUrl("sys/role-group/getTree"), //角色组树
  getRoleMember: resolveUrl("sys/system/role/getRole-user"), //获取角色成员
  addRole: resolveUrl("sys/system/role"), //添加
  editRole: resolveUrl("sys/system/role"), //编辑
  putEditRole: resolveUrl('sys/system/role/editInfo'), //修改角色
  updateStatus: resolveUrl("sys/system/role/changeStatus"), //切换状态
  delRole: resolveUrl("sys/system/role"), //删除
  detailRole: resolveUrl("sys/system/role"), //详情
  getRoleList: resolveUrl("sys/system/role/list"), //角色列表
  roleAddUser: resolveUrl("sys/system/role/role_relevancy_user"), //角色批量关联用户

  //用户管理
  getUser: resolveUrl("sys/system-user-management/search-users"), //查看
  addUser: resolveUrl("sys/system-user-management/create-user"), //添加
  editUser: resolveUrl("sys/system-user-management/modify-user"), //编辑
  deleteUser: resolveUrl("sys/system-user-management/delete-user"), //删除
  detailUser: resolveUrl("sys/system-user-management/search-user"), //详情
  resetPassword: resolveUrl("sys/system-user-management/reset-pwd"), //重置密码
  getUserTree: resolveUrl("sys/employee/getListUnitEmployee"), //组织用户树
  getUserSelectTree: resolveUrl("sys/hierarchical/getHierarchicalTree"), //组织用户选择树
  modifyPassword: resolveUrl("sys/system-user-management/modify-pwd"), //修改密码
  forceEditPassword: resolveUrl("sys/actuator/modify-pwd-batch"), //强制修改密码

  //职员管理
  getEmployee: resolveUrl("sys/employee/list"), //查看
  addEmployee: resolveUrl("sys/employee/add"), //添加
  editEmployee: resolveUrl("sys/employee/update"), //编辑
  deleteEmployee: resolveUrl("sys/employee/del"), //删除
  detailEmployee: resolveUrl("sys/employee/get"), //详情
  employeeToUser: resolveUrl("sys/employee/createUser"), //转用户
  userToEmployee: resolveUrl("sys/employee/createUser"), //转职员
  getSaleEmployeeUrl: resolveUrl("sys/employee/getSaleEmployee"), //获取销售列表

  //资质管理
  getEmployeeCert: resolveUrl(
    "sys/sys-employee-certification/select-employee-cert"
  ), //查询
  getCertList: resolveUrl("sys/sys-employee-certification/list-employee-cert"), //列表
  addEmployeeCert: resolveUrl(
    "sys/sys-employee-certification/save-employee-cert"
  ), //新增
  editEmployeeCert: resolveUrl(
    "sys/sys-employee-certification/edit-employee-cert"
  ), //修改
  deleteEmployeeCert: resolveUrl(
    "sys/sys-employee-certification/del-employee-cert"
  ), //删除

  //附件管理
  uploadFilesUrl: resolveUrl("file/file/upload"), //上传
  getAttachCert: resolveUrl("sys/sys/file/select-certification-file"), //3C证书附件新增
  getAttachEmployee: resolveUrl("sys/sys/file/select-employee-file"), //职员附件新增
  getAttachEps: resolveUrl("sys/sys/file/select-enterprise-file"), //企业附件新增
  getAttachOther: resolveUrl("sys/sys/file/select-other-cert-file"), //其他资质附件新增
  getAttachProd: resolveUrl("sys/sys/file/select-product-license-file"), //生产许可证附件新增
  getAttachTrade: resolveUrl("sys/sys/file/select-trade-license-file"), //营业执照附件新增
  addAttachCert: resolveUrl("sys/sys/file/save-certification-file"), //3C证书附件新增
  addAttachEmployee: resolveUrl("sys/sys/file/save-employee-file"), //职员附件新增
  addAttachEps: resolveUrl("sys/sys/file/save-enterprise-file"), //企业附件新增
  addAttachOther: resolveUrl("sys/sys/file/save-other-cert-file"), //其他资质附件新增
  addAttachProd: resolveUrl("sys/sys/file/save-product-license-file"), //生产许可证附件新增
  addAttachTrade: resolveUrl("sys/sys/file/save-trade-license-file"), //营业执照附件新增
  deleteAttachCert: resolveUrl("sys/sys/file/del-certification-file"), //3C证书附件删除
  deleteAttachEmployee: resolveUrl("sys/sys/file/del-employee-file"), //职员附件删除
  deleteAttachEps: resolveUrl("sys/sys/file/del-enterprise-file"), //企业附件删除
  deleteAttachOther: resolveUrl("sys/sys/file/del-other-cert-file"), //其他资质附件删除
  deleteAttachProd: resolveUrl("sys/sys/file/del-product-license-file"), //生产许可证附件删除
  deleteAttachTrade: resolveUrl("sys/sys/file/del-trade-license-file"), //营业执照附件删

  getRoleUserTreeUrl: resolveUrl("sys/hierarchical/getRoleUserTree"), //获取角色用户

  // 业务员管理
  getSalesmanManagerTreeUrl: resolveUrl(
    "sys/sys/salesman/getSalesmanManagerTree"
  ), //查询区域级业务员列表
  getSalesmanManagerTreeBackUrl: resolveUrl(
    "sys/sys/salesman/getSalesmanManagerTreeBack"
  ), //查询区域级业务员列表
  postSaveManagerUrl: resolveUrl("sys/sys/salesman/saveManager"), //新增区域
  putEditManagerUrl: resolveUrl("sys/sys/salesman/editManager"), //编辑区域
  deleteDelManagerUrl: resolveUrl("sys/sys/salesman/delBatchManager"), //删除区域
  postSalesByIdUrl: resolveUrl("sys/sys/salesman/getListById"), //查询业务员
  postSaveSalesmanUrl: resolveUrl("sys/sys/salesman/saveSalesman"), //新增业务员
  putEditSalesmanUrl: resolveUrl("sys/sys/salesman/edit"), //编辑业务员
  deleteDelSalesmanUrl: resolveUrl("sys/sys/salesman/delBatch"), //批量删除业务员
  postSetManagerAdminUrl: resolveUrl("sys/sys/salesman/setManagerAdmin"), //设置为区域管理员
  putMovingRegionUrl: resolveUrl("sys/sys/salesman/movingRegion"), //移动业务员区域
  postSaveSalesmanBatchUrl: resolveUrl("sys/sys/salesman/saveSalesmanBatch"), //批量添加业务员
  getUserInfoUrl: resolveUrl("sys/system-user-management/getUserInfo"), //获取用户详情数据

  // 版本
  getVersionTreeUrl: resolveUrl("sys/version/versionTree"), //版本树
  putAddVersionUrl: resolveUrl("sys/version/saveVersion"), //新增版本
  putEditVersionUrl: resolveUrl("sys/version/editVersion"), //修改版本
  deleteVersionUrl: resolveUrl("sys/version/deleteVersion"), //删除版本

  // 按钮配置页面
  // 菜单按钮
  getBtnConfigTreeListUrl: resolveUrl("sys/hierarchical/getApplyMenuTree"), // 侧边树形接口
  getBtnDetailListUrl: resolveUrl("button/button-control/getInfo"), //获取菜单按钮数据-根据菜单
  postMenuBtnUrl: resolveUrl("button/button-control/save"), //菜单按钮 - 新增菜单
  putMenuBtnUrl: resolveUrl("button/button-control/editDetail"), //菜单按钮 - 修改菜单按钮
  putMenuFormUrl: resolveUrl("button/button-control/edit"), //菜单按钮 - 编辑菜单介绍部分
  deleteMenuListUrl: resolveUrl("button/button-control/delById"), //菜单按钮 - 删除按钮
  //获取业务页面按钮
  postDetailBtnListUrl: resolveUrl("button/button-control/getWebButton"),

  // 角色配置//文件夹权限配置
  getRoleFilePurviewListUrl: resolveUrl("file/folder-auth/get-role-folder"),
  postRoleFilePurviewUrl: resolveUrl("file/folder-auth/save-role-folder"),

  //获取脚本配置数据-Groovy配置
  getScriptListUrl: resolveUrl("button/script/getPage"), //获取脚本配置数据 -查询脚本配置
  postScriptListUrl: resolveUrl("button/script/save"), //获取脚本配置数据 - 添加脚本配置
  putScriptListUrl: resolveUrl("button/script/edit"), //获取脚本配置数据 - 编辑脚本配置
  deleteScriptListUrl: resolveUrl("button/script/delById"), //获取脚本配置数据 - 删除脚本配置

  //获取表配置数据 - SQL配置
  getTableConfigListUrl: resolveUrl("button/table-config/getPage"), //获取表配置数据
  postTableConfigListUrl: resolveUrl("button/table-config/save"), //获取表配置数据 - 添加表配置
  putTableConfigListUrl: resolveUrl("button/table-config/edit"), //获取表配置数据 - 编辑表配置
  deleteTableConfigListUrl: resolveUrl("button/table-config/delById"), //获取表配置数据 - 删除表配置

  // 查询脚本逻辑-Rule配置
  getScriptAlgorithmListUrl: resolveUrl("button/script-algorithm/getPage"), //获取查询脚本逻辑
  postScriptAlgorithmListUrl: resolveUrl("button/script-algorithm/save"), //查询脚本逻辑 - 添加脚本逻辑
  putScriptAlgorithmListUrl: resolveUrl("button/script-algorithm/edit"), //查询脚本逻辑 - 编辑脚本逻辑
  deleteScriptAlgorithmListUrl: resolveUrl("button/script-algorithm/delById"), //查询脚本逻辑- 删除脚本逻辑

  //获取菜单动态字段 - 动态字段
  getFieldConfigListUrl: resolveUrl("button/field-config/getPage"), //获取菜单动态字段
  postFieldConfigListUrl: resolveUrl("button/field-config/save"), //获取菜单动态字段- 添加 动态字段
  putFieldConfigListUrl: resolveUrl("button/field-config/edit"), //获取菜单动态字段 - 编辑 动态字段
  deleteFieldConfigListUrl: resolveUrl("button/field-config/delById"), //获取菜单动态字段- 删除 动态字段

  //获取菜单动态字段colmun
  postCongifColmunListUrl: resolveUrl("button/field-config/getTypeList"),
  getAlgorithmListUrl: resolveUrl("button/script-algorithm/getList"),
  // 菜单 获取下拉父级
  getMenuParentListUrl: resolveUrl("button/button-control/getButtonTree"),
  // 表头配置 一览表搜索
  getTableColumnConfigListUrl: resolveUrl("button/columns-config/getPage"),
  deleteTableColumnUrl: resolveUrl("button/columns-config/delById"),
  postTableColumnConfigListUrl: resolveUrl("button/columns-config/save"),
  putTableColumnConfigUrl: resolveUrl("button/columns-config/edit"),
  getTableColumnConfigDetailUrl: resolveUrl("button/columns-config/getInfo"),

  // 业务员提成报表
  getSalesManagerUrl: resolveUrl('sys/salesman-commission/salesManager'),
  putEditSalesmanCommissionUrl: resolveUrl('sys/salesman-commission/editSalesmanCommission'),
  getSalesManagerListUrl: resolveUrl('sys/salesman-commission/list'),
  putSalesCommissionArchiveUrl: resolveUrl('sys/salesman-commission/archive'),
  putSalesCommissionRollbackArchiveUrl: resolveUrl('sys/salesman-commission/rollbackArchive'),

  // 欠款登记报表
  getRegisterUrl: resolveUrl('sys/salesman-debt-register/getList'),
  postRegisterImportUrl: resolveUrl('sys/salesman-debt-register/import'),
  deleteManagerDebtRegisterUrl: resolveUrl('sys/salesman-debt-register/delManagerDebtRegister'),
  getRegisterExportUrl: resolveUrl('sys/salesman-debt-register/export'),


  // 用户维护
  putUpdateStateUrl: resolveUrl("sys/system-user-management/updateState"), //修改用户状态
  putSaveUserCertUrl: resolveUrl('sys/sys-user-certification/save-user-cert'),  ///保存用户资质
  deleteDelUserCertUrl: resolveUrl('sys/sys-user-certification/del-user-cert'), //删除用户资质
  getUserCertUrl: resolveUrl('sys/sys-user-certification/list-user-cert'), //获取用户资质
  putEitUserCertUrl: resolveUrl('sys/sys-user-certification/edit-user-cert'), //编辑用户资质

  // 登录日志
  getLoginLogListUrl: resolveUrl('sys/log-login/list'), //登录日志列表
  // 操作日志
  getOperationListUrl: resolveUrl('sys/sys-operation-log/list-page'), //操作日志列表


  getJustDeptListListUrl: resolveUrl("sys/sys/dept/justDeptList"),
  getOrderUsersListUrl: resolveUrl("sys/system-user-management/search-order-users"),
  // 专家
  getSearchEmployeeUsersUrl: resolveUrl('sys/system-user-management/search-employee-users'),
};

class ApiInstance {
  // 公告
  postAddProclamation(data) {
    return request({
      method: "POST",
      url: URLs.postAddProclamationUrl,
      data: { ...data },
    });
  }
  putEditProclamation(data) {
    return request({
      method: "put",
      url: URLs.putEditProclamationUrl,
      data: { ...data },
    });
  }
  getProclamationList(condition, page = 1, size = 20) {
    return request({
      method: "GET",
      url: URLs.getProclamationListUrl,
      params: {
        ...condition,
        page,
        size,
      },
    });
  }
  getProclamationListExport(condition) {
    return request({
      method: "GET",
      url: URLs.getProclamationListExportUrl,
      params: {
        ...condition,
      },
      responseType: "blob",
    });
  }
  getProclamationDetail(data) {
    return request({
      method: "get",
      url: URLs.getProclamationDetailUrl,
      params: { ...data },
    });
  }
  putProclamation(data) {
    return request({
      method: "put",
      url: URLs.putProclamationUrl,
      data: { ...data },
    });
  }
  deleteProclamation(id) {
    return request({
      method: "delete",
      url: URLs.deleteProclamationUrl,
      data: id,
    });
  }

  getOrderUsersList() {
    return request({
      method: "get",
      url: URLs.getOrderUsersListUrl,
    });
  }
  getJustDeptListList() {
    return request({
      method: "get",
      url: URLs.getJustDeptListListUrl,
    });
  }
  getOperationListApi(data, token) {
    return request({
      method: "get",
      url: URLs.getOperationListUrl,
      headers: {
        Authorization: token,
      },
      params: {
        ...data,
      }
    });
  }
  getLoginLogListApi(data, token) {
    return request({
      method: "get",
      url: URLs.getLoginLogListUrl,
      headers: {
        Authorization: token,
      },
      params: {
        ...data,
      }
    });
  }

  //添加表配置
  getTableColumnConfigDetail(data) {
    return request({ method: "get", url: URLs.getTableColumnConfigDetailUrl, params: data, });
  }
  postTableColumnConfigList(data) {
    return request({
      method: "post",
      url: URLs.postTableColumnConfigListUrl,
      data,
    });
  }
  //编辑表配置
  putTableColumnConfig(data) {
    return request({
      method: "put",
      url: URLs.putTableColumnConfigUrl,
      data,
    });
  }
  deleteTableColumn(data) {
    return request({
      method: "delete",
      url: URLs.deleteTableColumnUrl,
      params: { ...data },
    });
  }
  getTableColumnConfigList(data) {
    return request({ method: "get", url: URLs.getTableColumnConfigListUrl, params: data, });
  }


  getAlgorithmList() {
    return request({ method: "get", url: URLs.getAlgorithmListUrl });
  }
  getMenuParentList(data) {
    return request({ method: "get", url: URLs.getMenuParentListUrl, params: data, });
  }
  //菜单按钮**
  //按钮配置 树状搜索
  getBtnConfigTreeList() {
    return request({ method: "get", url: URLs.getBtnConfigTreeListUrl });
  }
  //获取菜单按钮数据-根据菜单
  getBtnDetailList(data) {
    return request({
      method: "get",
      url: URLs.getBtnDetailListUrl,
      params: data,
    });
  }
  getRoleFilePurviewList(data) {
    return request({
      method: "get",
      url: URLs.getRoleFilePurviewListUrl,
      params: data,
    });
  }
  postRoleFilePurview(data) {
    return request({ method: "post", url: URLs.postRoleFilePurviewUrl, data: data });
  }
  //菜单按钮-新增
  postMenuBtn(data) {
    return request({ method: "post", url: URLs.postMenuBtnUrl, data: data });
  }
  //菜单按钮-修改
  putMenuBtn(data) {
    return request({ method: "put", url: URLs.putMenuBtnUrl, data });
  }
  //菜单按钮-修改菜单详情
  putMenuForm(data) {
    return request({ method: "put", url: URLs.putMenuFormUrl, data });
  }
  // 删除菜单按钮
  deleteMenuList(data) {
    return request({
      method: "delete",
      url: URLs.deleteMenuListUrl,
      params: { ...data },
    });
  }


  //脚本逻辑-Groovy配置**
  //获取脚本配置数据
  getScriptList(data) {
    return request({ method: "get", url: URLs.getScriptListUrl, params: data });
  }
  //添加脚本配置
  postScriptList(data) {
    return request({
      method: "post",
      url: URLs.postScriptListUrl,
      data: data,
    });
  }
  //编辑脚本配置
  putScriptList(data) {
    return request({ method: "put", url: URLs.putScriptListUrl, data: data });
  }
  //删除脚本配置
  deleteScriptList(data) {
    return request({
      method: "delete",
      url: URLs.deleteScriptListUrl,
      params: { ...data },
    });
  }

  //表配置数据 **
  //获取表配置数据
  getTableConfigList(data) {
    return request({
      method: "get",
      url: URLs.getTableConfigListUrl,
      params: data,
    });
  }
  //添加表配置
  postTableConfigList(data) {
    return request({
      method: "post",
      url: URLs.postTableConfigListUrl,
      data: data,
    });
  }
  //编辑表配置
  putTableConfigList(data) {
    return request({
      method: "put",
      url: URLs.putTableConfigListUrl,
      data: data,
    });
  }
  //删除表配置
  deleteTableConfigList(data) {
    return request({
      method: "delete",
      url: URLs.deleteTableConfigListUrl,
      params: { ...data },
    });
  }
  //脚本逻辑-**
  //获取查询脚本逻辑
  getScriptAlgorithmList(data) {
    return request({
      method: "get",
      url: URLs.getScriptAlgorithmListUrl,
      params: data,
    });
  }
  //添加表配置
  postScriptAlgorithmList(data) {
    return request({
      method: "post",
      url: URLs.postScriptAlgorithmListUrl,
      data: data,
    });
  }
  //编辑表配置
  putScriptAlgorithmList(data) {
    return request({
      method: "put",
      url: URLs.putScriptAlgorithmListUrl,
      data: data,
    });
  }
  //删除表配置
  deleteScriptAlgorithmList(data) {
    return request({
      method: "delete",
      url: URLs.deleteScriptAlgorithmListUrl,
      params: { ...data },
    });
  }

  //菜单动态字段****
  //获取菜单动态字段
  getFieldConfigList(data) {
    return request({
      method: "get",
      url: URLs.getFieldConfigListUrl,
      params: data,
    });
  }
  //添加表配置
  postFieldConfigList(data) {
    return request({
      method: "post",
      url: URLs.postFieldConfigListUrl,
      data,
    });
  }
  //编辑表配置
  putFieldConfigList(data) {
    return request({
      method: "put",
      url: URLs.putFieldConfigListUrl,
      data,
    });
  }
  //删除表配置
  deleteFieldConfigList(data) {
    return request({
      method: "delete",
      url: URLs.deleteFieldConfigListUrl,
      params: { ...data },
    });
  }
  //获取菜单动态字段colmun
  postCongifColmunList() {
    return request({
      method: "post",
      url: URLs.postCongifColmunListUrl,
      data: ['columnFrom']
    });
  }

  //系统管理
  getSysTree(type) {
    return request({
      method: "get",
      url: URLs.getSysTree + "?HierarchicalType=" + type,
    });
  }

  //部门管理
  getDeptTree() {
    return request({ method: "get", url: URLs.getDeptTree });
  }
  getDeepDeptTree() {
    return request({ method: "get", url: URLs.getDeepDeptTree });
  }
  getDeptList(data = {}) {
    return request({ method: "get", url: URLs.getDeptList, params: data });
  }
  getSaleEmployee() {
    return request({ method: "get", url: URLs.getSaleEmployeeUrl });
  }
  addDept(data) {
    return request({ method: "post", url: URLs.addDept, data });
  }
  editDept(data) {
    return request({ method: "put", url: URLs.editDept, data });
  }
  deleteDept(id) {
    return request({
      method: "delete",
      url: URLs.deleteDept + "?deptId=" + id,
    });
  }
  detailDept(deptId) {
    return request({ method: "get", url: URLs.detailDept, params: { deptId } });
  }

  //企业管理
  getApsTree() {
    return request({ method: "get", url: URLs.getApsTree });
  }
  addAps(data) {
    return request({ method: "post", url: URLs.addAps, data });
  }
  editAps(data) {
    return request({ method: "put", url: URLs.editAps, data });
  }
  deleteAps(id) {
    return request({
      method: "delete",
      url: URLs.deleteAps + "?clientId=" + id,
    });
  }
  detailAps(clientId) {
    return request({
      method: "get",
      url: URLs.detailAps,
      params: { clientId },
    });
  }
  getAps(id = 0) {
    return request({
      method: "get",
      url: URLs.getAps + (id ? "?sysOrganizationId=" + id : ""),
    });
  }
  getLocation(clientId) {
    return request({
      method: "get",
      url: URLs.getLocation,
      params: { clientId },
    });
  }
  addLocation(data) {
    return request({ method: "put", url: URLs.addLocation, data });
  }
  editLocation(data) {
    return request({ method: "put", url: URLs.editLocation, data });
  }
  delLocation(id) {
    return request({
      method: "delete",
      url: URLs.delLocation + "?productAddrId=" + id,
    });
  }
  getTradeLic(clientId) {
    return request({
      method: "get",
      url: URLs.getTradeLic,
      params: { clientId },
    });
  }
  addTradeLic(data) {
    return request({ method: "put", url: URLs.addTradeLic, data });
  }
  editTradeLic(data) {
    return request({ method: "put", url: URLs.editTradeLic, data });
  }
  delTradeLic(id) {
    return request({
      method: "delete",
      url: URLs.delTradeLic + "?tradeLicenseId=" + id,
    });
  }
  getProductLic(clientId) {
    return request({
      method: "get",
      url: URLs.getProductLic,
      params: { clientId },
    });
  }
  addProductLic(data) {
    return request({ method: "put", url: URLs.addProductLic, data });
  }
  editProductLic(data) {
    return request({ method: "put", url: URLs.editProductLic, data });
  }
  delProductLic(id) {
    return request({
      method: "delete",
      url: URLs.delProductLic + "?productAddrId=" + id,
    });
  }
  getProductCert(clientId) {
    return request({
      method: "get",
      url: URLs.getProductCert,
      params: { clientId },
    });
  }
  addProductCert(data) {
    return request({ method: "put", url: URLs.addProductCert, data });
  }
  editProductCert(data) {
    return request({ method: "put", url: URLs.editProductCert, data });
  }
  delProductCert(id) {
    return request({
      method: "delete",
      url: URLs.delProductCert + "?certId=" + id,
    });
  }
  getProductOtherCert(clientId) {
    return request({
      method: "get",
      url: URLs.getProductOtherCert,
      params: { clientId },
    });
  }
  addProductOtherCert(data) {
    return request({ method: "put", url: URLs.addProductOtherCert, data });
  }
  editProductOtherCert(data) {
    return request({ method: "put", url: URLs.editProductOtherCert, data });
  }
  delProductOtherCert(id) {
    return request({
      method: "delete",
      url: URLs.delProductOtherCert + "?otherId=" + id,
    });
  }

  //区域管理
  getRegionTree(token) {
    return request({
      method: "get",
      url: URLs.getRegionTree + "?showFlag=0",
      headers: {
        Authorization: token,
      }
    });
  }

  getRegionTrees(token) {
    return request({
      method: "get",
      url: URLs.getRegionTree + "?showFlag=1",
      headers: {
        Authorization: token,
      },
    });
  }

  deleteRegionDatails(code) {
    return request({
      method: 'delete',
      url: URLs.deleteRegionDatails,
      params: { code }
    })
  }

  editRegionDatails(data) {
    return request({
      method: 'put',
      url: URLs.editRegionDatails,
      data
    })
  }

  getRegionDetails(code) {
    return request({
      method: "get",
      url: URLs.getRegionDatails,
      params: { code }
    });
  }

  addRegionDatails(data) {
    return request({ method: "put", url: URLs.addRegionDatails, data });
  }

  // 导入execl
  postimportRegionDetailUrl(file, id) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    return request({
      method: "POST",
      url: URLs.postimportRegionDetailUrl,
      data: formData,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }
  // execl导出
  postRegionDetailExport() {
    // console.log(data,'data');
    return request({
      method: "GET",
      url: URLs.postRegionDetailExport,
      responseType: "blob",
    });
  }

  getOrgAps(id) {
    return request({ method: "post", url: URLs.getOrgAps, params: { id } });
  }
  addOrg(data) {
    return request({ method: "post", url: URLs.addOrg, data });
  }
  editOrg(data) {
    return request({ method: "put", url: URLs.editOrg, data });
  }
  deleteOrg(id) {
    return request({ method: "delete", url: URLs.deleteOrg + "?id=" + id });
  }
  detailOrg(id) {
    return request({ method: "get", url: URLs.detailOrg, params: { id } });
  }

  // 区域管理
  getOrgTree() {
    return request({ method: "get", url: URLs.getOrgTree });
  }

  //岗位管理
  getPostTree() {
    return request({ method: "get", url: URLs.getPostTree });
  }
  getDeepPostTree() {
    return request({ method: "get", url: URLs.getDeepPostTree });
  }
  addPost(data) {
    return request({ method: "post", url: URLs.addPost, data });
  }
  editPost(data) {
    return request({ method: "put", url: URLs.editPost, data });
  }
  deletePost(id) {
    return request({
      method: "delete",
      url: URLs.deletePost + "?postId=" + id,
    });
  }
  detailPost(postId) {
    return request({ method: "get", url: URLs.detailPost, params: { postId } });
  }
  getApsPost(clientId) {
    return request({
      method: "get",
      url: URLs.getApsPost,
      params: { clientId },
    });
  }
  getDeptPost(deptId) {
    return request({
      method: "get",
      url: URLs.getDeptPost,
      params: { deptId },
    });
  }

  //字典管理
  getDictTree() {
    return request({ method: "get", url: URLs.getDictTree });
  }
  addDict(data) {
    return request({ method: "post", url: URLs.addDict, data });
  }
  editDict(data) {
    return request({ method: "put", url: URLs.editDict, data });
  }
  detailDict(id) {
    return request({ method: "get", url: URLs.detailDict, params: { id } });
  }
  deleteDict(id) {
    return request({ method: "delete", url: URLs.deleteDict + "?id=" + id });
  }
  getApplyDict(applyId) {
    return request({
      method: "get",
      url: URLs.getApplyDict,
      params: { applyId },
    });
  }
  getDictItem(id) {
    return request({ method: "get", url: URLs.getDictItem, params: { id } });
  }
  addDictItem(data) {
    return request({ method: "post", url: URLs.addDictItem, data });
  }
  editDictItem(data) {
    return request({ method: "put", url: URLs.editDictItem, data });
  }
  detailDict(id) {
    return request({ method: "get", url: URLs.detailDict, params: { id } });
  }
  deleteDictItem(id) {
    return request({
      method: "delete",
      url: URLs.deleteDictItem + "?id=" + id,
    });
  }

  //应用管理
  getApplyTree() {
    return request({ method: "get", url: URLs.getApplyTree });
  }
  getCheckApply(clientId) {
    return request({
      method: "get",
      url: URLs.getCheckApply,
      params: { clientId },
    });
  }
  getUnCheckApply(id) {
    return request({
      method: "get",
      url: URLs.getUnCheckApply,
      params: { id },
    });
  }
  saveCheckApply(data) {
    return request({ method: "put", url: URLs.saveCheckApply, data });
  }
  saveApply(data) {
    return request({ method: "post", url: URLs.saveApply, data });
  }
  editApply(data) {
    return request({ method: "put", url: URLs.editApply, data });
  }
  deleteApply(id) {
    return request({ method: "delete", url: URLs.deleteApply + "?id=" + id });
  }
  detailApply(id) {
    return request({ method: "get", url: URLs.detailApply, params: { id } });
  }

  //用户权限
  getUserRoles(id) {
    return request({ method: "get", url: URLs.getUserRoles + "?userId=" + id });
  }
  getEmpTree() {
    return request({ method: "get", url: URLs.getEmpTree });
  }
  getUserMenu(userId) {
    return request({
      method: "get",
      url: URLs.getUserMenu,
      params: { userId },
    });
  }
  saveUserMenu(id, data) {
    return request({
      method: "post",
      url: URLs.saveUserMenu + "?userId=" + id,
      data,
    });
  }

  //菜单管理
  getApplyList() {
    return request({ method: "get", url: URLs.getAppList });
  }
  getMenuApp() {
    return request({ method: "get", url: URLs.getMenuApp });
  }
  getAllMenuTree(params) {
    return request({ method: "get", url: URLs.getAllMenuTree, params });
  }
  getMenuTree(parentId) {
    return request({
      method: "get",
      url: URLs.getMenuTree,
      params: { parentId },
    });
  }
  getMenuList(applyId) {
    return request({
      method: "get",
      url: URLs.getMenuList,
      params: { applyId },
    });
  }
  getMenuNoPerm(applyId) {
    return request({
      method: "get",
      url: URLs.getMenuNoPerm,
      params: { applyId },
    });
  }
  addMenu(data) {
    return request({ method: "post", url: URLs.addMenu, data });
  }
  editMenu(data) {
    return request({ method: "put", url: URLs.editMenu, data });
  }
  deleteMenu(id) {
    return request({ method: "delete", url: URLs.deleteMenu + "/" + id });
  }
  detailMenu(id) {
    return request({ method: "get", url: URLs.deleteMenu + "/" + id });
  }

  //角色管理
  getRolePerms(data) {
    return request({ method: "post", url: URLs.getRolePerms, data });
  }
  getRoleTree() {
    return request({ method: "get", url: URLs.getRoleTree });
  }
  addRoleTree(data) {
    return request({ method: "post", url: URLs.addRoleTree, data });
  }
  editRoleTree(data) {
    return request({ method: "put", url: URLs.editRoleTree, data });
  }
  delRoleTree(id) {
    return request({ method: "delete", url: URLs.delRoleTree + "?id=" + id });
  }
  changeRoleGroup(data) {
    return request({ method: "put", url: URLs.changeRoleGroup, data });
  }
  getRoleGroupTree() {
    return request({ method: "get", url: URLs.getRoleGroupTree });
  }
  getRoleMember(roleId) {
    return request({
      method: "get",
      url: URLs.getRoleMember,
      params: { roleId },
    });
  }
  addRole(data) {
    return request({ method: "post", url: URLs.addRole, data });
  }
  editRole(data) {
    return request({ method: "put", url: URLs.editRole, data });
  }
  putEditRole(data) {
    return request({ method: "put", url: URLs.putEditRole, data });
  }
  delRole(id) {
    return request({ method: "delete", url: URLs.delRole + "/" + id });
  }
  detailRole(id) {
    return request({ method: "get", url: URLs.detailRole + "/" + id });
  }
  getRoleList() {
    return request({
      method: "get",
      url: URLs.getRoleList + "?page=1&size=9999",
    });
  }
  roleAddUser(data) {
    return request({ method: "post", url: URLs.roleAddUser, data });
  }

  //用户管理
  getUser(data) {
    return request({
      method: "get",
      url: URLs.getUser,
      params: { ...data },
      paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false });
      },
    });
  }
  addUser(data) {
    return request({ method: "post", url: URLs.addUser, data });
  }
  editUser(data) {
    return request({ method: "put", url: URLs.editUser, data });
  }
  deleteUser(id) {
    return request({ method: "delete", url: URLs.deleteUser + "/" + id });
  }
  detailUser(id) {
    return request({ method: "get", url: URLs.detailUser + "/" + id });
  }
  resetPassword(userId) {
    return request({
      method: "put",
      url: URLs.resetPassword,
      data: { userId },
    });
  }
  getUserTree() {
    return request({ method: "get", url: URLs.getUserTree });
  }
  getUserSelectTree(HierarchicalType) {
    return request({
      method: "get",
      url: URLs.getUserSelectTree,
      params: { HierarchicalType },
    });
  }
  modifyPassword(data) {
    return request({ method: "put", url: URLs.modifyPassword, data });
  }
  forceEditPassword(data, token) {
    return request({
      method: "put",
      url: URLs.forceEditPassword,
      data,
      headers: {
        security: token,
      },
    });
  }

  //职员管理
  getEmployee(data) {
    return request({ method: "get", url: URLs.getEmployee, params: data });
  }
  addEmployee(data, createUser) {
    return request({
      method: "post",
      url: URLs.addEmployee + "?createUser=" + createUser,
      data,
    });
  }
  editEmployee(data) {
    return request({ method: "put", url: URLs.editEmployee, data });
  }
  deleteEmployee(id) {
    return request({
      method: "delete",
      url: URLs.deleteEmployee + "?id=" + id,
    });
  }
  detailEmployee(id) {
    return request({ method: "get", url: URLs.detailEmployee, params: { id } });
  }
  employeeToUser(arr) {
    return request({ method: "post", url: URLs.employeeToUser, data: arr });
  }
  userToEmployee(data) {
    return request({ method: "post", url: URLs.userToEmployee, data });
  }

  //资质管理
  getEmployeeCert(id) {
    return request({
      method: "get",
      url: URLs.getEmployeeCert,
      params: { id },
    });
  }
  getCertList(employeeId) {
    return request({
      method: "get",
      url: URLs.getCertList,
      params: { employeeId },
    });
  }
  addEmployeeCert(data) {
    return request({ method: "post", url: URLs.addEmployeeCert, data });
  }
  editEmployeeCert(data) {
    return request({ method: "put", url: URLs.editEmployeeCert, data });
  }
  deleteEmployeeCert(id) {
    return request({
      method: "delete",
      url: URLs.deleteEmployeeCert + "?id=" + id,
    });
  }

  //附件管理
  getAttachCert(data) {
    return request({ method: "post", url: URLs.getAttachCert, data });
  }
  getAttachEmployee(data) {
    return request({ method: "post", url: URLs.getAttachEmployee, data });
  }
  getAttachEps(data) {
    return request({ method: "post", url: URLs.getAttachEps, data });
  }
  getAttachOther(data) {
    return request({ method: "post", url: URLs.getAttachOther, data });
  }
  getAttachProd(data) {
    return request({ method: "post", url: URLs.getAttachProd, data });
  }
  getAttachTrade(data) {
    return request({ method: "post", url: URLs.getAttachTrade, data });
  }
  addAttachCert(data) {
    return request({ method: "post", url: URLs.addAttachCert, data });
  }
  addAttachEmployee(data) {
    return request({ method: "post", url: URLs.addAttachEmployee, data });
  }
  addAttachEps(data) {
    return request({ method: "post", url: URLs.addAttachEps, data });
  }
  addAttachOther(data) {
    return request({ method: "post", url: URLs.addAttachOther, data });
  }
  addAttachProd(data) {
    return request({ method: "post", url: URLs.addAttachProd, data });
  }
  addAttachTrade(data) {
    return request({ method: "post", url: URLs.addAttachTrade, data });
  }
  deleteAttachCert(id) {
    return request({
      method: "delete",
      url: URLs.deleteAttachCert + "?id=" + id,
    });
  }
  deleteAttachEmployee(id) {
    return request({
      method: "delete",
      url: URLs.deleteAttachEmployee + "?id=" + id,
    });
  }
  deleteAttachEps(id) {
    return request({
      method: "delete",
      url: URLs.deleteAttachEps + "?id=" + id,
    });
  }
  deleteAttachOther(id) {
    return request({
      method: "delete",
      url: URLs.deleteAttachOther + "?id=" + id,
    });
  }
  deleteAttachProd(id) {
    return request({
      method: "delete",
      url: URLs.deleteAttachProd + "?id=" + id,
    });
  }
  deleteAttachTrade(id) {
    return request({
      method: "delete",
      url: URLs.deleteAttachTrade + "?id=" + id,
    });
  }

  getRoleUserTree() {
    return request({ method: "get", url: URLs.getRoleUserTreeUrl });
  }

  // 业务员管理
  getSalesmanManagerTree() {
    return request({
      method: "get",
      url: URLs.getSalesmanManagerTreeUrl,
    });
  }
  getSalesmanManagerTreeBack() {
    return request({
      method: "get",
      url: URLs.getSalesmanManagerTreeBackUrl,
    });
  }
  postSaveManager(data) {
    return request({
      method: "post",
      url: URLs.postSaveManagerUrl,
      data,
    });
  }
  putEditManager(data) {
    return request({
      method: "put",
      url: URLs.putEditManagerUrl,
      data,
    });
  }
  deleteDelManager(data) {
    return request({
      method: "delete",
      url: URLs.deleteDelManagerUrl,
      data,
    });
  }
  postSalesById(data) {
    return request({
      method: "post",
      url: URLs.postSalesByIdUrl,
      params: { current: 1, size: 10000 },
      data,
    });
  }
  postSaveSalesman(data) {
    return request({
      method: "post",
      url: URLs.postSaveSalesmanUrl,
      data,
    });
  }
  putEditSalesman(data) {
    return request({
      method: "put",
      url: URLs.putEditSalesmanUrl,
      data,
    });
  }
  deleteDelSalesman(data) {
    return request({
      method: "delete",
      url: URLs.deleteDelSalesmanUrl,
      data,
    });
  }
  postSetManagerAdmin(data) {
    return request({
      method: "post",
      url: URLs.postSetManagerAdminUrl,
      data,
    });
  }
  putMovingRegion(data) {
    return request({
      method: "put",
      url: URLs.putMovingRegionUrl,
      data,
    });
  }
  postSaveSalesmanBatch(data) {
    return request({
      method: "post",
      url: URLs.postSaveSalesmanBatchUrl,
      data,
    });
  }
  getUserInfo(id) {
    return request({
      method: "get",
      url: URLs.getUserInfoUrl + `/${id}`,
    });
  }

  // 版本
  getVersionTree() {
    return request({
      method: "get",
      url: URLs.getVersionTreeUrl,
    });
  }
  putAddVersion(data) {
    return request({
      method: "put",
      url: URLs.putAddVersionUrl,
      data,
    });
  }
  putEditVersion(data) {
    return request({
      method: "put",
      url: URLs.putEditVersionUrl,
      data,
    });
  }
  deleteVersion(id) {
    return request({
      method: "delete",
      url: URLs.deleteVersionUrl,
      params: { id },
    });
  }

  // 业务员提成报表
  getSalesManager() {
    return request({
      method: 'get',
      url: URLs.getSalesManagerUrl,
    })
  }
  putEditSalesmanCommission(data) {
    return request({
      method: 'put',
      url: URLs.putEditSalesmanCommissionUrl,
      data
    })
  }
  getSalesManagerList(data) {
    return request({
      method: 'get',
      url: URLs.getSalesManagerListUrl,
      params: {
        ...data,
        oldNewFlag: 1
      }
    })
  }
  putSalesCommissionArchive(data) {
    return request({
      method: 'put',
      url: URLs.putSalesCommissionArchiveUrl,
      params: {
        ...data,
        oldNewFlag: 1
      }
    })
  }
  putSalesCommissionRollbackArchive(data) {
    return request({
      method: 'put',
      url: URLs.putSalesCommissionRollbackArchiveUrl,
      params: {
        ...data,
        oldNewFlag: 1
      }
    })
  }

  getRegister(salesmanManagerId) {
    return request({
      method: 'get',
      url: URLs.getRegisterUrl,
      params: { salesmanManagerId }
    })
  }
  postRegisterImport(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      method: 'post',
      url: URLs.postRegisterImportUrl,
      data: formData,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
  }
  deleteManagerDebtRegister(salesmanManagerId) {
    return request({
      method: 'delete',
      url: URLs.deleteManagerDebtRegisterUrl,
      params: { salesmanManagerId }
    })
  }
  getRegisterExport(salesmanManagerId) {
    return request({
      method: 'get',
      url: URLs.getRegisterExportUrl,
      params: { salesmanManagerId },
      responseType: "blob"
    })
  }


  // 用户维护
  putUpdateState(data) {
    return request({
      method: 'put',
      url: URLs.putUpdateStateUrl,
      data
    })
  }
  putSaveUserCert(data) {
    return request({
      method: 'post',
      url: URLs.putSaveUserCertUrl,
      data
    })
  }
  deleteDelUserCert(data) {
    return request({
      method: 'delete',
      url: URLs.deleteDelUserCertUrl,
      params: data
    })
  }
  getUserCert(userId) {
    return request({
      method: 'get',
      url: URLs.getUserCertUrl,
      params: { userId }
    })
  }
  putEitUserCert(data) {
    return request({
      method: 'put',
      url: URLs.putEitUserCertUrl,
      data
    })
  }
  getSearchEmployeeUsers(data) {
    return request({
      method: 'get',
      url: URLs.getSearchEmployeeUsersUrl,
      params: data
    })
  }
}

export default ApiInstance;
