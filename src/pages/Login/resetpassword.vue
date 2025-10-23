<template>
<div class="login-pages">
    <div class="toLogins">
        <span @click="toLogin">返回登录</span>
    </div>
    <div class="big_box">
        <div class="register_title">重置密码</div>
        <div class="step_box">
            <el-steps :space="350" :active="active" finish-status="success" align-center>
                <el-step title="验证身份"></el-step>
                <el-step title="设置新密码"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </div>

        <div class="register_box" v-if="active == 0">
            <div class="register_box_nav">验证身份</div>
            <div class="from_box">
                <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="form.name" placeholder="输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="form.name" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input
                        v-model.trim="form.code"
                        placeholder="请输入图形验证码"
                        size="small"
                        style="width: 200px "
                        />
                        <span class="login-code" style="position: absolute; right: 0; top: 4px; left: 257px">
                        <Identify :identifyCode="identifyCode"></Identify>
                        </span>
                        <span
                        class="el-icon-refresh-right"
                        style="position: absolute;  left: 394px; top: 13px; cursor: pointer"
                        @click="refreshCode"
                        />
                    </el-form-item>
                    <el-form-item  label="验证码">
                        <el-input v-model="form.name" placeholder="请输入短信验证码">
                            <el-button slot="append" @click="submitForm" :loading="loading">获取验证码</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                            <el-button
                                type="primary"
                                @click="active = 1"
                            >下一步</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="register_box" v-if="active == 1">
            <div class="register_box_nav">设置新密码</div>
            <div class="from_box">
                <el-form ref="ruleform" :model="ruleform" label-position="right" :rules="rules" label-width="80px">
                    <el-form-item label="新的密码">
                        <el-input v-model="form.name" placeholder="设置8至20位登录密码,须包含字母和数字"></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码">
                        <el-input v-model="form.name" placeholder="请再次输入登录密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                            <el-button
                                type="primary"
                                @click="active = 3"
                            >下一步</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="register_boxs" v-if="active == 3">
            <div>密码重置成功</div>
            <div>下次请使用新密码进行登录</div>
            <el-button class="loginbtn"  @click="toLogin" type="primary">登录</el-button>
        </div>
    </div>
</div>
</template>
 
<script>
import Identify from './com/identify.vue'
export default {
  name: "resetpassword",
  components: { Identify },
  data() {
    return {
      active:0,
      formSetting: {
        contentWidth: 340,
      },
      form: {
        logoUrl: "",
        licenseUrl: "",
        description: [],
        account: "",
        name: "",
      },
      ruleform:{
        name:''
      },
      loading:false,
      code:this.$route.query.code,
      identifyCodes: "1234567890abcdefjhijklinopqrsduvwxyz",
      identifyCode: "",
      picList: [],
      props: { label: "name", value: "id", children: "children" },
      rules: {
        code: [{ required: true, message: "请输入验证码", trigger: "change" }],
      },
      formList: [],
    };
  },
  created() {
    // this.getAllDict()
  },
  mounted() {
    // 初始化验证码
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    localStorage.setItem("code", this.code);
  },
  methods: {
        toLogin(){
            this.$router.push(`login/`)
        },
        openHtml() {
        this.visible = true;
        },
        //刷新验证码
        refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
        },
        //生成验证上的随机数，验证码中的数从identifyCodes中取，
        makeCode(o, l) {
        for (let i = 0; i < l; i++) {
            this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
            ];
        }
        },
        //生成随机数,这里是生成
        //Math.random()方法返回大于等于0小于1的一个随机数
        //随机数 = Math.floor(Math.random() * 可能的总数 + 第一个可能的值)
        randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
        },
        // 提交表单
        submitForm() {
        this.$refs["form"].validate((valid) => {
            if (valid) {
            if (this.loading) {
                return;
            }
            this.loading = true;
            this.submit();
            } else {
            return false;
            }
        });
        },
        submit: async function () {
        if (this.form.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
            this.$message({ type: "error", message: "请填写正确验证码" });
            this.refreshCode();
            this.loading = false;
            return;
        } else {
            this.$message({ type: "success", message: "验证通过" });
        }
    }
    }
}
</script>
<style lang="less">
.login-pages {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  .toLogins{
    width: 100%;
    height: 56px;
    border-bottom: 1px solid #ccc;
    line-height: 56px;
    font-size: 14px;
    text-align: right;
    padding-right: 200px;
    span{
        color: #409EFF;
        cursor: pointer;
    }
  }
  .big_box{
    width: 1080px;
    margin: 0 auto;
    padding-bottom: 56px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    .register_title{
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-indent: 12px;
        font-size: 16px;
        font-weight: bold;
        color: #999990;
    }
  }
  .step_box{
    width: 760px;
    height: 200px;
    margin: 0 auto;
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
    width: 580px;
    margin: 0 auto;
    min-height: 500px;
    padding-bottom: 48px;
    box-shadow: 0px 0px 10px 0px rgba(100, 100, 100, 0.5);
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
        margin-left: 50px;
        margin-top: 32px;
        .el-input__inner{
            height: 48px !important;
            line-height: 48px !important;
        }
        .zcBtns{
            width: 100%;
        }
    }
    .from_boxs{
        width: calc(100% - 100px);
        margin-left: 50px;
        margin-top: 32px;
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
            background: #ccc;
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
    div{
        width: 100%;
        height: 48px;
        margin-bottom: 20px;
        line-height: 48px;
        text-align: center;
    }
    .loginbtn{
        width: 200px;
    }
}
</style>