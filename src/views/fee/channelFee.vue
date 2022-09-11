<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-select v-model="queryForm.category" clearable placeholder="Channel Account">
            <el-option
              v-for="(val,key) in channelAccountMap"
              :key="key"
              :label="val.remark"
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
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add ChannelFee</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="channelFeeList" style="width:100%;margin-top:30px;" border>
      <el-table-column align="center" fixed label="uid" width="200">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Account" width="200">
        <template slot-scope="scope">
          {{ channelAccountMap[scope.row.channelAccountId].remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodes[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Currency" width="200">
        <template slot-scope="scope">
          {{ scope.row.channelCurrency }}
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
      <el-form :model="channelFee" label-width="150px" label-position="right">
        <el-input v-model="channelFee.id" class="hidden" />
        <el-form-item label="UID">
          <el-input v-model="channelFee.uid" :disabled="disableInput" placeholder="Please enter the uid" />
        </el-form-item>
        <el-form-item label="Channel Account">
          <el-select v-model="channelFee.channelAccountId" :disabled="disableInput" style="width:450" placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelAccountMap"
              :key="key"
              :label="`${val.remark} - ${businessCodes[val.businessCode].name} - ${val.accountNo}`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-select v-model="channelFee.channelCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="`${val.name}(${val.value})`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Currency">
          <el-input v-model="channelFee.channelCurrency" :disabled="disableInput" placeholder="Please Select" />
        </el-form-item>
        <el-form-item label="Fee Mode">
          <el-select v-model="channelFee.feeMode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in feeModes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Charge Type">
          <el-select v-model="channelFee.type" :disabled="disableInput" placeholder="Please Select" @change="handleFeeType">
            <el-option
              v-for="item in feeTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :class="{'hidden':hideFixed}" label="Fixed Fee">
          <el-input v-model="channelFee.amount" :disabled="disableInput" placeholder="Please enter the fixed fee" type="number" />
        </el-form-item>
        <el-form-item :class="{'hidden':hidePercent}" label="Percent">
          <el-input v-model="channelFee.percent" :disabled="disableInput" placeholder="Please enter the percent (1~100)" type="number" min="1" max="100" />
        </el-form-item>
        <el-form-item :class="{'hidden':hidePercent}" label="Min Fee">
          <el-input v-model="channelFee.minAmount" :disabled="disableInput" placeholder="Please enter the min fee" type="number" />
        </el-form-item>
        <el-form-item :class="{'hidden':hidePercent}" label="Max Fee">
          <el-input v-model="channelFee.maxAmount" :disabled="disableInput" placeholder="Please enter the max fee" type="number" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmChannelFee">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, addChannelFee, getChannelFees, updateChannelFee } from '@/api/channelFee'

const defaultRole = {
  id: null,
  uid: null,
  channelAccountId: null,
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
      channelFee: Object.assign({}, defaultRole),
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
      channelFeeList: [],
      channelAccountMap: {},
      channelCodes: {},
      feeModes: {},
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
    this.getChannelFees()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.channelAccountMap = data.SYS_CHANNEL_ACCOUNT_MAP
      this.businessCodes = data.BUSINESS_CODE
      this.channelCodes = data.CHANNEL_CODE
      this.feeModes = data.FEE_MODE
      this.categories = data.BUSINESS_CATEGORY
    },
    async getChannelFees(query) {
      this.loading = true
      const { data } = await getChannelFees(query)
      this.channelFeeList = data.list
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
      this.channelFee = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New ChannelFee'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getChannelFees(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Transfer Fee'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelFee = deepClone(scope.row)
      this.handleFeeType(this.channelFee.type)
      this.channelFee.channelAccountId = this.channelFee.channelAccountId + ''
      this.channelFee.feeMode = this.channelFee.feeMode + ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Transfer Fee'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelFee = deepClone(scope.row)
      this.handleFeeType(this.channelFee.type)
      this.channelFee.channelAccountId = this.channelFee.channelAccountId + ''
      this.channelFee.feeMode = this.channelFee.feeMode + ''
    },
    async confirmChannelFee() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateChannelFee(this.channelFee)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: ' Update success !'
        })
      } else {
        const { data } = await addChannelFee(this.channelFee)
        this.dialogVisible = false
        this.channelFee.id = data.id
        this.$message({
          type: 'success',
          message: 'Add success !'
        })
      }
      this.getChannelFees(this.queryForm)
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
