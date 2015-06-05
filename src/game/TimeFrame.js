// let actionsPool = {}

export default {
  bind(action, time) {
    // actionsPool.push({
    //   global.setTimeout(action, time): action
    // })
    global.setTimeout(action, time)
  },
  remove(action) {
    Object.keys(actionsPool).some(item => {
      if (actionsPool[item] === action) {
        global.clearTimeout(actionsPool[item])
        delete actionsPool[item]
        return true
      }
    })
  }
}
