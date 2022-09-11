<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.code" style="width:300px" placeholder="Code" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.name" style="width:230px" placeholder="Name" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add Dictionary</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="dictionaryList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="Organization Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Code" fixed="left" width="300">
        <template slot-scope="scope">
          {{ scope.row.code == null?'┗':scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Type" width="200">
        <template slot-scope="scope">
          {{ scope.row.type | typeTextFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="value" width="200">
        <template slot-scope="scope">
          {{ scope.row.value }}
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
          <el-button v-show="showButton('Add',actions)" v-if="scope.row.parentId==scope.row.id" type="success" size="small" @click="handleAddSub(scope)">Add Subset</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="dictionary" label-width="120px" label-position="right">
        <el-input v-model="dictionary.id" class="hidden" />
        <el-form-item label="Display Name">
          <el-input v-model="dictionary.name" :disabled="disableInput" placeholder="Please enter the Display name" />
        </el-form-item>
        <el-form-item :class="{'hidden':addSubset||dictionary.parentId!==dictionary.id}" label="Code">
          <el-input v-model="dictionary.code" :disabled="disableInput" placeholder="Please enter the code" />
        </el-form-item>
        <el-form-item label="Value">
          <el-input v-model="dictionary.value" :disabled="disableInput" placeholder="Please enter the value" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="dictionary.type" :disabled="disableInput||addSubset" placeholder="Please Select">
            <el-option
              v-for="item in dictTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="dictionary.status" :disabled="disableInput" placeholder="Please Select">
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
            v-model="dictionary.fileds"
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
import { addDictionary, getDictionaries, updateDictionary } from '@/api/dictionary'

const defaultRole = {
  id: null,
  parentId: null,
  name: '',
  code: null,
  value: '',
  status: null,
  encrypted: null,
  type: null,
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
    },
    typeTextFilter(status) {
      const textMap = {
        0: 'Dictionary',
        1: 'Parameters'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      dictionary: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        code: '',
        name: '',
        pageNum: '',
        pageSize: ''
      },
      actions: [],
      dictionaryList: [],
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      dictTypes: [
        { 'key': 0, 'label': 'Dictionary' },
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
    this.getDictionaries()
  },
  methods: {
    async getDictionaries(query) {
      // this.loading = true
      const { data } = await getDictionaries(query)
      this.dictionaryList = data.list
      this.total = data.page.total
      // this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.dictionary = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Dictionary'
      this.dialogVisible = true
      this.addSubset = false
    },
    handleAddSub(scope) {
      this.disableInput = false
      this.dictionary = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogTitle = 'New Sub Dictionary'
      this.dialogVisible = true
      this.dictionary.type = 0
      this.addSubset = true
      this.dictionary.parentId = scope.row.id
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getDictionaries(this.queryForm)
    },
    handleView(scope) {
      this.dialogTitle = 'View Dictionary'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.dictionary = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit Dictionary'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.dictionary = deepClone(scope.row)
      this.addSubset = false
    },
    async confirmDictionary() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateDictionary(this.dictionary)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: 'The parameter update success !'
        })
      } else {
        const { data } = await addDictionary(this.dictionary)
        this.dialogVisible = false
        this.dictionary.id = data.id
        this.$message({
          type: 'success',
          message: 'The parameter add success !'
        })
      }
      this.getDictionaries(this.queryForm)
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
