import { init, getApiOrders } from '@/api/apiOrder'

const actions = {
  getApiOrders(data) {
    return new Promise((resolve, reject) => {
      getApiOrders(data).then(response => {
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
