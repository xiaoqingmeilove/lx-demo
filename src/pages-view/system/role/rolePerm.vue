<template>
    <div class="permission-page">
        <div style="height: 20px;">
          <span style="color:rgb(180,180,180);font-size:14px;margin:15px 0">设置角色对应的功能操作、应用管理、后台管理权限</span>
          <el-checkbox style="float:right;margin-right:10px" v-model="checkall" @change="selectAll">全选</el-checkbox>
        </div>
        <el-row>
            <el-col class="permission-col" style="height:100% !important" :span="3">
                <div class="permission-cont">
                    <div class="select-title" style="margin:10px 0 0 15px;font-size:14px">请选择菜单</div>
                    <el-tree class="left-tree" default-expand-all highlight-current :data="applyTree" :indent="12"
                        :expand-on-click-node="false"  @node-click="applyClk" :props="{label:'menuName', children:'children'}" />
                </div>
            </el-col>
            <el-col class="permission-col" :span="21">
                <div class="permission-cont">
                    <el-table border height="100%" :data="tableData" style="width:100%" :header-cell-style="{background:'rgb(245,245,245)'}">
                        <el-table-column label="菜单" align="center" width="180">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.checked">{{scope.row.name}}</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="功能" align="center">
                            <template slot-scope="scope">
                                <div style="text-align:left">
                                    <el-checkbox v-for="(i,j) in scope.row.perm" :key="j" v-model="i.checked">{{i.label}}
                                        <el-tooltip effect="light" :content="i.desc" placement="top-start">
                                            <i style="position:relative;right:3px;color:rgb(200,200,200) !important" v-if="!!i.desc" class="el-icon-question"/>
                                        </el-tooltip>
                                    </el-checkbox>
                                </div>
                                <div style="text-align:right" v-if="scope.row.perm.length">
                                    <page-button type="text" @click="scope.row.perm.forEach(i=>i.checked=true)" content="全选" />
                                    <page-button type="text" @click="scope.row.perm.forEach(i=>i.checked=false)" content="全不选" />
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="默认数据范围" align="center" width="180">
                            <template slot-scope="scope">
                                <div v-for="(i,j) in scope.row.range" :key="j" style="width:150px;height:24px">
                                    <el-radio style="float:left" v-model="scope.row.dataScope" :label="i.value" @input="v=>scope.row.dataScope=v">{{i.label}}</el-radio>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="业务员数据范围" align="center" width="180">
                            <template slot-scope="scope">
                                <div v-for="(i,j) in scope.row.salesman" :key="j" style="width:150px;height:24px">
                                    <el-radio style="float:left" v-model="scope.row.salesmanScope" :label="i.value" @input="v=>scope.row.salesmanScope=v">{{i.label}}</el-radio>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="经销商数据范围" align="center" width="180">
                            <template slot-scope="scope">
                                <div v-for="(i,j) in scope.row.franchiser" :key="j" style="width:150px;height:24px">
                                    <el-radio style="float:left" v-model="scope.row.franchiserScope" :label="i.value" @input="v=>scope.row.franchiserScope=v">{{i.label}}</el-radio>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import eventBus from '@/utils/event-bus.js'
export default {
    props: ['roleObj'],
    data() {
        return {
            checkall:false,
            tableData:[],
            applyTree:[],
            menuArr:[],
            roleMenu:[],
            menuTreeObj: {},
        }
    },
    methods: {
        handleMsgEvent(){
            if(!this.tableData.length){
                this.$message.warning('请选择您要设置的菜单')
                return
            }
            this.menuArr = []
            this.menuArr = this.roleMenu.filter(i=>!this.tableData.map(a=>a.menuId).includes(i.menuId)).map(i=>{
                return { menuId:i.menuId, dataScope:i.dataScope, franchiserScope: i.franchiserScope, salesmanScope: i.salesmanScope, roleId:this.roleObj.roleId }
            })
            let tablePerm = []
            this.tableData.forEach(i=>tablePerm.push(...i.perm.map(a=>a.menuId)))
            this.menuArr = this.menuArr.filter(i=>!tablePerm.includes(i.menuId))
            this.getTreeMenu(this.tableData)
            let obj = JSON.parse(JSON.stringify(this.roleObj))
            obj.menus = this.menuArr
            delete obj.name
            this.checkall = false
            apiSystem.editRole(obj).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message);
                this.applyClk(this.menuTreeObj);
            })
        },
        selectAll(v){
            this.tableData.forEach(i=>{
                i.checked = v
                v ? i.dataScope = '4' : ''
                v ? i.salesmanScope = '4' : ''
                v ? i.franchiserScope = '4' : ''
                i.perm.forEach(j=>j.checked=v)
            })
        },
        filterTree (tree) {
            return tree.reduce((acc, item) => {
                if (item.menuId) {
                    acc.push({ ...item });
                }
                if (item.children && item.children.length) {
                    acc.push(...this.filterTree(item.children));
                }
                return acc;
            }, []);
        },
        applyClk(v){
            this.menuTreeObj = {...v};
            apiSystem.getMenuTree(v?.roleId||v?.menuId).then(res=>{
                let menuData = res.data
                const menes = this.filterTree(menuData||[]);
                if (this.roleObj?.roleId) {
                    apiSystem.getRolePerms({roleIds:[this.roleObj.roleId]}).then(res=>{
                        this.roleMenu = res.data||[]
                        let menuIds = (res.data||[]).map(i=>i.menuId)
                        this.tableData = (menuData||[]).map(i=>{
                            const menuId = menes.filter(m=>m.menuId==i.menuId||m.parentId==i.menuId).map(j=>j.menuId);
                            const scope = this.roleMenu.find(a=>menuId.includes(a.menuId));
                            return {
                                menuId: i.menuId,
                                name: i.menuName,
                                checked: menuIds.includes(i.menuId),
                                perm: i.children.map(j=>{
                                    return { label:j.menuName, desc:j.perms, checked:menuIds.includes(j.menuId), menuId:j.menuId }
                                }),
                                dataScope: scope ? scope.dataScope+'' : '3',
                                salesmanScope: scope ? scope.salesmanScope+'' : '1',
                                franchiserScope: scope ? scope.franchiserScope+'' : '1',
                                range: [
                                    { label:'本人相关', value:'3' },
                                    { label:'本部门', value:'2' },
                                    { label:'本部门及下属部门', value:'4' },
                                    { label:'全部', value:'1' },
                                ],
                                salesman: [
                                    { label:'无权限', value:'1' },
                                    { label:'本人相关', value:'2' },
                                    { label:'本区域', value:'3' },
                                    { label:'本区域及下属区域', value:'4' },
                                ],
                                franchiser: [
                                    { label:'无权限', value:'1' },
                                    { label:'本人关联', value:'2' },
                                    { label:'区域关联', value:'3' },
                                    { label:'本人及下属经销商', value:'4' },
                                    { label:'本区域及下属经销商', value:'5' },
                                ],

                            }
                        })
                    })
                }
            })
        },
        getTreeMenu(arr,ds='3',fs='1',ms='1'){
            arr.forEach(i=>{
                i.checked?this.menuArr.push({menuId:i.menuId, dataScope:(i?.dataScope||ds)+'', franchiserScope:(i?.franchiserScope||fs)+'', salesmanScope:(i?.salesmanScope||ms)+'', roleId:this.roleObj.roleId}):''
                i.perm?.length?this.getTreeMenu(i.perm,i.dataScope,i.franchiserScope,i.salesmanScope):''
            })
        }
    },
    created() {
        this.menuTreeObj = {};
        apiSystem.getApplyTree().then(res=>{
            res.data.forEach(i=>{ i.menuName = i.name })
            this.applyTree = res.data
            /**eventBus.$on('msgEvent',e=>{
                if(!this.tableData.length){
                    this.$message.warning('请选择您要设置的菜单')
                    return
                }
                this.menuArr = []
                this.menuArr = this.roleMenu.filter(i=>!this.tableData.map(a=>a.menuId).includes(i.menuId)).map(i=>{
                    return { menuId:i.menuId, dataScope:i.dataScope, franchiserScope: i.franchiserScope, salesmanScope: i.salesmanScope, roleId:this.roleObj.roleId }
                })
                let tablePerm = []
                this.tableData.forEach(i=>tablePerm.push(...i.perm.map(a=>a.menuId)))
                this.menuArr = this.menuArr.filter(i=>!tablePerm.includes(i.menuId))
                this.getTreeMenu(this.tableData)
                let obj = JSON.parse(JSON.stringify(this.roleObj))
                obj.menus = this.menuArr
                delete obj.name
                this.checkall = false
                apiSystem.editRole(obj).then(res=>{
                    this.$message[res.code==200?'success':'warning'](res.message)
                })
            })*/
        })
    },
    // beforeDestroy() {
    //     eventBus.$off('msgEvent')
    // }
}
</script>
<style lang="less" scoped>
.permission-page {
    display: flex;
  flex-direction: column;
  height: 100%;
    > .el-row {
      flex: 1;
      height: 0;          
    }
    .permission-col {
        padding-top:8px;
        box-sizing:border-box;
        height:100%;
    }
    .permission-cont {
        height:100%;
        box-sizing:border-box;
        // overflow-y:scroll
        overflow:auto;
    }
    .permission-col:first-child {
        .permission-cont {
            padding:5px 5px 15px 5px;
            border:1px solid rgb(200,200,200);
            border-radius: 5px;
        }
    }
    .permission-col:last-child {
        .permission-cont {
            padding:0 5px 0 5px;
        }
    }
    .left-tree {
        margin-top:10px
    }
}
</style>
