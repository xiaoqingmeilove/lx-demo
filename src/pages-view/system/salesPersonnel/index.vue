<template>
  <app-page>
    <div class="warp" auto>
      <div class="view-section tab-view-section" style="width: 18%;" >
        <div class="left-warp" auto>
          <div class="add-button">
            <page-button type="text"
              @click="create=true;regionDlg=true;regionObj={orderNum:1}"
              content="新增区域">
              <template #img>
                <img :src="require(`/static/images/ic-quyu.png`)" alt="img" style="margin-right: 6px">
              </template>
            </page-button>
            <page-button type="text"
              @click="editRegion"
              content="修改区域">
              <template #img>
                <img :src="require(`/static/images/ic-xiugai.png`)" alt="img" style="margin-right: 6px">
              </template>
            </page-button>
          </div> 
          <el-input placeholder="请输入查询内容"
            v-model="filterText"
            size="small"
            clearable
            style="width: calc(100% - 20px);margin: 0 auto 5px"
          />
          <div>
            <el-tree style="max-height:calc(100%-30px);"
              class="left-tree-cont"
              default-expand-all
              highlight-current
              node-key="id" 
              :data="regionTree"
              :props="{label:'name', children:'children'}"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              ref="roleTree"
            />
          </div>
        </div>
      </div>
      <div class="view-section tab-view-section" style="width: 81%;" >
        <h3 v-if="!!selrole" style="margin-bottom: 6px">
          {{selrole.name}}
          <el-switch 
            v-model="selrole.enabled"
            :inactive-value="'1'"
            :active-value="'0'"
            style="margin-left: 20px"
            v-if="!!selrole && selrole.name != '全部'"
            @change="changeStatus"
          ></el-switch>
        </h3>
        <el-tabs v-model="tabkey" flex ref="tabs">
          <template #buttons>
            <el-input v-model="queryContent" clearable placeholder="请输入业务员、用户名、手机号、身份证等信息进行查询" style="margin-right:10px" size="small" @keyup.enter.native="onSearch" />
            <page-button @click="onSearch">查询</page-button>
            <page-button style="margin-right: 10%" @click="onReset">清空</page-button>
            <template v-if="selrole && selrole.name != '全部'">
              <page-button @click="addUserDlg=true;associated=false">批量添加业务员</page-button>
              <page-button @click="salesObj={title: '新增',form: {salesmanManagerId: selrole?.id, managerAdmin: 0, status: '0'},flag: true}">添加业务员</page-button>
              <page-button @click="delreginDlg=true">删除区域</page-button>
            </template>
            <vxe-toolbar ref="toolbar">
              <template #tools>
                <table-tools :default-columns="defaultColumns" :tools="['setting']" style="margin: 0 10px"></table-tools>
              </template>
            </vxe-toolbar>
          </template>
          <el-tab-pane name="1">
            <span slot="label">业务员</span>
            <div class="tab-content-container detailed-container" >
              <table-section ref="tableSection" >
                <div class="app-table-container" auto>
                  <div class="app-table-body"> 
                    <vxe-grid 
                      :id="`tb_salesPersonnel_${userInfo.userId}`"
                      :data="tableData"
                      :columns="columns"
                      :custom-config="{ storage: true }"
                      :scroll-y="{ enabled: true }"
                      height= 'auto'
                      ref="table"
                    > 
                      <template #rowNum="{rowIndex}">
                        {{ rowIndex + 1 }}
                      </template>
                      <template #sex="{row}">
                        <span v-if="row.sex==0">男</span>
                        <span v-if="row.sex==1">女</span>
                      </template>
                      <template #type="{row}">
                        <span v-if="row.type==1">内部</span>
                        <span v-else-if="row.type==2">外部</span>
                      </template>
                      <template #managerAdmin="{row}">
                        <page-button v-if="row.managerAdmin==1" theme="success">是</page-button>
                        <page-button v-else-if="row.managerAdmin==0" type="text" :disabled="selrole.name == '全部'" @click="setManagerAdmin(row)">设为区域经理</page-button>
                      </template>
                      <template #status="{row}">
                        <page-button v-if="row.status==0" theme="success">启用</page-button>
                        <page-button v-if="row.status==1" theme="danger">停用</page-button>
                      </template>
                      <template #userName="{row, column}">
                        <span style="color: var(--base-color);cursor:pointer;" @click="toUser(row)">{{row[column.field]}}</span>
                      </template>
                      <template #action="{row}">
                        <!-- :disabled="selrole.name == '全部'" -->
                        <page-button style="margin-left: 5px" type="text" @click="editSales(row)">修改</page-button>
                        <page-button style="margin-left: 5px" type="text" @click="salesmanObj=row;delSalesmanDlg=true">删除</page-button> 
                        <page-button style="margin-left: 5px" type="text" @click="moveDlg=true;moveObj={...row}">移动至</page-button>
                        <page-button style="margin-left: 5px" type="text" @click="associatedDlg=true;associatedObj={...row};tableOrg=row.userId?[{...row}]:[]">关联用户</page-button>
                      </template>
                    
        </vxe-grid>
                  </div>
                </div>
              </table-section>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <addSales v-if="salesObj.flag" :salesObj="salesObj" :regionList="regionListObj.regionList" @ok="saveSalesman" @close="salesObj.flag=false"></addSales>
    <DeleteDialog :width="600" @close="v=>{ v ? delRegion() : delreginDlg = false }" 
        :delObj="{ module: '区域', target: selrole ? selrole.name : '', flag: delreginDlg }"/>
    <DeleteDialog :width="600" @close="v=>{ v ? delSalesman() : delSalesmanDlg = false }" 
        :delObj="{ module: '业务员', target: salesmanObj ? salesmanObj.name : '', flag: delSalesmanDlg }"/>
    <template #custom>
      <vxe-modal 
        v-model="addUserDlg"
        title="新增业务员"
        width="800"
      >
        <add-member v-if="addUserDlg" :roleObj="regionObj" :selectRole="tableData" @Ok="saveSalesmanBatch" @close="addUserDlg=false"></add-member>
      </vxe-modal>
      <vxe-modal 
        v-model="regionDlg"
        :title="create?'新增区域':'修改区域'"
        width="800"
      >
        <template #default>
          <el-form ref="roleForm" :rules="regionRules" :model="regionObj" label-width="90px">
            <el-form-item label="区域名称" prop="name">
              <el-input v-model="regionObj.name" placeholder="请输入区域名称" />
            </el-form-item>
            <el-form-item label="区域编码">
              <el-input v-model="regionObj.code" placeholder="请输入区域编码" />
            </el-form-item>
            <el-form-item label="上级区域">
              <el-select-tree
                v-model="regionObj.parentId"
                class="popup-form--selecttree"
                filterable
                clearable
                check-strictly
                node-key="id"
                :props="{label:'name', children:'children'}"
                :data="regionListObj.regionList"
              >
              </el-select-tree>
            </el-form-item>
            <el-form-item label="所属企业">
              <el-select-tree
                v-model="regionObj.clientId"
                class="popup-form--selecttree"
                filterable
                clearable
                node-key="id"
                :props="{label:'name', children:'children'}"
                :data="regionListObj.clientList"
              >
              </el-select-tree>
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number
                style="width: 100%"
                v-model="regionObj.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
              <el-input
                v-model="regionObj.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注说明"
              />
            </el-form-item>
            <el-form-item label="启用状态">
              <el-radio-group v-model="regionObj.enabled">
                <el-radio v-for="(item, index) in regionListObj.enabled" :key="index" :label="item.value" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div style="margin:25px 0 10px; text-align:right">
            <page-button theme="default" @click="regionDlg=false">取消</page-button>
            <page-button v-if="create" @click="regionOk">保存</page-button>
            <page-button v-else @click="regionEdit">保存</page-button>
          </div>
        </template>
      </vxe-modal>
      <!-- 移动业务员区域 -->
      <vxe-modal 
        v-model="moveDlg"
        title="移动至区域"
        width="800"
      >
        <template #default>
          <el-form ref="roleForm1" :rules="moveRules" :model="moveObj" label-width="100px">
            <el-form-item label="区域名称" prop="salesmanManagerIdNew">
              <el-select-tree
                v-model="moveObj.salesmanManagerIdNew"
                class="popup-form--selecttree"
                filterable
                clearable
                check-strictly
                node-key="id"
                :props="{label:'name', children:'children'}"
                :data="regionListObj.regionList"
              >
              </el-select-tree>
            </el-form-item>
            <div style="line-height: 26px;margin-left: 10px" v-if="moveObj.managerAdmin == 1">
              <div>当前业务员是<span style="color:red;font-size:16px">区域经理</span>，移至新区域后，默认为普通业务员。</div>
              <div>如有需要，请重新设定区域经理！</div>
            </div>
          </el-form>
          <div style="margin:25px 0 10px; text-align:right">
            <page-button theme="default" @click="moveDlg=false">取消</page-button>
            <page-button @click="moveRegion">保存</page-button>
          </div>
        </template>
      </vxe-modal>
      <vxe-modal 
        v-model="associatedDlg"
        title="关联用户"
        width="800"
      >
        <add-member v-if="associatedDlg" :roleObj="regionObj" :selectRole="tableOrg" :associated="true" @Ok="associatedOk" @close="associatedDlg=false"></add-member>
      </vxe-modal>
    </template>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>
