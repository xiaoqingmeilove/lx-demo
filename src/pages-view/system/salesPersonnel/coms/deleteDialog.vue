<template>
    <vxe-modal 
        v-model="delObj.flag" 
        :width="width" 
        @close="$emit('close',false)" 
    >
        <template #title>
            <img :src="require(`/static/images/icon-warn-fill@2x.png`)" alt="img">
            <span class="del-title">删除{{delObj.module}} </span>
        </template>
        <span style="margin-right:3px">确定要删除{{delObj.module}} </span>
        <span style="color:red;font-size:16px"> {{delObj.target}} </span> 
        <span>？</span>
        <div style="margin:25px 0 10px; text-align:left">
            <page-button @click="$emit('close',true)" background="rgba(255,0,0,.6)">确认删除</page-button>
            <page-button @click="$emit('close',false)" type="text" color="rgba(0,0,0,.6)" style="margin-left: 20px">取消</page-button>
        </div> 
    </vxe-modal>
</template>
<script>
export default {
    props: {
        delObj: {
            type: Object,
            default() {
                return {
                    module: '',
                    target: '',
                    flag: false
                }
            },
            required: true
        },
        width: {
            type: Number,
            default: 800
        }
    }
}
</script>
<style lang="less" scoped>
.del-title {
    vertical-align: 6px;
    font-size: 16px;
    font-weight: bold;
    margin-left: 5px;
}
/deep/ .delete-dialog-cont {
    .el-dialog__body {
        padding: 6px 20px 20px 20px;
    }
}
</style>