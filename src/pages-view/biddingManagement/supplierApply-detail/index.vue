<template>
  <app-page>
    <div class="view-section">
      <div class="countdownBox">
        <div class="icon">
          <i class="el-icon-time"></i>
        </div>
        <div class="time">
          <div class="time-content">
            <p>报名截止时间：{{ form.deadlineTime }}</p>
            <p>距报名截止时间仅剩：</p>
            <p class="time-value" :class="{'time-value-red': timeDifference == '已过期'}">{{ timeDifference }}</p>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="title">邀请函</div>
        <div class="secondary">
          <div class="item">
            <i class="el-icon-time"></i>
            <span>发布时间：{{form.releaseTime}}</span>
          </div>
          <div class="item">
            <i class="el-icon-postcard"></i>
            <span>招标单位：{{form.clientName}}</span>
          </div>
          <div class="item">
            <i class="el-icon-discount"></i>
            <span>招标类型：{{form.purchaseMethodName}}</span>
          </div>
        </div>
      </div>
      <div class="contentBox">
        <div class="content">
          <div class="info-name">致：{{form.supplierName}}</div>
          <div class="item-name">
            我司拟对【{{ form.projectName }}】进行招标，诚邀请各单位进行投标，招标信息如下：
          </div>
          <div class="itemBox">
            <div class="item">
              <div class="label">邀请项目：</div>
              <div class="value">【{{ form.projectName }}】邀请函</div>
            </div>
            <div class="item" v-if=" form.purchaseMethodName">
              <div class="label" >采购类型：</div>
              <div class="value">【{{ form.purchaseMethodName }}】</div>
            </div>
            <div class="item"  v-if=" form.purchaseRemark">
              <div class="label">招标内容说明：</div>
              <div class="value">【{{ form.purchaseRemark }}】</div>
            </div>
            <div class="item" v-if=" form.purchaseUserName">
              <div class="label" >联系人：</div>
              <div class="value">【{{ form.purchaseUserName }}】</div>
            </div>
            <div class="item" v-if=" form.purchaseUserTel">
              <div class="label">联系电话：</div>
              <div class="value">【{{ form.purchaseUserTel }}】</div>
            </div>
            <div class="item" v-if=" form.purchaseUserEmail">
              <div class="label">联系邮箱：</div>
              <div class="value">【{{ form.purchaseUserEmail }}】</div>
            </div>
            <div class="item" v-if=" form.purchaseUserAddress">
              <div class="label">地址：</div>
              <div class="value">【{{ form.purchaseUserAddress }}】</div>
            </div>
          </div>
          <div class="fileBox">
            <div class="file-title">
              <i class="el-icon-paperclip"></i>
              <span>附件</span>
            </div>
            <div class="file-item" v-for="(item, index) in form.technicalFileList" :key="index">
              <a :href="item.url" target="_blank" class="file-download">
                <i class="el-icon-document"></i>
                <div class="file-name">{{ item.originalFileName }}</div>
                <div class="file-size">{{ item.fileImageSize  }} </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-item">
          <el-button type="primary" icon="el-icon-check" @click="signUp" :disabled=" !showBtn('signUp')" >报名</el-button>
          <el-button type="danger" icon="el-icon-close" @click="rejectSignUp"  :disabled=" !showBtn('rejectSignUp')">不报名</el-button>
          <el-button type="info" plain icon="el-icon-delete" @click="$tabs.close()" >关闭</el-button>
        </div>
      </div>
    </div>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
