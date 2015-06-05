import PIXI from 'pixi.js'
const left = 10,
      top = 100,
      height = 30,
      width = 120

class StartButton extends PIXI.Container {
  constructor() {
    super()
    var _background = new PIXI.Graphics()
    var _text = new PIXI.Text('Start', {
      font: '20px Snippet',
      fill: 'white',
      align: 'center'
    })
    _text.x = 40
    _background.boundsPadding = 0
    _background.beginFill(0x1d932d, 1)
    _background.drawRect(0, 0, width, height)
    _background.endFill()
    this._text = _text
    this._background = _background
    this.bounds = new PIXI.Rectangle(0,0,width,height)
    this.addChild(new PIXI.Sprite(_background.generateTexture()))
    this.addChild(_text)
    this.x = left
    this.y = top
    this.interactive = true
  }
}

export default StartButton
