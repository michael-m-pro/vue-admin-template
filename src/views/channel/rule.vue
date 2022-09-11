<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-select v-model="queryForm.channelAccountId" clearable placeholder="Channel Account">
            <el-option
              v-for="(val,key) in channelAccountMap"
              :key="key"
              :label="`${val.remark} - ${businessCodes[val.businessCode].name} - ${val.accountNo}`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.category" clearable placeholder="Business Category">
            <el-option
              v-for="(val,key) in categories"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
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
              :label="`${val.name}(${val.value})`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Rule</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="channelRuleList" style="width:100%;margin-top:10px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="UID" width="200">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Account Id" width="200">
        <template slot-scope="scope">
          {{ channelAccountMap[scope.row.channelAccountId].remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Anonymous" width="200">
        <template slot-scope="scope">
          {{ anonymousMap[scope.row.anonymous] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Bisiness Code" width="200">
        <template slot-scope="scope">
          {{ businessCodes[scope.row.businessCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Channel Code" width="200">
        <template slot-scope="scope">
          {{ channelCodes[scope.row.channelCode].name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Float Value" width="200">
        <template slot-scope="scope">
          {{ scope.row.floatValue }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
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
      <el-form :model="channelRule" label-width="180px" label-position="right">
        <el-input v-model="channelRule.id" class="hidden" />
        <el-form-item label="UID">
          <el-input v-model="channelRule.uid" :disabled="disableInput" placeholder="Please enter the user id" />
        </el-form-item>
        <el-form-item label="Channel Account">
          <el-select v-model="channelRule.channelAccountId" :disabled="disableInput" style="width:450" placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelAccountMap"
              :key="key"
              :label="`${val.remark} - ${businessCodes[val.businessCode].name} - ${val.accountNo}`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Business Category">
          <el-select v-model="channelRule.category" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(val,key) in categories"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Business Code">
          <el-select v-model="channelRule.businessCode" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(val,key) in businessCodes"
              :key="key"
              :label="val.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Code">
          <el-select v-model="channelRule.channelCode" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(val,key) in channelCodes"
              :key="key"
              :label="`${val.name}(${val.value})`"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Currency">
          <el-input v-model="channelRule.channelCurrency" :disabled="disableInput" placeholder="Please enter the channel currency" />
        </el-form-item>
        <el-form-item label="Float Value">
          <el-input v-model="channelRule.floatValue" :disabled="disableInput" placeholder="Please enter the float value" />
        </el-form-item>
        <el-form-item label="Anonymous">
          <el-select v-model="channelRule.anonymous" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="(val,key) in anonymousMap"
              :key="key"
              :label="val"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="channelRule.status" :disabled="disableInput" placeholder="Please Select">
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
            v-model="channelRule.fileds"
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
import { addChannelRule, updateChannelRule, getChannelRules, init } from '@/api/channelRule'

const defaultRole = {
  id: null,
  uid: null,
  category: null,
  channelAccountId: null,
  businessCode: '',
  channelCode: '',
  channelCurrency: '',
  floatValue: null,
  anonymous: '',
  status: '',
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
      channelRule: Object.assign({}, defaultRole),
      queryForm: {
        channelAccountId: '',
        category: '',
        channelCode: '',
        businessCode: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      channelRuleList: [],
      businessCodes: {},
      channelCodes: {},
      categories: {},
      channelAccountMap: {},
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      anonymousMap: {
        1: 'Yes',
        2: 'No'
      },
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
    this.getChannelRules()
  },
  methods: {
    async init() {
      const { data } = await init()
      this.businessCodes = data.BUSINESS_CODE
      this.channelCodes = data.CHANNEL_CODE
      this.categories = data.BUSINESS_CATEGORY
      this.channelAccountMap = data.SYS_CHANNEL_ACCOUNT_MAP
    },
    async getChannelRules(query) {
      this.loading = true
      const { data } = await getChannelRules(query)
      this.channelRuleList = data.list
      this.total = data.page.total
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.channelRule = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Channel Rule'
      this.dialogVisible = true
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getChannelRules(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Channel Rule'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelRule = deepClone(scope.row)
      this.channelRule.channelAccountId = this.channelRule.channelAccountId + ''
      this.channelRule.category = this.channelRule.category + ''
      this.channelRule.anonymous = this.channelRule.anonymous + ''
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Channel Rule'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.channelRule = deepClone(scope.row)
      this.channelRule.channelAccountId = this.channelRule.channelAccountId + ''
      this.channelRule.category = this.channelRule.category + ''
      this.channelRule.anonymous = this.channelRule.anonymous + ''
    },
    async confirmDictionary() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateChannelRule(this.channelRule)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The channel rule update success !'
        })
      } else {
        const { data } = await addChannelRule(this.channelRule)
        this.dialogVisible = false
        this.channelRule.id = data.id
        this.$message({
          type: 'success',
          message: 'The channel rule add success !'
        })
      }
      this.getChannelRules()
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
