import { init, addAccountDetail, deleteAccountDetail, getAccountDetails, updateAccountDetail } from '@/api/fundingDetail'

const actions = {
  addAccountDetail(data) {
    return new Promise((resolve, reject) => {
      addAccountDetail(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateAccountDetail(data) {
    return new Promise((resolve, reject) => {
      updateAccountDetail(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteAccountDetail(data) {
    return new Promise((resolve, reject) => {
      deleteAccountDetail(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getAccountDetails(data) {
    return new Promise((resolve, reject) => {
      getAccountDetails(data).then(response => {
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
