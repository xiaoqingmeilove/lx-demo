<template>
    <div class="role-add-member">
        <tree-transfer :key="tnum" :title="title" :from_data="fromData" :to_data="toData" :defaultProps="{label:'label'}" :defaultTransfer="true"
            @add-btn="addItem" @remove-btn="removeItem" :mode="mode" height="540px" filter openAll :defaultCheckedKeys="checkedKeys"/>
        <i v-if="loaded" class="el-icon-loading tree-loading"/>
        <div style="margin-top:15px">
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" @click="$emit('closeForm',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import treeTransfer from 'el-tree-transfer'
export default {
    name:'addMemberForm',
    props: ['roleObj', 'selectRole'],
    components: { treeTransfer },
    data() {
        return {
            sum: 0,
            mode: 'transfer', //addressList
            title: ['集团用户', '已选用户'],
            title1: '已选用户',
            fromData: [],
            toData: [],
            userIds: [],
            checkedKeys:[],
            tnum:0,
            loaded:false
        }
    },
    watch:{
        toData: {
            handler(newV,oldV) {
                this.sum = 0
                newV.forEach(i => { this.getSelectSum(i) })
                this.title[1] = this.title1 + '('+this.sum+')'
                if (document.querySelectorAll('.transfer-title span')[5]) {
                    document.querySelectorAll('.transfer-title span')[5].innerHTML=this.title[1]
                }
            },
            immediate:true,
            deep:true
        }
    },
    methods:{
        addItem(fromData,toData,obj){
            console.log("fromData:", fromData)
            console.log("toData:", toData)
            console.log("obj:", obj)
            this.fromData = fromData
            this.toData = toData
            this.userIds = []
        },
        removeItem(fromData,toData,obj) {
            console.log("fromData:", fromData)
            console.log("toData:", toData)
            console.log("obj:", obj)
            this.fromData = fromData
            this.toData = toData
            this.userIds = []
        },
        getSelectSum(obj) {
            obj.children.length ? obj.children.forEach( i=> { this.getSelectSum(i) }) : this.sum += 1
        },
        getDataUser(arr){
            arr.forEach(i=>{
                i?.id&&i.hierarchicalType==5?this.userIds.push(i.id):''
                i?.children?this.getDataUser(i.children):'' 
            })
        },
        save() {
            this.getDataUser(this.toData)
            apiSystem.roleAddUser({roleId:this.roleObj.roleId,userId:this.userIds}).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.$emit('closeForm', true)
            })
        },
        treeFormat(arr,pid){
            // arr.forEach(i=>{
            //     i.pid = pid || 0
            //     i.label =  i?.nickName || i?.deptName || i?.bname || i?.orgName
            //     i.id = (i?.userId || i?.deptId || i?.clientId || i?.id)+(i?.userId?'u':i?.deptId?'d':i?.clientId?'c':i?.id?'o':'')
            //     i.children = i?.sysUserChildren || i?.sysDeps || i?.deptChildren|| i?.enterpriseChildren || []
            //     i.disabled = !i?.userId || (this.selectRole||[]).map(a=>a.userId).includes(i?.userId)
            //     this.treeFormat(i.children,i.id)
            // })
            if (arr) {
                arr.forEach(i=>{
                    i.pid = pid || i.parentId
                    i.label = i.name
                    i.id = i.id+''
                    i.children = i.children
                    i.disabled = i.hierarchicalType!=5
                    // i.disabled = i.hierarchicalType!=5 || (this.selectRole||[]).map(a=>a.userId).includes(i?.id-0)
                    this.treeFormat(i.children,i.id)
                })
            }
            return arr || []
        },
        getToData() {
            this.tnum+=1
            if (!!this.selectRole.length&&!this.toData.length) {
                this.loaded=true
                setTimeout(()=>{ this.getToData() },80)
            } else {
                this.loaded=false
            }
        }
    },
    mounted() {
        setTimeout(()=>{ this.getToData() },80)
    },
    created() {
        this.checkedKeys = JSON.parse(JSON.stringify(this.selectRole)).map(i=>i.userId)
        this.title[1] = this.title1+'('+this.sum+')'
        // apiSystem.getUserTree().then(res=>{
        //     this.fromData = this.treeFormat(res.data)
        // })
        apiSystem.getSysTree(5).then(res=>{
            this.fromData = this.treeFormat(res.data)
        })
    }
}
</script>
<style lang="less" scoped>
 /deep/ .wl-transfer .transfer-title {
    width:100%
 }
 .role-add-member {
    position:relative;
    /deep/ .transfer-main {
        position: relative;
        .filter-tree {
            position: sticky;
            top: -15px;
            padding: 5px;
            z-index: 99;
        }
    }
    .tree-loading {
        position:absolute;
        right:120px;
        top:280px;
        font-size:20px;
        color:#1890ff;
    }
 }
</style>