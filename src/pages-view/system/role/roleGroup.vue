<template>
    <div>
        <el-form ref="groupForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="分组名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入分组名称" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input-number style="width:100%" v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" @click="$emit('closeForm',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['roleGroupObj'],
    data() {
        return {
            form: {
                children:[],
                // id:0,
                name:'',
                orderNum:0,
                parentId:0
            },
            rules: {
                name:[{ required:true, message:'请输入分组名称'}],
            }
        }
    },
    methods: {
        save() {
            this.$refs.groupForm.validate(valid => {
                if (valid) {
                    apiSystem[this.roleGroupObj?.id?'editRoleTree':'addRoleTree'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('closeForm', true)
                    })
                } else {
                    this.$message.warning('请输入分组名称')
                }
            })
        }
    },
    created() {
        if (this.roleGroupObj?.id) {
            const { children, id, name, orderNum, parentId } = this.roleGroupObj
            this.form = { children, id, name, orderNum, parentId }
        }
    }
}
</script>