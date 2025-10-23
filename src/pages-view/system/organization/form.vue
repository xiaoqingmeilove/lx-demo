<template>
    <div>
        <el-form ref="orgForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="组织名称" prop="orgName">
                <el-input v-model="form.orgName" placeholder="请输入组织名称" />
            </el-form-item>
            <el-form-item label="组织编码" prop="orgCode">
                <el-input v-model="form.orgCode" placeholder="请输入组织编码" />
            </el-form-item>
            <el-form-item label="上级组织" prop="parentId">
                <el-tree ref="orgfTree" style="padding-top:6px" :data="orgData" :props="{ label:'orgName' }" node-key="id" show-checkbox check-on-click-node
                   highlight-current :expand-on-click-node="false" @check-change="orgCheck" check-strictly :default-expanded-keys="expNode"/>
            </el-form-item>
            <el-form-item label="注册地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入注册地址" />
            </el-form-item>
            <el-form-item label="行政区域" prop="administrativeDivision">
                <el-select style="width:100%" v-model="form.administrativeDivision" placeholder="请选择行政区域">
                    <el-option v-for="(i,j) in allarea" :key="j" :label="i.name" :value="i.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input-number style="width:100%" v-model="form.orderNum" controls-position="right" :min="0" />
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
    props: ['orgObj', 'create'],
    data() {
        return {
            orgData: [],
            form: {
                address: '',
                administrativeDivision: '',
                children: [],
                createName: '',
                createTime: '',
                delFlag: 0,
                enterpriseChildren: [],
                id: 0,
                orgCode: '',
                orgName: '',
                parentId: 0,
                status: 0,
                updateName: '',
                updateTime: '',
                orderNum: 0,
                remark: ''
            },
            rules: {
                orgName: [{ required:true, message:'请输入组织名称' }],
            },
            allarea: [
                { name:'区域一', id:'1' },
                { name:'区域二', id:'2' }
            ],
            expNode: []
        }
    },
    methods:{
        save() {
            this.$refs.orgForm.validate(valid => {
                this.create?delete this.form.id:''
                if (valid) {
                    apiSystem[this.create?'addOrg':'editOrg'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close', true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        },
        orgCheck(data, checked, indeterminate){
            this.form.parentId = checked ? data.id : 0
            checked ? this.$refs.orgfTree.setCheckedNodes([data]) : ''
        }
    },
    mounted(){
        apiSystem.getOrgTree().then(res=>{ 
            // res.data.pop()
            this.orgData = res.data
            if (this.orgObj?.parentId) {
                setTimeout(()=>{ 
                    this.$refs.orgfTree.setChecked(this.form.parentId,true,false) 
                },500)
            }
        })
    },
    created() {
        if (!this.create) {
            this.orgObj?.id ? this.form=JSON.parse(JSON.stringify(this.orgObj)):''
        }
    }
}
</script>