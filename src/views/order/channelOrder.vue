<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" style="width:230px" placeholder="Payment Order No" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.merchantOrderNo" style="width:230px" placeholder="Merchant Order No" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.channelOrderNo" style="width:230px" placeholder="Channel Order No" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.channelCode" style="width:230px" placeholder="Channel Code" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.currency" style="width:230px" placeholder="Channel Currency" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <!-- <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add PayOrder</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="payOrderList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Order No" width="200">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodeMap[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Order No" width="200">
        <template slot-scope="scope">
          {{ scope.row.channelOrderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Merchant Order No" width="200">
        <template slot-scope="scope">
          {{ scope.row.merchantOrderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Amount" width="200">
        <template slot-scope="scope">
          {{ scope.row.amount }} {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Fee" width="200">
        <template slot-scope="scope">
          {{ scope.row.channelFee }} {{ scope.row.settlementCurrency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Fee Mode" width="200">
        <template slot-scope="scope">
          {{ feeModeMap[scope.row.feeMode+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Settlement Amount" width="300">
        <template slot-scope="scope">
          {{ scope.row.settlementAmount }} {{ scope.row.settlementCurrency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Error Info" width="300">
        <template slot-scope="scope">
          {{ scope.row.errorInfo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Order Status" width="150">
        <template slot-scope="{row}">
          {{ orderStatusMap[row.status+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Create Time" width="200">
        <template slot-scope="{row}">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Update Time" width="200">
        <template slot-scope="{row}">
          {{ row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <!-- <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="payOrder" label-width="120px" label-position="right">
        <el-input v-model="payOrder.id" class="hidden" />
        <el-form-item label="Order No">
          <el-input v-model="payOrder.orderNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-input v-model="payOrder.channelCode" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Order No">
          <el-input v-model="payOrder.channelOrderNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Merchant Order No">
          <el-input v-model="payOrder.merchantOrderNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Amount">
          <el-input v-model="payOrder.amount" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Currency">
          <el-input v-model="payOrder.currency" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Fee">
          <el-input v-model="payOrder.channelFee" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Fee Mode">
          <el-input v-model="payOrder.feeMode" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Settlement Amount">
          <el-input v-model="payOrder.settlementAmount" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Settlement Currency">
          <el-input v-model="payOrder.settlementCurrency" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Error Info">
          <el-input
            v-model="payOrder.errorInfo"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="disableInput"
          />
        </el-form-item>
        <el-form-item label="Channel Info">
          <el-input
            v-model="payOrder.channelInfo"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="disableInput"
          />
        </el-form-item>
        <el-form-item label="status">
          <el-input v-model="payOrder.status" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Create Time">
          <el-input v-model="payOrder.createTime" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Update Time">
          <el-input v-model="payOrder.updateTime" :disabled="disableInput" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <!-- <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmPayOrder">Confirm</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, getPayOrders } from '@/api/channelOrder'

const defaultRole = {
  id: null,
  orderNo: '',
  merchantOrderNo: '',
  channelCode: '',
  channelOrderNo: '',
  businessNo: '',
  amount: '',
  currency: '',
  channelFee: '',
  settlementAmount: '',
  settlementCurrency: '',
  channelInfo: '',
  errorInfo: '',
  feeMode: '',
  status: null,
  approvalStatus: null,
  createTime: null,
  updateTime: null
}

export default {
  components: { Pagination },
  filters: {
    statusTextFilter(status) {
      const textMap = {
        1: 'Normal',
        0: 'Disable'
      }
      return textMap[status]
    },
    typeTextFilter(status) {
      const textMap = {
        0: 'PayOrder',
        1: 'Parameters'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      payOrder: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        orderNo: '',
        merchantOrderNo: '',
        channelOrderNo: '',
        channelCode: '',
        currency: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      payOrderList: [],
      orderStatusMap: {},
      channelCodeMap: {},
      feeModeMap: {},
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: '',
      disableInput: true,
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      addSubset: false,
      loading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  computed: {
  },
  created() {
    this.actions = this.storage(this.$route.name)
    this.init()
    this.getPayOrders()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.feeModeMap = data.FEE_MODE
      this.orderStatusMap = data.ORDER_STATUS
      this.channelCodeMap = data.CHANNEL_CODE
    },
    async getPayOrders(query) {
      this.loading = true
      const { data } = await getPayOrders(query)
      this.payOrderList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getPayOrders(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View PayOrder'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.payOrder = deepClone(scope.row)
      this.payOrder.status = this.orderStatusMap[this.payOrder.status + ''].name
      this.payOrder.channelCode = this.channelCodeMap[this.payOrder.channelCode].name
      this.payOrder.feeMode = this.feeModeMap[this.payOrder.feeMode + ''].name
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
