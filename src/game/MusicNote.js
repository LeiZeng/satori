import PIXI from 'pixi.js'
import _ from 'lodash'
import Note from './Note'

const defaultOpts = {
  height: 600,
  width: 100,
  x: 0,
  y: 0,
  key: 0
}
const drawBackground = function drwaNote(opts) {
  var notebarBackground = new PIXI.Graphics()
  notebarBackground.bounds = new PIXI.Rectangle(opts.x,opts.y,opts.width,opts.height)
  notebarBackground.boundsPadding = 0
  notebarBackground.beginFill(opts.color || 0xffff00, opts.alpha || 0.1)
  notebarBackground.drawRect(0, 0, opts.width, opts.height)
  notebarBackground.endFill()
  return notebarBackground.generateTexture()
}
class MusicNote extends PIXI.Container {
  constructor(opts) {
    super()
    opts = _.merge(defaultOpts, opts)
    this._background = new PIXI.Sprite(drawBackground(opts))
    this.addChild(this._background)
    this.interactive = true
    this.x = opts.x || 0
    this.y = opts.y || 0
  }
  removeNotes() {
    this.children.forEach(child => {
      if (child.constructor === Note) {
        this.removeChild(child)
      }
    })
  }
}

export default MusicNote
