<template>
  <div class="filePurview-page">
    <div class="filePurview-header">
      <span>设置角色对应的功能操作、应用管理、后台管理权限</span>
      <page-button @click="submit">保存</page-button>
    </div>
    <div class="filePbody">
      <div class="filePbody-left">
        <el-input placeholder="搜索" v-model="filterText" clearable />
        <el-tree
          :data="treeData"
          default-expand-all
          highlight-current
          :indent="12"
          ref="roleTree"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="filePbody-right">
        <vxe-grid :data="tableData" :columns="columns" height="auto">
          <template #fileName="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }">
            <el-checkbox :label="row[column.field]" v-model="row.folderLook"></el-checkbox>
           </template>
          <template #cz="{ row, rowIndex }">
           <div>
            <div>
            <el-checkbox label="上传" v-model="row.folderUpload"></el-checkbox>
            <el-checkbox label="导出"  v-model="row.folderExport"></el-checkbox>
            <el-checkbox label="移动" v-model="row.folderMove"></el-checkbox>
            <el-checkbox label="下载" v-model="row.folderDownload"></el-checkbox>
            <el-checkbox label="重命名" v-model="row.folderRename"></el-checkbox>
            <el-checkbox label="删除" v-model="row.folderDel"></el-checkbox></div>
            <div class="select-btn">
              <page-button type="text" @click="allSelect('all',row)">全选</page-button>
              <page-button type="text" @click="allSelect('notall',row)">全不选</page-button>
            </div>
           </div>
          </template>
        
        </vxe-grid>
      </div>
    </div>
  </div>
</template>
<script>
import { ApiSystem } from "@/apis";
const apiSystem = new ApiSystem();
export default {
  props: ['roleObj'],
  components: {},
  data() {
    return {
      columns: [
        { title: "文件夹", width: 250, field: "folderName", align: "left", slots: { default: "fileName" },},
        {
          title: "功能(是否可用)",
          field: "cz",
          minWidth: 250,
          slots: { default: "cz" },
        },
      ],
      treeData: [],
      tableData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      filterText: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.roleTree.filter(val);
    },
  },
  created() {
    this.getTree();
    this.tableData = [];
  },
  methods: {
    submit(){
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiSystem.postRoleFilePurview(this.tableData).then(res => {
        if(res.code == 200){
          this.$message.success('保存成功')
        }else{
          this.$message.error(res.message)
        }
      }).finally(() => {
            loading.close();
        });
    },
    allSelect(code,row){
      if(code == 'all'){
        row.folderLook =  true;
        row.folderUpload =  true;
        row.folderExport =  true;
        row.folderMove =  true;
        row.folderDownload =  true;
        row.folderRename =  true;
        row.folderDel =  true;
      }else{
        row.folderLook =  false;
        row.folderUpload =  false;
        row.folderExport =  false;
        row.folderMove =  false;
        row.folderDownload =  false;
        row.folderRename =  false;
        row.folderDel =  false;
      }
     
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let obj = {
        roleId:this.roleObj.roleId,
        menuCode:data.code
      }
      apiSystem.getRoleFilePurviewList(obj).then(res =>{
        if (res.code === 200 && res.data) {
         this.tableData = [...res.data];
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
            loading.close();
        });
    },
    getTree() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      apiSystem.getBtnConfigTreeList().then((res) => {
        if (res.code === 200 && res.data) {
          this.treeData = [...res.data];
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
            loading.close();
        });
    },
  },
};
</script>
<style lang="less" scoped>
.filePurview-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  .select-btn{
    margin: 5px;
    color:#43a5ff;
    display: flex;
    div{
      margin-right: 20px;
    }
  }
  .filePurview-header {
    color: rgb(180, 180, 180);
    font-size: 14px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
  }
  .filePbody {
    height: 0;
    flex: 1;
    display: flex;
    .filePbody-left {
      border: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      margin-right: 15px;
      .el-tree {
        flex: 1;
        height: 0;
        overflow: auto;
      }
    }
    .filePbody-right {
      width: 0;
      flex: 1;
    }
  }
}
</style>
