<template>
    <div class="workflow-member">
        <el-form ref="wfexecForm" :rules="rules" :model="form" label-width="80px">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="分组名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入分组名称" clearable=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="显示顺序" prop="sortOrder">
                        <el-input-number style="width:100%" v-model="form.sortOrder" controls-position="right" :min="0" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider />
        <tree-transfer :key="tnum" :title="title" :from_data="fromData" :to_data="toData" :defaultProps="{label:'label'}" :defaultTransfer="true"
            @add-btn="addItem" @remove-btn="removeItem" :mode="mode" height="540px" filter openAll :defaultCheckedKeys="checkedKeys"/>
        <i v-if="loaded" class="el-icon-loading tree-loading"/>
        <div style="margin-top:30px">
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" @click="$emit('close',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import treeTransfer from 'el-tree-transfer'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    components: { treeTransfer },
    data() {
        return {
            form:{
                name:'',
                sortOrder:'',
                members:[],
            },
            rules:{
                name:[{required:true,message:'请选择分组名称'}],
            },
            sum: 0,
            mode: 'transfer', //addressList
            title: ['集团用户', '已选用户'],
            title1: '已选用户',
            fromData: [],
            toData: [],
            // userIds: [],
            userObj: [],
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
    methods: {
        addItem(fromData,toData){
            this.fromData = fromData
            this.toData = toData
            this.userIds = []
        },
        removeItem(fromData,toData) {
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
        getUserObj(arr){
            arr.forEach(i=>{
                /u$/.test(i.id)?this.userObj.push(i):''
                i?.children?this.getUserObj(i.children):''
            })
        },
        treeFormat(arr,pid){
            if (arr) {
                arr.forEach(i=>{
                    i.pid = pid || 0
                    i.label =  i?.nickName || i?.deptName || i?.bname || i?.orgName
                    i.id = (i?.userId || i?.deptId || i?.clientId || i?.id)+(i?.userId?'u':i?.deptId?'d':i?.clientId?'c':i?.id?'o':'')
                    i.children = i?.sysUserChildren || i?.sysDeps || i?.deptChildren|| i?.enterpriseChildren || []
                    i.disabled = !i?.userId || (this.selectRole||[]).map(a=>a.userId).includes(i?.userId)
                    i.deptName = i?.deptName
                    i.deptId = i?.deptId
                    this.treeFormat(i.children,i.id)
                })
            }
            return arr || []
        },
        save() {
            this.$refs.wfexecForm.validate(valid=>{
                if(valid) {
                    this.getUserObj(this.toData)
                    this.form.members = this.userObj
                    this.$emit('close',this.form)
                }
            })
        }
    },
    created() {
        // this.checkedKeys = JSON.parse(JSON.stringify(this.selectRole)).map(i=>i.userId)
        apiSystem.getUserTree().then(res=>{
            this.fromData = this.treeFormat(res.data)
        })
        this.title[1] = this.title1+'('+this.sum+')'
    }
}
</script>
<style lang="less" scoped>
 /deep/ .wl-transfer .transfer-title {
    width:100%
 }
 .workflow-member {
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
.el-divider--horizontal {
    margin: 5px 0 12px 0;
 }
</style>