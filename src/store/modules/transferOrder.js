import { init, getTransferOrders, getTransferOrder, preReview, review } from '@/api/transferOrder'

const actions = {
  preReview(data) {
    return new Promise((resolve, reject) => {
      preReview(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  review(data) {
    return new Promise((resolve, reject) => {
      review(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTransferOrders(data) {
    return new Promise((resolve, reject) => {
      getTransferOrders(data).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTransferOrder(data) {
    return new Promise((resolve, reject) => {
      getTransferOrder(data).then(response => {
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
