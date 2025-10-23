<template>
    <div class="negotiations">
        <div class="supplier content">
            <div class="supplier-item-title ">
                <div class="supplier-item-title-left">选择供应商</div>
                <div class="supplier-item-title-right">
                    <el-input placeholder="搜索供应商" v-model="searchSupplier" class="input-with-select">
                        <el-button slot="append" type="primary" size="small" icon="el-icon-search" @click="handleSearchSupplier"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="supplier-box">
                <div class="supplier-item" :class="{'Ac': item.checked}" v-for="item in supplierList" :key="item.id" @click="handleSupplierClick(item)" >
                    <div class="icon">
                        <img src="@/assets/fileIcon/default.png" alt="">
                    </div>
                    <div class="info">
                        <div class="name">
                            <span>{{item.supplierName}}</span>
                        </div>
                        <div class="score">
                            <span>评分: {{item.score}}</span>
                        </div>
                        <div class="price">
                            <span>投标价格: ¥{{item.amount || 0}}元</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="negotiation-record">
                <div class="negotiation-record-list content right">
                    <div class="title">
                        <span>历史谈判记录</span>
                        <el-button type="primary" size="small" plain @click="init" >新增谈判记录</el-button>
                    </div>
                    <div class="record-box">
                        <div class="negotiation-record-item" :class="{'success': item.status === 1 , 'save': item.status === 0 , 'checked': item.checked }" v-for="(item,index) in negotiateList" :key="index" @click="handleNegotiateRecordClick(item)">
                            <div class="negotiation-record-item-content">
                                <div class="p1">
                                    <div class="time">
                                        <i class="el-icon-success negotiateSuccess" v-if="item.status === 1"></i>
                                        <i class="el-icon-circle-plus-outline negotiateEdit" v-if="item.status === 0 && !item.checked"></i>
                                        <i class="el-icon-edit negotiateEdit" v-if="item.status === 0 && item.checked"></i>
                                        {{item.negotiateDate}} {{item.negotiateTime}}</div>
                                    <div class="name">参与人员：{{item.participants}}</div>
                                </div>
                                <div class="p2">
                                    <span>{{item.content}}</span>
                                </div>
                                <div class="p3">
                                    <div class="price-adjust">价格调整：¥{{item.originalAmount}}元 -> ¥{{item.amount}}元</div>
                                    <div class="price-adjust" v-if="item.originalPaymentTerm && item.paymentTerm">付款方式调整：{{item.originalPaymentTerm}}  -> {{item.paymentTerm}}</div>
                                </div>
                                <div class="p4">
                                    <div class="file">
                                        <div class="icon"> <i class="el-icon-paperclip"></i></div>
                                        <div class="file-name">{{item.fileList?.length || 0}}个附件</div>
                                    </div>
                                    <div class="view-more">查看详情</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-negotiation-record content left">
                    <div class="title">谈判记录</div>
                    <el-form ref="form" :model="createForm" label-width="100px" label-position="top" size="small" :disabled="createForm.status === 1">
                        <div class="flexBox">
                            <div class="flexItem">
                               <el-form-item label="谈判日期">
                                    <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="createForm.negotiateDate" style="width: 100%;"></el-date-picker>
                                </el-form-item>                             
                            </div>
                            <div class="flexItem">
                                <el-form-item label="谈判时间">
                                    <el-time-select :picker-options="{ start: '08:30', step: '00:15',  end: '18:30' }" placeholder="请输入谈判时间" v-model="createForm.negotiateTime" style="width: 100%;"></el-time-select>
                                </el-form-item>                                
                            </div>
                        </div>
                        <div class="flexBox">
                            <div class="flexItem">
                                <el-form-item label="谈判地点">
                                    <el-input v-model="createForm.place" placeholder="请输入谈判地点" style="width: 100%;"></el-input>
                                </el-form-item>                                
                            </div>
                            <div class="flexItem">
                                <el-form-item label="参与人员">
                                    <el-input  v-model="createForm.participants" placeholder="请输入参与人员" style="width: 100%;"></el-input>
                                </el-form-item>                                  
                            </div>
                        </div>
                        <el-form-item label="谈判内容">
                            <el-input type="textarea" :rows="2" v-model="createForm.content" placeholder="请输入参与内容" style="width: 100%;"></el-input>
                        </el-form-item>
                        <el-form-item label="价格调整">
                            <el-col :span="7">原投标价格: ¥{{createForm.oldAmount || 0}}元</el-col>
                            <el-col :span="7">
                                <el-input v-model="createForm.amount" placeholder="请输入调整后价格" style="width: 100%;"></el-input>
                            </el-col>
                            <el-col :span="2">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover
                                    placement="bottom"
                                    title="差价"
                                    width="200"
                                    trigger="click"
                                    :content="`价格调整: ${ (createForm.amount - createForm.oldAmount )|| 0}元 `">
                                    <el-button slot="reference">计算差价</el-button>
                                </el-popover>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="付款方式">
                            <el-col :span="7">原付款条件 : {{createForm.originalPaymentTerm}}</el-col>
                            <el-col :span="7">
                                <el-input v-model="createForm.paymentTerm" placeholder="请输入调整后付款条件" style="width: 100%;"></el-input>
                            </el-col>
                            <!-- <el-col :span="2">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover
                                    placement="bottom"
                                    title="调整记录:"
                                    width="200"
                                    trigger="click"
                                    :content="`上次结果: ${createForm.lastPaymentTerm || ''} `">
                                    <el-button slot="reference">查看</el-button>
                                </el-popover>
                            </el-col> -->
                        </el-form-item>
                        <el-form-item label="附件上传">
                            <template slot="label">附件上传<span style="font-size: 12px;">（支持jpg、png、pdf、docx格式，且不超过5MB）</span></template>
                            <el-upload
                                class="upload-demo"
                                action="/api/file/notAuthFile/upload"
                                multiple
                                :file-list="createForm.fileList"
                                :limit="5"
                                :on-change="handleChange"
                                :on-remove="handleChange"
                            >
                                <el-button size="small" type="primary" plain>点击上传附件</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="24" style="text-align: right;">
                                <el-button type="primary" @click="postNegotiateSave" >保存记录</el-button>
                                <el-button type="primary" @click="postNegotiateSubmit" >提交确认</el-button>
                                <el-button type="primary" plain @click="handleCancel" :disabled="false">取消</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
