import PIXI from 'pixi.js'
const left = 10,
      top = 200

class Score extends PIXI.Container {
  constructor() {
    super()
    this._score = 0
    this._text = new PIXI.Text('Score:0', { font: '24px Snippet', fill: 'white', align: 'right' })
    this.x = left
    this.y = top
    this.addChild(this._text)
  }
  update(score) {
    this._score = score
    this._text.text = 'Score:' + score
  }
}

export default Score
