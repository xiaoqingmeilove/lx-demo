<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable />
                    <el-tree ref="userTree" style="max-height:calc(100% - 60px)" class="left-tree" default-expand-all :data="userTree" :filter-node-method="filterNode"
                        highlight-current node-key="id" :expand-on-click-node="false" @node-click="clickNode" :props="{label:'name'}" >
                        <template slot-scope="{data}">
                            <div>
                                <img v-if="data.hierarchicalType<4" :src="require(`/static/images/${data.hierarchicalType==3?'Group-392@2x':data.hierarchicalType==2?'Group-391@2x':data.hierarchicalType==1?'Group-390@2x':'Group-393@2x'}.png`)" alt="image">
                                <i style="color:#69C0FF" v-else class="el-icon-s-custom"/>
                                <span style="margin-left:3px">{{data.name}}</span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right-cont">
                <div style="position:relative;padding-bottom:10px"> 
                    <h2 v-if="seluser" class="select-title">{{seluser.name}}</h2>
                    <div class="tabs-button ">
                        <page-button content="保存" @click="save"/>
                    </div>
                    <el-tabs v-model="tabValue">
                        <el-tab-pane name="1">
                            <span slot="label">角色信息</span>
                            <span style="vertical-align:middle;font-size:14px">已选角色：</span>
                            <el-tag style="margin-right:3px" v-for="i in selrole" :key="i.id">{{i.name}}</el-tag>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <PermItem :key="pnum" :selrole="selrole" :userObj="seluser"/>
            </div>
        </el-row>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import PermItem from './permItem'
import eventBus from '@/utils/event-bus.js'

export default {
    name: 'userPerm',
    components: { PermItem },
    data() {
        return {
            tabValue: '1',
            filterText: '',
            userTree: [],
            seluser: undefined,
            selrole: [],
            pnum: 0,
        }
    },
    watch: {
      filterText(val) {
        this.$refs.userTree.filter(val);
      }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        clickNode(obj) {
            this.seluser = obj
            apiSystem.getUserRoles(obj.id).then(res=>{
                let roleArr = res.data??[]
                apiSystem.getRoleList().then(res=>{
                    this.selrole = (res.data?.records??[]).filter(i=>
                        roleArr.includes(i.roleId)
                    ).map(i=>{
                        return { name:i.roleName, id:i.roleId }
                    })
                    this.pnum+=1
                })
            })
        },
        save() {
            eventBus.$emit('msgEvent1')
        },
        treeFormat(arr) {
            // arr.forEach(i=>{
            //     i.name = i?.userName ? (i.nickName+' ('+i.userName+')') : (i?.postName || i?.deptName || i?.bname || i?.orgName)
            //     i.id = i?.userId || i?.postId || i?.deptId || i?.clientId || i?.id 
            //     i.children = i?.sysUserChildren || i?.sysPostsChildren || i?.deptChildren || i?.enterpriseChildren || []
            //     this.treeFormat(i.children)
            // })
            (arr || []).forEach(i=>{
                i.name = i.name
                i.id = i.id
                i.children = i.children
                this.treeFormat(i.children)
            })
            return arr
        },
        getUserTree() {
            // apiSystem.getEmpTree().then(res=>{
            //     this.userTree = this.treeFormat(res.data)
            // })
            apiSystem.getSysTree(5).then(res=>{
                this.userTree = this.treeFormat(res.data)
            })
        }
    },
    created() {
        this.getUserTree()
    }
}
</script>
<style>
@import '../style/system.css';
</style>