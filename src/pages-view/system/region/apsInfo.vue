<template>
    <div style="height:100%;overflow-y:auto">
        <el-descriptions :column="2" contentClassName="desc-cont"
            :labelStyle="{width:'10%',color:'#333333',background:'#FAFAFA'}" border size="medium">
            <template #title>
                <TabLabel :label="'区域信息'" />
            </template>
            <el-descriptions-item v-for="(i,j) in baseInfo" :key="j">
                <template slot="label">
                    <span>{{i.name}}</span>
                </template>
                <div>
                    <div v-if="i.key=='flag'">
                        <el-tag v-if="apsForm&&apsForm.code" size="small" :type="apsForm[i.key]=='0'?'success':'danger'">
                            {{apsForm[i.key]=='0'?'启用':'停用'}}
                        </el-tag>
                    </div>
                    <span v-else>{{apsForm[i.key]}}</span>
                </div>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import TabLabel from '../components/tabLabel'
import moment from 'moment'
import SysUpload from '../components/sysUpload.vue'

export default {
    props: ['selObj', 'create', 'selAps'],
    components: { TabLabel, SysUpload },
    data() {
        return {
            moment,
            apsForm:{
                name:"",
                sunId:"",
                level:"",
                sort:"",
                flag:"",
                belongName:"",
                remark:"",
                startPoint:"",
                endPoint:"",
                kilometers:"",
                fullLoadPrice:"",
                lessThanPrice:"",
                routeName:""
            },
            baseInfo:[
                { name:'区域名称', key:'name' }, { name:'区域编码', key:'code' }, { name:'所属区域', key:'belongName' },
                { name:'备注说明', key:'remark' }, { name:'显示顺序', key:'sort' }, { name:'启用状态', key:'flag' },
                { name:'起运地', key:'startPoint' },
                { name:'目的地', key:'endPoint' }, { name:'运输路线', key:'routeName' }, { name:'运输里程（公里）', key:'kilometers' },
                { name:'运费单价（元/吨*公里）', key:'fullLoadPrice' }, { name:'运费零担单价（元/吨*公里）', key:'lessThanPrice' }
            ]
        }
    },
    methods:{
        cancelEdit() {
            this.baseEdit=false
            this.keyEdit=false
            this.$emit('close')
        }
    },
    created() {
        if(this.selObj){
            this.apsForm = JSON.parse(JSON.stringify(this.selObj))            
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-descriptions__header {
    margin-bottom: 8px
}
</style>