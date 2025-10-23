<template>
    <div class="tab-cont">
        <span class="tab-label">{{ label }}</span>
        <slot name="tail"/>
    </div>
</template>
<script>
export default {
    props:{
        label:{
            type: String,
            defaultValue: '标签名称'
        }
    }
}
</script>
<style lang="less" scoped>
.tab-cont {
    width: 100%;
    padding: 12px 8px;
    box-sizing: border-box;
    .tab-label {
        font-size: 14px;
        color: #1890ff
    }
    .tab-label::before {
        content: '';
        display: inline-block;
        height: 15px;
        width: 1px;
        border-left: 3px solid #409EFF;
        vertical-align: -3px;
        margin-right: 5px;
    }
    .tab-right {
        float: right;
    }
}
</style>