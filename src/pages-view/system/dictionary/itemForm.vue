<template>
    <div class="item-from">
        <el-form ref="dictForm" :rules="rules" :model="form" label-width="100px" class="item-from-center" size="small">
            <el-form-item label="标签编码" prop="dictValue">
                <el-input v-model="form.dictValue" placeholder="请输入标签编码" :disabled="isview" />
            </el-form-item>
            <el-form-item label="标签名" prop="dictLabel">
                <el-input v-model="form.dictLabel" placeholder="请输入标签名" :disabled="isview" />
            </el-form-item>
            <el-form-item label="分值" prop="score">
                <el-input-number style="width:100%" v-model="form.score" step-strictly controls-position="right" :min="0" :disabled="isview" />
            </el-form-item>
            <el-form-item label="分值类型" prop="scoretype">
                <el-input v-model="scoretype" placeholder="请输入分值类型" :disabled="isview" />
            </el-form-item>
            <el-form-item label="是否可编辑" prop="editFlag">
                <el-radio v-model="form.editFlag" label="0" :disabled="isview">是</el-radio>
                <el-radio v-model="form.editFlag" label="1" :disabled="isview">否</el-radio>
            </el-form-item>
            <el-form-item label="是否默认" prop="defaultFlag">
                <el-radio v-model="form.defaultFlag" label="0" :disabled="isview">是</el-radio>
                <el-radio v-model="form.defaultFlag" label="1" :disabled="isview">否</el-radio>
            </el-form-item>
            <el-form-item label="系统初始化" prop="construct">
                <el-radio v-model="form.construct" :label="1" :disabled="isview">是</el-radio>
                <el-radio v-model="form.construct" :label="0" :disabled="isview">否</el-radio>
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input-number style="width:100%" v-model="form.orderNum" step-strictly controls-position="right" :min="0" :disabled="isview" />
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入备注说明" :disabled="isview" />
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-radio v-model="form.status" label="0">启用</el-radio>
                <el-radio v-model="form.status" label="1">停用</el-radio>
            </el-form-item>
        </el-form>
        <div class="footer">
            <page-button theme="white" @click="$emit('close',false)">取消</page-button>
            <page-button @click="save" :disabled="isview">确定</page-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['mid', 'dictObj', 'create', 'isview'],
    data() {
        return {
            scoretype:'',
            form: {
                construct: 0,
                dictValue: '',
                defaultFlag: '0',
                editFlag: '0',
                id: '',
                masterId: 0,
                dictLabel: '',
                orderNum: 0,
                remark: '',
                score: '',
                status: '0'
            },
            rules: {
                dictLabel: [{ required:true, message:'请输入标签名称' }],
                dictValue: [{ required:true, message:'请输入标签编码' }],
            }
        }
    },
    methods:{
        save() {
            this.$refs.dictForm.validate(valid => {
                if (valid) {
                    this.form.score += ''
                    delete this.form._X_ROW_KEY
                    apiSystem[this.create?'addDictItem':'editDictItem'](this.form).then(res=>{
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
        !this.create ?
            this.form = JSON.parse(JSON.stringify(this.dictObj)) : this.form.masterId = this.mid
    }
}
</script>
<style lang="less" scoped>
.item-from {
  display: flex;
  flex-direction: column;
  height: 100%;
  .item-from-center{
    flex: 1;
    overflow-y: auto;
  }
  .footer{
    text-align: right;
    margin-top: 10px;
  }
}
::v-deep .el-form-item__error {
  top: 57%;
}
</style>