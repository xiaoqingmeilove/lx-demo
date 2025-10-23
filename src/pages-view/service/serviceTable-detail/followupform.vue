<template>
    <div>
        <el-form ref="followUpForm" :rules="rules" :model="fform" label-width="100px">
            <el-form-item label="问题解决情况" prop="problemSolving">
                <el-radio v-model="fform.problemSolving" label="已解决">已解决</el-radio>
                <el-radio v-model="fform.problemSolving" label="未解决">未解决</el-radio>
            </el-form-item>
            <el-form-item label="服务及时性" prop="timeliness">
                <el-radio v-model="fform.timeliness" label="及时">及时</el-radio>
                <el-radio v-model="fform.timeliness" label="不够及时">不够及时</el-radio>
                <el-radio v-model="fform.timeliness" label="不及时">不及时</el-radio>
            </el-form-item>
            <el-form-item label="服务态度" prop="attitude">
                <el-radio v-model="fform.attitude" label="热情、积极主动">热情、积极主动</el-radio>
                <el-radio v-model="fform.attitude" label="不够热情主动">不够热情主动</el-radio>
                <el-radio v-model="fform.attitude" label="冷谈被动">冷谈被动</el-radio>
            </el-form-item>
            <el-form-item label="满意度评价" prop="satisfaction">
                <el-radio v-model="fform.satisfaction" label="很满意">很满意(10分)</el-radio>
                <el-radio v-model="fform.satisfaction" label="满意">满意(5分)</el-radio>
                <el-radio v-model="fform.satisfaction" label="一般">一般(1分)</el-radio>
            </el-form-item>
            <el-form-item label="沟通摘要" prop="description">
                <el-input type="textarea" placeholder="请输入沟通摘要" v-model="fform.description" maxlength="500" show-word-limit :rows="3"/>
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
    props:['form'],
    data() {
        return {
            rules:{},
            fform:{
                afterSalesBillId: this.form.id,
                attitude: "热情、积极主动",
                createTime: "",
                createUser: "",
                createUserId: 0,
                createUserName: "",
                description: "",
                problemSolving: "已解决",
                satisfaction: "很满意",
                timeliness: "及时",
                updateTime: "",
                updateUser: "",
                updateUserId: 0,
                updateUserName: ""
            }
        }
    },
    methods:{
        save(){
            apiService.changeFollowUp(this.fform).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.$emit('close')
            })
        }
    },
    created() {
        this.fform.problemSolving = this.form.afterSalesBillReview.problemSolving
        this.fform.timeliness = this.form.afterSalesBillReview.timeliness
        this.fform.attitude = this.form.afterSalesBillReview.attitude
        this.fform.satisfaction = this.form.afterSalesBillReview.satisfaction
        this.fform.description = this.form.afterSalesBillReview.description
    }
}
</script>