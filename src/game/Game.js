import _ from 'lodash'
import PIXI from 'pixi.js'

import Stage from './Stage'

class Game extends PIXI.Container {
  constructor(width, height, type, container, state) {
    super()
    this.bounds = new PIXI.Rectangle(0,0,this.width,this.height)

    this._renderType = type || null
    this.stateCallback = _.merge({
      init() {},
      preload() {},
      create() {},
      update() {},
      render() {},
      resize() {},
      paused() {},
      shutdown() {}
    }, state)
  }
  createGame() {
    this.stateCallback.create &&
      this.stateCallback.create()
  }
  updateGame(time) {
    this.stateCallback.update &&
      this.stateCallback.update()
    this.tickerStart &&
      this.ticker.update(time)
    this.renderer.render(this)
    global.requestAnimationFrame(this.updateGame.bind(this))
  }
  startGame() {
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height)

    this.container = new PIXI.Container()
    global.document.body.appendChild(this.renderer.view)

    this.addChild(this.container)
    this.container.bounds = new PIXI.Rectangle(0,0,this.width,this.height)

    // ticker
    this.ticker = PIXI.ticker.shared
    this.ticker.autoStart = false;
    this.ticker.stop();
    this.createGame()
    this.updateGame(1)
  }
};

export default Game
