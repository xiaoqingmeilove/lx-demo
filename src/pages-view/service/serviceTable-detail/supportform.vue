<template>
    <div>
        <el-form ref="supportForm" :rules="rules" :model="sform" label-width="100px">
            <el-form-item label="服务标题" prop="serviceTitle">
                <el-input placeholder="请输入服务标题" v-model="form.serviceTitle" disabled/>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
                {{priorityList.length?priorityList.find(i=>i.dictValue==form.priority).dictLabel:''}}
            </el-form-item>
            <el-form-item label="支持类型" prop="assesType">
                <el-select style="width:100%" v-model="sform.assesType" placeholder="请选择支持类型">
                    <el-option v-for="(i,j) in supportTypeList" :key="j" :label="i.dictLabel" :value="i.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="支持原因" prop="assesReason">
                <el-input type="textarea" placeholder="请输入支持原因" v-model="sform.assesReason" maxlength="500" show-word-limit :rows="3"/>
            </el-form-item>
        </el-form>
        <div style="text-align:center">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="$emit('close')">关闭</el-button>
        </div>
    </div>
</template>
<script>
import { ApiService } from '@/apis'
const apiService = new ApiService()
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props:['form'],
    data() {
        return {
            supportTypeList:[],
            priorityList:[],
            rules:{
                deptId: [{ required:true, message:'请选择支持类型' }],
            },
            sform:{
                afterSalesBillId: this.form.id,
                assesContent: "",
                assesReason: "",
                assesTime: "",
                assesType: "",
                createTime: "",
                createUser: "",
                createUserId: 0,
                createUserName: "",
                deptId: 0,
                state: 0,
                updateTime: "",
                updateUser: "",
                updateUserId: 0,
                updateUserName: ""
            }
        }
    },
    methods:{
        save(){
            this.$refs.supportForm.validate(valid => {
                if (valid) {
                    apiService.supportServicBill(this.sform).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close')
                    })
                }
            })
        }
    },
    created() {
        apiSystem.getDictItem(4927286877369).then(res=>{ this.supportTypeList = res.data })
        apiSystem.getDictItem(4927286877362).then(res=>{ this.priorityList = res.data })
    }
}
</script>