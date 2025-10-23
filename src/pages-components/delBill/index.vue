<template>
    <vxe-modal
        v-model="visible"
        :width="width"
        show-footer
        destroy-on-close
        @close="cancel"
    > 
        <template #title>
            <img :src="require(`/static/images/icon-warn-fill@2x.png`)" alt="img">
            <span class="del-title">{{title}}</span>
        </template>
        <div style="font-size: 14px;color:#333333;font-weight: 400;">确定要删除 <span style="color: #FF4D4F;" v-if="billNo">单据{{billNo}}</span>，删除数据无法还原</div>
        <template #footer>
            <page-button theme="default" @click="cancel">取消</page-button>
            <page-button @click="confirm">确认</page-button>
        </template>
    </vxe-modal>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        width: {
            type: [Number, String],
            default: 500
        },
        title: {
            type: [String],
            default: '删除提醒'
        },
        billNo: {
            type: [String],
            default: ''
        }
    },
    data(){
        return {


        }
    },
    methods: {
        confirm(){
            this.$emit('ok');
        },
        cancel(){
            this.$emit('cancel');
        }
    },
}
</script>

<style lang="less" scoped>
.del-title {
    vertical-align: 6px;
    font-size: 16px;
    font-weight: bold;
    margin-left: 5px;
    line-height: 24px; 
    color: #333333;
}
/deep/ .vxe-modal--content{ 
    margin: 0 15px;
}
</style>