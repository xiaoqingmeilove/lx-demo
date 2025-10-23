<template>
    <div>
        <div v-for="(m,n) in evalist" :key="n">
            <span>{{m.expontentialName}}：</span>
            <el-rate style="display:inline-block;vertical-align:2px" v-model="result[n]" />
        </div>
        <div style="margin-top:10px">
            <span>评价内容<span style="font-size:12px">(200字以内)</span>：</span>
            <div style="margin-top:3px">
                <el-input type="textarea" placeholder="请输入评价内容" :rows="5" v-model="comment" maxlength="200" show-word-limit></el-input>
            </div>
        </div>
        <div style="width:100%;text-align:center;margin-top:15px">
            <el-button type="primary" @click="submit()" :disabled="disabled">保存</el-button>
            <el-button type="primary" @click="$emit('close')">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiService } from '@/apis'
const apiService = new ApiService()

export default {
    name:'quoted_service_score',
    props:['row'],
    data(){
        return {
            evalist:[],
            result:[],
            scoringConfigId:'',
            comment:'',
            disabled:true
        }
    },
    methods: {
        submit(){
            if (this.result.length==this.evalist.length) {
                let obj = {
                    comment: this.comment,
                    commentUserId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    documentId: this.row.billNo,
                    scoringConfigId:this.scoringConfigId
                }
                obj.resultList = this.evalist.map((a,b)=>{return {
                    scoringCommentId: a.expontentialId,
                    scoringNumber: this.result[b]
                }})
                apiService.evaluateSave(obj).then(res=>{
                    if(res.code==200) {
                        this.$message.success('保存成功')
                        this.$emit('close')
                    }
                })
            } else {
                this.$message.warning('请填写所有评价项')
            }
        }
    },
    created() {
        apiService.evaluateFind(this.row.billNo).then(res=>{
            if (res.data&&res.data.length) { 
                this.evalist = res.data
                this.result = res.data.map(i=>parseInt(i.scoringNumber))
                this.comment = res.data[0].comment
            } else {
                apiService.evaluateDoc('market_quote_newSpecial').then(res=>{
                    if (res?.data&&res.data.length) {
                        this.evalist = res.data
                        this.scoringConfigId = res.data[0].scoringConfigId
                        this.disabled = false
                    }
                })
            }
        })
    }
}
</script>