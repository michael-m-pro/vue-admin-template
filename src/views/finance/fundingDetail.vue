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
          <el-input v-model="queryForm.businessNo" clearable style="width:230px" placeholder="Business Order No" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <!-- <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add AccountDetail</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="accountDetailList" style="width:100%;margin-top:30px;" border>
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
      <el-table-column align="center" fixed label="Business No" width="210">
        <template slot-scope="scope">
          {{ scope.row.businessNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Account No" width="200">
        <template slot-scope="scope">
          {{ scope.row.accountNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Business Code" width="200">
        <template slot-scope="scope">
          {{ scope.row.businessCode }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Sub Business No" width="210">
        <template slot-scope="scope">
          {{ scope.row.subBusinessNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Currency" width="90">
        <template slot-scope="scope">
          {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Amount" width="200">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Balance" width="200">
        <template slot-scope="scope">
          {{ scope.row.balance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="category" width="300">
        <template slot-scope="scope">
          {{ categories[scope.row.category+''].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Funding Type" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.feeFlag | typeTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Create Time" width="200">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" fixed="right" label="Operations" width="200">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="danger" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, addAccountDetail, getAccountDetails, updateAccountDetail } from '@/api/fundingDetail'

const defaultRole = {
  id: null,
  uid: '',
  accountNo: '',
  businessCode: '',
  businessNo: '',
  subBusinessNo: '',
  currency: '',
  amount: '',
  balance: '',
  category: null,
  feeFlag: null,
  updateTime: null
}

export default {
  components: { Pagination },
  filters: {
    typeTextFilter(status) {
      const textMap = {
        0: 'Transfer Amount',
        1: 'Service Charge',
        2: 'Channel Service Charge'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      accountDetail: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        uid: '',
        businessNo: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      accountDetailList: [],
      categories: {},
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
    this.getAccountDetails()
  },
  methods: {
    async init() {
      this.loading = true
      const { data } = await init()
      this.categories = data.FUNDING_ACCOUNT_CATEGORY
    },
    async getAccountDetails(query) {
      this.loading = true
      const { data } = await getAccountDetails(query)
      this.accountDetailList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.accountDetail = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New AccountDetail'
      this.dialogVisible = true
      this.addSubset = false
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getAccountDetails(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View AccountDetail'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.accountDetail = deepClone(scope.row)
      this.accountDetail.category = this.accountDetail.category + ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit AccountDetail'
      this.disableInput = true
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.accountDetail = deepClone(scope.row)
      this.addSubset = false
      this.accountDetail.category = this.accountDetail.category + ''
    },
    async confirmAccountDetail() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateAccountDetail(this.accountDetail)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The parameter update success !'
        })
      } else {
        const { data } = await addAccountDetail(this.accountDetail)
        this.dialogVisible = false
        this.accountDetail.id = data.id
        this.$message({
          type: 'success',
          message: 'The parameter add success !'
        })
      }
      this.getAccountDetails()
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
