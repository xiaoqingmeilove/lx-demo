<template>
  <app-page>
    <bill-info-cust :info-value="form" :show-value="!!form.id"></bill-info-cust>
    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeTab" @tab-click="" flex>
        <template #buttons>
            <page-button @click="bform=true" :disabled="!!form.billState">受理单据</page-button>
            <page-button @click="pform=true" :disabled="form.billState!=1">业务支持</page-button>
            <page-button @click="eform=true" :disabled="form.billState!=1">业务评估</page-button>
            <page-button @click="bsform=true" :disabled="form.billState!=1">开始服务</page-button>
            <page-button @click="rform=true" :disabled="form.billState<3||form.billState==6">填写回单</page-button>
            <page-button @click="fsform=true" :disabled="form.billState<4||form.billState==6">客户回访</page-button>
            <page-button @click="csform=true" :disabled="form.billState<4||form.billState==6">关闭单据</page-button>
            <page-button @click="sform=true" :disabled="form.billState==2||form.billState==6">修改</page-button>
            <page-button @click="" disabled>打印</page-button>
            <page-button @click="$tabs.close()">关闭</page-button>
        </template>
        <el-tab-pane name="shfwsl">
            <span slot="label">售后服务受理</span>
            <div class="tab-content-container">
                <div class="after-sales-handle">
                    <div>
                        <div style="margin-top:18px;text-align:center">
                            <span style="color:#1890FF">单据号：{{form.billNo}}</span>
                        </div>
                        <div style="margin-left:20px;margin-top:16px">
                            <div>
                                <span style="color:#A3A3A3">服务标题：</span><span :title="form.serviceTitle">{{form.serviceTitle}}</span>
                            </div>
                            <div style="margin:12px 0">
                                <span style="color:#A3A3A3">客户名称：</span><span :title="form.customerName">{{form.customerName}}</span>
                            </div>
                            <div>
                                <span style="color:#A3A3A3">项目名称：</span><span :title="form.sourceProjectName">{{form.sourceProjectName}}</span>
                            </div>
                        </div>
                        <div style="margin-left:20px;margin-top:35px">
                            <div>
                                <span style="color:#A3A3A3">业务单据：</span><span>{{form.sourceBillNo}}</span>
                            </div>
                            <div style="margin:12px 0">
                                <span style="color:#A3A3A3">单据类型：</span><span>{{form.sourceBillTypeName}}</span>
                            </div>
                        </div>
                        <div style="margin-left:20px;margin-top:35px">
                            <div>
                                <span style="color:#A3A3A3">问题描述：</span><span :title="form.problemDescription">{{form.problemDescription}}</span>
                            </div>
                            <div style="margin:12px 0">
                                <span style="color:#A3A3A3">优先级：</span><span>{{priorityList.find(i=>i.dictValue==form.priority)?priorityList.find(i=>i.dictValue==form.priority).dictLabel:''}}</span>
                            </div>
                        </div>
                        <div style="margin-left:20px;margin-top:35px">
                            <div style="height:32px">
                                <span style="color:#A3A3A3">联系人：</span><el-tag color="#EBF0FB">{{form.contactsName}}</el-tag>
                            </div>
                            <div style="margin:12px 0">
                                <span style="color:#A3A3A3">联系电话：</span><span>{{form.contactsPhone}}</span>
                            </div>
                            <div style="margin:12px 0">
                                <span style="color:#A3A3A3">所在区域：</span><span>{{form.areaCodeListName}}</span>
                            </div>
                            <div style="margin:12px 0">
                                <span style="color:#A3A3A3">详细地址：</span><span :title="form.detailAddress">{{form.detailAddress}}</span>
                            </div>
                        </div>
                        <div style="margin-left:20px;margin-top:35px">
                            <div>
                                <span style="color:#A3A3A3">受理时间：</span><span>{{form.acceptTime}}</span>
                            </div>
                        </div>
                        <div>
                            <span>附件：</span>
                            <!-- <img v-for="(i,j) in form.afterSalesBillFileList" :key="j" :src="i.url" alt="image" @click="selimg=i;showimg=true"/> -->
                            <el-image style="width:65px;height:65px;margin-right:3px" v-for="(i,j) in form.afterSalesBillFileList" :key="j" :src="i.url" :preview-src-list="[i.url]"></el-image>
                        </div>
                    </div>
                    <div>
                        <div>
                            <el-button v-for="(i,j) in ['处理过程','回单信息','客户评价']" :key="j" :class="activeBtn==j?'active-btn':''" @click="activeBtn=j">{{i}}</el-button>
                        </div>
                        <div>
                            <el-steps v-if="activeBtn==0&&!loading" class="service-process" direction="vertical" :active="serviceProcess.length">
                                <el-step v-for="(i,j) in serviceProcess" :key="j">
                                    <template #title>
                                        <span style="color:#595959">{{i.createTime}}</span>
                                    </template>
                                    <template #description>
                                        <div class="process-desc">
                                            <div style="display:flex;align-items: center;height:62px">
                                                <div class="process-desc-content">{{i.description}}</div>
                                                <div style="width:100px;">
                                                    <el-button class="process-btn" type="primary" round size="small">{{getStateName(i.state)}}</el-button>
                                                </div>
                                            </div>
                                            <div style="margin-left:5px;color:#A3A3A3">{{i.updateTime}}</div>
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                            <el-form style="margin-top:10px" v-if="!!activeBtn" ref="form" :model="form" label-width="160px">
                                <el-form-item :prop="i.key" v-for="(i,j) in reinfo[activeBtn-1]" :key="j">
                                    <template slot="label"><span style="font-weight:bold">{{i.name}}:</span></template>
                                    <div class="show-receipt" v-if="form[i.parent]" :title="i.key!='processingMethod'&&i.key!='lossLevel'?form[i.parent][i.key]:''">
                                        <span v-if="i.key=='processingMethod'&&form[i.parent][i.key]">
                                            {{processingMethodList.find(a=>a.dictValue==form[i.parent][i.key]).dictLabel}}
                                        </span>
                                        <span v-else-if="i.key=='lossLevel'&&form[i.parent][i.key]">
                                            {{lossLevelList.find(a=>a.dictValue==form[i.parent][i.key]).dictLabel}}
                                        </span>
                                        <span v-else-if="i.key=='beforeFileList'">
                                            <el-image style="width:45px;height:45px;margin-right:3px" v-for="(i,j) in form[i.parent][i.key]" :key="j" :src="i.url" :preview-src-list="[i.url]"></el-image>
                                            <!-- <img style="width:45px;height:45px;cursor:pointer;margin-right:3px" v-for="(i,j) in form[i.parent][i.key]" :key="j" :src="i.url" alt="image" @click="selimg=i;showimg=true"/> -->
                                        </span>
                                        <span v-else-if="i.key=='afterFileList'">
                                            <el-image style="width:45px;height:45px;margin-right:3px" v-for="(i,j) in form[i.parent][i.key]" :key="j" :src="i.url" :preview-src-list="[i.url]"></el-image>
                                            <!-- <img style="width:45px;height:45px;cursor:pointer;margin-right:3px" v-for="(i,j) in form[i.parent][i.key]" :key="j" :src="i.url" alt="image" @click="selimg=i;showimg=true"/> -->
                                        </span>
                                        <span v-else>{{form[i.parent][i.key]}}</span>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
        </el-tab-pane>
        <!-- <el-tab-pane name="shfw">
            <span slot="label">售后服务</span>
            <div class="tab-content-container">
                售后服务
            </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <el-dialog top="1vh" title="维护售后服务受理单据" :visible.sync="sform" width="1000px" :append-to-body="true" :modal-append-to-body="false">
      <ServiceForm v-if="sform" :create="create" :data="form" @close="v=>{v?getDetail():'';sform=false}"/>
    </el-dialog>
    <el-dialog title="单据受理" :visible.sync="bform" width="500px" :append-to-body="true" :modal-append-to-body="false">
      <HandleBillForm v-if="bform" :id="form.id" @close="bform=false;getDetail()"/>
    </el-dialog>
    <el-dialog title="业务支持" :visible.sync="pform" width="500px" :append-to-body="true" :modal-append-to-body="false">
      <SupportBillForm v-if="pform" :form="form" @close="pform=false;getDetail()"/>
    </el-dialog>
    <el-dialog title="业务评估" :visible.sync="eform" width="500px" :append-to-body="true" :modal-append-to-body="false">
      <EvaluateBillForm v-if="eform" :form="form" @close="eform=false;getDetail()"/>
    </el-dialog>
    <el-dialog top="1vh" title="填写回单" :visible.sync="rform" width="1000px" :append-to-body="true" :modal-append-to-body="false">
      <ReceiptForm v-if="rform" :form="form" @close="rform=false;getDetail()"/>
    </el-dialog>
    <el-dialog title="客户回访" :visible.sync="fsform" width="500px" :append-to-body="true" :modal-append-to-body="false">
      <FollowUpForm v-if="fsform" :form="form" @close="fsform=false;getDetail()"/>
    </el-dialog>
    <el-dialog :visible.sync="bsform" width="500px" :append-to-body="true" :modal-append-to-body="false">
        <template slot="title">
            <i class="el-icon-info" style="color:#1890FF;font-size:20px"></i>
            <span style="font-weight:bold;margin-left:5px;vertical-align:top">开始服务</span>
        </template>
        <span>您现在要开始处理此条服务单据吗?</span>
        <span slot="footer">
            <el-button @click="bsform=false">取 消</el-button>
            <el-button type="primary" @click="confirm()">确 认</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="csform" width="500px" :append-to-body="true" :modal-append-to-body="false">
        <template slot="title">
            <i class="el-icon-info" style="color:#1890FF;font-size:20px"></i>
            <span style="font-weight:bold;margin-left:5px;vertical-align:top">关闭单据</span>
        </template>
        <span>您现在要关闭此条服务单据吗?</span>
        <span slot="footer">
            <el-button @click="csform=false">取 消</el-button>
            <el-button type="primary" @click="close()">确 认</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="showimg" :append-to-body="true" :modal-append-to-body="false">
        <template slot="title">
            <i class="el-icon-picture-outline" style="color:#1890FF;font-size:20px"></i>
            <span style="font-weight:bold;margin-left:5px;vertical-align:top">查看图片 ({{selimg.originalFileName}})</span>
        </template>
        <img :src="selimg.url" alt="image">
        <span slot="footer">
            <el-button @click="showimg=false">关 闭</el-button>
        </span>
    </el-dialog>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>