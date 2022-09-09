import { addDictionary, deleteDictionary, getDictionaries, updateDictionary } from '@/api/dictionary'

const actions = {
  // add organization
  addCurrency(data) {
    return new Promise((resolve, reject) => {
      addDictionary(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateCurrency(data) {
    return new Promise((resolve, reject) => {
      updateDictionary(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteCurrency(data) {
    return new Promise((resolve, reject) => {
      deleteDictionary(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDictionaries(data) {
    return new Promise((resolve, reject) => {
      getDictionaries(data).then(response => {
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
