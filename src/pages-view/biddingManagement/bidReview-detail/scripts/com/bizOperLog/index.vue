<template>
    <div class="timeline-box" style="padding:  50px;">
        <el-timeline>
            <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.createTime"
                >
                <div class="timeline-item-content">
                <div class="timeline-item-content-title">{{activity.operModule}}</div>
                <div class="timeline-item-content-remark">{{activity.operInfo}}</div>
                </div>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
