<template>
  <div class="user-list">
    <div>
      <div class="header-box">
        <div class="left-box" />

        <el-button
          v-if="superUser"
          type="primary"
          @click="openAddUser"
        >新增</el-button>

        <el-dialog
          key="register"
          title="添加用户"
          :visible.sync="dialogUserFormVisible"
        >
          <register ref="register" />
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogUserFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click.native.prevent="handleUserLogin"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="username"
        label="账号"
      />
      <el-table-column
        prop="password"
        label="密码"
      />
      <el-table-column
        prop="ip"
        label="ip地址"
      />
      <el-table-column label="最后登录时间">
        <template slot-scope="scope">
          {{ getDate(scope.row.date, 'YYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="superUser"
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            style="margin-right: 12px;"
            type="text"
            size="small"
            @click="editItem(scope)"
          >编辑</el-button>
          <el-popconfirm
            title="确定删除？"
            @onConfirm="onConfirm(scope)"
          >
            <el-button
              slot="reference"
              type="text"
              size="small"
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      class="login-container"
      title="修改密码"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleLogin"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @prev-click="onPrevClick"
      @next-click="onNextClick"
      @current-change="onCurrentChange"
    />
  </div>
</template>

<script>
import { getUserList } from '@/api/user'
import { mapGetters } from 'vuex'
import { modifyPassword, deleteAccount } from '@/api/user'
import register from '@/views/login/register.vue'
import dayjs from 'dayjs'

export default {
  components: {
    register
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogUserFormVisible: false,
      loginForm: {
        username: '',
        password: ''
      },
      passwordType: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      userList: [],
      tableData: [],
      page: 1,
      capacity: 10,
      total: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'superUser'
    ])
  },
  created() {
    this.getUserListFn()
  },

  methods: {
    getDate(value) {
      if (!value) return
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    },
    openAddUser() {
      this.dialogUserFormVisible = true
    },
    handleUserLogin() {
      this.$refs.register.handleLogin().then(res => {
        if (res) {
          this.dialogUserFormVisible = false

          this.getUserListFn()
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    onCurrentChange(val) {
      this.page = val
      this.getUserListFn()
    },
    onPrevClick() {
      this.page--
      this.getUserListFn()
    },
    onNextClick() {
      this.page++
      this.getUserListFn()
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.loading = true
          modifyPassword(this.loginForm).then(() => {
            this.$message({
              type: 'success',
              message: '密码修改成功'
            })

            this.getUserListFn()
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getUserListFn() {
      this.loading = true
      try {
        const res = await getUserList({
          page: this.page,
          capacity: this.capacity
        })

        this.tableData = res.data.userList
        this.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    editItem(scope) {
      this.dialogFormVisible = true
      this.loginForm.username = scope.row.username
      this.loginForm.password = scope.row.password
    },
    async onConfirm(scope) {
      await deleteAccount({ username: scope.row.username })
      this.$message({
        message: '删除成功',
        type: 'success'
      })

      this.getUserListFn()
    }
  }
}
</script>

<style scoped lang="scss">
.user-list {
  padding: 15px;
}

.header-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  .left-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
