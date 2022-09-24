import { init, addPayOrder, deletePayOrder, getPayOrders, updatePayOrder } from '@/api/channelOrder'

const actions = {
  addPayOrder(data) {
    return new Promise((resolve, reject) => {
      addPayOrder(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updatePayOrder(data) {
    return new Promise((resolve, reject) => {
      updatePayOrder(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deletePayOrder(data) {
    return new Promise((resolve, reject) => {
      deletePayOrder(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPayOrders(data) {
    return new Promise((resolve, reject) => {
      getPayOrders(data).then(response => {
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
