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

const drawBarLine = function drwaNote(opts) {
  var notebarBackground = new PIXI.Graphics()
  notebarBackground.bounds = new PIXI.Rectangle(opts.x,opts.y,opts.width,opts.height)
  notebarBackground.boundsPadding = 0
  notebarBackground.lineStyle(2, 0xffffff, 1);
  notebarBackground.drawRect(opts.x,opts.y,opts.width,opts.height)
  return notebarBackground.generateTexture()
}
const drawBackground = function drwaNote(opts) {
  var notebarBackground = new PIXI.Graphics()
  notebarBackground.bounds = new PIXI.Rectangle(opts.x,opts.y,opts.width,opts.height)
  notebarBackground.boundsPadding = 0
  notebarBackground.beginFill(opts.color || 0xffff00, opts.alpha || 1)
  notebarBackground.drawRect(0, 0, opts.width, opts.height)
  notebarBackground.endFill()
  return notebarBackground.generateTexture()
}
class MusicNote extends PIXI.Container {
  constructor(opts) {
    super()
    opts = _.merge(defaultOpts, opts)
    this._background = new PIXI.Sprite(drawBackground(opts))
    this._background.alpha = 0
    this._barLine = new PIXI.Sprite(drawBarLine(opts))
    this.addChild(this._background)
    this.addChild(this._barLine)
    this.interactive = true
    this.x = opts.x || 0
    this.y = opts.y || 0
  }
  removeNotes() {
    this.children
      .filter(child => child.constructor === Note)
      .map(child => {
        return this.removeChild(child)
      })
  }
  activeNote() {
    var currentNote = this.children.filter(note => {
      return note.constructor === Note
    })
    .find(note => {
      return !note.actived && note.y > 450 && note.y < 550
    })
    this._background.alpha = 0.6

    global.setTimeout(() => {
      this._background.alpha = 0
    }, 100)

    if (currentNote) {
      currentNote.actived = true
      this.removeChild(currentNote)
      return true
    } else {
      return false
    }
  }
}

export default MusicNote
