<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.merchantOrderNo" style="width:230px" clearable placeholder="Merchant Order No" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.businessNo" style="width:230px" clearable placeholder="Api Order No" />
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

    <el-table :data="transferOrderList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Merchant Order No" width="200">
        <template slot-scope="scope">
          {{ scope.row.merchantOrderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Api Order No" width="230">
        <template slot-scope="scope">
          {{ scope.row.businessNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Order No" width="230">
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
      <el-table-column align="center" label="Merchant Email" width="200">
        <template slot-scope="scope">
          {{ scope.row.payeeEmail }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Receive Amount" width="200">
        <template slot-scope="scope">
          {{ scope.row.receiveAmount }} {{ scope.row.receiveCurrency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Payment Amount" width="200">
        <template slot-scope="scope">
          {{ scope.row.paymentAmount }} {{ scope.row.paymentCurrency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fee" width="200">
        <template slot-scope="scope">
          {{ scope.row.payerFee }} {{ scope.row.settlementCurrency }}
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
      <el-table-column align="center" label="Memo" width="150">
        <template slot-scope="{row}">
          {{ row.remark }}
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
      <el-table-column align="center" fixed="right" label="Operations" width="300">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('PreReview',actions) && (scope.row.approvalStatus == 0)" type="danger" size="small" @click="handlePreReview(scope)">PreReview</el-button>
          <el-button v-show="showButton('Review',actions) && (scope.row.approvalStatus == 1||scope.row.approvalStatus == 2)" type="danger" size="small" @click="handleReview(scope)">Review</el-button>
          <!-- <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle" width="70%">
      <el-form :model="transferOrder" label-width="150px" label-position="right" inline style="border:1px solid #C4E1C5;padding:10px">
        <el-input v-model="transferOrder.id" class="hidden" />
        <el-form-item label="Order No">
          <el-input v-model="transferOrder.orderNo" :disabled="true" />
        </el-form-item>
        <el-form-item label="Business Category">
          <el-input v-model="transferOrder.category" :disabled="true" />
        </el-form-item>
        <el-form-item label="Business Code">
          <el-input v-model="transferOrder.businessCode" :disabled="true" />
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-input v-model="transferOrder.channelCode" :disabled="true" />
        </el-form-item>
        <el-form-item label="Merchant Order No">
          <el-input v-model="transferOrder.merchantOrderNo" :disabled="true" />
        </el-form-item>
        <el-form-item label="Receive Amount">
          <el-input v-model="transferOrder.receiveAmount" :disabled="true" />
        </el-form-item>
        <el-form-item label="Receive Currency">
          <el-input v-model="transferOrder.receiveCurrency" :disabled="true" />
        </el-form-item>
        <el-form-item label="Payment Amount">
          <el-input v-model="transferOrder.paymentAmount" :disabled="true" />
        </el-form-item>
        <el-form-item label="Payment Currency">
          <el-input v-model="transferOrder.paymentCurrency" :disabled="true" />
        </el-form-item>
        <el-form-item label="Fee">
          <el-input v-model="transferOrder.fee" :disabled="true" />
        </el-form-item>
        <el-form-item label="Fee Mode">
          <el-input v-model="transferOrder.feeMode" :disabled="true" />
        </el-form-item>
        <el-form-item label="status">
          <el-input v-model="transferOrder.status" :disabled="true" />
        </el-form-item>
        <el-form-item label="Create Time">
          <el-input v-model="transferOrder.createTime" :disabled="true" />
        </el-form-item>
        <el-form-item label="Update Time">
          <el-input v-model="transferOrder.updateTime" :disabled="true" />
        </el-form-item>
        <el-form-item label="Extended Info">
          <el-input
            v-model="transferOrder.fields"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="Payer Info">
          <el-input
            v-model="payerInfo"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <div class="el-dialog__header" style="margin-left:-20px;margin-bottom:20px">
        <span class="el-dialog__title">Review records</span>
      </div>
      <el-table :data="records" style="width:100%;margin-top:30px;" border>
        <el-table-column align="center" label="Remark">
          <template slot-scope="scope">
            {{ scope.row.approvalRemark }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="operator">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Approval Status">
          <template slot-scope="scope">
            {{ approvalStatusMap[scope.row.approvalStatus+''].name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Content">
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Create Time">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
      </el-table>
      <div class="el-dialog__header" style="margin-left:-20px;margin-bottom:20px">
        <span class="el-dialog__title">Review Order</span>
      </div>
      <el-form :model="preReviewInfo" label-width="150px" label-position="right" style="border:1px solid #C4E1C5;padding:10px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="Approval Remark">
              <el-input v-model="preReviewInfo.orderNo" class="hidden" />
              <el-input v-model="preReviewInfo.businessCode" class="hidden" />
              <el-input
                v-model="preReviewInfo.approvalRemark"
                :autosize="{ minRows: 3, maxRows: 6}"
                type="textarea"
                style="width:70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Approval Status">
              <el-radio-group v-model="preReviewInfo.status" size="medium" @change="handleRadio">
                <el-radio border label="0">Fail</el-radio>
                <el-radio border label="1">Success</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;margin-top:20px;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmOrder">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, getTransferOrders, getTransferOrder, preReview, review } from '@/api/transferOrder'

const defaultRole = {
  id: null,
  orderNo: '',
  merchantOrderNo: '',
  category: '',
  channelCode: '',
  businessCode: '',
  paymentAmount: '',
  paymentCurrency: '',
  receiveAmount: '',
  receiveCurrency: '',
  payeeEmail: '',
  payerEmail: '',
  businessNo: '',
  payerFee: '',
  feeMode: '',
  anonymous: '',
  fields: '',
  remark: '',
  status: null,
  approvalStatus: null,
  approvalRemark: '',
  expireTime: '',
  createTime: null,
  updateTime: null
}

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      transferOrder: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        businessNo: '',
        merchantOrderNo: '',
        channelCode: '',
        currency: '',
        pageNum: '',
        pageSize: ''
      },
      preReviewInfo: {
        businessCode: '',
        orderNo: '',
        status: '',
        approvalRemark: ''
      },
      reviewInfo: {
        businessCode: '',
        orderNo: '',
        status: '',
        approvalRemark: ''
      },
      viewReqDTO: {
        orderNo: ''
      },
      actions: [],
      records: [],
      transferOrderList: [],
      orderStatusMap: {},
      channelCodeMap: {},
      feeModeMap: {},
      businessCodeMap: {},
      approvalStatusMap: {},
      categoryMap: {},
      payerInfo: {},
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: '',
      disableInput: true,
      disableResetAmount: true,
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
    console.log(this.actions)
    this.init()
    this.getTransferOrders()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.feeModeMap = data.FEE_MODE
      this.orderStatusMap = data.ORDER_STATUS
      this.channelCodeMap = data.CHANNEL_CODE
      this.businessCodeMap = data.BUSINESS_CODE
      this.categoryMap = data.BUSINESS_CATEGORY
      this.approvalStatusMap = data.APPROVAL_STATUS
    },
    async getTransferOrders(query) {
      this.loading = true
      const { data } = await getTransferOrders(query)
      this.transferOrderList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getTransferOrders(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Order'
      this.disableInput = true
      this.handDisplay(scope)
      this.transferOrder.businessCode = this.businessCodeMap[this.transferOrder.businessCode].name
    },
    async handDisplay(scope) {
      this.dialogVisible = true
      this.checkStrictly = true
      this.transferOrder = deepClone(scope.row)
      this.viewReqDTO.orderNo = this.transferOrder.orderNo
      const { data } = await getTransferOrder(this.viewReqDTO)
      this.records = data.ApprovalRecordListResDTO
      this.transferOrder.status = this.orderStatusMap[this.transferOrder.status + ''].name
      this.transferOrder.channelCode = this.channelCodeMap[this.transferOrder.channelCode].name
      this.transferOrder.feeMode = this.feeModeMap[this.transferOrder.feeMode + ''].name
      this.transferOrder.category = this.categoryMap[this.transferOrder.category + ''].name
      const payerInfo = JSON.parse(this.transferOrder.fields).PayerInfoReqDTO
      this.payerInfo = ''
      if (payerInfo) {
        this.payerInfo = JSON.stringify(payerInfo)
      }
    },
    handlePreReview(scope) {
      this.dialogTitle = 'Review Order'
      this.disableInput = false
      this.dialogType = 'preReview'
      this.handDisplay(scope)
      this.preReviewInfo.orderNo = this.transferOrder.orderNo
      this.preReviewInfo.businessCode = this.transferOrder.businessCode
      this.transferOrder.businessCode = this.businessCodeMap[this.transferOrder.businessCode].name
    },
    handleReview(scope) {
      this.dialogTitle = 'Review Order'
      this.disableInput = false
      this.dialogType = 'review'
      this.handDisplay(scope)
      this.preReviewInfo.orderNo = this.transferOrder.orderNo
      this.preReviewInfo.businessCode = this.transferOrder.businessCode
      this.transferOrder.businessCode = this.businessCodeMap[this.transferOrder.businessCode].name
    },
    handleRadio() {
      this.disableResetAmount = true
      if (this.preReviewInfo.status === '1') {
        this.disableResetAmount = false
      }
    },
    async confirmOrder() {
      const isPreReview = this.dialogType === 'preReview'
      console.log(this.preReviewInfo)
      if (isPreReview) {
        await preReview(this.preReviewInfo)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: ' Pre-Review success !'
        })
      } else {
        await review(this.preReviewInfo)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'Review success !'
        })
      }
      this.getTransferOrders(this.queryForm)
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
