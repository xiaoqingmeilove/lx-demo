<template>
    <div>
        <el-form ref="deptForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="所属企业" prop="clientId" style="width:100%">
                <el-select style="width:100%" v-model="form.clientId" placeholder="请选择所属企业" @change="changeAps">
                    <el-option v-for="(i,j) in apsData" :key="j" :label="i.bname" :value="i.clientId"/>
                </el-select>
            </el-form-item>
            <el-form-item label="部门名称" prop="deptName">
                <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
            <el-form-item label="部门编码" prop="deptCode">
                <el-input v-model="form.deptCode" placeholder="请输入部门编码" />
            </el-form-item>
            <el-form-item label="上级部门" prop="parentId">
                <el-select style="width:100%" v-model="form.parentId" placeholder="请选择上级部门" clearable @change="changeParent">
                    <el-option v-for="(i,j) in deptData" :key="j" :label="i.deptName" :value="i.deptId"/>
                </el-select>
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input-number style="width:100%" v-model="form.orderNum" step-strictly controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入备注说明" />
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-radio v-model="form.status" :label="0">启用</el-radio>
                <el-radio v-model="form.status" :label="1">停用</el-radio>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" @click="$emit('close',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['deptObj', 'create', 'deptTree'],
    data() {
        return {
            form: {
                ancestors: '',
                bname: '',
                clientId: '',
                createName: '',
                createTime: '',
                dataScope: '',
                delFlag: 0,
                deptCode: '',
                deptId: 0,
                deptName: '',
                email: '',
                leader: '',
                orderNum: '',
                parentId: '',
                parentName: '',
                phone: '',
                remark: '',
                status: 0,
                sysDeps: [],
                sysPostsChildren:[],
                sysUserChildren:[],
                updateName: '',
                updateTime: ''
            },
            rules: {
                clientId: [{ required:true, message:'请选择所属企业' }],
                deptName: [{ required:true, message:'请输入部门名称' }],
            },
            deptData:[],
            apsData:[],
        }
    },
    methods:{
        save() {
            this.$refs.deptForm.validate(valid => {
                if (valid) {
                    if (this.form.clientId) {
                        this.form.bname = this.apsData.find(i=>i.clientId==this.form.clientId)?.bname||''
                    }
                    this.form.parentId = this.form.parentId || 0
                    this.create?delete this.form.deptId:''
                    apiSystem[!this.create?'editDept':'addDept'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close',true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        },
        deptCheck(data, checked, indeterminate){
            this.form.clientId = checked ? data.clientId : 0
            this.form.parentId = checked ? data.deptId : 0
            checked ? this.$refs.deptTree.setCheckedNodes([data]) : ''
        },
        changeAps(v){
            v?
            apiSystem.getDeptList({clientId:v}).then(res=>{
                this.deptData = res.data.deptChildren
                this.form.parentId = ''
            }):''
        },
        changeParent(v){
            this.form.parentName = this.deptData.find(i=>i.deptId==v).deptName
        }
    },
    created(){ 
        apiSystem.getAps().then(res=>{
            this.apsData = res.data
             apiSystem.getDeptList(this.deptObj?.deptId?{clientId:this.deptObj.clientId}:{}).then(res=>{
                this.deptData = res.data.deptChildren
                if (!this.create) {
                    apiSystem.detailDept(this.deptObj?.deptId).then(res=>{
                        this.form = res.data
                        this.form.parentId = this.form.parentId||''
                    })
                }
            })
        })
    }
}
</script>