import { addCountry, deleteCountry, getCountries, updateCountry } from '@/api/country'

const actions = {
  // add organization
  addCountry(data) {
    return new Promise((resolve, reject) => {
      addCountry(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateCountry(data) {
    return new Promise((resolve, reject) => {
      updateCountry(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteCountry(data) {
    return new Promise((resolve, reject) => {
      deleteCountry(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCountries(data) {
    return new Promise((resolve, reject) => {
      getCountries(data).then(response => {
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
