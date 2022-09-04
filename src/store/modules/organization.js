import { addOrganization, getOrganizations } from '@/api/organization'

const actions = {
// user add GA
  addOrganization(data) {
    return new Promise((resolve, reject) => {
      addOrganization(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateOrganization(data) {
    return new Promise((resolve, reject) => {
      addOrganization(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteOrganization(data) {
    return new Promise((resolve, reject) => {
      addOrganization(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getOrganizations(data) {
    return new Promise((resolve, reject) => {
      getOrganizations(data).then(response => {
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
