import { init, addChannelField, deleteChannelField, getChannelFields, updateChannelField } from '@/api/channelField'

const actions = {
  addChannelField(data) {
    return new Promise((resolve, reject) => {
      addChannelField(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateChannelField(data) {
    return new Promise((resolve, reject) => {
      updateChannelField(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteChannelField(data) {
    return new Promise((resolve, reject) => {
      deleteChannelField(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getChannelFields(data) {
    return new Promise((resolve, reject) => {
      getChannelFields(data).then(response => {
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
