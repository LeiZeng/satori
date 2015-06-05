export default {
  /**
   *   options: { eventType: callback }
   */
  bind(options) {
    Object.keys(options).map(eventType => {
      document.addEventListener(eventType, function (event) {
        options[eventType].call(this, event)
      }, false)
    })
  }
}
