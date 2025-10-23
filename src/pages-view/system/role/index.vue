<template>
  <app-page class="app-page--role">
    <el-row class="main-cont">
      <div class="left-cont">
        <div class="add-button">
          <page-button
            type="text"
            @click="
              create = true;
              roleDlg = true;
            "
            icon="el-icon-circle-plus-outline"
            content="新增角色"
          />
          <page-button
            type="text"
            @click="
              groupCreate = true;
              groupDlg = true;
            "
            icon="el-icon-user"
            content="新增分组"
          />
        </div>
        <div>
          <el-input
            placeholder="请输入查询内容"
            v-model="filterText"
            clearable
          />
          <el-tree
            style="max-height: calc(100% - 60px)"
            class="left-tree"
            default-expand-all
            highlight-current
            :data="rolesTree"
            node-key="roleId"
            @node-click="nodeClick"
            :props="{ label: 'name', children: 'roles' }"
            :expand-on-click-node="false"
            ref="roleTree"
            :filter-node-method="filterNode"
          />
        </div>
      </div>
      <div class="right-cont">
        <template v-if="selrole">
          <h2 class="select-title">{{ selrole.name }}</h2>
          <div style="position: relative; flex: 1; height: 0">
            <div class="tabs-button">
              <page-button v-if="tabkey == '2'" content="保存" @click="save" />
              <page-button
                v-if="selrole && selrole.roleId"
                content="添加用户"
                @click="addMemberDlg = true"
              />
              <page-button
                v-if="selrole && selrole.roleId"
                content="移至分组"
                @click="groupMoveDlg = true"
              />
              <page-button
                v-if="selrole && selrole.roleId"
                content="修改角色"
                @click="
                  create = false;
                  roleDlg = true;
                "
              />
              <page-button
                v-if="selrole && selrole.roleId"
                content="删除角色"
                @click="delDlg = true"
              />
              <page-button
                v-if="selrole && !selrole.roleId"
                content="修改分组"
                @click="
                  groupCreate = false;
                  groupDlg = true;
                "
              />
              <page-button
                v-if="selrole && !selrole.roleId"
                content="删除分组"
                @click="delgroupDlg = true"
              />
            </div>
            <el-tabs v-model="tabkey" class="role-perm-tab">
              <el-tab-pane style="height: 100%" name="1">
                <span slot="label">角色成员</span>
                <div style="width: 100%; height: 100%">
                  <div
                    class="app-table-container"
                    style="
                      display: flex;
                      flex-direction: column;
                      width: 100%;
                      height: 100%;
                    "
                  >
                    <div
                      class="app-table-body"
                      style="width: 100%; flex: 1; height: 0"
                    >
                      <vxe-grid
                        :data="tableData"
                        :columns="tableColumns"
                        height="auto"
                        ref="table"
                      >
                        <template #sex="{ row }">
                          {{ row.sex == "0" ? "男" : "女" }}
                        </template>
                      
        </vxe-grid>
                    </div>
                    <div class="app-table-footer">
                      <vxe-pager
                        :current-page.sync="tablePage.currentPage"
                        :page-size.sync="tablePage.pageSize"
                        :total="tablePage.total"
                        @page-change="pageChange"
                      />
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="2" style="height: 100%">
                <span slot="label">功能权限</span>
                <RolePerm :key="pnum" :roleObj="selrole" ref="rolePerm" />
              </el-tab-pane>
              <el-tab-pane name="3" >
                <span slot="label" >文件夹权限</span>
                <file-purview  :key="num"  :roleObj="selrole" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
        <template v-else>
          <div class="not-role">
            <span>请选择角色</span>
          </div>
        </template>
      </div>
    </el-row>

    <modal
      :title="(create ? '新增' : '修改') + '角色'"
      width="500px"
      :visible="roleDlg"
      @close="roleDlg = false"
    >
      <RoleForm
        v-if="roleDlg"
        :roleObj="selrole"
        :create="create"
        @closeForm="closeRole"
      />
      <template slot="footer_bnt"><span /></template>
    </modal>

    <modal
      :title="(groupCreate ? '新增' : '修改') + '分组'"
      width="500px"
      :visible="groupDlg"
      @close="groupDlg = false"
    >
      <GroupForm
        v-if="groupDlg"
        :roleGroupObj="selrole"
        @closeForm="closeGroup"
      />
      <template slot="footer_bnt"><span /></template>
    </modal>

    <modal
      title="添加用户"
      width="700px"
      :visible="addMemberDlg"
      @close="addMemberDlg = false"
    >
      <addMemberForm
        v-if="addMemberDlg"
        :roleObj="selrole"
        :selectRole="tableOrg"
        @closeForm="closeAddMember"
      />
      <template slot="footer_bnt"><span /></template>
    </modal>

    <modal
      title="移至分组"
      :visible="groupMoveDlg"
      @close="groupMoveDlg = false"
    >
      <MoveGroup
        v-if="groupMoveDlg"
        :roleObj="selrole"
        @closeForm="closeMoveGroup"
      />
      <template slot="footer_bnt"><span /></template>
    </modal>

    <DeleteDialog
      @close="
        (v) => {
          delDlg = false;
          v ? deleteRole() : '';
        }
      "
      :delObj="{
        module: '角色',
        target: selrole ? selrole.name : '',
        flag: delDlg,
      }"
    />
    <DeleteDialog
      @close="
        (v) => {
          delgroupDlg = false;
          v ? deleteGroup() : '';
        }
      "
      :delObj="{
        module: '分组',
        target: selrole ? selrole.name : '',
        flag: delgroupDlg,
      }"
    />
  </app-page>
</template>
<script>
import { ApiSystem } from "@/apis";
const apiSystem = new ApiSystem();

import RolePerm from "./rolePerm";
import RoleForm from "./roleForm";
import GroupForm from "./roleGroup";
import MoveGroup from "./moveGroup";
import addMemberForm from "./addMember";
import eventBus from "@/utils/event-bus.js";
import DeleteDialog from "../components/deleteDialog";
import filePurview from "./com/filePurview/index.vue";

export default {
  name: "role",
  components: {
    RolePerm,
    RoleForm,
    GroupForm,
    MoveGroup,
    DeleteDialog,
    addMemberForm,
    filePurview,
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 255,
      tabkey: "1",
      create: false,
      roleDlg: false,
      groupDlg: false,
      groupCreate: false,
      delgroupDlg: false,
      groupMoveDlg: false,
      delDlg: false,
      addMemberDlg: false,
      rolesTree: [{ name: "角色列表", roles: [] }],
      selrole: undefined,
      tableData: [],
      tableColumns: [
        { title: "姓名", field: "nickName", align: "center" },
        { title: "工号", field: "userName", align: "center" },
        { title: "手机号", field: "phone", align: "center" },
        // { title:'部门', field:'department', align:'center' },
        // { title:'岗位', field:'position', align:'center' },
        {
          title: "性别",
          field: "sex",
          align: "center",
          slots: { default: "sex" },
          sortable: true,
          filters: [
            { label: "男", value: "0" },
            { label: "女", value: "1" },
          ],
          filterMultiple: false,
        },
      ],
      tablePage: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize")
          ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20
          : 20,
        total: 0,
      },
      pnum: 0,
      num:0,
      tableOrg: [],
      filterText: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.roleTree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    tableRange(arr) {
      const { currentPage, pageSize } = this.tablePage;
      return JSON.parse(JSON.stringify(arr)).slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
    },
    pageChange(e) {
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize")
        ? JSON.parse(localStorage.getItem("pageSize"))
        : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.tablePage = {
        ...this.tablePage,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.tableData = this.tableRange(this.tableOrg);
    },
    nodeClick(obj) {
      this.selrole = obj;
      this.tablePage.currentPage = 1;
      obj?.roleId
        ? apiSystem.getRoleMember(obj.roleId).then((res) => {
            this.tableOrg = res.data;
            this.tableData = this.tableRange(this.tableOrg);
            this.tablePage.total = this.tableOrg.length;
            this.pnum += 1;
            this.num += 1;
          })
        : "";
    },
    save() {
      // eventBus.$emit("msgEvent");
      this.$refs.rolePerm && this.$refs.rolePerm?.handleMsgEvent();
    },
    closeRole(v) {
      this.roleDlg = false;
      v ? this.getRoleTree() : "";
    },
    closeGroup(v) {
      this.groupDlg = false;
      if (v) {
        this.selrole = undefined;
        this.getRoleTree();
      }
    },
    closeMoveGroup(v) {
      this.groupMoveDlg = false;
      v ? this.getRoleTree() : "";
    },
    closeAddMember() {
      apiSystem.getRoleMember(this.selrole.roleId).then((res) => {
        this.tableOrg = res.data;
        this.tableData = this.tableRange(this.tableOrg);
        this.tablePage.total = this.tableOrg.length;
        this.pnum += 1;
        this.addMemberDlg = false;
      });
    },
    deleteRole() {
      this.selrole?.roleId
        ? (this.delDlg = true)
        : this.$message.warning("请选择角色");
    },
    deleteRole() {
      apiSystem.delRole(this.selrole.roleId).then((res) => {
        this.$message[res.code == 200 ? "success" : "warning"](res.message);
        this.getRoleTree();
        this.delDlg = false;
      });
    },
    deleteGroup() {
      apiSystem.delRoleTree(this.selrole.id).then((res) => {
        this.$message[res.code == 200 ? "success" : "warning"](res.message);
        this.getRoleTree();
        this.delgroupDlg = false;
      });
    },
    treeFormat(obj) {
      if (!!obj?.roles?.length) {
        obj.roles.forEach((i) => {
          i.name = i.roleName;
        });
      }
      return obj;
    },
    getRoleTree() {
      apiSystem.getRoleTree().then((res) => {
        res.data.forEach((i) => (i = this.treeFormat(i)));
        this.rolesTree[0].roles = res.data;
      });
    },
  },
  created() {
    this.getRoleTree();
  },
};
</script>
<style lang="less">
.role-perm-tab {
  height: calc(100% - 20px);
  .el-tabs__content {
    height: calc(100% - 35px);
    .el-tab-pane:last-child {
      height: 100%;
    }
  }
}
.not-role {
  position: relative;
  height: 100%;
  font-size: 60px;
  color: #ddd;
  span {
    position: absolute;
    left: 40%;
    top: 50%;
  }
}
</style>
<style>
@import "../style/system.css";
</style>

<style lang="scss">
.app-page--role {
  .role-perm-tab {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-tabs__content {
      flex: 1;
      height: 0;
    }
  }
}
</style>
