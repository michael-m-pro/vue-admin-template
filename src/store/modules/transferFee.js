import { init, addTransferFee, deleteTransferFee, getTransferFees, updateTransferFee } from '@/api/transferFee'

const actions = {
  addTransferFee(data) {
    return new Promise((resolve, reject) => {
      addTransferFee(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateTransferFee(data) {
    return new Promise((resolve, reject) => {
      updateTransferFee(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteTransferFee(data) {
    return new Promise((resolve, reject) => {
      deleteTransferFee(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTransferFees(data) {
    return new Promise((resolve, reject) => {
      getTransferFees(data).then(response => {
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
