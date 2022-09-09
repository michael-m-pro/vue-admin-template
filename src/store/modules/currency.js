import { addCurrency, deleteCurrency, getCurrencies, updateCurrency } from '@/api/currency'

const actions = {
  // add organization
  addCurrency(data) {
    return new Promise((resolve, reject) => {
      addCurrency(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateCurrency(data) {
    return new Promise((resolve, reject) => {
      updateCurrency(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteCurrency(data) {
    return new Promise((resolve, reject) => {
      deleteCurrency(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCurrencies(data) {
    return new Promise((resolve, reject) => {
      getCurrencies(data).then(response => {
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
