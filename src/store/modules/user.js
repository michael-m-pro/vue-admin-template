import { login, addGA, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

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
        console.log('login==', data)
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
    const { googleCode } = GAInfo
    return new Promise((resolve, reject) => {
      addGA({ googleCode: googleCode }).then(response => {
        resolve()
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
        console.log('==', data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { userName, avatar, userType } = data.admin
        var roles = []
        if (userType) {
          roles = ['admin']
        }

        commit('SET_NAME', userName)
        commit('SET_AVATAR', avatar)
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

