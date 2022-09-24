import { init, addAccountInfo, deleteAccountInfo, getAccountInfos, updateAccountInfo } from '@/api/fundingAccount'

const actions = {
  addAccountInfo(data) {
    return new Promise((resolve, reject) => {
      addAccountInfo(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateAccountInfo(data) {
    return new Promise((resolve, reject) => {
      updateAccountInfo(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteAccountInfo(data) {
    return new Promise((resolve, reject) => {
      deleteAccountInfo(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getAccountInfos(data) {
    return new Promise((resolve, reject) => {
      getAccountInfos(data).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  init(data) {
    return new Promise((resolve, reject) => {
      init(data).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  actions
}
