import PIXI from 'pixi.js'
const left = 0,
      top = 500,
      height = 20,
      width = 800
class HitBar extends PIXI.Container {
  constructor() {
    super()
    var bar = new PIXI.Graphics()
    bar.bounds = new PIXI.Rectangle(0,0,width,height)
    bar.boundsPadding = 0
    bar.beginFill(0xffff00, 1)
    bar.drawRect(0, 0, width, height)
    bar.endFill()
    this._bar = new PIXI.Sprite(bar.generateTexture())
    this.x = left
    this.y = top
    this.addChild(this._bar)
  }
}

export default HitBar
