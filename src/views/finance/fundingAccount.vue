<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.uid" clearable style="width:230px" placeholder="uid" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.currency" clearable style="width:230px" placeholder="Curreny" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <!-- <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add AccountInfo</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="accountInfoList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="uid" width="200">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Account No" width="200">
        <template slot-scope="scope">
          {{ scope.row.accountNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Currency" width="200">
        <template slot-scope="scope">
          {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Balance" width="200">
        <template slot-scope="scope">
          {{ scope.row.balance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="category" width="400">
        <template slot-scope="scope">
          {{ categories[scope.row.category+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Create Time" width="200">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operations" width="200">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="danger" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="accountInfo" label-width="120px" label-position="right">
        <el-input v-model="accountInfo.id" class="hidden" />
        <el-form-item label="uid">
          <el-input v-model="accountInfo.uid" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Account No">
          <el-input v-model="accountInfo.accountNo" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Currency">
          <el-input v-model="accountInfo.currency" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Balance">
          <el-input v-model="accountInfo.balance" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="accountInfo.status" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="accountInfo.category" :disabled="disableInput||addSubset" style="width:50%" placeholder="Please Select">
            <el-option
              v-for="(val,key) in categories"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="JSON Field">
          <el-input
            v-model="accountInfo.fields"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="disableInput"
            placeholder="Please enter a JSON value"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmAccountInfo">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, addAccountInfo, getAccountInfos, updateAccountInfo } from '@/api/fundingAccount'

const defaultRole = {
  id: null,
  uid: '',
  accountNo: '',
  currency: '',
  balance: '',
  status: null,
  category: null,
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
        0: 'AccountInfo',
        1: 'Parameters'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      accountInfo: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        uid: '',
        currency: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      accountInfoList: [],
      categories: {},
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      dictTypes: [
        { 'key': 0, 'label': 'AccountInfo' },
        { 'key': 1, 'label': 'Parameters' }
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
    this.getAccountInfos()
  },
  methods: {
    async init() {
      this.loading = true
      const { data } = await init()
      this.categories = data.FUNDING_ACCOUNT_CATEGORY
    },
    async getAccountInfos(query) {
      this.loading = true
      const { data } = await getAccountInfos(query)
      this.accountInfoList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.accountInfo = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New AccountInfo'
      this.dialogVisible = true
      this.addSubset = false
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getAccountInfos(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View AccountInfo'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.accountInfo = deepClone(scope.row)
      this.accountInfo.category = this.accountInfo.category + ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit AccountInfo'
      this.disableInput = true
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.accountInfo = deepClone(scope.row)
      this.addSubset = false
      this.accountInfo.category = this.accountInfo.category + ''
    },
    async confirmAccountInfo() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateAccountInfo(this.accountInfo)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The parameter update success !'
        })
      } else {
        const { data } = await addAccountInfo(this.accountInfo)
        this.dialogVisible = false
        this.accountInfo.id = data.id
        this.$message({
          type: 'success',
          message: 'The parameter add success !'
        })
      }
      this.getAccountInfos()
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
