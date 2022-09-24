<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" style="width:230px" clearable placeholder="Payment Order No" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.merchantOrderNo" style="width:230px" clearable placeholder="Merchant Order No" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.channelCode" style="width:230px" clearable placeholder="Channel Code" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.currency" style="width:230px" clearable placeholder="Channel Currency" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <!-- <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Order</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="apiOrderList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Order No" width="230">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Category" width="200">
        <template slot-scope="scope">
          {{ categoryMap[scope.row.category+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodeMap[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Code" width="200">
        <template slot-scope="scope">
          {{ businessCodeMap[scope.row.businessCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Merchant Order No" width="200">
        <template slot-scope="scope">
          {{ scope.row.merchantOrderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Merchant Name" width="200">
        <template slot-scope="scope">
          {{ scope.row.merchantName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Order Amount" width="200">
        <template slot-scope="scope">
          {{ scope.row.amount }} {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fee" width="200">
        <template slot-scope="scope">
          {{ scope.row.fee }} {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fee Mode" width="200">
        <template slot-scope="scope">
          {{ feeModeMap[scope.row.feeMode+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Order Status" width="150">
        <template slot-scope="{row}">
          {{ orderStatusMap[row.status+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Create Time" width="200">
        <template slot-scope="{row}">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Update Time" width="200">
        <template slot-scope="{row}">
          {{ row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operations" width="100">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <!-- <el-button v-show="showButton('PreReview',actions)" type="primary" size="small" @click="handleView(scope)">PreReview</el-button>
          <el-button v-show="showButton('Review',actions)" type="primary" size="small" @click="handleView(scope)">Review</el-button> -->
          <!-- <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="apiOrder" label-width="150px" label-position="right">
        <el-input v-model="apiOrder.id" class="hidden" />
        <el-form-item label="Order No">
          <el-input v-model="apiOrder.orderNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Business Category">
          <el-input v-model="apiOrder.category" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Business Code">
          <el-input v-model="apiOrder.businessCode" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-input v-model="apiOrder.channelCode" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Merchant Order No">
          <el-input v-model="apiOrder.merchantOrderNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Merchant name">
          <el-input v-model="apiOrder.merchantOrderNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Amount">
          <el-input v-model="apiOrder.amount" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Currency">
          <el-input v-model="apiOrder.currency" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Fee">
          <el-input v-model="apiOrder.fee" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Fee Mode">
          <el-input v-model="apiOrder.feeMode" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Notify Url">
          <el-input v-model="apiOrder.notifyUrl" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Extended Info">
          <el-input
            v-model="apiOrder.extendedFields"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="disableInput"
          />
        </el-form-item>
        <el-form-item label="status">
          <el-input v-model="apiOrder.status" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Create Time">
          <el-input v-model="apiOrder.createTime" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Update Time">
          <el-input v-model="apiOrder.updateTime" :disabled="disableInput" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <!-- <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmOrder">Confirm</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, getApiOrders } from '@/api/apiOrder'

const defaultRole = {
  id: null,
  orderNo: '',
  merchantOrderNo: '',
  category: '',
  channelCode: '',
  businessCode: '',
  amount: '',
  currency: '',
  merchantEmail: '',
  merchantName: '',
  notifyUrl: '',
  fee: '',
  feeMode: '',
  extendedFields: '',
  anonymous: '',
  fields: '',
  status: null,
  createTime: null,
  updateTime: null
}

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      apiOrder: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        orderNo: '',
        merchantOrderNo: '',
        channelCode: '',
        currency: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      apiOrderList: [],
      orderStatusMap: {},
      channelCodeMap: {},
      feeModeMap: {},
      businessCodeMap: {},
      categoryMap: {},
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
    this.getApiOrders()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.feeModeMap = data.FEE_MODE
      this.orderStatusMap = data.ORDER_STATUS
      this.channelCodeMap = data.CHANNEL_CODE
      this.businessCodeMap = data.BUSINESS_CODE
      this.categoryMap = data.BUSINESS_CATEGORY
    },
    async getApiOrders(query) {
      this.loading = true
      const { data } = await getApiOrders(query)
      this.apiOrderList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getApiOrders(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Api Order'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.apiOrder = deepClone(scope.row)
      this.apiOrder.status = this.orderStatusMap[this.apiOrder.status + ''].name
      this.apiOrder.channelCode = this.channelCodeMap[this.apiOrder.channelCode].name
      this.apiOrder.feeMode = this.feeModeMap[this.apiOrder.feeMode + ''].name
      this.apiOrder.extendedFields = JSON.stringify(this.apiOrder.extendedFields)
      this.apiOrder.category = this.categoryMap[this.apiOrder.category + ''].name
      this.apiOrder.businessCode = this.businessCodeMap[this.apiOrder.businessCode].name
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
