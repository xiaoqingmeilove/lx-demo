<template>
    <div>
        <el-form ref="postForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="岗位名称" prop="postName">
                <el-input v-model="form.postName" placeholder="请输入岗位名称" />
            </el-form-item>
            <el-form-item label="岗位编码" prop="postCode">
                <el-input v-model="form.postCode" placeholder="请输入岗位编码" />
            </el-form-item>
            <el-form-item label="所属部门" prop="deptId">
                <el-select style="width:100%" v-model="form.deptId" placeholder="请选择上级部门" @change="getAps">
                    <el-option v-for="(i,j) in deptData" :key="j" :label="i.deptName" :value="i.deptId"/>
                </el-select>
            </el-form-item>
            <el-form-item label="显示顺序" prop="postSort">
                <el-input-number style="width:100%" v-model="form.postSort" controls-position="right" :min="0" />
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
    props: ['postObj', 'create'],
    data() {
        return {
            form: {
                postName:'',
                postCode:'',
                clientId:'',
                deptId:'',
                postSort:'',
                remark:'',
                status:0
            },
            rules:{
                postName: [{ required:true, message:'请输入部门名称'}],
            },
            deptData:[]
        }
    },
    methods:{
        getAps(val) {
            val?
                this.form.clientId = this.deptData.find(i=>i.deptId == val)?.clientId || ''
            :''
        },
        save() {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    apiSystem[!this.create?'editPost':'addPost'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close',true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        }
    },
    created() {
        let clientId = this.postObj?.clientId||''
        this.form.clientId = clientId
        apiSystem.getDeptList(clientId?{clientId}:{}).then(res=>{
            this.deptData = res.data.deptChildren
            if (!this.create) {
                apiSystem.detailPost(this.postObj?.postId).then(res=>{
                    this.form = res.data
                })
            }
        })
    }
}
</script>