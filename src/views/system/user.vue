<template>
  <div class="app-container">
    <div v-if="userType<2" class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.userName" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.userType" clearable placeholder="Select">
            <el-option
              v-for="item in userTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add User</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="userList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="User Id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="User Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Type" width="220">
        <template slot-scope="{row}">
          {{ row.userType | userTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role" width="220">
        <template slot-scope="{row}">
          {{ roles[row.roleId] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="memo" width="220">
        <template slot-scope="scope">
          {{ scope.row.memo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Create Time" width="220">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="560" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button v-show="showButton('Delete',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Delete</el-button>
          <el-button v-show="showButton('ResetGA',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="resetGA(scope)">Reset GA</el-button>
          <el-button v-if="scope.row.userType>=2" v-show="showButton('CreateApiKey',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleApiKey(scope)">Api Key</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="user" label-width="100px" label-position="right">
        <el-input v-model="user.id" class="hidden" />
        <el-form-item label="Name">
          <el-input v-model="user.userName" :disabled="disableInput" placeholder="Please enter user name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="user.email" :disabled="disableInput" placeholder="Please enter email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="user.password" :disabled="disableInput" placeholder="If you want to change the password, please enter a new password, otherwise keep it blank" />
        </el-form-item>
        <el-form-item label="Company">
          {{ companies.key }}
          <el-select v-model="user.companyId" clearable :disabled="disableInput" placeholder="Please Select" @change="changeCompany">
            <el-option
              v-for="(value, key) in companies"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Department">
          <el-select v-model="user.deptId" clearable :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in departmentSubs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="User Role">
          <el-select v-model="user.roleId" clearable :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(val,key) in roles"
              :key="key"
              :label="val"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="User Type">
          <el-select v-model="user.userType" clearable :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in userTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="user.status" clearable :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="user.userType<2" label="Gender">
          <el-select v-model="user.gender" clearable :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in genderList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="user.phone" :disabled="disableInput" placeholder="Please enter phone number" />
        </el-form-item>
        <el-form-item label="Memo">
          <el-input
            v-model="user.memo"
            :disabled="disableInput"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="User Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="apiDialogVisible" title="Api Key">
      <el-form :model="user" label-width="200px" label-position="right">
        <el-input v-model="merchantApi.id" class="hidden" />
        <el-input v-model="merchantApi.uid" class="hidden" />
        <el-form-item v-if="merchantApi.id" label="Key">
          <el-tag type="success" style="font-size:20px">
            {{ merchantApi.apiKey }}
          </el-tag>
          <el-button v-show="showButton('ResetApiKey',actions)" type="primary" style="margin-left:20px" @click="resetApiKey">Reset ApiKey</el-button>
        </el-form-item>
        <el-form-item label="Receive">
          OFF <el-switch
            v-model="merchantApi.enableReceive"
            :active-value="1"
            :inactive-value="0"
          /> ON
        </el-form-item>
        <el-form-item>
          <el-tag type="info">With this option turned on, you can use the api interface to collect payments from your customers</el-tag>
        </el-form-item>
        <el-form-item label="Payout">
          OFF <el-switch
            v-model="merchantApi.enablePayment"
            :active-value="1"
            :inactive-value="0"
          /> ON
        </el-form-item>
        <el-form-item>
          <el-tag type="info">With this option turned on, you can use the api interface to make payments to your customers</el-tag>
        </el-form-item>
        <el-form-item label="IP Address Whitelist">
          <el-input
            v-model="merchantApi.acessIp"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Limit account access by IP address. You can provide one or more IP addresses.Example: 192.168.0.1 or 192.168.0.1,192.168.0.2"
          />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="apiDialogVisible=false">Cancel</el-button>
        <el-button v-if="!merchantApi.id" v-show="showButton('CreateApiKey',actions)" type="primary" @click="confirmApiKey">Create ApiKey</el-button>
        <el-button v-if="merchantApi.id" v-show="showButton('UpdateApiKey',actions)" type="primary" @click="updateApiKey">Update ApiKey</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, getUsers, addUser, updateUser, deleteUser, resetGA, createApiKey, getApiKey, resetApiKey, updateApiKey } from '@/api/user'

const defaultRole = {
  id: '',
  userName: '',
  userType: '',
  status: null,
  gender: null,
  password: '',
  secret: '',
  deptId: '',
  companyId: '',
  roleId: '',
  email: '',
  phone: '',
  memo: ''
}

const defaultMerchantApi = {
  id: null,
  companyId: null,
  uid: null,
  apiKey: '',
  status: '',
  enableReceive: 0,
  enablePayment: 0,
  allowIp: ''
}

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      const textMap = {
        1: 'Normal',
        0: 'Disable'
      }
      return textMap[status]
    },
    userTypeFilter(status) {
      const textMap = {
        0: 'Administrator',
        1: 'Administrator',
        2: 'Merchant'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      user: Object.assign({}, defaultRole),
      merchantApi: Object.assign({}, defaultMerchantApi),
      queryForm: {
        userName: '',
        userType: null,
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      userList: [],
      userType: null,
      departments: {},
      departmentSubs: {},
      companies: {},
      roles: {},
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      genderList: [
        { 'key': 0, 'label': 'Male' },
        { 'key': 1, 'label': 'Female' }
      ],
      userTypes: [
        { 'key': 1, 'label': 'Administrator' },
        { 'key': 2, 'label': 'Merchant' }
        // { 'key': 3, 'label': 'Sub-Merchant' }
      ],
      dialogVisible: false,
      apiDialogVisible: false,
      dialogType: 'new',
      dialogTitle: 'New User',
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
    // console.log('actions', this.actions)
    this.init()
    this.getUsers()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.companies = data.COMPANY_MAP
      this.departments = data.DEPARTMENT_MAP
      this.roles = data.ROLE_MAP
      this.userType = data.userType
    },
    async getUsers(query) {
      this.loading = true
      const { data } = await getUsers(query)
      this.userList = data.list
      this.total = data.page.total
      this.loading = false
    },
    changeCompany(val) {
      this.departmentSubs = this.departments[val]
    },
    handleAdd() {
      this.disableInput = false
      this.user = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New User'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getUsers(this.queryForm)
    },
    handleView(scope) {
      console.log(JSON.stringify(this.genderList))
      this.dialogTitle = 'View User'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
      this.user.companyId = this.user.companyId + ''
      this.departmentSubs = this.departments[this.user.companyId]
      this.user.roleId = this.user.roleId + ''
      this.user.password = ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit User'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
      this.departmentSubs = this.departments[this.user.companyId]
      this.user.companyId = this.user.companyId + ''
      this.user.roleId = this.user.roleId + ''
      this.user.password = ''
    },
    handleDelete({ $index, row }) {
      this.user.id = row.id
      this.$confirm('Confirm to delete the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(this.user)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getUsers(this.queryForm)
        })
    },
    handleApiKey(scope) {
      this.user = deepClone(scope.row)
      this.merchantApi.uid = this.user.id
      this.merchantApi.companyId = this.user.companyId
      this.apiDialogVisible = true
      this.getApiKey(this.merchantApi)
    },
    resetGA(scope) {
      this.user = deepClone(scope.row)
      this.$confirm('After reset, you can bind a new GA! Confirm to reset the GA?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await resetGA(this.user)
          this.$message({
            type: 'success',
            message: 'The GA reseted successfully !'
          })
        })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateUser(this.user)
        this.$message({
          type: 'success',
          message: 'User updated successfully !'
        })
      } else {
        await addUser(this.user)
        this.$message({
          type: 'success',
          message: 'User added successfully !'
        })
      }
      this.dialogVisible = false
      this.getUsers(this.queryForm)
    },
    async confirmApiKey() {
      this.merchantApi.uid = this.user.id
      this.merchantApi.companyId = this.user.companyId
      console.log(this.merchantApi)
      await createApiKey(this.merchantApi)
      this.$message({
        type: 'success',
        message: 'Api Key created successfully !'
      })
      this.apiDialogVisible = false
    },
    async updateApiKey() {
      await updateApiKey(this.merchantApi)
      this.$message({
        type: 'success',
        message: 'Api Key up successfully !'
      })
      this.getApiKey(this.merchantApi)
    },
    resetApiKey() {
      this.$confirm('This operation will reset your api key,Confirm to reset it ?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await resetApiKey(this.merchantApi)
          this.$message({
            type: 'success',
            message: 'Api Key reseted successfully !'
          })
          this.getApiKey(this.merchantApi)
        })
    },
    async getApiKey(query) {
      const { uid, companyId } = query
      const { data } = await getApiKey({ 'uid': uid, 'companyId': companyId })
      if (data) {
        this.merchantApi = data
      } else {
        this.merchantApi = defaultMerchantApi
      }
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
