import PIXI from 'pixi.js'
import _ from 'lodash'

import Fps from '../lib/Fps'

import Game from './Game'
import HitBar from './HitBar'
import Score from './Score'
import Note from './Note'
import MusicNote from './MusicNote'
import MusicSheet from './MusicSheet'
import TimeFrame from './TimeFrame'
import StartButton from './StartButton'

import documentEvent from './documentEvent'
import fakeSheet from './fakeSheet'

var thing,
    count = 0,
    game,
    noteBars = [],
    keyArray = [87, 69, 32, 73, 79], // WE[Space]IO
    noteColor = [0xffffff, 0x3680cd, 0xde9519, 0x3680cd, 0xffffff]
function preload() {

}
function create() {
  var fps = new Fps()
  var score = new Score()
  var hitbar = new HitBar()
  game.container.addChild(fps)
  game.container.addChild(score)

  noteBars = _.range(0,5).map(x => {
    var noteBar = new MusicNote({
      x: x * 100 + 150
    })

    game.container.addChild(noteBar)

    return noteBar
  })

  game.container.addChild(hitbar)

  var musicSheet = new MusicSheet(120, 1000, 4)
  musicSheet.loadSheetFromJson(fakeSheet)
    .load()
    .then(function () {
      var startbutton = new StartButton()
      game.container.addChild(startbutton)
      startbutton
        .on('click', evt => {
          game.newStage()
        })
    })

  game.ticker.add(time => {
    if (count%60 < 1) {
      fps.update(Math.floor(game.ticker.FPS))
    }
  })

  game.tickerStart = true


  // keydown event binding
  documentEvent.bind({
    keydown: function (event) {
      var keys = [event.keyCode]
      keys.filter(code => {
        return keyArray.indexOf(code) > -1
      })
      .map(code => keyArray.indexOf(code))
      .forEach(activeNote)

      keys
      .filter(code => {
        return code == "13"
      })
      .forEach(game.newStage)
    }
  })
  game.newStage = function newStage() {
    console.log('new stage start!');
    score.update(0)
    clearNotes()
    musicSheet.scores
      .map(note => {
        return musicSheet.start(note, function() {
          createNote(this.channel - 1)
        })
      })
    musicSheet.play()
  }
  function clearNotes() {
    noteBars.forEach(bar => {
      bar.removeNotes()
    })
    musicSheet.clear()
  }
  function createNote(idx) {
    if (idx < 0) return

    noteBars[idx].addChild(new Note({
      color: noteColor[idx]
    }))
  }
  function activeNote(idx) {
    if (idx < 0) return

    if (noteBars[idx].activeNote()) {
      score.update(score._score + 100)
    }
  }
}
function update() {
  noteBars.map(noteBar => {
    noteBar.children.forEach(note => {
      note.move &&
        note.move()
    })
  })
}

export default {
  init() {
    game = new Game(800, 600, null, null, {
      preload: preload,
      create: create,
      update: update
    });

    return game
  },
  start() {
    game.startGame()
  }
}
