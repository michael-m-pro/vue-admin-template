<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-input v-model="queryForm.pageNum" class="hidden" />
        <el-input v-model="queryForm.pageSize" class="hidden" />
        <el-form-item label="">
          <el-input v-model="queryForm.roleName" placeholder="Role Name" />
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" style="align:right" @click="handleAddRole">Add Role</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="rolesList" style="width: 100%;margin-top:20px;" border>
      <el-table-column align="center" label="Role Id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.memo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button v-show="showButton('Delete',actions)" type="danger" size="small" :disabled="!scope.row.status" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleQuery" />

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.roleName" :disabled="disableInput" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.memo"
            :autosize="{ minRows: 2, maxRows: 4}"
            :disabled="disableInput"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="levelPath"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" :class="{'hidden':disableInput}" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" :class="{'hidden':disableInput}" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, getRoutesByRUI, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  id: '',
  levelPath: '',
  checkedKeys: [],
  roleName: '',
  memo: '',
  routes: []
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
    }
  },
  data() {
    return {
      queryForm: {
        roleName: '',
        pageNum: '',
        pageSize: ''
      },
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      actions: [],
      dialogVisible: false,
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
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
    this.actions = this.storage(this.$route.name)
  },
  methods: {
    async getRoutes() {
      const { data } = await getRoutes()
      this.serviceRoutes = data
      this.routes = this.generateRoutes(data)
    },
    async getRoles(query) {
      this.loading = true
      const { data } = await getRoles(query)
      this.loading = false
      this.rolesList = data.list
      this.total = data.page.total
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        var onlyOneShowingChild = false
        if (route.path === basePath) {
          onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        }

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          id: route.id,
          levelPath: route.levelPath,
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleQuery() {
      this.queryForm.pageNum = this.listQuery.page
      this.queryForm.pageSize = this.listQuery.limit
      this.getRoles(this.queryForm)
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.disableInput = false
      this.dialogVisible = true
      this.dialogTitle = 'Add Role'
    },
    handleView(scope) {
      this.dialogType = 'view'
      this.dialogTitle = 'View Role'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.getRoleRoutes()
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogTitle = 'Edit Role'
      this.disableInput = false
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.getRoleRoutes()
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to delete the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        console.log('row==>', row)
        if (row.status !== 1) {
          this.$message({
            type: 'info',
            message: 'The current role has been deleted !'
          })
          return
        }
        await deleteRole(row)
        await this.getRoles()
        this.$message({
          type: 'success',
          message: 'Delete succed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    getRoleRoutes() {
      return new Promise((resolve) => {
        getRoutesByRUI(this.role.id).then(response => {
          const { data } = response
          const routes = this.generateRoutes(data)
          console.log('routes==', routes)
          var attr = this.generateArr(routes)
          this.$refs.tree.setCheckedNodes(attr)
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
          resolve(data)
        })
      })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      var menuIds = []
      checkedKeys.forEach(element => {
        element = element.replace('0-', '')
        var mids = element.split('-')
        menuIds = menuIds.concat(mids)
      })
      menuIds = [...new Set(menuIds.sort())]
      this.role.checkedKeys = menuIds
      if (isEdit) {
        await updateRole(this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].levelPath === this.role.levelPath) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.id = data.id
        this.rolesList.push(this.role)
      }

      const { memo, id, roleName } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${id}</div>
            <div>Role Name: ${roleName}</div>
            <div>Description: ${memo}</div>
          `,
        type: 'success'
      })
      this.getRoles(this.queryForm)
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
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
