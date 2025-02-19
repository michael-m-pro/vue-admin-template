import { login, addGA, logout, getInfo, init, addUser, updateUser, deleteUser, getApiKey, createApiKey, updateApiKey, resetApiKey, queryBalance } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { storage } from '@/utils'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const defaultAvator = require('../../assets/img/default.png')

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, googleCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password, googleCode: googleCode }).then(response => {
        const { data } = response
        // console.log('login==', data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user add GA
  addGA({ commit }, GAInfo) {
    const token = getToken()
    if (!token) {
      setToken(storage('token'))
    }
    const { googleCode } = GAInfo
    return new Promise((resolve, reject) => {
      addGA({ googleCode: googleCode }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        storage('token', token)
        removeToken()
        reject(error)
      })
    })
  },
  // init
  init() {
    return new Promise((resolve, reject) => {
      init().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addUser(data) {
    return new Promise((resolve, reject) => {
      addUser(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateUser(data) {
    return new Promise((resolve, reject) => {
      updateUser(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteUser(data) {
    return new Promise((resolve, reject) => {
      deleteUser(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetGA(data) {
    return new Promise((resolve, reject) => {
      deleteUser(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getApiKey(data) {
    return new Promise((resolve, reject) => {
      getApiKey(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  queryBalance(data) {
    return new Promise((resolve, reject) => {
      queryBalance(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  createApiKey(data) {
    return new Promise((resolve, reject) => {
      createApiKey(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateApiKey(data) {
    return new Promise((resolve, reject) => {
      updateApiKey(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetApiKey(data) {
    return new Promise((resolve, reject) => {
      resetApiKey(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        // console.log('==', data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { userName, avatar, userType } = data
        var roles = []
        if (userType) {
          roles = ['admin']
        }
        if (avatar == null || String(avatar).length === 0) {
          commit('SET_AVATAR', defaultAvator)
        } else {
          commit('SET_AVATAR', avatar)
        }
        storage('userInfo', data)
        commit('SET_NAME', userName)
        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      commit('SET_ROLES', [])
      resolve()
    })
  },

  async changeRoles({

    commit, dispatch }, role) {
    const token = state.token
    commit('SET_TOKEN', token)
    setToken(token)
    const {

      roles } = await dispatch('getInfo')
    resetRouter()
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {

      root: true })
    router.addRoutes(accessRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

