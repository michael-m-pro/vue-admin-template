import { init, addChannelAccount, deleteChannelAccount, getChannelAccounts, updateChannelAccount } from '@/api/channelAccount'

const actions = {
  addChannelAccount(data) {
    return new Promise((resolve, reject) => {
      addChannelAccount(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateChannelAccount(data) {
    return new Promise((resolve, reject) => {
      updateChannelAccount(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteChannelAccount(data) {
    return new Promise((resolve, reject) => {
      deleteChannelAccount(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getChannelAccounts(data) {
    return new Promise((resolve, reject) => {
      getChannelAccounts(data).then(response => {
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
