<template>
  <div class="order">
    <div>
      <div class="header-box">
        <div class="left-box">
          <el-radio-group v-model="radio1" @input="changInput">
            <el-radio-button label="all">所有</el-radio-button>
            <el-radio-button label="month">按月查看</el-radio-button>
            <el-radio-button label="year">按年查看</el-radio-button>
          </el-radio-group>

          <el-date-picker
            v-if="radio1 !== 'all'"
            v-model="value2"
            :type="radio1"
            value-format="timestamp"
            placeholder="请选择"
            @input="getData"
          />
        </div>

        <el-button type="primary" @click="openDialog">新增</el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <!-- <el-table-column fixed prop="order" label="订单id" /> -->
      <el-table-column prop="machineNo" label="机器编号" />
      <el-table-column prop="location" label="地理位置" />
      <el-table-column prop="consumptionAmount" label="消费金额（元）">
        <template slot-scope="scope">
          {{ outputmoney(scope.row.consumptionAmount) }}
        </template>
      </el-table-column>

      <el-table-column prop="divideIntoRanks" label="分成比列（%）">
        <template slot-scope="scope">
          {{ scope.row.divideIntoRanks }}%
        </template>
      </el-table-column>
      <el-table-column label="金额（元）">
        <template slot-scope="scope">
          {{ outputmoney(currency(scope.row.consumptionAmount).multiply(scope.row.divideIntoRanks).divide(100)) }}
        </template>
      </el-table-column>

      <!-- <el-table-column prop="createData" label="日期">
        <template slot-scope="scope">
          {{ new Date(scope.row.createData).toLocaleDateString() }}
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog class="order-container" title="新增" :visible.sync="dialogFormVisible" @close="close">
      <el-form
        ref="orderForm"
        :model="orderForm"
        :rules="orderRules"
        class="order-form"
        auto-complete="on"
        label-position="left"
      >

        <el-form-item label="订单id" prop="order">
          <el-input v-model="orderForm.order" />
        </el-form-item>

        <el-form-item label="机器编号" prop="machineNo">
          <el-input v-model="orderForm.machineNo" />
        </el-form-item>

        <el-form-item label="地理位置" prop="location">
          <el-input v-model="orderForm.location" />
        </el-form-item>

        <el-form-item label="消费金额（元）" prop="consumptionAmount">
          <el-input v-model="orderForm.consumptionAmount" />
        </el-form-item>

        <el-form-item label="分成比列（%）" prop="divideIntoRanks">
          <el-input v-model="orderForm.divideIntoRanks" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingBtn" type="primary" @click="handleOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addList, deleteData } from '@/api/order'
import currency from 'currency.js'

export default {
  data() {
    return {
      currency,
      radio1: 'all',
      value2: '',
      tableData: [],
      loading: false,
      loadingBtn: false,
      dialogFormVisible: false,
      orderForm: {
        'order': '',
        'machineNo': '',
        'location': '',
        'consumptionAmount': '',
        'divideIntoRanks': ''
      },
      orderRules: {
        order: [{ required: true, trigger: 'blur', message: '请输入订单编号' }],
        machineNo: [{ required: true, trigger: 'blur', message: '请输入机器编号' }],
        location: [{ required: true, trigger: 'blur', message: '请输入地理位置' }],
        consumptionAmount: [{ required: true, trigger: 'blur', message: '请输入消费金额' }],
        divideIntoRanks: [{ required: true, trigger: 'blur', message: '请输入分成比列' }]
      },
      passwordType: 'password'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 金额 格式化
    outputmoney(value) {
      if (!value && value !== 0) return '-'
      var intPart = Number(value) | 0 // 获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

      var floatPart = '.00' // 预定义小数部分
      var value2Array = value.toString().split('.')

      // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分

        if (floatPart.length === 1) { // 补0,实际上用不着
          return intPartFormat + '.' + floatPart + '0'
        } else {
          return intPartFormat + '.' + floatPart
        }
      } else {
        return intPartFormat + floatPart
      }
    },

    getData() {
      this.loading = true
      getList({
        type: this.radio1,
        date: this.value2
      }).then(res => {
        this.tableData = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    handleClick(row) {
      console.log(row)
    },
    openDialog() {
      this.dialogFormVisible = true
    },
    handleOrder() {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          this.loadingBtn = true

          addList(this.orderForm).then(res => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getData()
            this.dialogFormVisible = false
          }).finally(() => {
            this.loadingBtn = false
          })
        } else {
          return false
        }
      })
    },
    deleteItem(scope) {
      this.loading = true
      deleteData({
        order: scope.order
      }).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getData()
      }).finally(() => {
        this.loading = false
      })
    },
    close() {
      this.$refs.orderForm.resetFields()
    },
    changInput(val) {
      if (val === 'all') {
        this.getData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  padding: 15px;

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
}
</style>
