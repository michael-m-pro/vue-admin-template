import { asyncRoutes, constantRoutes, exceptionRoutes } from '@/router'
import { getRoutes } from '@/api/user'
import Layout from '@/layout/index'

/**
* Use meta.role to determine if the current user has permission
* @param roles
* @param route
*/
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function generateMenus(routes, data, is_children = false) {
  data.forEach(item => {
    const menu = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : resolve => require([`@/views/${item.component}`], resolve),
      name: item.name,
      meta: item.meta
    }
    if (is_children === false) {
      menu.children = []
      menu.redirect = item.redirect
    }
    if (item.children && is_children === false) {
      generateMenus(menu.children, item.children, true)
    }
    routes.push(menu)
  })
}

/**
* Filter asynchronous routing tables by recursion
* @param routes asyncRoutes
* @param roles
*/
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      getRoutes().then(res => {
        Object.assign(loadMenuData, res.data)
        const tmpAsyncRoutes = Object.assign([], asyncRoutes)
        generateMenus(tmpAsyncRoutes, loadMenuData)
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = tmpAsyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(tmpAsyncRoutes, roles)
        }
        accessedRoutes = accessedRoutes.concat(exceptionRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
