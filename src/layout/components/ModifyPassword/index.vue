<template>
  <div class="password-form">
    <el-form
      ref="passwordForm"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="当前用户:" prop="nickName" v-if="!forceCode">
        <span>{{ form.nickName }}</span>
      </el-form-item>
      <el-form-item label="旧密码:" prop="oldPwd" v-if="!forceCode">
        <el-input
          style="width: 300px"
          v-model="form.oldPwd"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码:" prop="newPwd">
        <el-input
          style="width: 300px"
          v-model="form.newPwd"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="请确认新密码:" prop="cfmPwd">
        <el-input
          style="width: 300px"
          v-model="form.cfmPwd"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin: 15px 0">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="$emit('close')">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { ApiSystem } from "@/apis";
const apiSystem = new ApiSystem();

export default {
  props: {
    forceCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        email: "",
        newPwd: "",
        nickName: "",
        oldPwd: "",
        phone: "",
        userId: "",
        cfmPwd: "",
      },
      rules: {
        oldPwd: [{ required: true, message: "请输入旧密码" }],
        newPwd: [{ required: true, message: "请输入新密码" },
          { validator: (rule, value, callback) => {
            if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/.test(value)) {
              callback(new Error('密码8~16位必须包含大写字母，小写字母，数字和特殊字符三种以上'))
            } else {
              callback()
            }
          }, message: '密码8~16位必须包含大写字母，小写字母，数字和特殊字符三种以上' }
        ],
        cfmPwd: [{ required: true, message: "请再次输入新密码" },
          { validator: (rule, value, callback) => {
            if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/.test(value)) {
              callback(new Error('密码8~16位必须包含大写字母，小写字母，数字和特殊字符三种以上'))
            } else {
              callback()
            }
          }, message: '密码8~16位必须包含大写字母，小写字母，数字和特殊字符三种以上' }
        ],
      },
    };
  },
  methods: {
    save() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          if (this.form.newPwd === this.form.cfmPwd) {
            // delete this.form.cfmPwd;
            if (this.forceCode) {
              //改密码
              apiSystem
                .forceEditPassword({ newPwd: this.form.newPwd }, this.forceCode)
                .then((res) => {
                  if (res.code === 200) {
                    this.$message.success(res.message);
                    this.$emit("close");
                  } else {
                    this.$message.warning(res.message);
                  }
                });
            } else {
              const data = {...this.form}
              delete data.cfmPwd;
              apiSystem.modifyPassword(data).then((res) => {
                this.$message[res.code == 200 ? "success" : "warning"](
                  res.message
                );
                this.$emit("close");
              });
            }
          } else {
            this.form.newPwd = "";
            this.form.cfmPwd = "";
            this.$message.warning("新密码确认失败，请重新输入");
          }
        }
      });
    },
  },
  created() {
    let userInfo = this.$store.state.User?.userInfo ?? {};
    this.form.nickName = userInfo.nickName;
    this.form.email = userInfo.email;
    this.form.phone = userInfo.phone;
    this.form.userId = userInfo.userId;
  },
};
</script>
<style lang="less" scoped>
.password-form {
  /deep/ .el-form-item {
    margin-bottom: 40px;
  }
}
</style>
