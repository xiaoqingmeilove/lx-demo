<template>
    <div>
        <el-form ref="billForm" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="受理状态" prop="state">
                <el-radio v-model="form.state" :label="1">受理</el-radio>
                <el-radio v-model="form.state" :label="0">不受理</el-radio>
            </el-form-item>
            <el-form-item label="不受理原因" prop="rejectReason">
                <el-input type="textarea" placeholder="请输入不受理原因" v-model="form.rejectReason" maxlength="500" show-word-limit :rows="3"/>
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

export default {
    props:['id'],
    data() {
        return {
            state:0,
            rejectReason:'',
            rules:{},
            form:{
                id:this.id,
                state:1,
                rejectReason:''
            }
        }
    },
    methods:{
        save(){
            apiService.handleServicBill(this.form).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.$emit('close')
            })
        }
    }
}
</script>