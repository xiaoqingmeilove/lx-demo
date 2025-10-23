<template>
    <div>
        <el-form :key="num" ref="menuForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="类型" prop="menuType">
                <el-radio v-model="form.menuType" label="M">目录</el-radio>
                <el-radio v-model="form.menuType" label="C">菜单</el-radio>
                <el-radio v-model="form.menuType" label="F">按钮</el-radio>
            </el-form-item>
            <el-form-item label="所属应用" prop="applyId">
                <el-select v-model="form.applyId" placeholder="请选择所属应用" @change="changeApp">
                    <el-option v-for="(i,j) in appData" :key="j" :label="i.name" :value="i.id"/>
                </el-select>
            </el-form-item>
            <el-form-item :label="'上级菜单'" prop="parentId">
                <el-tree ref="menuTree" style="padding-top:6px" :data="menuTree" node-key="id" show-checkbox check-on-click-node
                    highlight-current :expand-on-click-node="false" @check-change="menuCheck" check-strictly :default-expanded-keys="expNode"/>
            </el-form-item>
            <el-form-item label="名称" prop="menuName">
                <el-input v-model="form.menuName" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item  v-if="form.menuType!=='F'" label="图标" prop="icon">
                <el-input v-model="form.icon" placeholder="请输入图标" />
            </el-form-item>
            <el-form-item v-if="form.menuType!=='F'" label="打开方式" prop="isFrame">
                <el-radio v-model="form.isFrame" label="1">内部</el-radio>
                <el-radio v-model="form.isFrame" label="0">外部</el-radio>
            </el-form-item>
            <el-form-item v-if="form.menuType!=='F'" label="路由" prop="path">
                <el-input v-model="form.path" placeholder="请输入路由" />
            </el-form-item>
            <el-form-item v-if="form.menuType!=='F'" label="菜单标识" prop="menuCode">
                <el-input v-model="form.menuCode" placeholder="菜单标识" />
            </el-form-item>
            <el-form-item label="权限标识" prop="perms">
                <el-input v-model="form.perms" placeholder="请输入权限标识" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input-number style="width:100%" v-model="form.orderNum" step-strictly controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="是否显示" prop="visible">
                <el-radio v-model="form.visible" label="0">显示</el-radio>
                <el-radio v-model="form.visible" label="1">隐藏</el-radio>
            </el-form-item>
            <el-form-item label="菜单类别" prop="platform">
                <el-input v-model="form.platform" placeholder="请输入菜单类别" />
            </el-form-item>
            <el-form-item label="内部路由" prop="internalPath">
                <el-input v-model="form.internalPath" placeholder="请输入内部路由" />
            </el-form-item>
            
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入备注说明" />
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
            <el-button type="primary" @click="$emit('close',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    props: ['menuObj', 'create', 'applyId', 'expNode'],
    data() {
        return {
            form: {
                applyId: null,
                checked: 0,
                children: [],
                component: '',
                createName: '',
                createTime: '',
                dataScope: '',
                icon: '',
                isFrame: '1',
                menuId: 0,
                menuName: '',
                menuType: 'M',
                orderNum: '',
                parentId: '',
                parentName: '',
                path: '',
                perms: '',
                remark: '',
                searchValue: '',
                updateName: '',
                updateTime: '',
                visible: '0',
                menuCode:''
            },
            rules:{
                menuName: [ { required:true, message:'请输入名称' } ],
                applyId: [ { required:true, message:'请选择所属应用' } ],
            },
            menuTree: [],
            appData: [],
            num: 0
        }
    },
    watch:{
        'form.menuType': {
            handler(newV,oldV) {
                // newV!=='M'?
                newV==='F'?
                    this.rules.parentId = [{ required:true, message:'请选择上级菜单' }]:
                    delete this.rules.parentId
                this.num+=1
            },
            immediate:true
        }
    },
    methods:{
        menuCheck(data, checked, indeterminate) {
            this.form.parentId = checked ? data.id : ''
            checked ? this.$refs.menuTree.setCheckedNodes([data]) : ''
        },
        save() {
            this.$refs.menuForm.validate(valid => {
                if (valid) {
                    this.form.parentId = this.form.parentId || 0
                    apiSystem[this.create?'addMenu':'editMenu'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close',true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
        },
        changeApp(id){
            apiSystem.getMenuNoPerm(id).then(res=>{ this.menuTree = res.data })
        }
    },
    mounted(){
        if (!this.create) {
            apiSystem.detailMenu(this.menuObj.menuId).then(res=>{
                res.data?this.form = JSON.parse(JSON.stringify(res.data)):''
                setTimeout(()=>{
                    this.$refs.menuTree.setChecked(res.data.parentId,true,false)
                },500)
            })
        } else {
            if (this.menuObj?.menuId) {
                setTimeout(()=>{
                    this.$refs.menuTree.setChecked(this.menuObj.menuId,true,false)
                },500)
            }
        }
    },
    created() {
        apiSystem.getApplyList().then(res=>{ this.appData = res.data })
        this.form.applyId = this.applyId
        apiSystem.getMenuNoPerm(this.applyId).then(res=>{ this.menuTree = res.data })
    }
}
</script>