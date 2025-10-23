<template>
    <app-page>
        <TabLabel style="margin-top:15px" :label="'菜单信息'">
            <template #tail>
                <span style="font-size:14px;margin-left:20px">选择应用：</span>
                <el-select v-model="applyId" placeholder="请选择所属应用" @change="changeApp">
                    <el-option v-for="(i,j) in appData" :key="j" :label="i.name" :value="i.id" />
                </el-select>
                <page-button style="float:right" content="新建菜单" @click="create=true;selMenu={};expNode=[];showmenu=true"/>
            </template>
        </TabLabel>
        <div class="menutree-table">
            <vxe-table border="inner" ref="xTree" :column-config="{resizable:true}" :data="tableData"
            :tree-config="{transform:true, rowField:'menuId', parentField:'parentId'}" height="auto">
                <vxe-column field="menuName" title="名称" width="300" tree-node :filters="[{data:''}]" :filter-method="filterAgeMethod">
                    <template #filter="{ $panel, column }">
                        <div style="padding:5px;box-sizing:border-box">
                            <el-input size="small" placeholder="请输入查询内容..." v-for="(o,i) in column.filters" :key="i" v-model="o.data" @input="$panel.changeOption($event, !!o.data, o)"/>
                        </div>
                    </template>
                </vxe-column>
                <vxe-column v-for="(i,j) in tableColumn" :key="j" :field="i.key" :title="i.title" align="center" :width="i.width">
                    <template #default="{ row }">
                        <div v-if="i.key=='menuType'">
                            <span>{{row.menuType=='M'?'目录':row.menuType=='C'?'菜单':row.menuType=='F'?'按钮':'其他'}}</span>
                        </div>
                        <div v-else-if="i.key=='applyId'">
                            <span>{{appData.length?appData.find(i=>i.id==row.applyId).name:''}}</span>
                        </div>
                        <div v-else-if="i.key=='isFrame'">
                            <span>{{row.isFrame==1?'内部':'外部'}}</span>
                        </div>
                        <div v-else-if="i.key=='parentId'">
                            <span>{{tableData.length&&tableData.find(i=>i.menuId==row.parentId)?tableData.find(i=>i.menuId==row.parentId).menuName:'root'}}</span>
                        </div>
                        <div v-else-if="i.key=='visible'">
                            <page-button :theme="row.visible==0?'success':'danger'">{{row.visible==0?'显示':'隐藏'}}</page-button>
                        </div>
                        <div v-else>
                            {{row[i.key]}}
                        </div>
                    </template>
                </vxe-column>
                <vxe-column title="操作" width="180">
                    <template #default="{ row }">
                    <div style="text-align:center">
                        <vxe-button v-if="row.menuType!='F'" type="text" status="primary" @click="create=true;expChildMenu(row)">新增</vxe-button>
                        <vxe-button type="text" status="primary" @click="create=false;expChildMenu(row)">修改</vxe-button>
                        <vxe-button type="text" status="primary" @click="selMenu=row;delDlg=true">删除</vxe-button>
                    </div>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <modal width="500px" :title="(create?'新增':'修改')+'菜单'" :visible="showmenu" @close="showmenu=false">
            <MenuForm v-if="showmenu" :expNode="expNode" :applyId="applyId" :create="create" :menuObj="selMenu" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>

        <DeleteDialog @close="v=>{ delDlg=false; v?deleteMenu():'' }" 
            :delObj="{ module:selMenu.menuType=='F'?'按钮':'菜单', target:selMenu?.menuName||'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import MenuForm from './menuForm'
import TabLabel from '../components/tabLabel'
import DeleteDialog from '../components/deleteDialog'
export default {
    name:'menus',
    components: { TabLabel, MenuForm, DeleteDialog },
    data() {
        return {
            tableColumn: [
                { title:'图标', key:'icon', width:'' }, { title:'类型', key:'menuType', width:'100' }, 
                { title:'所属应用', key:'applyId', width:'' }, { title:'上级菜单', key:'parentId', width:'' }, 
                { title:'打开方式', key:'isFrame', width:'100' }, { title:'路由', key:'path', width:'' }, { title:'菜单标识', key:'menuCode', width:'' }, 
                { title:'权限标识', key:'perms', width:'' }, { title:'展示顺序', key:'orderNum', width:'80' },
                { title:'是否显示', key:'visible', width:'80' },
            ],
            tableData: [],
            showmenu: false,
            create: true,
            selMenu: {},
            delDlg: false,
            applyId: '',
            appData: [],
            expNode: []
        }
    },
    methods:{
        filterAgeMethod({ option, row }) {
            return row.menuName.includes(option.data)
        },
        closeForm(v){
            this.showmenu = false
            v ? this.getMenuTree() : ''
        },
        getMenuTree(){
            apiSystem.getMenuList(this.applyId).then(res=>{
                this.tableData = res.data.sort((a,b)=>{ return a.orderNum-b.orderNum })
                // .filter(i=>i.menuType!='F'&&i.menuType!='A')
            })
        },
        deleteMenu(){
            apiSystem.deleteMenu(this.selMenu.menuId).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.delDlg = false
                this.getMenuTree()
            })
        },
        changeApp(id){
            this.applyId = id
            this.getMenuTree()
        },
        expChildMenu(row){
            this.selMenu=row
            this.getParentArr(row.parentId)
            this.showmenu=true
        },
        getParentArr(id){
            let node = this.tableData.find(i=>i.id == id)
            if (node) {
                this.expNode.push(node.id)
                this.getParentArr(node.parentId)
            } 
            return
        }
    },
    created() {
        apiSystem.getApplyList().then(res=>{ 
            this.appData = res.data 
            this.applyId = this.appData?.[0].id
            this.getMenuTree()
        })
    }
}
</script>
<style lang="less" scoped>
.menutree-table {
    height:calc(100% - 80px);
    /deep/ .vxe-cell--filter {
        float: initial;
        line-height: 10px;
    }
}
</style>