<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
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
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.remark" style="width:230px" placeholder="Channel Account Name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Channel Account</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="channelAccountList" style="width:100%;margin-top:30px;" border>
      <el-table-column align="center" fixed label="Channel Name" width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Category" width="200">
        <template slot-scope="scope">
          {{ categories[scope.row.category].name }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Account Name">
        <template slot-scope="scope">
          {{ scope.row.accountName }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Account No">
        <template slot-scope="scope">
          {{ scope.row.accountNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Code" width="200">
        <template slot-scope="scope">
          {{ businessCodes[scope.row.businessCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodes[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="settlement Currency" width="200">
        <template slot-scope="scope">
          {{ scope.row.settlementCurrency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Transaction Mode" width="200">
        <template slot-scope="scope">
          {{ transactionModes[scope.row.transactionMode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fee Mode" width="200">
        <template slot-scope="scope">
          {{ feeModes[scope.row.feeMode].name }}
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
      <el-form :model="channelAccount" label-width="210px" label-position="right">
        <el-input v-model="channelAccount.id" class="hidden" />
        <el-form-item label="Channel Name">
          <el-input v-model="channelAccount.remark" :disabled="disableInput" placeholder="Please enter the Channel name" />
        </el-form-item>
        <el-form-item label="Business Category">
          <el-select v-model="channelAccount.category" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in categories"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Business Code">
          <el-select v-model="channelAccount.businessCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in businessCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-select v-model="channelAccount.channelCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="settlement Currency">
          <el-input v-model="channelAccount.settlementCurrency" :disabled="disableInput" placeholder="Please enter the settlement currency" />
        </el-form-item>
        <el-form-item label="Transaction Mode">
          <el-select v-model="channelAccount.transactionMode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in transactionModes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Account Name">
          <el-input v-model="channelAccount.accountName" :disabled="disableInput" placeholder="Please enter the account name" />
        </el-form-item>
        <el-form-item label="Account">
          <el-input v-model="channelAccount.accountNo" :disabled="disableInput" placeholder="Please enter the account" />
        </el-form-item>
        <el-form-item label="Api Key">
          <el-input v-model="channelAccount.apiKey" readonly :disabled="disableInput" placeholder="Please enter the api key" @focus="handleFocusEvent" />
        </el-form-item>
        <el-form-item label="Secret Key">
          <el-input v-model="channelAccount.password" type="password" readonly :disabled="disableInput" placeholder="Please enter the secret key" @focus="handleFocusEvent" />
        </el-form-item>
        <el-form-item label="Fee Mode">
          <el-select v-model="channelAccount.feeMode" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(val,key) in feeModes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Order Validity Time(Minutes)">
          <el-input v-model="channelAccount.validTime" :disabled="disableInput" placeholder="Please enter the order validity time (Example: 720)" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="channelAccount.status" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="JSON Field">
          <el-input
            v-model="channelAccount.fileds"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="disableInput"
            placeholder="Please enter a JSON value"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmDictionary">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, getChannelAccounts, updateChannelAccount, addChannelAccount } from '@/api/channelAccount'

const defaultRole = {
  id: null,
  category: null,
  businessCode: '',
  channelCode: '',
  settlementCurrency: '',
  transactionMode: null,
  accountName: '',
  accountNo: '',
  apiKey: '',
  password: '',
  remark: '',
  feeMode: '',
  validTime: '',
  status: null,
  fileds: ''
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
    }
  },
  data() {
    return {
      channelAccount: Object.assign({}, defaultRole),
      queryForm: {
        businessCode: '',
        channelCode: '',
        remark: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      channelAccountList: [],
      businessCodes: {},
      channelCodes: {},
      transactionModes: {},
      categories: {},
      feeModes: {},
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: '',
      disableInput: true,
      checkStrictly: false,
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
    this.getChannelAccounts()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.businessCodes = data.BUSINESS_CODE
      this.channelCodes = data.CHANNEL_CODE
      this.transactionModes = data.TRANSACTION_MODE
      this.feeModes = data.FEE_MODE
      this.categories = data.BUSINESS_CATEGORY
    },
    async getChannelAccounts(query) {
      this.loading = true
      const { data } = await getChannelAccounts(query)
      this.channelAccountList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.channelAccount = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Channel Account'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getChannelAccounts(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Channel Account'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelAccount = deepClone(scope.row)
      this.channelAccount.category = this.channelAccount.category + ''
      this.channelAccount.feeMode = this.channelAccount.feeMode + ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Channel Account'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelAccount = deepClone(scope.row)
      this.channelAccount.category = this.channelAccount.category + ''
      this.channelAccount.feeMode = this.channelAccount.feeMode + ''
    },
    async confirmDictionary() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateChannelAccount(this.channelAccount)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The channel account update success !'
        })
      } else {
        const { data } = await addChannelAccount(this.channelAccount)
        this.dialogVisible = false
        this.channelAccount.id = data.id
        this.$message({
          type: 'success',
          message: 'The channel account add success !'
        })
      }
      this.getChannelAccounts()
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
