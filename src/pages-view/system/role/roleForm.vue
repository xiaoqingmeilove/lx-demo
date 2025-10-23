<template>
    <div>
        <el-form ref="roleForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="分组名称" prop="groupId">
                <el-select style="width:100%" v-model="form.groupId" placeholder="请选择分组名称">
                    <el-option v-for="(i,j) in allgroup" :key="j" :label="i.name" :value="i.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="显示顺序" prop="roleSort">
                <el-input-number style="width:100%" v-model="form.roleSort" controls-position="right" :min="1" />
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入备注说明" />
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-radio v-model="form.status" label="0">启用</el-radio>
                <el-radio v-model="form.status" label="1">停用</el-radio>
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
    props: ['roleObj', 'create'],
    data() {
        return {
            form: {
                clientId: 0,
                createName: '',
                createTime: '',
                dataScope: '',
                delFlag: 0,
                // deptIds: [],
                flag: true,
                groupId: undefined,
                menus: [],
                remark: '',
                roleId: 0,
                // roleKey: '0',
                roleName: '',
                roleSort: '1',
                searchValue: '',
                status: '0',
                updateName: '',
                updateTime: ''
            },
            rules:{
                roleName: [{ required: true, message: '请输入角色名称'}],
                groupId: [{ required: true, message: '请选择分组名称'}],
            },
            allgroup:[]
        }
    },
    methods:{
        save() {
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    this.create?delete this.form.roleId:''
                    delete this.form.name
                    // apiSystem[this.create?'addRole':'editRole'](
                    apiSystem[this.create?'addRole':'putEditRole'](
                        Object.assign(this.form)
                    ).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('closeForm', true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        }
    },
    created() {
        apiSystem.getRoleGroupTree().then(res=>{
            this.allgroup = res.data
        })
        if (!this.create&&this.roleObj?.roleId) {
            apiSystem.detailRole(this.roleObj.roleId).then(res=>{
                this.form = res.data
            })
        }
    }
}
</script>