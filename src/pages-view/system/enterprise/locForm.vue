<template>
    <div>
        <el-form ref="locForm" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="场地名称" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入场地名称" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="场地地址" prop="productAddr">
                <el-input v-model="form.productAddr" placeholder="请输入场地地址" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="场地用途" prop="productUse">
                <el-input v-model="form.productUse" placeholder="请输入场地用途" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="负责人" prop="proMonitor">
                <el-input v-model="form.proMonitor" placeholder="请输入负责人" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="负责人电话" prop="proMonitorTel">
                <el-input v-model="form.proMonitorTel" placeholder="请输入负责人电话" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="负责人邮箱" prop="proMonitorEmail">
                <el-input v-model="form.proMonitorEmail" placeholder="请输入负责人邮箱" :disabled="isview"/>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="saveLoc">确定</el-button>
            <el-button type="primary" @click="$emit('close',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['locObj', 'isview', 'row'],
    data() {
        return {
            form: {
                clientId: 0,
                lat: 0,
                lng: 0,
                proMonitor: '',
                proMonitorEmail: '',
                proMonitorTel: '',
                productAddr: '',
                productAddrId: 0,
                productName: '',
                productUse: '',
                status: '1',
                uuidNo: 0
            },
            edit:true,
            rules:{}
        }
    },
    methods:{
        saveLoc() {
            delete this.form._X_ROW_KEY
            apiSystem[this.row.productAddrId?'editLocation':'addLocation'](this.form).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.$emit('close',true)
            })
        }
    },
    created() {
        !!this.row?this.form=JSON.parse(JSON.stringify(this.row)):''
        this.locObj?.clientId?this.form.clientId = this.locObj.clientId:''
    }
}
</script>