<template>
    <div class="eps-cred-cont">
        <TabLabel style="margin-bottom:10px" :label="'营业执照'">
            <template #tail>
                <page-button style="margin-left:10px;float:right" v-if="licEdit" :content="'取消'" @click="cancelTrade"/>
                <page-button :disabled="!!!selObj" style="float:right" :content="licEdit?'保存':'修改'" @click="saveTrade"/>
            </template>
        </TabLabel>
        <el-descriptions :column="2" contentClassName="desc-cont"
            :labelStyle="{width:'10%',color:'#333333',background:'#FAFAFA'}" border size="medium">
            <el-descriptions-item v-for="(i,j) in licInfo" :key="j" :label="i.name">
                <span v-if="!licEdit">
                    <span v-if="i.key=='sysTradeLicenseFileList'">
                        <img style="cursor:pointer" @click="showpic=true" v-if="imgUrl" height="50" width="50" :src="imgUrl" alt="image">
                    </span>
                    <span v-else>{{tradeForm[i.key]}}</span>
                </span>
                <div v-if="licEdit">
                    <SysUpload :key="num" v-if="i.key=='sysTradeLicenseFileList'" :files="fileList" @getFiles="getFiles"/>
                    <el-date-picker v-else-if="i.key=='establishTime'" style="width:100%" v-model="tradeForm[i.key]" type="date" placeholder="请选择成立日期"/>
                    <el-input-number v-else-if="i.key=='regMoney'" style="width:100%;text-align:right" v-model="tradeForm[i.key]" :controls="false" :precision="2" placeholder="请输入注册资本"/>
                    <el-input v-else v-model="tradeForm[i.key]" :placeholder="'请输入'+i.name "/>
                </div>
            </el-descriptions-item>
        </el-descriptions>
        <TabLabel style="margin:10px 0" :label="'生产许可证'">
            <template #tail>
                <page-button :disabled="!!!selObj" style="float:right" content="新增" @click="create=true;licView=false;licDlg=true"/>
            </template>
        </TabLabel>
        <vxe-grid :height="300" :style="{width}" :data="licData" :columns="licColumns" ref="table">
            <template #status="{ row }">
                <span>{{row.status==0?'失效':row.status==1?'有效':'延续'}}</span>
            </template>
            <template #attach="{ row }">
                <page-button @click="showLicPic(row)" content="查看"/>
            </template>
            <template #action="{ row }">
                <page-button type="text" @click="create=false;licView=true;licRow=row;licDlg=true" content="查看"/>
                <page-button type="text" @click="create=false;licView=false;licRow=row;licDlg=true" content="编辑"/>
                <page-button type="text" @click="delDlg=true;delName='deleteLicRow';delId=row.licenseId" content="删除"/>
            </template>
        
        </vxe-grid>
        <div class="app-table-footer">
            <vxe-pager
                :current-page.sync="tablePage1.currentPage"
                :page-size.sync="tablePage1.pageSize"
                :total="tablePage1.total"
                @page-change="pageChange1"
            />
        </div>
        <TabLabel style="margin:10px 0" :label="'3C证书'">
            <template #tail>
                <page-button :disabled="!!!selObj" style="float:right" content="新增" @click="create=true;cccDlg=true"/>
            </template>
        </TabLabel>
        <vxe-grid :height="300" :style="{width}" :data="cccData" :columns="cccColumns" ref="table">
            <template #status="{ row }">
                <span>{{row.status==0?'失效':row.status==1?'有效':'延续'}}</span>
            </template>
            <template #attach="{ row }">
                <page-button @click="showCccPic(row)" content="查看"/>
            </template>
            <template #action="{ row }">
                <page-button type="text" @click="create=false;cccView=true;cccRow=row;cccDlg=true" content="查看"/>
                <page-button type="text" @click="create=false;cccView=false;cccRow=row;cccDlg=true" content="编辑"/>
                <page-button type="text" @click="delDlg=true;delName='deleteCccRow';delId=row.certId" content="删除"/>
            </template>
        
        </vxe-grid>
        <div class="app-table-footer">
            <vxe-pager
                :current-page.sync="tablePage2.currentPage"
                :page-size.sync="tablePage2.pageSize"
                :total="tablePage2.total"
                @page-change="pageChange2"
            />
        </div>
        <div style="margin:10px 0">
            <TabLabel :label="'其他资质'">
                <template #tail>
                    <page-button :disabled="!!!selObj" style="float:right" content="新增" @click="create=true;credDlg=true"/>
                </template>
            </TabLabel>
        </div>
        <vxe-grid :height="300" :style="{width}" :data="credData" :columns="credColumns" ref="table">
            <template #status="{ row }">
                <span>{{row.status==0?'失效':row.status==1?'有效':'延续'}}</span>
            </template>
            <template #attach="{ row }">
                <page-button @click="showOtherPic(row)" content="查看"/>
            </template>
            <template #action="{ row }">
                <page-button type="text" @click="create=false;credView=true;credRow=row;credDlg=true" content="查看"/>
                <page-button type="text" @click="create=false;credView=false;credRow=row;credDlg=true" content="编辑"/>
                <page-button type="text" @click="delDlg=true;delName='deleteCredRow';delId=row.otherId" content="删除"/>
            </template>
        
        </vxe-grid>
        <div class="app-table-footer">
            <vxe-pager
                :current-page.sync="tablePage3.currentPage"
                :page-size.sync="tablePage3.pageSize"
                :total="tablePage3.total"
                @page-change="pageChange3"
            />
        </div>

        <modal width="500px" :title="(create?'新增':licView?'查看':'修改')+'生产许可证信息'" :visible="licDlg" @close="licDlg=false">
            <LicForm v-if="licDlg" :selObj="selObj" :licObj="licRow" :isview="licView" @close="closeLic" :create="create"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        <modal width="500px" :title="(create?'新增':cccView?'查看':'修改')+'3C证书信息'" :visible="cccDlg" @close="cccDlg=false">
            <CccForm v-if="cccDlg" :selObj="selObj" :cccObj="cccRow" :isview="cccView" @close="closeCcc" :create="create"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        <modal width="500px" :title="(create?'新增':credView?'查看':'修改')+'其他资质信息'" :visible="credDlg" @close="credDlg=false">
            <CredForm v-if="credDlg" :selObj="selObj" :credObj="credRow" :isview="credView" @close="closeCred" :create="create"/>
            <template slot="footer_bnt"><span/></template>
        </modal>

        <el-dialog :visible.sync="showpic" width="1200px" @close="showpic=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showpic" :src="imgUrl" alt=""/>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showlic" width="1200px" @close="showlic=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showlic" :src="licUrl" alt=""/>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showccc" width="1200px" @close="showccc=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showccc" :src="cccUrl" alt=""/>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showother" width="1200px" @close="showother=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showother" :src="otherUrl" alt=""/>
            </div>
        </el-dialog>
        <DeleteDialog @close="v=>{ delDlg=false; v?this[delName](delId)():'' }" 
            :delObj="{ module:'企业信息', target:'', flag:delDlg }"/>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import TabLabel from '../components/tabLabel'
import LicForm from './licForm'
import CccForm from './cccForm'
import CredForm from './credForm'
import moment from 'moment'
import SysUpload from '../components/sysUpload.vue'
import DeleteDialog from '../components/deleteDialog'

export default {
    components: { TabLabel, LicForm, CccForm, CredForm, SysUpload, DeleteDialog },
    props: [ 'selObj' ],
    data() {
        return {
            moment,
            width:0,
            create:false,
            licEdit:false,
            licDlg:false,
            cccDlg:false,
            credDlg:false,
            selectLic:undefined,
            selectCcc:undefined,
            selectCred:undefined,
            showTable:false,
            licInfo:[
                { name:'类型', key:'tradeType' },{ name:'注册资本', key:'regMoney' },{ name:'成立日期', key:'establishTime' },
                { name:'营业期限', key:'tradeDeadline' },{ name:'登记机关', key:'regOffice' },{ name:'住所', key:'tradePlaceAddr' },
                { name:'经营范围', key:'tradeBrief' },{ name:'上传营业执照', key:'sysTradeLicenseFileList' },
            ],
            licRow:{},
            licView:false,
            cccRow:{},
            cccView:false,
            credRow:{},
            credView:false,
            licData:[],
            licColumns:[
                { field:'licenseNo', title:'生产许可证编号', align:'center', width:'150' },
                { field:'licenseName', title:'生产许可证名称', align:'center', width:'150' },
                { field:'licenseOffice', title:'发证机关', align:'center', minWidth:'150' },
                { field:'productName', title:'主导产品', align:'center', minWidth:'150' },
                { field:'begDate', title:'发证日期', align:'center', width:'150' },
                { field:'endDate', title:'有效日期至', align:'center', width:'150' },
                { field:'continueDate', title:'延续有效期至', align:'center', width:'150' },
                { field:'productAddr', title:'生产地址', align:'center', width:'150' },
                { field:'licenseContent', title:'许可证内容', align:'center', width:'150' },
                { field:'status', title:'状态', align:'center', width:'150', slots:{ default:'status' } },
                { field:'remark', title:'说明', align:'center', width:'150' },
                { field:'sysProductLicenseFileList', title:'附件', align:'center', width:'150', slots:{ default:'attach' } },
                { title:'操作', align:'center', slots:{ default:'action' } , width:'150', fixed:'right' },
            ],
            cccData:[],
            cccColumns:[
                { field:'certNo', title:'证书编号', width:'150', align:'center' },
                { field:'certName', title:'证书名称', width:'150', align:'center' },
                { field:'consignorName', title:'委托人名称', width:'150', align:'center' },
                { field:'consignorAddr', title:'委托人地址', width:'150', align:'center' },
                { field:'manufacturerName', title:'制造商名称', width:'150', align:'center' },
                { field:'menufacturerAddr', title:'制造商地址', width:'150', align:'center' },
                { field:'model', title:'型号', width:'150', align:'center' },
                { field:'standard', title:'规格', width:'150', align:'center' },
                { field:'technicalStandard', title:'技术标准', width:'150', align:'center' },
                { field:'begDate', title:'发证日期', width:'150', align:'center' },
                { field:'endDate', title:'有效日期至', width:'150', align:'center' },
                { field:'continueDate', title:'延续有效期至', width:'150', align:'center' },
                { field:'status', title:'状态', width:'150', align:'center', slots:{ default:'status' } },
                { field:'remark', title:'说明', width:'150', align:'center' },
                { field:'sysCertificationFileList', title:'附件', width:'150', align:'center', slots:{ default:'attach' } },
                { title:'操作', align:'center', slots:{ default:'action' } , width:'150', fixed:'right' },
            ],
            credData:[],
            credColumns:[
                { field:'otherNo', title:'证书编号', width:'150', align:'center' },
                { field:'otherName', title:'证书名称', width:'150', align:'center' },
                { field:'licenseOffice', title:'发证机关', width:'150', align:'center' },
                { field:'begDate', title:'发证日期', width:'150', align:'center' },
                { field:'endDate', title:'有效期至', width:'150', align:'center' },
                { field:'continueDate', title:'延续有效期至', width:'150', align:'center' },
                { field:'licenseContent', title:'证书内容', width:'150', align:'center' },
                { field:'status', title:'状态', width:'150', align:'center', slots:{ default:'status' } },
                { field:'remark', title:'说明', width:'150', align:'center' },
                { field:'sysOtherCertificationFile', title:'附件', width:'150', align:'center', slots:{ default:'attach' } },
                { title:'操作', align:'center', slots:{ default:'action' } , width:'150', fixed:'right' },
            ],
            boxWidth:0,
            tradeForm:{
                clientId: 0,
                establishTime: '',
                legalRepresentative: "",
                regMoney: 0,
                regOffice: "",
                sysTradeLicenseFileList: [],
                tradeBrief: "",
                tradeDeadline: "",
                tradeLicenseId: 0,
                tradePlaceAddr: "",
                tradeType: "",
                uuidNo: 0
            },
            tradeFormOrg:{},
            tablePage1: { currentPage:1, pageSize:20, total:0 },
            tablePage2: { currentPage:1, pageSize:20, total:0 },
            tablePage3: { currentPage:1, pageSize:20, total:0 },
            fileList: [],
            fileListOrg: [],
            imgUrl:'',
            num:0,
            showpic:false,
            showlic:false,
            showccc:false,
            showother:false,
            licUrl:'',
            cccUrl:'',
            otherUrl:'',
            delDlg:false,
            delName:'',
            delId:'',
        }
    },
    methods:{
        pageChange1(obj){},
        pageChange2(obj){},
        pageChange3(obj){},
        saveTrade() {
            this.licEdit=!this.licEdit
            if (!this.licEdit) {
                this.tradeForm.establishTime = this.tradeForm.establishTime?moment(this.tradeForm.establishTime).format('YYYY-MM-DD HH:mm:ss'):''
                if (this.fileList.length){
                    delete this.fileList[0].status
                    delete this.fileList[0].uid
                    apiSystem.addAttachTrade(this.fileList[0]).then(res=>{
                        this.getTradeLic()
                    })
                } else {
                    if (this.fileListOrg?.length) {
                        apiSystem.deleteAttachTrade(this.fileListOrg[0].fileId).then(res=>{
                            this.getTradeLic()
                        })
                    }
                }
                apiSystem[this.tradeForm?.tradeLicenseId?'editTradeLic':'addTradeLic'](this.tradeForm).then(res=>{
                    this.$message[res.code==200?'success':'warning'](res.message)
                    this.getTradeLic()
                }) 
            }
        },
        cancelTrade() {
            this.licEdit=false
            this.fileList = this.fileListOrg
            this.tradeForm=JSON.parse(JSON.stringify(this.tradeFormOrg))
        },
        closeLic(v) {
            this.licDlg=false
            v?this.getProductLic():''
        },
        closeCcc(v) {
            this.cccDlg=false
            v?this.getProductCert():''
        },
        closeCred(v) {
            this.credDlg=false
            v?this.getOtherCert():''
        },
        deleteLicRow(id) {
            apiSystem.delProductLic(id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getProductLic()
            })
        },
        deleteCccRow(id) {
            apiSystem.delProductCert(id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getProductCert()
            })
        },
        deleteCredRow(id) {
            apiSystem.delProductOtherCert(id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getOtherCert()
            })
        },
        getProductLic() {
            apiSystem.getProductLic(this.selObj?.clientId).then(res=>{
                this.licData = res.data
                this.tablePage1.total = this.licData.length
            })
        },
        getProductCert(){
            apiSystem.getProductCert(this.selObj?.clientId).then(res=>{
                this.cccData = res.data
                this.tablePage2.total = this.cccData.length
            })
        },
        getOtherCert(){
            apiSystem.getProductOtherCert(this.selObj?.clientId).then(res=>{
                this.credData = res.data
                this.tablePage3.total = this.credData.length
            })
        },
        getFiles(arr){
            if (arr.length) {
                this.fileList = arr.map( i => { 
                    return { 
                        bucketName: i.response?.data.bucketName||'',
                        fileId: 0,
                        fileName: i.response?.data.fileName||'',
                        filePath: i.response?.data.filePath||'',
                        fileType: i.raw.type,
                        masterId: this.selObj?.clientId||0,
                        model:'trade',
                        oprTable: '',
                        sourceFileName: i.response?.data.originalFileName||'',
                        type: '',
                        uploadTime: '',
                        uploadUse: '',
                        uploadUseName: ''
                    }               
                })
            } else {
                this.fileList = []
            }
        },
        getTradeLic(){
            apiSystem.getTradeLic(this.selObj?.clientId).then(res=>{
                if (res.data.length) {
                    this.tradeForm = res.data[0]
                    this.tradeFormOrg = JSON.parse(JSON.stringify(this.tradeForm))
                    apiSystem.getAttachTrade({fileId:this.tradeForm.clientId,model:'trade'}).then(res=>{
                        if (res.data.length) {
                            this.imgUrl = '/minio/'+res.data[0].filePath
                            res.data.forEach(i=>{
                                i.name = i.sourceFileName;
                                i.url ='/minio/'+i.filePath
                            })
                            this.fileList = res.data
                            this.fileListOrg = JSON.parse(JSON.stringify(this.fileList))
                        } else {
                            this.imgUrl = ''
                            this.fileList = []
                            this.fileListOrg = []
                        }
                    })
                }
            })
        },
        showLicPic(row){
            apiSystem.getAttachProd({fileId:row.licenseId,model:'lic'}).then(res=>{
                if (res.data.length) {
                    this.licUrl = '/minio/'+res.data[0].filePath
                    this.showlic = true
                } else {
                    this.$message.warning('未上传附件')
                    this.licUrl = ''
                }
            })
        },
        showCccPic(row){
            apiSystem.getAttachCert({fileId:row.certId,model:'cert'}).then(res=>{
                if (res.data.length) {
                    this.cccUrl = '/minio/'+res.data[0].filePath
                    this.showccc = true
                } else {
                    this.$message.warning('未上传附件')
                    this.cccUrl = ''
                }
            })
        },
        showOtherPic(row){
            apiSystem.getAttachOther({fileId:row.otherId,model:'other'}).then(res=>{
                if (res.data.length) {
                    this.otherUrl = '/minio/'+res.data[0].filePath
                    this.showother = true
                } else {
                    this.$message.warning('未上传附件')
                    this.otherUrl = ''
                }
            })
        }
    },
    created() {
        if (this.selObj?.clientId) {
            this.tradeForm.clientId = this.selObj.clientId
            this.getTradeLic()
            this.getProductLic()
            this.getProductCert()
            this.getOtherCert()
        }
        this.width = (document.getElementsByClassName('eps-cred-cont')?.[0]?.clientWidth||0)+'px'
        window.onresize = () => {
            return (() => {
                this.width = document.documentElement.clientWidth-280+'px'
            })()
        }
    }
}
</script>
<style lang="less" scoped>
.eps-cred-cont {
    width:100%;
    height:100%;
    overflow-y: auto;
    /deep/ .el-input-number .el-input__inner {
        text-align:right !important
    }
}
/deep/ .el-descriptions__header {
    margin-bottom: 8px;
}
</style>