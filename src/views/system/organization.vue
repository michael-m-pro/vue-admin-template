<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-form-item label="">
          <el-input v-model="queryForm.name" style="width:230px" placeholder="Company/Department Name" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.level" placeholder="Type">
            <el-option
              v-for="item in organizationTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Company/Department</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="organizationList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Superior name" width="200">
        <template slot-scope="scope">
          {{ companyMap[scope.row.parentId] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Type" width="200">
        <template slot-scope="{row}">
          {{ row.level | organizationTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Manager" width="200">
        <template slot-scope="scope">
          {{ scope.row.manager }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Phone" width="200">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email" width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
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
      <el-table-column align="center" fixed="right" label="Operations" width="300">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button v-show="showButton('Delete',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="organization" label-width="120px" label-position="right">
        <el-input v-model="organization.id" class="hidden" />
        <el-form-item label="Name">
          <el-input v-model="organization.name" :disabled="disableInput" placeholder="Please enter Company/Department name" />
        </el-form-item>
        <el-form-item label="Manager">
          <el-input v-model="organization.manager" :disabled="disableInput" placeholder="Please enter the manager's name" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="organization.phone" :disabled="disableInput" placeholder="Please enter the phone" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="organization.email" :disabled="disableInput" placeholder="Please enter the email" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="organization.level" :disabled="disableInput" placeholder="Please Select" @change="changeOrganizationType">
            <el-option
              v-for="item in organizationTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="organizationType==1 || organization.level==1" label="Superior name">
          <el-select v-model="organization.parentId" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(value, key) in companyMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="organizationType == 0 || organization.level == 0" label="Registration No">
          <el-input v-model="organization.registrationNo" :disabled="disableInput" placeholder="Please enter the Registration number" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="organization.status" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="organization.address" :disabled="disableInput" placeholder="Please enter the Registration Address" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmOrganization">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addOrganization, deleteOrganization, getOrganizations, updateOrganization } from '@/api/organization'

const defaultRole = {
  id: null,
  parentId: null,
  name: '',
  manager: '',
  phone: '',
  email: '',
  status: null,
  registrationNo: '',
  companyId: null,
  country: '',
  level: null,
  address: ''
}

export default {
  filters: {
    organizationTypeFilter(type) {
      const statusMap = {
        1: 'Department',
        0: 'Company'
      }
      return statusMap[type]
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
      organization: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        name: '',
        level: null
      },
      actions: [],
      organizationList: [],
      departments: [],
      companyMap: [],
      organizationType: null,
      organizationTypes: [
        { 'key': 0, 'label': 'Company' },
        { 'key': 1, 'label': 'Department' }
      ],
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
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
    routesData() {
      return this.routes
    }
  },
  created() {
    this.actions = this.storage(this.$route.name)
    this.getOrganizations()
  },
  methods: {
    async getOrganizations(query) {
      this.loading = true
      const res = await getOrganizations(query)
      this.organizationList = res.data.list
      this.companyMap = res.data.companyMap
      this.loading = false
    },
    changeOrganizationType(val) {
      this.organizationType = val
    },
    handleAdd() {
      this.disableInput = false
      this.organization = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogTitle = 'New Company/Department'
      this.dialogVisible = true
    },
    handleQuery() {
      this.getOrganizations(this.queryForm)
    },
    handleView(scope) {
      console.log(JSON.stringify(this.genderList))
      this.dialogTitle = 'View Organization'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.organization = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Organization'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.organizationType = null
      this.organization = deepClone(scope.row)
      this.organization.parentId = this.organization.parentId + ''
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the organization?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteOrganization(row.key)
          this.organizationList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmOrganization() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateOrganization(this.organization)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The organization update success !'
        })
      } else {
        const { data } = await addOrganization(this.organization)
        this.dialogVisible = false
        this.organization.id = data.id
        this.organizationList.push(this.organization)
        this.$message({
          type: 'success',
          message: 'The organization add success !'
        })
      }
      this.getOrganizations()
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
