<template>
    <div class="model_box">
        <el-form ref="roleForm" :rules="rules" :model="form" label-width="150px">
            <el-form-item label="区域名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入区域名称" />
            </el-form-item>
            <el-form-item label="区域编码" prop="code">
                <el-input v-model="form.code" placeholder="请输入区域编码" />
            </el-form-item>
            <el-form-item label="所属区域" prop="parentId">
                <el-cascader style="width:100%"
                 v-model="form.parentId"
                  :options="apsTrees"
                  :before-filter="filterOption"
                  :props="{ label:'name',value:'id', emitPath:false, checkStrictly:true}"
                 >
                </el-cascader>
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
                <el-input-number style="width:100%" v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入备注说明" />
            </el-form-item>
            <el-form-item label="起运地" prop="startPoint">
                <el-input v-model="form.startPoint" placeholder="请输入起运地" />
            </el-form-item>
            <el-form-item label="目的地" prop="endPoint">
                <el-input v-model="form.endPoint" placeholder="请输入目的地" />
            </el-form-item>
            <el-form-item label="运输路线" prop="routeName">
                <el-input v-model="form.routeName" disabled placeholder="自动拼接起运地和目的地" />
            </el-form-item>
            <el-form-item label="运输里程（公里）" prop="kilometers">
                <el-input-number style="width:100%" v-model="form.kilometers" controls-position="right" />
            </el-form-item>
            <el-form-item label="运费单价（元/吨*公里）" prop="fullLoadPrice">
                <el-input-number style="width:100%" v-model="form.fullLoadPrice" controls-position="right" />
            </el-form-item>
            <el-form-item label="运费零但单价（元/吨*公里）" prop="lessThanPrice">
                <el-input-number style="width:100%" v-model="form.lessThanPrice" controls-position="right" />
            </el-form-item>
            <el-form-item label="启用状态" prop="flag">
                <el-radio v-model="form.flag" :label=0>启用</el-radio>
                <el-radio v-model="form.flag" :label=1>停用</el-radio>
            </el-form-item>
        </el-form>
        <div class="footerbtn">
            <el-button type="primary" class="buttons" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" class="buttons" @click="$emit('closeForm',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['apsTrees','businessCode'],
    data() {
        return {
            selectedOptions:"",
            form: {
                id: "",
                name:"",
                belongName: "",
                code:"",
                remark: "",
                parentId: '',
                sort:0,
                startPoint: '',
                endPoint:'',
                routeName:'',
                kilometers:'',
                fullLoadPrice:'',
                lessThanPrice:'',
                flag:0
            },
            rules: {
                name:[{ required:true, message:'请输入区域名称'}],
                code:[{ required:true, message:'请输入区域编码'}],
                parentId:[{ required:true, message:'请选择所属区域'}],
            }
        }
    },
     computed: {
        fullName() {
        return this.form.startPoint + ' - ' + this.form.endPoint;
        }
    },
    methods:{
        filterOption(node, keyword) {
            return !(node.data && node.data.level == 3);
        },
        save() {
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    console.log(this.form)
                    apiSystem.addRegionDatails(this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('closeForm', true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        },
    },
    created() {
        // console.log(this.businessCode)
        // if(this.businessCode == 'TYDL'){
        //     this.form.startPoint = '太阳电缆'
        // }
    }
}
</script>
<style scoped>
.model_box{
    width: 100%;
    height: 600px;
    overflow: scroll;
}
.model_box::-webkit-scrollbar {
  display: none;
}
.footerbtn{
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: center;
}
.buttons{
    width: 92px;
    height: 40px;
}
</style>