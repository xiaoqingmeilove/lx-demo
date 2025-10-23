<template>
    <div>
        <el-form ref="groupMoveForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="分组名称" prop="groupId">
                <el-tree ref="tree" style="padding-top:6px" :data="groups" :props="props" node-key="id" 
                    highlight-current @check-change="treeClick" show-checkbox check-strictly/>
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
    props: ['roleObj'],
    data() {
        return {
            groups:[],
            form: {
                groupId:'',
            },
            rules: {
                groupId:[{ required:true, message:'请选择分组名称'}],
            },
            props:{
                label:'name',
                children:'children',
            }
        }
    },
    methods: {
        save() {
            let obj = JSON.parse(JSON.stringify(this.roleObj))
            obj.groupId = this.form.groupId
            this.$refs.groupMoveForm.validate(valid => {
                if (valid) {
                    delete obj.name
                    apiSystem.changeRoleGroup(obj).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('closeForm', true)
                    })
                } else {
                    this.$message.warning('请选择分组名称')
                }
            })
        },
        treeClick(data, checked, node) {
            this.form.groupId = checked ? data.id : 0
            checked ? this.$refs.tree.setCheckedNodes([data]) : ''
        },
    },
    created() {
        apiSystem.getRoleGroupTree().then(res=>{
            this.groups = res.data
        })
    }
}
</script>