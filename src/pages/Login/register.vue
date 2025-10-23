<template>
  <div class="login-pages">
    <div class="toLogins">
        <div class="register_title">供应商注册</div>
        <div>已有账号，<span @click="toLogin">立即登录</span></div>
    </div>
    <div class="big_box">
        <div class="step_box">
            <el-steps :space="350" :active="active" finish-status="success" align-center>
                <el-step title="账号注册"></el-step>
                <!-- <el-step title="完善企业资料"></el-step> -->
                <el-step title="注册成功"></el-step>
            </el-steps>
        </div>

        <div class="register_box" v-if="active == 0">
            <!-- <div class="gather-title" style="margin-top: 26px"><h4>{{time?'用户注册':'账号注册'}}</h4></div> -->
            <!-- <div class="success_tip" v-if="time">
                <i class="el-icon-circle-check"></i>
                <h3>恭喜您！账号注册成功</h3>
                <span>{{time}}秒后自动跳转至完善企业信息</span>
                <div class="success_tip_btn" @click.stop="toActive(1)">去完善企业信息</div>
            </div> -->
            <!-- <div class="from_box" v-else> -->
            <div class="from_box">
                <el-form ref="nickform" :model="form" :rules="nickrules" size="medium" label-width="80px" class="register_from">
                    <el-form-item prop="userName" label="用户名称">
                        <el-input v-model="form.userName" placeholder="设置用户名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="passWord" label="登录密码">
                        <el-input v-model="form.passWord" placeholder="请设置8-20位登录密码，须包含数字字母组合" type="password" maxlength="20" show-password></el-input>
                    </el-form-item>
                    <el-form-item prop="supplierPassWord" label="确认密码">
                        <el-input v-model="form.supplierPassWord" placeholder="再次输入登录密码" type="password" maxlength="20" show-password></el-input>
                    </el-form-item>
                    <el-form-item prop="mobile" label="手机号码">
                        <el-input v-model="form.mobile" placeholder="请输入11位手机号码" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item prop="phoneCode" label="短信验证码">
                        <el-input v-model="form.phoneCode" placeholder="请输入短信验证码" maxlength="6">
                            <template slot="append">
                                <div style="width: 100%;height: 100%;cursor: pointer;" :disabled="!phoneCodeRegister.enable || loading"  @click="onCodeBtnClick">{{btnText}}</div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="supplierName" label="企业名称">
                        <el-input v-model="form.supplierName" placeholder="请输入企业名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="businessLicense" label="统一社会信用代码">
                        <el-input v-model="form.businessLicense" placeholder="请输入统一社会信用代码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="checked">勾选同意<span style="color: var(--base-color)">《用户服务协议》</span></el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <page-button style="padding: 20px;width:100%" :disabled="!checked" @click="submitReg">注册</page-button>
                    </el-form-item>
                </el-form>
                <el-alert
                    v-if="errorTitle"
                    :title="errorTitle"
                    type="error"
                    show-icon
                    :closable="false"
                >
                </el-alert>
            </div>
        </div>

        <!-- <div class="register_box" v-else-if="active == 1">
            <div class="from_boxs">
                <el-form ref="forms" :model="baseForm" :rules="rules" label-width="100px" label-position="right" size="medium">
                    <el-form-item class="gather-title">
                        <h4>基本信息</h4>
                    </el-form-item>
                    <el-form-item label="企业名称" prop="businessLicense">
                        <div>{{baseForm.businessLicense}}</div>
                    </el-form-item>
                    <el-form-item label="企业简称">
                        <el-input v-model="baseForm.supplierNickName" placeholder="请输入企业简称"></el-input>
                    </el-form-item>
                    <el-form-item label="企业类型">
                        <el-select v-model="baseForm.enterpriseType" style="width: 100%" placeholder="请选择" @change="(value) => selectChange(value, sourceList.enterpriseType, 'enterpriseTypeName')">
                            <el-option :label="item.label" :value="item.value" v-for="item in sourceList.enterpriseType" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册资金">
                        <vue2-number-input
                            v-model="baseForm.supplierAmount"
                            placeholder="请输入注册资金"
                            focus-select
                            :controls="false"
                            style="width: 100%;padding:0 10px"
                        >
                            <template #suffix>万元</template>
                        </vue2-number-input>
                    </el-form-item>
                    <el-form-item label="成立时间">
                        <el-date-picker v-model="baseForm.bornDate" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="所在地区">
                        <pca-cascader-home
                            v-model="baseForm"
                            data-type="string"
                            @change="pcaChange"
                            clearable
                            :check-strictly="false"
                            style="width: 100%"
                        ></pca-cascader-home>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input v-model="baseForm.deliveryAddress" placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                    <el-form-item label="企业电话">
                        <el-input v-model="baseForm.supplierTel" placeholder="请输入企业电话"></el-input>
                    </el-form-item>
                    <el-form-item label="企业网址">
                        <el-input v-model="baseForm.supplierUrl" placeholder="请输入企业网址"></el-input>
                    </el-form-item>
                    <el-form-item label="企业简介">
                        <el-input type="textarea" v-model="baseForm.supplierBlurb" placeholder="请输入企业简介"></el-input>
                    </el-form-item>
                    <el-form-item label="主供物料">
                        <el-input type="textarea" v-model="baseForm.materialMsg" placeholder="请输入主供物料"></el-input>
                    </el-form-item>
                    <el-form-item class="gather-title">
                        <h4>公司证照</h4>
                    </el-form-item>
                    <el-form-item label="营业执照" prop="fileList">
                        <upload-button class="uploadBtn" :accept="['.jpg','.jpeg','.png','.gif']" content="选择附件" icon="el-icon-upload2" plain @success="onUploadSuccess"></upload-button>
                        <div class="upload_spec">支持 JPG、JPEG、PNG、gif 格式，图片小于5M</div>
                        <div class="imgBox" v-if="(baseForm?.fileList??[]).length">
                            <el-image style="width:100%;height:100%;"
                                :src="'/'+ baseForm.fileList[0]?.url"
                                :preview-src-list="['/'+ baseForm.fileList[0]?.url]">
                            </el-image>
                        </div>
                    </el-form-item>
                    <el-form-item class="gather-title">
                        <h4>企业联系人</h4>
                    </el-form-item>
                    <el-form-item label="联系人姓名" prop="linkerName">
                        <el-input v-model="baseForm.linkerName" placeholder="请输入联系人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="尊称">
                        <el-radio-group v-model="baseForm.linkerGender">
                            <el-radio :label="0">未知</el-radio>
                            <el-radio :label="1">先生</el-radio>
                            <el-radio :label="2">女士</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="部门职务">
                        <el-input v-model="baseForm.linkerDeptPosition" placeholder="请输入部门职务"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="linkerTel">
                        <el-input v-model="baseForm.linkerTel" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱">
                        <el-input v-model="baseForm.linkerEmail" placeholder="请输入电子邮箱"></el-input>
                    </el-form-item>
                </el-form>
                <div style="text-align: center">
                    <page-button style="padding: 20px;width:100%" @click="save">保 存</page-button>
                </div>
            </div>
        </div> -->
        
        <div class="register_boxs" v-else-if="active == 3">
            <h1>注册成功，请登录系统补充资料</h1>
            <h3 style="margin-top: 60px;color:var(--base-color);cursor: pointer;" @click="toLogin">立即登录</h3>
            <!-- <h2 style="margin-top: 60px">系统将于24小时内审核您的注册信息，请耐心等候</h2> -->
        </div>
    </div>

  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import ModifyPassword from "@/layout/components/ModifyPassword";

  import { ApiBasic } from '@/apis'
  import $store from "@/store";
  const apiBasic = new ApiBasic()
  let phoneCodeTimer = null;
  export default {
    name: 'register',
    components: {
      ModifyPassword
    },
    data() {
      const dict = $store.state.Common.dict;
      return {
        id: null,
        time: null,
        active: 0,
        loading: false,
        phoneCodeRegister: {
          enable: true,
          time: 0
        },
        errorTitle: '',
        checked:false,
        form: {},
        sourceList: {
            enterpriseType: (dict["ENTERPRISE_TYPE"] || []).map(d => {
                return { label: d.dictLabel, value: d.dictValue }
            }),
        },
        baseForm: {
            areaCodeList: '',
            areaCodeListName: '',
            countryCode: '',
            fileList: []
        },
        nickrules: {
            userName: [
                { required: true, message: '请设置用户名称', trigger: 'blur' },
            ],
            supplierName: [
				{ required: true, message: '请输入企业名称', trigger: 'blur' },
			],
            mobile: [
				{ required: true, message: '请输入手机号', trigger: 'blur' },
				{ validator: (rule, value, callback) => {
					if (/^1[3456789]\d{9}$/.test(value)) {
						callback()
					} else {
						callback(new Error('手机格式错误!'))
					}
				}, trigger: 'blur' }
			],
			phoneCode: [
				{ required: true, message: '请输入验证码', trigger: 'blur' },
			],
            businessLicense: [
                { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
            ],
            passWord: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { validator: (rule, value, callback) => {
                    if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/.test(value)) {
                        callback(new Error('密码8~16位必须包含大写字母，小写字母，数字和特殊字符三种以上'))
                    } else {
                        callback()
                    }
                }, trigger: 'blur' }
            ],
            supplierPassWord: [
                { required: true, message: '请输入确认密码', trigger: 'blur' },
                { validator: (rule, value, callback) => {
                if (value === this.form.passWord) {
                    callback()
                } else {
                    callback(new Error('两次密码输入不一致!'))
                }
                }, trigger: 'blur' }
            ],
        },
        rules: {
          supplierName: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
          ],
          linkerName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          ],
          linkerTel: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                if (/^1[3456789]\d{9}$/.test(value)) {
                    callback()
                } else {
                    callback(new Error('手机格式错误!'))
                }
                }, trigger: 'blur' }
          ],
          fileList: [
            { required: true, message: '请上传营业执照', trigger: 'blur' },
          ],
        }
      };
    },
    computed: {
      ...mapState({
        latestUser: (state) => state.latestUser || "",
        theme: state => state.Theme.theme || {}
      }),
      btnText() {
        return this.phoneCodeRegister.enable ? '获取验证码' : this.phoneCodeRegister.time + '秒后重新获取'
      }
    },
    created() {},
    mounted() {},
    methods: {
      ...mapMutations(["setLatestUser"]),
      ...mapActions("User", ["userLogin"]),
      selectChange(value, list, field){
        const val = (list||[]).find(d => d.value == value)?.label ?? ''
        this.$set(this.baseForm, field, val);
      },
      toActive(state){
        this.active = state;
        clearInterval(phoneCodeTimer)
        phoneCodeTimer = null;
      },
      save(){
        this.$refs['forms'].validate(async (valid) => {
            if (valid) {
                const data = {...this.baseForm};
                delete data.countryCode;
                // delete data.fileList;
                apiBasic.putSupplier(data).then(res=>{
                    if(res.code === 200){
                        this.$message.success(res?.message ?? '操作成功');
                        this.active = 3;
                    }else{
                        this.$message.error(res?.message ?? '操作失败')
                    }
                }).catch(err=>{
                    this.$message.error(err?.message ?? '操作失败')
                })
            } else { 
                this.$message.warning('请填写必填信息！')   
            }
        })
      },
      getSupplier(){
        apiBasic.getSupplier(this.id).then(res=>{
            if(res.code === 200){
                this.baseForm = {...(res.data || {}), countryCode: res.data?.countryCode ?? '' };
            }else{
                this.$message.error(res?.message ?? '获取信息失败')
            }
        }).catch(err=>{
            this.$message.error(err?.message ?? '获取信息失败')
        })
      },
      pcaChange(e) {
        this.baseForm.areaCodeList = e.value;
        this.baseForm.areaCodeListName = e.name;
        this.baseForm.countryCode = e.countryCode;
      },
      submitReg(){
        this.$refs['nickform'].validate(async (valid) => {
            if (valid) { 
                const loading = this.$loading({
                    lock: true,
                    text: '正在注册',
                    spinner: 'el-icon-loading',
                })
                if(phoneCodeTimer) clearInterval(phoneCodeTimer);
                phoneCodeTimer = null;
                apiBasic.postSupplier(this.form).then(res=>{
                    if(res.code === 200){
                        this.id = res.data || null;
                        this.$message.success(res?.message ?? '注册成功');
                        let countdown = 5;
                        this.getSupplier();
                        this.errorTitle = '';
                        this.active = 3;
                        // phoneCodeTimer = setInterval(() => {          
                        //     countdown--;
                        //     if (countdown <= 0) {
                        //         clearInterval(phoneCodeTimer)
                        //         phoneCodeTimer = null;
                        //         this.active = 3;
                        //     } else {
                        //         this.time = countdown
                        //     }          
                        // }, 1000)
                    }else{
                        this.errorTitle = res?.message ?? '注册失败'
                    }
                }).catch(err=>{
                    this.errorTitle = err.message || '注册失败'
                }).finally(()=>{loading.close();})
            } else { 
                this.$message.warning('请填写信息！')   
            }
        });
      },
      getPhoneCode(phoneNum) {
        if (this.phoneCodeRegister.enable) {
            let countdown = 60
            this.phoneCodeRegister.enable = false        
            this.phoneCodeRegister.time = countdown
            phoneCodeTimer = setInterval(() => {          
                countdown--;
                if (countdown <= 0) {
                  this.phoneCodeRegister.enable = true
                  clearInterval(phoneCodeTimer)
                  phoneCodeTimer = null
                } else {
                  this.phoneCodeRegister.time = countdown
                }          
            }, 1000)
            return { success: true }
        }
        return {
          success: false
        }
      },
      async onCodeBtnClick() {
        if (this.loading || !this.phoneCodeRegister.enable) return
        if (/^1[3456789]\d{9}$/.test(this.form.mobile)) {
            this.loading = true;
            const res = await this.getPhoneCode()
            this.$message({
                message: res.success ? '验证码发送成功' : '验证码发送失败',
                type: res.success ? 'success' : 'error'
            })
            setTimeout(()=>{this.loading = false;}, 500);
        } else {
          this.$message({
          	message: '请正确输入手机号',
          	type: 'error'
          })
        }
      },
      async onUploadSuccess(files) {
        const {fileImageSize, fileName} = files[0];
        const suffix = fileName.substring(fileName.lastIndexOf("."));
        if (['.jpg','.jpeg','.png','.gif'].indexOf(suffix) == -1) {
            this.$message.warning("暂不支持此类型的文件上传，请选择JPG、JPEG、PNG、gif 格式");
            return;
        }
        this.$set(this.baseForm, 'fileList', files)
      },
      toLogin(){
        this.$router.push(`/login`)
      }
    },
  }
</script>

<style lang="less" scoped>
.login-pages {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  .toLogins{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 56px;
    border-bottom: 1px solid #EAEAEA;
    line-height: 56px;
    font-size: 14px;
    text-align: right;
    padding: 0 16%;
    span{
        color: var(--base-color);
        cursor: pointer;
    }
    .register_title{
        font-size: 18px;
        font-weight: bold;
    }
  }
  .big_box{
    width: 1080px;
    min-height: calc(100% - 56px);
    margin: 0 auto;
    padding-bottom: 56px;
    // border-left: 1px solid #ccc;
    // border-right: 1px solid #ccc;
    // .register_title{
    //     width: 100%;
    //     height: 32px;
    //     line-height: 32px;
    //     text-indent: 12px;
    //     font-size: 16px;
    //     font-weight: bold;
    //     color: #999990;
    // }
  }
  .step_box{
    width: 680px;
    // height: 200px;
    margin: auto;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-steps{
        width: 100% !important;
    }
    .el-step__title{
        font-size: 14px !important;
    }
  }
  .register_box{
    display: flex;
    flex-direction: column;
    width: 580px;
    margin: 0 auto;
    min-height: 680px;
    padding-bottom: 48px;
    // box-shadow: 0px 0px 10px 0px rgba(100, 100, 100, 0.5);
    border-radius: 4px;
    .register_box_nav{
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        text-indent: 16px;
        background: #f5f5f5;
    }
    .from_box{
        width: calc(100% - 100px);
        margin: 30px auto 0;
        .zcBtns{
            width: 100%;
        }
    }
    .from_boxs{
        width: 100%;
        padding: 0 30px;
        .posiBtn{
            width: 100%;
            display: flex;
            justify-content: center;
            .bcBtns{
                width: 160px;
            }
        }
        .upload_spec{
            font-size: 12px;
            color: #858585;
        }
        .imgBox{
            width: 150px;
            height: 150px;
            border-radius: 4px;
            border:#ccc 1px dashed;
        }
        .imgBoxs{
            width: 100%;
            display: flex;
            .img_item{
                width: 120px;
                height: 120px;
                margin-right: 8px;
                border-radius: 4px;
                background: #ccc;
            }
        }
    }
  }
}
.register_boxs{
    width: 580px;
    margin: 0 auto;
    min-height: 500px;
    padding-bottom: 48px;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    div{
        width: 100%;
        height: 48px;
        margin-bottom: 20px;
        line-height: 48px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
    }
    .loginbtn{
        width: 200px;
    }
}
.success_tip{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: 1;
    i{
        font-size: 80px;
        color: #7ED96D;
    }
    h3{
        font-size: 18px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.6);
        margin: 20px auto 10px;
    }
    span{
        color: rgba(0, 0, 0, 0.3);
        font-size: 12px;
    }
    .success_tip_btn{
        width: 50%;
        height: 40px;
        margin-top: 30px;
        background: var(--base-color);
        color: #fff;
        text-align: center;
        line-height: 40px;
        border-radius: 4px;
        cursor: pointer;
    }
}
/deep/ .gather-title{
    margin-bottom: 10px !important;
    h4{
        display: flex;
        align-items: center;
        gap: 6px;
        &::before{
            content: '';
            display: block;
            width: 3px;
            height: 14px;
            background: var(--base-color);
        }
    }
    .el-form-item__content{
        margin-left: 0 !important;
    }
}
.register_from{
    /deep/ .el-form-item{
        display: flex;
        align-items: center;
        .el-form-item__content{
            flex: 1;
            margin-left: 0 !important;
        }
        .el-form-item__label{
            line-height: 1.5;

        }
    }
}

</style>
