<template>
    <div>
        <el-form ref="wfForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="模块名" prop="applyName">
                <el-select style="width:100%" v-model="form.applyName" filterable placeholder="请选择模块名">
                    <el-option v-for="i in names" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="模块名称" prop="applyCode">
                <el-select style="width:100%" v-model="form.applyCode" filterable placeholder="请选择模块名称">
                    <el-option v-for="i in codes" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="模型代码" prop="wfModuleCode">
                <el-input v-model="form.wfModuleCode" placeholder="请输入工作流模型代码" />
            </el-form-item>
        </el-form>
        <div style="margin-top:30px">
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" @click="$emit('close',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form:{
                applyName:'',
                applyCode:'',
                wfModuleCode:'',
            },
            rules:{
                applyName:[{required:true,message:'请选择模块名'}],
                applyCode:[{required:true,message:'请选择模块名称'}],
                wfModuleCode:[{required:true,message:'请输入模型代码'}],
            },
            names:[
                { label:'专项报价', value:1 },
                { label:'项目报备', value:2 },
            ],
            codes:[
                { label:'WF_SUN_newApply_V2.0', value:3 },
                { label:'WF_SUN_information_V1.0', value:4 },
            ]
        }
    },
    methods: {
        save() {
            this.$refs.wfForm.validate(valid=>{
                if(valid) {
                    this.$emit('close',false)
                }
            })
        }
    }
}
</script>