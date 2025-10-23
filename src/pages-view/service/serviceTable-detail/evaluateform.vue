<template>
    <div>
        <el-form ref="evaluteForm" :rules="rules" :model="eform" label-width="100px">
            <el-form-item label="服务标题" prop="serviceTitle">
                <el-input placeholder="请输入服务标题" v-model="form.serviceTitle" disabled/>
            </el-form-item>
            <el-form-item label="评估类型" prop="assesType">
                <el-select style="width:100%" v-model="eform.assesType" placeholder="请选择评估类型">
                    <el-option v-for="(i,j) in supportTypeList" :key="j" :label="i.dictLabel" :value="i.dictValue"/>
                </el-select>
            </el-form-item>
            <el-form-item label="评估结果" prop="assesContent">
                <el-input type="textarea" placeholder="请输入评估结果" v-model="eform.assesContent" maxlength="500" show-word-limit :rows="3"/>
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
                deptId: [{ required:true, message:'请选择评估类型' }],
            },
            eform:{
                afterSalesBillId: this.form.id,
                assesContent: "",
                assesReason: "",
                assesTime: "",
                assesType: "",
                createTime: "",
                createUser: "",
                createUserId: 0,
                createUserName: "",
                deptId: '',
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
            this.$refs.evaluteForm.validate(valid => {
                if (valid) {
                    apiService.evaluateServicBill(this.eform).then(res=>{
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