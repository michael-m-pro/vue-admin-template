import { init, addChannelRule, deleteChannelRule, getChannelRules, updateChannelRule } from '@/api/channelRule'

const actions = {
  addChannelRule(data) {
    return new Promise((resolve, reject) => {
      addChannelRule(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateChannelRule(data) {
    return new Promise((resolve, reject) => {
      updateChannelRule(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteChannelRule(data) {
    return new Promise((resolve, reject) => {
      deleteChannelRule(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getChannelRules(data) {
    return new Promise((resolve, reject) => {
      getChannelRules(data).then(response => {
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
