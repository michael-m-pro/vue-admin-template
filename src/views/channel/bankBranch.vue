<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
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
          <el-input v-model="queryForm.currency" style="width:230px" placeholder="Currency" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <!-- <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Bank Branch</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="bankBranchList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Bank Branch Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ scope.row.channelCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Location Id" width="200">
        <template slot-scope="scope">
          {{ scope.row.locationId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Bank Id" width="200">
        <template slot-scope="scope">
          {{ scope.row.bankId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Bank Branch" width="500">
        <template slot-scope="scope">
          {{ scope.row.bankBranch }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Transation Mode" width="200">
        <template slot-scope="scope">
          {{ scope.row.transactionMode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="200" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <!-- <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="bankBranch" label-width="150px" label-position="right">
        <el-input v-model="bankBranch.id" class="hidden" />
        <el-form-item label="Channel Code">
          <el-select v-model="queryForm.channelCode" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="`${val.name}(${val.value})`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Location Id">
          <el-input v-model="bankBranch.locationId" :disabled="disableInput" placeholder="Please enter the location id" />
        </el-form-item>
        <el-form-item label="Bank Id">
          <el-input v-model="bankBranch.bankId" :disabled="disableInput" placeholder="Please enter the bank id" />
        </el-form-item>
        <el-form-item label="Bank Name">
          <el-input v-model="bankBranch.bankName" :disabled="disableInput" placeholder="Please enter the bank name" />
        </el-form-item>
        <el-form-item label="Bank Branch">
          <el-input v-model="bankBranch.bankBranch" :disabled="disableInput" placeholder="Please enter the bank branch" />
        </el-form-item>
        <el-form-item label="Transaction Mode">
          <el-select v-model="bankBranch.transactionMode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in transactionModes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="bankBranch.address" :disabled="disableInput" placeholder="Please enter the address" />
        </el-form-item>
        <el-form-item label="City">
          <el-input v-model="bankBranch.city" :disabled="disableInput" placeholder="Please enter the city" />
        </el-form-item>
        <el-form-item label="State">
          <el-input v-model="bankBranch.state" :disabled="disableInput" placeholder="Please enter the state" />
        </el-form-item>
        <el-form-item label="Currency">
          <el-input v-model="bankBranch.currency" :disabled="disableInput" placeholder="Please enter the currency" />
        </el-form-item>
        <el-form-item label="Country Name">
          <el-input v-model="bankBranch.countryName" :disabled="disableInput" placeholder="Please enter the country name" />
        </el-form-item>
        <el-form-item label="Country Code">
          <el-input v-model="bankBranch.currency" :disabled="disableInput" placeholder="Please enter the country code" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="bankBranch.phone" :disabled="disableInput" placeholder="Please enter the phone" />
        </el-form-item>
        <el-form-item label="Payment Mode">
          <el-input v-model="bankBranch.paymentMode" :disabled="disableInput" placeholder="Please enter the Payment Mode" />
        </el-form-item>
        <el-form-item label="Hours Of Opertation">
          <el-input v-model="bankBranch.hoursOfOpertation" :disabled="disableInput" placeholder="Please enter the hours of opertation" />
        </el-form-item>
        <el-form-item label="Holidays">
          <el-input v-model="bankBranch.holidays" :disabled="disableInput" placeholder="Please enter the holidays" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="bankBranch.status" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmBankBranch">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, addBankBranch, getBankBranchs, updateBankBranch } from '@/api/bankBranch'

const defaultRole = {
  id: null,
  channelCode: null,
  locationId: '',
  bankId: null,
  bankName: '',
  bankBranch: '',
  transactionMode: '',
  address: '',
  city: '',
  state: '',
  currency: '',
  countryName: '',
  countryCode: '',
  hoursOfOpertation: '',
  holidays: '',
  phone: '',
  paymentMode: '',
  status: null,
  fields: ''
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
      bankBranch: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        channelCode: '',
        currency: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      bankBranchList: [],
      channelCodes: {},
      transactionModes: {},
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
    this.getBankBranchs()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.channelCodes = data.CHANNEL_CODE
      this.transactionModes = data.TRANSACTION_MODE
    },
    async getBankBranchs(query) {
      this.loading = true
      const { data } = await getBankBranchs(query)
      this.bankBranchList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.bankBranch = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New BankBranch'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getBankBranchs(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View BankBranch'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.bankBranch = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit BankBranch'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.bankBranch = deepClone(scope.row)
    },
    async confirmBankBranch() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateBankBranch(this.bankBranch)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The parameter update success !'
        })
      } else {
        const { data } = await addBankBranch(this.bankBranch)
        this.dialogVisible = false
        this.bankBranch.id = data.id
        this.$message({
          type: 'success',
          message: 'The parameter add success !'
        })
      }
      this.getBankBranchs(this.queryForm)
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
