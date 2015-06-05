import PIXI from 'pixi.js'
import _ from 'lodash'

import Fps from '../lib/Fps'

import Game from './Game'
import HitBar from './HitBar'
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

function create() {
  var fps = new Fps()
  var hitbar = new HitBar()
  game.container.addChild(fps)
  game.container.addChild(hitbar)

  var musicSheet = new MusicSheet(120, 1000, 4)
  musicSheet.loadSheetFromJson(fakeSheet)


  documentEvent.bind({
    keydown: function (event) {
      createNote(keyArray.indexOf(event.keyCode))
    }
  })

  noteBars = _.range(0,5).map(x => {
    var noteBar = new MusicNote({
      x: x * 100 + 150
    })

    game.container.addChild(noteBar)

    return noteBar
  })

  game.ticker.add(time => {
    if (count%60 < 1) {
      fps.update(Math.floor(game.ticker.FPS))
    }
  })

  game.tickerStart = true

  var startbutton = new StartButton()
  game.container.addChild(startbutton)
  startbutton
    .on('click', evt => {
      game.newStage()
    })

  game.newStage = function newStage() {
    clearNotes()
    musicSheet.scores
      .map(note => {
        return musicSheet.start(note, function() {
          createNote(this.channel - 1)
        })
      })
  }
  function clearNotes() {
    noteBars.forEach(bar => {
      bar.removeNotes()
    })
  }
  function createNote(idx) {
    if (idx < 0) {
      return
    }
    noteBars[idx].addChild(new Note({
      color: noteColor[idx]
    }))
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
      create: create,
      update: update
    });

    return game
  },
  start() {
    game.startGame()
  }
}
