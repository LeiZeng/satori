import PIXI from 'pixi.js'
import _ from 'lodash'

const defaultOpts = {
  height: 20,
  width: 80,
  speed: 8,
  maxY: 550
}
const drawNote = function drawNote(opts) {
  var note = new PIXI.Graphics()
  note.bounds = new PIXI.Rectangle(0,0,opts.width,opts.height)
  note.boundsPadding = 0
  note.beginFill(opts.color || 0xffffff, opts.alpha || 1)
  note.drawRect(0, 0, opts.width, opts.height)
  note.endFill()
  return note.generateTexture()
}
class Note extends PIXI.Sprite {
  constructor(opts) {
    opts = _.merge(defaultOpts, opts)
    super(drawNote(opts))
    this.opts = opts
    this.actived = false
    this.x = opts.x || 0
    this.y = opts.y || 0
    this.startTime = new Date().getTime()
    this.dropTo(this.opts.maxY, () => {
      this.parent && this.parent.removeChild(this)
    })
  }
  dropTo(y, cb) {
    if (!this.doneDroped && this.y >= y) {
      cb.call(this)
      this.doneDroped = true
    }
  }
  move() {
    this.y += this.opts.speed
  }
}

export default Note
