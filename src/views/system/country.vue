<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.code" style="width:230px" placeholder="Country Code" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.name" style="width:230px" placeholder="Country Name" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Country</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="countryList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="country Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Country Code" width="200">
        <template slot-scope="scope">
          {{ scope.row.countryCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Area Code" width="200">
        <template slot-scope="scope">
          {{ scope.row.areaCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" width="300">
        <template slot-scope="scope">
          {{ scope.row.countryName }}
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
      <el-table-column align="center" fixed="right" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="country" label-width="120px" label-position="right">
        <el-input v-model="country.id" class="hidden" />
        <el-form-item label="Country Code">
          <el-input v-model="country.countryCode" :disabled="disableInput" placeholder="Please enter currency code" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="country.countryName" :disabled="disableInput" placeholder="Please enter the currency name" />
        </el-form-item>
        <el-form-item label="Area Code">
          <el-input v-model="country.areaCode" :disabled="disableInput" placeholder="Please enter the currency name" />
        </el-form-item>
        <div style="text-align:right;">
          <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
          <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmCurrency">Confirm</el-button>
        </div>
      </el-form></el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { addCountry, getCountries, updateCountry } from '@/api/country'

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
  data() {
    return {
      country: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        countryCode: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      countryList: [],
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
    this.getCountries()
  },
  methods: {
    async getCountries(query) {
      this.loading = true
      const { data } = await getCountries(query)
      this.countryList = data.list
      this.total = data.page.total
      console.log(this.total)
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.country = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Country'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getCountries(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Country'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.country = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Country'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.country = deepClone(scope.row)
    },
    async confirmCurrency() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateCountry(this.country)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The country update success !'
        })
      } else {
        const { data } = await addCountry(this.country)
        this.dialogVisible = false
        this.currency.id = data.id
        this.$message({
          type: 'success',
          message: 'The country add success !'
        })
      }
      this.getCountries()
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
