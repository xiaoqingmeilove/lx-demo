<template>
    <div>
        <el-form ref="dictForm" :rules="rules" :model="form" label-width="100px" size="small">
            <el-form-item label="所属应用" prop="applyId">
                <el-select style="width:100%" v-model="form.applyId" placeholder="请选择所属应用">
                    <el-option v-for="(i,j) in appData" :key="j" :label="i.name" :value="i.id"/>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属模块" prop="modules">
                <el-input v-model="modules" placeholder="请输入所属模块" />
            </el-form-item> -->
            <el-form-item label="字典名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item label="字典编码" prop="code">
                <el-input v-model="form.code" placeholder="请输入字典编码" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input-number style="width:100%" v-model="form.orderNum" step-strictly controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入备注说明" />
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-radio v-model="form.status" label="0">启用</el-radio>
                <el-radio v-model="form.status" label="1">停用</el-radio>
            </el-form-item>
        </el-form>
        <div style="text-align: right;">
            <page-button theme="white" @click="$emit('close',false)">取消</page-button>
            <page-button @click="save">确定</page-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['dictObj', 'create'],
    data() {
        return {
            modules:'',
            form: {
                applyId: '',
                applyName: '',
                code: '',
                id: '',
                name: '',
                orderNum: 0,
                remark: '',
                status: '0'
            },
            rules: {
                applyId: [{ required:true, message:'请选择应用名称' }],
                name: [{ required:true, message:'请输入字典名称' }],
                code: [{ required:true, message:'请输入字典编码' }],
            },
            appData:[]
        }
    },
    methods:{
        save() {
            this.$refs.dictForm.validate(valid => {
                if (valid) {
                    this.form.applyName = this.appData.find(i=>i.id==this.form.applyId).name
                    apiSystem[this.create?'addDict':'editDict'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        if (res.code === 200) {
                            this.$emit('close',true)
                        }
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        }
    },
    created() {
        apiSystem.getApplyTree().then(res=>{ this.appData = res.data })
        !this.create ?
            apiSystem.detailDict(this.dictObj.id).then(res=>{
                this.form = res.data
            }) : ''
    }
}
</script>
<style lang="less" scoped>
::v-deep .el-form-item__error {
  top: 57%;
}
</style>