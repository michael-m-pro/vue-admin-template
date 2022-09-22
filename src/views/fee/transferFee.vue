<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-select v-model="queryForm.category" clearable placeholder="Business Category">
            <el-option
              v-for="(val,key) in categories"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.businessCode" clearable placeholder="Business Code">
            <el-option
              v-for="(val,key) in businessCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.channelCode" clearable placeholder="Channel Code">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="`${val.name}(${val.value})`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.channelCurrency" style="width:230px" placeholder="Channel Currency" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add TransferFee</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="transferFeeList" style="width:100%;margin-top:30px;" border>
      <el-table-column align="center" fixed label="uid" width="200">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Category" width="200">
        <template slot-scope="scope">
          {{ categories[scope.row.category].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fee Mode" width="200">
        <template slot-scope="scope">
          {{ feeModes[scope.row.feeMode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodes[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Currency" width="200">
        <template slot-scope="scope">
          {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Charge Type" width="200">
        <template slot-scope="scope">
          {{ scope.row.type | typeTextFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fixed Fee" width="200">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Percent" width="200">
        <template slot-scope="scope">
          {{ scope.row.percent }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Min Fee" width="200">
        <template slot-scope="scope">
          {{ scope.row.minAmount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Max Fee" width="200">
        <template slot-scope="scope">
          {{ scope.row.maxAmount }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="300" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="transferFee" label-width="150px" label-position="right">
        <el-input v-model="transferFee.id" class="hidden" />
        <el-form-item label="UID">
          <el-input v-model="transferFee.uid" :disabled="disableInput" placeholder="Please enter the uid" />
        </el-form-item>
        <el-form-item label="Business Category">
          <el-select v-model="transferFee.category" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in categories"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Business Code">
          <el-select v-model="transferFee.businessCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in businessCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-select v-model="transferFee.channelCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="`${val.name}(${val.value})`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Business Currency">
          <el-input v-model="transferFee.currency" :disabled="disableInput" placeholder="Please Select" />
        </el-form-item>
        <el-form-item label="Channel Currency">
          <el-input v-model="transferFee.channelCurrency" :disabled="disableInput" placeholder="Please Select" />
        </el-form-item>
        <el-form-item label="Fee Mode">
          <el-select v-model="transferFee.feeMode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in feeModes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Charge Type">
          <el-select v-model="transferFee.type" :disabled="disableInput" placeholder="Please Select" @change="handleFeeType">
            <el-option
              v-for="item in feeTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :class="{'hidden':hideFixed}" label="Fixed Fee">
          <el-input v-model="transferFee.amount" :disabled="disableInput" placeholder="Please enter the fixed fee" type="number" />
        </el-form-item>
        <el-form-item :class="{'hidden':hidePercent}" label="Percent">
          <el-input v-model="transferFee.percent" :disabled="disableInput" placeholder="Please enter the percent (1~100)" type="number" min="1" max="100" />
        </el-form-item>
        <el-form-item :class="{'hidden':hidePercent}" label="Min Fee">
          <el-input v-model="transferFee.minAmount" :disabled="disableInput" placeholder="Please enter the min fee" type="number" />
        </el-form-item>
        <el-form-item :class="{'hidden':hidePercent}" label="Max Fee">
          <el-input v-model="transferFee.maxAmount" :disabled="disableInput" placeholder="Please enter the max fee" type="number" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmTransferFee">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, addTransferFee, getTransferFees, updateTransferFee } from '@/api/transferFee'

const defaultRole = {
  id: null,
  uid: null,
  category: null,
  businessCode: '',
  channelCode: '',
  currency: '',
  channelCurrency: '',
  type: null,
  feeMode: null,
  amount: null,
  percent: null,
  minAmount: null,
  maxAmount: null
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
        0: 'Fixed Amount',
        1: 'Percentage'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      transferFee: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        category: '',
        businessCode: '',
        channelCode: '',
        channelCurrency: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      transferFeeList: [],
      businessCodes: {},
      channelCodes: {},
      feeModes: {},
      categories: {},
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      feeTypes: [
        { 'key': 0, 'label': 'Fixed Amount' },
        { 'key': 1, 'label': 'Percentage' }
      ],
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: '',
      disableInput: true,
      checkStrictly: false,
      hideFixed: true,
      hidePercent: true,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
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
    this.getTransferFees()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.businessCodes = data.BUSINESS_CODE
      this.channelCodes = data.CHANNEL_CODE
      this.feeModes = data.FEE_MODE
      this.categories = data.BUSINESS_CATEGORY
    },
    async getTransferFees(query) {
      this.loading = true
      const { data } = await getTransferFees(query)
      this.transferFeeList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleFeeType(val) {
      this.hideFixed = true
      this.hidePercent = true
      if (val === 0) {
        this.hideFixed = false
      } else {
        this.hidePercent = false
      }
    },
    handleAdd() {
      this.disableInput = false
      this.transferFee = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New TransferFee'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getTransferFees(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Transfer Fee'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.transferFee = deepClone(scope.row)
      this.handleFeeType(this.transferFee.type)
      this.transferFee.category = this.transferFee.category + ''
      this.transferFee.feeMode = this.transferFee.feeMode + ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Transfer Fee'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.transferFee = deepClone(scope.row)
      this.handleFeeType(this.transferFee.type)
      this.transferFee.category = this.transferFee.category + ''
      this.transferFee.feeMode = this.transferFee.feeMode + ''
    },
    async confirmTransferFee() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateTransferFee(this.transferFee)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: ' Update success !'
        })
      } else {
        const { data } = await addTransferFee(this.transferFee)
        this.dialogVisible = false
        this.transferFee.id = data.id
        this.$message({
          type: 'success',
          message: 'Add success !'
        })
      }
      this.getTransferFees(this.queryForm)
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
