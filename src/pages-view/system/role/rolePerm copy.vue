<template>
    <div class="permission-page">
        <span style="color:rgb(180,180,180);font-size:14px;margin:15px 0">设置角色对应的功能操作、应用管理、后台管理权限</span>
        <el-checkbox style="float:right;margin-right:10px" v-model="checkall" @change="selectAll">全选</el-checkbox>
        <el-row style="height:calc(100% - 20px)">
            <el-col class="permission-col" style="height:100% !important" :span="3">
                <div class="permission-cont">
                    <div class="select-title" style="margin:10px 0 0 15px;font-size:14px">请选择应用模块</div>
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
                        <el-table-column label="数据范围" align="center" width="180">
                            <template slot-scope="scope">
                                <div v-for="(i,j) in scope.row.range" :key="j" style="width:150px;height:24px">
                                    <el-radio style="float:left" v-model="scope.row.dataScope" :label="i.value" @input="v=>scope.row.dataScope=v">{{i.label}}</el-radio>
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
            roleMenu:[]
        }
    },
    methods: {
        selectAll(v){
            this.tableData.forEach(i=>{
                i.checked = v
                v ? i.dataScope = '4' : ''
                i.perm.forEach(j=>j.checked=v)
            })
        },
        applyClk(v){
            apiSystem.getMenuTree(v?.roleId||v?.menuId).then(res=>{
                let menuData = res.data
                if (this.roleObj?.roleId) {
                    apiSystem.getRolePerms({roleIds:[this.roleObj.roleId]}).then(res=>{
                        this.roleMenu = res.data
                        let menuIds = res.data.map(i=>i.menuId)
                        this.tableData = menuData.map(i=>{
                            return {
                                menuId: i.menuId,
                                name: i.menuName,
                                checked: menuIds.includes(i.menuId),
                                perm: i.children.map(j=>{
                                    return { label:j.menuName, desc:j.perms, checked:menuIds.includes(j.menuId), menuId:j.menuId }
                                }),
                                dataScope: this.roleMenu.find(a=>a.menuId==i.menuId)?this.roleMenu.find(a=>a.menuId==i.menuId).dataScope+'': '3',
                                range: [
                                    { label:'本人相关', value:'3' },
                                    { label:'本部门', value:'2' },
                                    { label:'本部门及下属', value:'4' }
                                ]
                            }
                        })
                    })
                }
            })
        },
        getTreeMenu(arr,ds='3'){
            arr.forEach(i=>{
                i.checked?this.menuArr.push({menuId:i.menuId, dataScope:(i?.dataScope||ds)+'', roleId:this.roleObj.roleId}):''
                i.perm?.length?this.getTreeMenu(i.perm,i.dataScope):''
            })
        }
    },
    created() {
        apiSystem.getApplyTree().then(res=>{ 
            res.data.forEach(i=>{ i.menuName = i.name })
            this.applyTree = res.data
            eventBus.$on('msgEvent',e=>{
                this.menuArr = []
                this.menuArr = this.roleMenu.filter(i=>!this.tableData.map(a=>a.menuId).includes(i.menuId)).map(i=>{
                    return { menuId:i.menuId, dataScope:i.dataScope, roleId:this.roleObj.roleId }
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
            })
        })
    },
    beforeDestroy() {
        eventBus.$off('msgEvent')
    }
}
</script>
<style lang="less" scoped>
.permission-page {
    height:100%;
    flex:1;
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