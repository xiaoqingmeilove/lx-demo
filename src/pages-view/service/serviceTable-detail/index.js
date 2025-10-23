import { ApiService } from '@/apis'
const apiService = new ApiService()
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import billInfoCust from './billInfoCust'
import ServiceForm from '../serviceTable/form'
import HandleBillForm from './billform'
import SupportBillForm from './supportform'
import EvaluateBillForm from './evaluateform'
import FollowUpForm from './followupform'
import ReceiptForm from './receiptform'

export default {
    components:{ billInfoCust, ServiceForm, HandleBillForm, SupportBillForm, EvaluateBillForm, FollowUpForm, ReceiptForm },
    data(){
        return {
            id:0,
            sform:false,
            bform:false,
            pform:false,
            eform:false,
            rform:false,
            bsform:false,
            csform:false,
            fsform:false,
            create:false,
            form:{},
            activeTab:'shfwsl',
            activeBtn:0,
            serviceProcess:[],
            priorityList:[],
            processingMethodList:[],
            lossLevelList:[],
            reinfo:[
                [
                    { key:'serviceContent', parent:'afterSalesBillReceipt', name:'服务内容、过程及结果' },
                    { key:'reasonAnalysis', parent:'afterSalesBillReceipt', name:'原因分析' },
                    { key:'preventive', parent:'afterSalesBillReceipt', name:'纠正/预防措施' },
                    { key:'liableDept', parent:'afterSalesBillReceipt', name:'责任部门' },
                    { key:'relevantDepartments', parent:'afterSalesBillReceipt', name:'相关部门' },
                    { key:'processingResults', parent:'afterSalesBillReceipt', name:'处理结果及跟踪' },
                    { key:'processingMethod', parent:'afterSalesBillReceipt', name:'处理方式' },
                    { key:'liableProcessing', parent:'afterSalesBillReceipt', name:'责任处理' },
                    { key:'liablePerson', parent:'afterSalesBillReceipt', name:'相关部门及领导' },
                    { key:'lossFee', parent:'afterSalesBillReceipt', name:'损失费' },
                    { key:'lossLevel', parent:'afterSalesBillReceipt', name:'损失等级' },
                    { key:'remark', parent:'afterSalesBillReceipt', name:'备注' },
                    { key:'beforeFileList', parent:'afterSalesBillReceipt', name:'处理前图片' },
                    { key:'afterFileList', parent:'afterSalesBillReceipt', name:'处理后图片' },
                ],
                [
                    { key:'problemSolving', parent:'afterSalesBillReview', name:'问题解决情况' },
                    { key:'timeliness', parent:'afterSalesBillReview', name:'服务及时性' },
                    { key:'attitude', parent:'afterSalesBillReview', name:'服务态度' },
                    { key:'satisfaction', parent:'afterSalesBillReview', name:'满意度评价' },
                    { key:'description', parent:'afterSalesBillReview', name:'沟通摘要' },
                    { key:'createTime', parent:'afterSalesBillReview', name:'回访时间' },
                ]
            ],
            selimg:'',
            showimg:false,
            loading:true
        }
    },
    methods:{
        getStateName(i){
            return i==0?'待受理':i==1?'已受理':i==2?'拒受理':i==3?'待服务':i==4?'待回访':i==5?'已回访':i==6?'已完成':''
        },
        getDetail(){
            apiService.detailPostSalesService(this.id).then(res=>{
                this.form = res.data
                if (this.form.afterSalesBillFileList?.length) {
                    this.form.afterSalesBillFileList.forEach(i=>{
                        i.name = i.originalFileName
                        i.url = '/minio/'+i.filePath
                    })
                } else {
                    this.form.afterSalesBillFileList = []
                }
                this.getProcess()
            })
        },
        getProcess(){
            apiService.billProcessRecord(this.id).then(res=>{
                this.serviceProcess = res.data||[]
            })
        },
        confirm(){
            apiService.changeBillState(this.id,3).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getDetail()
                this.bsform = false
            })
        },
        close() {
            apiService.changeBillState(this.id,6).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getDetail()
                this.csform = false
            })
        }
    },
    created(){
        const { params } = this.$route
        this.id = params.id
        this.getDetail()
        apiSystem.getDictItem(4927286877362).then(res=>{ this.priorityList = res.data??[] })
        apiSystem.getDictItem(4927286877367).then(res=>{ this.processingMethodList = res.data??[] })
        apiSystem.getDictItem(4927286877368).then(res=>{ this.lossLevelList = res.data??[] })
    },
    mounted(){
        setTimeout(()=>{ this.loading = false },300)
    }
}