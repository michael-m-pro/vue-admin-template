<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-form-item label="">
          <el-input v-model="queryForm.userName" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.userType" placeholder="Select">
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
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
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
          <el-button v-show="showButton('View',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button v-show="showButton('Delete',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Delete</el-button>
          <el-button v-show="showButton('ResetGA',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Reset GA</el-button>
          <el-button v-show="showButton('ResetApiKey',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Reset ApiKey</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
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
          <el-select v-model="user.companyId" :disabled="disableInput" placeholder="Please Select" @change="changeCompany">
            <el-option
              v-for="(value, key) in companies"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Department">
          <el-select v-model="user.deptId" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in departmentSubs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="User Type">
          <el-select v-model="user.userType" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in userTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="user.status" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Gender">
          <el-select v-model="user.gender" :disabled="disableInput" placeholder="Please Select">
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
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { init, getUsers, addUser, updateUser, deleteUser } from '@/api/user'

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
  email: '',
  phone: '',
  memo: ''
}

export default {
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
    }
  },
  data() {
    return {
      user: Object.assign({}, defaultRole),
      queryForm: {
        userName: '',
        userType: null
      },
      actions: [],
      userList: [],
      departments: {},
      departmentSubs: {},
      companies: {},
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
        { 'key': 2, 'label': 'Merchant' },
        { 'key': 3, 'label': 'Sub-Merchant' }
      ],
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: 'New User',
      disableInput: true,
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      loading: false
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
      const res = await init()
      this.companies = res.data.COMPANY_MAP
      console.log(this.companies)
      this.departments = res.data.DEPARTMENT_MAP
    },
    async getUsers(query) {
      this.loading = true
      const res = await getUsers(query)
      this.userList = res.data.list
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
      this.getUsers(this.queryForm)
    },
    handleView(scope) {
      console.log(JSON.stringify(this.genderList))
      this.dialogTitle = 'View User'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
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
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to delete the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.id)
          this.userList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getUsers()
        })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateUser(this.user)
        this.$message({
          type: 'success',
          message: 'The user update success !'
        })
      } else {
        await addUser(this.user)
        this.$message({
          type: 'success',
          message: 'The user add success !'
        })
      }
      this.dialogVisible = false
      this.getUsers()
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
