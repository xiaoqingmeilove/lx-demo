<template>
    <div>
        <sub-title title="供应商列表">
            <template #beforeIcon>
                <i :class=" formDataShow.gyslb ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.gyslb = !formDataShow.gyslb"></i>
            </template>
        </sub-title>
        <div v-show="formDataShow.gyslb">
            <div class="gysBox">
                <div class="gyslb-item " v-for="item in form" :key="item.id" :class="{ status: item.status, Ac: item.checked == 1 }" @click="getGys(item)">
                    <div class="gyslb-item-title">{{item.supplierName}}&nbsp;&nbsp;{{ '¥' + item.amount }}&nbsp;&nbsp;{{ item.status ? '√' : '' }}</div>
                </div>
            </div>
            <div class="content">
                <div class="content-left">
                    <div class="content-item-title"> 
                        <div>
                            <i class="el-icon-document"></i><span>投标文件</span> 
                        </div>
                        <div>
                            <el-button type="primary" plain size="mini" @click="downloadAllFile"><i class="el-icon-download"></i><span>下载全部</span></el-button>
                            <el-button type="primary" plain size="mini"><i class="el-icon-printer"></i><span>打印</span></el-button>
                        </div>
                    </div>
                    <div class="field-content">
                        <div class="field-content-item" v-for="item in fileObj.fileList" :key="item.id">
                            <div class="field">
                                <i class="el-icon-document"></i>
                                <div>
                                    <p class="file-name">{{ item.originalFileName }}</p>
                                    <p class="supplier-name">供应商：{{ fileObj.supplierName }}</p>
                                    <p class="upload-time">上传时间：{{ item.uploadTime }}</p>
                                </div>
                            </div>
                            <div class="button">
                                <el-button type="primary" size="mini">
                                    <i class="el-icon-view"></i> 
                                    <a :href="item.url" target="_blank"> &nbsp;查看</a>
                                </el-button>
                                <el-button type="primary" plain size="mini">
                                    <i class="el-icon-download"></i>
                                     <a @click="downloadFile(item)"> &nbsp;下载</a>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <div class="content-item-title"> 
                        <div>
                            <i class="el-icon-document"></i><span>评分表</span>
                        </div>
                        <div>
                            <p class="supplier-pf-name">供应商：{{fileObj.supplierName}}</p>
                        </div>
                    </div>
                    <div class="progress-box">
                        <div class="progress-item" v-for="item in progress" :key="item.title">
                            <div class="progress-title">    
                                <span>{{ item.title }}{{ `(0-${item.max}分)` }}</span>
                            </div>
                            <el-slider v-model="fileObj[item.field]" :min="0" :max="item.max" :disabled="fileObj.status == 1" @change="changeScore(item.field)"></el-slider>
                            <div class="progress-value">
                                <p><span>{{ fileObj[item.field] }}</span> 分</p>
                            </div>
                        </div>
                        <div class="total-score">
                            <div class="progress-title">
                                <span>总分</span>
                            </div>
                            <div class="progress-value total-score-value">
                                <span>{{ fileObj.totalScore }} 分</span>
                            </div>
                        </div>
                        <div class="remark">
                            <div class="progress-title">
                                <span>评语：</span>
                            </div>
                            <div class="progress-value total-score-value">
                                <el-input type="textarea" rows="3" v-model="fileObj.comment"  :disabled="fileObj.status == 1" placeholder="请输入备注"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="bottom-btn">
                        <el-button type="primary" plain @click="saveScore(1)" :disabled="fileObj.status == 1" ><i class="el-icon-edit" ></i><span>保存草稿</span></el-button>
                        <el-button type="primary" @click="saveScore(2)" :disabled="fileObj.status == 1" ><i class="el-icon-check"></i><span>提交评分</span></el-button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
