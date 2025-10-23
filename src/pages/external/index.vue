<template>
  <div class="external-home">
    <!-- title -->
    <div class="navigation-bar">
      <img
        class="login_logo_logo"
        :src="require(`../../static/images/title.png`)"
        alt="img"
        style="width: 100%; height: 100%"
      />
      <div class="bar-content">
        <div class="bar-title">
          <div class="title-left">
            <div class="logo">
              <img
                class="login_logo_logo"
                :src="require(`/static/images/proc/logo.png`)"
                alt="img"
              />
            </div>
            <div class="bar">
              <div
                class="bar-item"
                v-for="(item, index) in menuList"
                :key="index"
                @click="scrollTo(item.class)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="title-right">
            <div class="login" @click="$router.push(`/login`)">登录</div>
            <el-divider direction="vertical"></el-divider>
            <div class="register" @click="$router.push(`/login/register`)">
              注册
            </div>
            <svg-icon
              icon-class="set"
              size="24"
              style="margin: 0 12px"
            ></svg-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- 交易情况 -->
    <div class="deal-state">
      <div class="deal-content">
        <div class="deal-title">交易情况</div>
        <div class="deal-buttom">
          <div class="deal-item" v-for="(item, index) in dealList" :key="index">
            <div class="containl">
              <div class="icons">
                <svg-icon :icon-class="item.icons" size="64"></svg-icon>
              </div>
              <div class="content">
                <div class="top">
                  {{ item.name }}
                </div>
                <div class="bottom">
                  <div class="number">{{ item.number }}</div>
                  <span
                    class="percentage"
                    :style="`color:${judgeNum(item.percentage)};`"
                    >{{ item.percentage }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 焦点关注/中标公告 -->
    <div class="news-notice">
      <div class="news-content">
        <div class="news">
          <div class="title">焦点关注</div>
          <div class="body">
            <div class="news-swiper">
              <el-carousel height="100%" trigger="click" :autoplay="false">
                <el-carousel-item
                  v-for="(item, index) in newsList"
                  :key="index"
                >
                  <img :src="item.imgUrl" style="height: 100%; width: 100%" />
                  <h3 class="title">
                    {{ item.title ?? "" }}
                  </h3>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
        <div class="notice">
          <div class="title">中标公告</div>
          <div class="body">
            <div
              class="not-item"
              v-for="(item, index) in noticeList"
              :key="index"
              @dblclick="noticeDbClick(item)"
            >
              <span class="not-content">{{ item.title }}</span>
              <div>{{ item.releaseTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 竞价采购/招标采购/询价采购 -->
    <div class="purchase">
      <div class="seek purchase-item">
        <div class="header">
          <div class="title">询价采购</div>
          <div class="toop">
            <svg-icon
              icon-class="speaker"
              fill="#F60"
              size="14"
              title="消息"
            ></svg-icon>
            <div class="company">{{ tableDate.seekTitle ?? "" }}</div>
            <div class="join" @click="jumpTo('/seekContrast/enquiryHall')">
              参与报价
            </div>
          </div>
        </div>
        <div class="table">
          <vxe-grid
            :stripe="false"
            height="auto"
            :columns="seekColumns"
            :data="tableDate.seekList"
            headerCellClassName="external-th"
            rowClassName="external-tr"
            border="outer"
          >
            <template #cz="{ row, rowIndex }">
              <page-button
                type="text"
                class="join"
                @click="jumpTo('/seekContrast/enquiryHall')"
              >
                我要供货
              </page-button>
            </template>
        </vxe-grid>
        </div>
      </div>
      <div class="bid purchase-item">
        <div class="header">
          <div class="title">竞价采购</div>
          <div class="toop">
            <svg-icon
              icon-class="speaker"
              fill="#F60"
              size="14"
              title="消息"
            ></svg-icon>
            <div class="company">{{ tableDate.bidTitle ?? "" }}</div>
            <div
              type="text"
              class="join"
              @click="jumpTo('/bidding/biddingHall')"
            >
              参与报价
            </div>
          </div>
        </div>
        <div class="table">
          <vxe-grid
            :stripe="false"
            :columns="bidColumns"
            :custom-config="{ storage: true }"
            id="tb_zxsh_list"
            :data="tableDate.bidList"
            height="auto"
            headerCellClassName="external-th"
            rowClassName="external-tr"
            border="outer"
          >
            <template #cz="{ row, rowIndex }">
              <page-button
                type="text"
                class="join"
                @click="jumpTo('/bidding/biddingHall')"
              >
                我要供货
              </page-button>
            </template>
        </vxe-grid>
        </div>
      </div>
      <div class="beckon purchase-item">
        <div class="header">
          <div class="title">招标采购</div>
          <div class="toop">
            <svg-icon
              icon-class="speaker"
              fill="#F60"
              size="14"
              title="消息"
            ></svg-icon>
            <div class="company">{{ tableDate.beckonTitle ?? "" }}</div>
            <div class="join">参与投标</div>
          </div>
        </div>
        <div class="table">
          <vxe-grid
            :stripe="false"
            :columns="beckonColumns"
            :data="tableDate.beckonList"
            height="auto"
            headerCellClassName="external-th"
            rowClassName="external-tr"
            border="outer"
          >
            <template #cz="{ row, rowIndex }">
              <page-button type="text" class="join" @click="jumpTo('/login')">
                查看详情
              </page-button>
            </template>
        </vxe-grid>
        </div>
      </div>
    </div>
    <div class="footer">版权所有@lanxin</div>
    <div class="back">
      <el-dropdown placement="top">
        <span class="el-dropdown-link">
          <svg-icon icon-class="anchor" style="font-size:40px;" fill="#68B3FF"  /> 
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div @click="scrollTo('navigation-bar')">首页</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="scrollTo('deal-state')">交易情况</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="scrollTo('news-notice')">焦点关注</div>
          </el-dropdown-item>
          <el-dropdown-item
            ><div @click="scrollTo('seek')">
              询价采购
            </div></el-dropdown-item
          >
          <el-dropdown-item
            ><div @click="scrollTo('bid')">竞价采购</div></el-dropdown-item
          >
          <el-dropdown-item
            ><div @click="scrollTo('beckon')">招标采购</div></el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <vxe-modal
      show-zoom
      resize
      v-model="noticeVisible"
      width="50%"
      height="80%"
      title="公告详情"
      :maskClosable="false"
      destroy-on-close
    >
      <div style="height: 100%; width: 100%" v-html="noticeContent"></div>
    </vxe-modal>
  </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
