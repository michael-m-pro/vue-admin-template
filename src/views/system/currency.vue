<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.code" style="width:230px" placeholder="Currency Code" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Currency</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="currencyList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Code" width="200">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="symbol" width="200">
        <template slot-scope="scope">
          {{ scope.row.symbol }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Create Time" width="200">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Update Time" width="200">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operations" width="300">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="currency" label-width="120px" label-position="right">
        <el-input v-model="currency.id" class="hidden" />
        <el-form-item label="Code">
          <el-input v-model="currency.code" :disabled="disableInput" placeholder="Please enter currency code" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="currency.name" :disabled="disableInput" placeholder="Please enter the currency name" />
        </el-form-item>
        <el-form-item label="Symbol">
          <el-input v-model="currency.symbol" :disabled="disableInput" placeholder="Please enter the symbol" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="currency.status" :disabled="disableInput" placeholder="Please Select">
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
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmCurrency">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { addCurrency, getCurrencies, updateCurrency } from '@/api/currency'

const defaultRole = {
  id: null,
  code: null,
  name: '',
  status: null,
  createTime: '',
  updateTime: ''
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
      currency: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        code: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      currencyList: [],
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
    routesData() {
      return this.routes
    }
  },
  created() {
    this.actions = this.storage(this.$route.name)
    this.getCurrencies()
  },
  methods: {
    async getCurrencies(query) {
      this.loading = true
      const { data } = await getCurrencies(query)
      this.currencyList = data.list
      this.total = data.page.total
      this.loading = false
    },
    changeOrganizationType(val) {
      this.organizationType = val
    },
    handleAdd() {
      this.disableInput = false
      this.currency = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Currency'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getCurrencies(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Currency'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.currency = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Currency'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.currency = deepClone(scope.row)
    },
    async confirmCurrency() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateCurrency(this.currency)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The currency update success !'
        })
      } else {
        const { data } = await addCurrency(this.currency)
        this.dialogVisible = false
        this.currency.id = data.id
        this.$message({
          type: 'success',
          message: 'The currency add success !'
        })
      }
      this.getCurrencies()
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
