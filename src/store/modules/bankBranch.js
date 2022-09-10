import { init, addBankBranch, deleteBankBranch, getBankBranchs, updateBankBranch } from '@/api/bankBranch'

const actions = {
  addBankBranch(data) {
    return new Promise((resolve, reject) => {
      addBankBranch(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateBankBranch(data) {
    return new Promise((resolve, reject) => {
      updateBankBranch(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteBankBranch(data) {
    return new Promise((resolve, reject) => {
      deleteBankBranch(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getBankBranchs(data) {
    return new Promise((resolve, reject) => {
      getBankBranchs(data).then(response => {
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
