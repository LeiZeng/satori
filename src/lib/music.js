export default {
  player: null,
  players: [],
  musicFolder: './music/',
  init() {
    if (!this.player) {
      this.player = global.document.createElement('audio')
      this.player.autoplay = false
      global.document.body.appendChild(this.player)
    }
  },
  load(fileName) {
    var self = this
    return new Promise(function (resolve, reject) {
      var player = {}
      if (self.players.find(item => item._fileName === fileName)) {
        self.player.src = self.musicFolder + fileName
        self.player.load()
        return resolve(self)
      }
      player._fileName = fileName
      self.player.oncanplay = function () {
        player.ready = true
        resolve(self)
      }
      self.player.src = self.musicFolder + fileName
      self.players.push(player)
    })
  },
  play() {
    this.player.play()
  }
}
