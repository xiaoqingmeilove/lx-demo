<template>
    <div class="role-add-member">
        <tree-transfer :key="tnum" :title="title" :from_data="fromData" :to_data="toData" :defaultProps="{label:'label'}" :defaultTransfer="true"
            @add-btn="addItem" @remove-btn="removeItem" :mode="mode" height="540px" filter openAll :defaultCheckedKeys="checkedKeys"
        />
        <i v-if="loaded" class="el-icon-loading tree-loading"/>
        <div style="margin:15px 0; text-align: right">
            <page-button theme="default" @click="$emit('close')">取消</page-button>
            <page-button v-if="associated" @click="saveOk">{{okText}}</page-button>
            <page-button v-else @click="save">{{okText}}</page-button>
        </div>
    </div>
</template>
<script>
import treeTransfer from 'el-tree-transfer'
import XEUtils from 'xe-utils'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
function filterTree (tree) {
  return tree.reduce((acc, item) => {
    if ((item.id ?? '') !== '') {
      acc.push({ ...item });
    }
    if (item.children) {
      acc.push(...filterTree(item.children));
    }
    return acc;
  }, []);
}
export default {
    name:'addMemberForm',
    props: {
        roleObj: {
            type: Object,
            default: ()=>{}
        },
        selectRole: {
            type: Array,
            default: ()=>[]
        },
        associated: {
            type: Boolean,
            default: ()=>false
        },
        okText: {
            type: String,
            default: ()=>'保存'
        }
    },
    components: { treeTransfer },
    data() {
        return {
            sum: 0,
            mode: 'transfer', //addressList
            title: ['集团用户', '已选用户'],
            title1: '已选用户',
            fromData: [],
            backfromData: [],
            toData: [],
            backtoData: [],
            userIds: [],
            checkedKeys:[],
            tnum:0,
            loaded:true
        }
    },
    watch:{
        toData: {
            handler(newV,oldV) {
                this.sum = 0
                newV.forEach(i => { this.getSelectSum(i) })
                this.title[1] = this.title1 + '('+this.sum+')'
                if (document.querySelectorAll('.transfer-title span')[5]) {
                    document.querySelectorAll('.transfer-title span')[5].innerHTML=this.title[1]
                }
            },
            immediate:true,
            deep:true
        }
    },
    methods:{
        handleTree(arr, list){
            if (arr) {
                arr.forEach((i, ind)=>{
                    if(list.includes(i.id)){
                        delete arr[ind]
                    }
                    this.handleTree(i.children, list)
                })
            }
            return arr || []
        },
        addItem(fromData,toData,obj){
            const toList = filterTree(toData).filter(x=>x.hierarchicalType === 5)
            if(this.associated&&!this.backtoData.length && toList.length!=1){
                const backtoData= this.handleTree(toData, obj.keys);
                const list = filterTree(backtoData).filter(x=>x.hierarchicalType === 5);
                this.backtoData = !list.length ? [] : backtoData;
            }
            const list = filterTree(this.backtoData).filter(x=>x.hierarchicalType === 5);
            if(this.associated && (obj.nodes.length!=1 || list.length!=0)){
                this.$message.warning('只能关联一个用户');
                this.toData=XEUtils.clone(this.backtoData, true)
                this.fromData=XEUtils.clone(this.backfromData, true)
                return
            }else{
                this.fromData = fromData
                this.toData = toData
                this.userIds = []
                this.backfromData=XEUtils.clone(this.fromData, true)
            }
            this.backtoData=XEUtils.clone(this.toData, true)
        },
        removeItem(fromData,toData,obj) {
            this.fromData = fromData
            this.toData = toData
            this.userIds = []
            this.backtoData=XEUtils.clone(this.toData, true)
            this.backfromData=XEUtils.clone(this.fromData, true)
        },
        getSelectSum(obj) {
            obj.children.length ? obj.children.forEach( i=> { this.getSelectSum(i) }) : this.sum += 1
        },
        getDataUser(arr){
            arr.forEach(i=>{
                i?.id&&i.hierarchicalType==5?this.userIds.push(i.id):''
                i?.children?this.getDataUser(i.children):'' 
            })
        },
        saveOk(){
            if(!this.toData.length){
                this.$message.warning('请选择用户')
                return
            }
            const list = filterTree(this.toData).filter(x=>x.hierarchicalType==5);
            this.$emit('Ok', list[0])
        },
        save() {
            if(!this.toData.length){
                this.$message.warning('请选择用户')
                return
            }
            const list = filterTree(this.toData).filter(x=>x.hierarchicalType==5);
            this.$emit('Ok', list)
        },
        treeFormat(arr,pid){
            if (arr) {
                arr.forEach(i=>{
                    i.pid = pid || i.parentId
                    i.label = i.name
                    i.id = String(i.id)
                    i.children = i.children
                    i.disabled = i.hierarchicalType!=5
                    this.treeFormat(i.children,i.id)
                })
            }
            return arr || []
        },
        getToData() {
            const list = filterTree(this.fromData).filter(f=>(this.selectRole||[]).some(x => x.userId == f.id));
            if(!list.length){
                this.loaded=false;
                if((this.selectRole||[]).map(x=>x.userId).length&&!this.toData.length) {
                    this.$message.warning('业务员绑定用户不在用户列表中，请重新选择');
                }
                return;
            }
            this.tnum+=1
            if (!!this.selectRole.length&&!this.toData.length) {
                setTimeout(()=>{ this.getToData() },80)
            } else {
                this.loaded=false
            }
            this.backtoData=XEUtils.clone(this.toData, true);
            this.backfromData = XEUtils.clone(this.fromData, true);
        }
    },
    mounted() {},
    created() {
        // this.checkedKeys = JSON.parse(JSON.stringify(this.selectRole)).map(i=>i.userId);
        this.checkedKeys = [];
        (this.selectRole||[]).map(i=>{
            if(i.userId){
                this.checkedKeys.push(i.userId)
            }
        })
        this.title[1] = this.title1+'('+this.sum+')'
        apiSystem.getSysTree(5).then(res=>{
            this.fromData = this.treeFormat(res.data)
            this.backfromData = XEUtils.clone(this.fromData, true)
            this.getToData()
        })
    }
}
</script>
<style lang="less" scoped>
 /deep/ .wl-transfer .transfer-title {
    width:100%
 }
 .role-add-member {
    position:relative;
    /deep/ .transfer-main {
        position: relative;
        .filter-tree {
            position: sticky;
            top: -15px;
            padding: 5px;
            z-index: 99;
        }
    }
    .tree-loading {
        position:absolute;
        right:160px;
        top:280px;
        font-size:20px;
        color:#1890ff;
    }
 }
/deep/ .component-transfer{
    .transfer-left, .transfer-right{
        width: 45%;
    }
    .transfer-center{
        width: 10%;
        left: 45%;
    }
}
/deep/ .transfer-title .el-checkbox{
    display: none;
}
</style>