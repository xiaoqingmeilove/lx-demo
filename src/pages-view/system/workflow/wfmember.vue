<template>
    <div class="workflow-members">
        <div v-for="(i,j) in row" :key="j" :class="i.iscel?'hovered':''"
            @mouseover="i.iscel=true;$forceUpdate()" @mouseout="i.iscel=false;$forceUpdate()">
            <i v-show="i.iscel" class="el-icon-error delete-member" @click="select=i;delDlg=true"/>
            <el-avatar size="large" class="wf-avatar" icon="el-icon-user-solid"/>
            <div class="wf-deptname" :title="i.deptName">{{i.deptName}}</div>
            <div class="wf-userName" :title="i.label">{{i.label}}</div>
        </div>
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteMember():'' }" 
            :delObj="{ module:'分组成员', target:select.label, flag:delDlg }"/>
    </div>
</template>
<script>
import DeleteDialog from '../components/deleteDialog'
export default {
    components: { DeleteDialog },
    props:['row'],
    data(){
        return {
            delDlg:false,
            select:{}
        }
    },
    methods:{
        deleteMember(){}
    },
    created() {
        this.row.forEach(i=>{ i.iscel=false })
    }
}
</script>
<style lang="less">
.workflow-members {
    width:100%;
    max-height:200px;
    padding:10px 0;
    box-sizing: border-box;
    overflow:auto;
    > div {
        display:inline-block;
        position:relative;
        padding-top:5px;
        border-radius:4px;
        margin-right:12px;
        width:80px;
        text-align:center;
        .wf-avatar {
            border:2px solid #C6DDFF
        }
        .wf-deptname {
            width:100%;
            position:relative;
            bottom:12px;
            font-size:10px;
            color:white;
            background:#1890FF;
            padding:3px;
            border-radius: 4px;
            transform: scale(0.7);
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .wf-userName {
            width:100%;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position:relative;
            bottom:10px;
        }
        .delete-member {
            position:absolute;
            top:3px;
            right:12px;
            color:rgb(210,210,210);
            cursor:pointer;
        }
    }
}
</style>