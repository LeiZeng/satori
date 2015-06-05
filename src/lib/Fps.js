import PIXI from 'pixi.js'
const left = 0,
      top = 0

class Fps extends PIXI.Container {
  constructor() {
    super()
    this._text = new PIXI.Text('FPS:', { font: '35px Snippet', fill: 'white', align: 'left' })
    this.x = left
    this.y = top
    this.addChild(this._text)
  }
  update(FPS) {
    this._text.text = 'FPS:' + FPS
  }
}

export default Fps
