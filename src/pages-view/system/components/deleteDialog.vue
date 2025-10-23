<template>
    <vxe-modal 
        v-model="delObj.flag" 
        :width="width" 
        @close="$emit('close',false)" 
    >
        <template #title>
            <img :src="require(`/static/images/icon-warn-fill@2x.png`)" alt="img">
            <span class="del-title">删除{{delObj.module}}</span>
        </template>
        <span style="margin-right:3px">确定要删除{{delObj.module}}</span>
        <span style="color:red;font-size:16px">{{delObj.target}}</span>
        <div style="margin-top:25px;text-align:right">
            <page-button theme="white" @click="$emit('close',false)">取消</page-button>
            <page-button @click="$emit('close',true)">确认</page-button>
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
            default: 500
        }
    }
}
</script>
<style lang="less" scoped>
.del-title {
    vertical-align:6px;
    font-size:16px;
    font-weight:bold;
    margin-left:5px;
}
/deep/ .delete-dialog-cont {
    .el-dialog__body {
        padding:6px 20px 20px 20px;
    }
}
</style>