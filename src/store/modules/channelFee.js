import { init, addChannelFee, deleteChannelFee, getChannelFees, updateChannelFee } from '@/api/channelFee'

const actions = {
  addChannelFee(data) {
    return new Promise((resolve, reject) => {
      addChannelFee(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateChannelFee(data) {
    return new Promise((resolve, reject) => {
      updateChannelFee(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteChannelFee(data) {
    return new Promise((resolve, reject) => {
      deleteChannelFee(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getChannelFees(data) {
    return new Promise((resolve, reject) => {
      getChannelFees(data).then(response => {
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
