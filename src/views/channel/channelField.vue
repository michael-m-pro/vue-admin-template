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
          <el-select v-model="queryForm.type" placeholder="Owner Type">
            <el-option
              v-for="item in ownerTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.currency" style="width:230px" placeholder="Currency" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Channel Field</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="channelFieldList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="Business Code" width="200">
        <template slot-scope="scope">
          {{ businessCodes[scope.row.businessCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodes[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Owner Type" width="200">
        <template slot-scope="scope">
          {{ scope.row.ownerType }}
          {{ scope.row.ownerType | ownerTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Currency" width="200">
        <template slot-scope="scope">
          {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="channelField" label-width="120px" label-position="right">
        <el-input v-model="channelField.id" class="hidden" />
        <el-form-item label="Business Code">
          <el-select v-model="channelField.businessCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in businessCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-select v-model="channelField.channelCode" :disabled="disableInput" clearable placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Owner Type">
          <el-select v-model="channelField.ownerType" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in ownerTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Currency">
          <el-input v-model="channelField.currency" :disabled="disableInput" placeholder="Please enter the currency" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="channelField.status" :disabled="disableInput" placeholder="Please Select">
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
            v-model="channelField.field"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            :disabled="disableInput"
            placeholder="Please enter a JSON value"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmChannelField">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { init, addChannelField, getChannelFields, updateChannelField } from '@/api/channelField'

const defaultRole = {
  id: null,
  businessCode: '',
  channelCode: '',
  ownerType: null,
  currency: '',
  status: null,
  field: null
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
    ownerTypeFilter(type) {
      const textMap = {
        1: 'Payer',
        2: 'Payee'
      }
      return textMap[type]
    }
  },
  data() {
    return {
      channelField: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        businessCode: '',
        channelCode: '',
        ownerType: '',
        currency: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      channelFieldList: [],
      channelCodes: {},
      businessCodes: {},
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      ownerTypes: [
        { 'key': 1, 'label': 'Payer' },
        { 'key': 2, 'label': 'Payee' }
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
    this.getChannelFields()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.channelCodes = data.CHANNEL_CODE
      this.businessCodes = data.TRANSACTION_MODE
    },
    async getChannelFields(query) {
      this.loading = true
      const { data } = await getChannelFields(query)
      this.channelFieldList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.channelField = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Channel Field'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getChannelFields(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Channel Field'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelField = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Channel Field'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelField = deepClone(scope.row)
    },
    async confirmChannelField() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateChannelField(this.channelField)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The parameter update success !'
        })
      } else {
        const { data } = await addChannelField(this.channelField)
        this.dialogVisible = false
        this.channelField.id = data.id
        this.$message({
          type: 'success',
          message: 'The parameter add success !'
        })
      }
      this.getChannelFields()
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
