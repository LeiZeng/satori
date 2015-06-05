import music from '../lib/music'

class Note {
  channel = 0
  bar = 0
  beat = 0
  endBar = 0
  endBeat = 0
  type = 'note'
  constructor(info) {
    this.channel = info.channel
    this.bar = info.bar
    this.beat = info.beat
    this.endBar = info.endBar
    this.endBeat = info.endBeat
    this.type = this.endBeat ? 'noodle' : 'note'
  }
  getStartTime(speed, offset, bpb) {
    return offset +
      1000 / speed * this.bar * bpb  +
      1000 / speed * safeEval(this.beat)
  }
  getStopTime(speed, offset) {
    if (!this.endBeat) {
      return null
    }
    return null //TODO
  }
}
class MusicSheet {
  notes = []
  scores = []
  offset = 0
  speed = 2
  bpb = 4
  constructor() {
    music.init()
  }
  initFromJson(json) {
    this.scores = parseJsonScores(json.scores)
    this.offset = Number(json.offset, 10) || 0
    this.speed = Number(json.bpm, 10) / 60 //bps
    this.bpb = Number(json.bpb, 10) || 4
    this.music = json.music
    return this
  }
  getSpeed() {
    return this.speed
  }
  getScore() {
    return this.scores.map(score => {
      return {
        start: score.getStartTime(this.speed, this.offset),
        stop: score.getStopTime(this.speed, this.offset),
        channel: Number(score.channel, 10)
      }
    })
  }
  load() {
    return music.load(this.music)
  }
  play() {
    music.player.load()
    return music.play()
  }
  clear() {
    this.notes.map(handler => {
      global.clearTimeout(handler)
    })
    this.notes = []
  }
  start(note, cb) {
    var handler = global.setTimeout(() => {
      this.notes.shift()
      cb.call(note)
    }, note.getStartTime(this.speed, this.offset, this.bpb))
    this.notes.push(handler)
  }
  loadSheetFromJson(json) {
    return this.initFromJson(json)
  }
}

function parseJsonScores(jsonScores) {
  return jsonScores.map(score => {
    return score.split('-')
      .reduce((scoreInfo, props, index) => {
        switch (index) {
          case 0:
            scoreInfo.channel = props
            break;
          case 1:
            props.split(':')
              .map((start, startIndex) => {
                if (startIndex) {
                  scoreInfo.beat = start
                } else {
                  scoreInfo.bar = start - 1
                }
              })
            break;
          case 2:
            props.split(':')
              .map((end, endIndex) => {
                if (endIndex === 0) {
                  scoreInfo.endBar = end || scoreInfo.bar
                }
                if (endIndex && end) {
                  scoreInfo.endBeat = end
                }
              })
            break;
        }
        return scoreInfo
      }, {})
  })
  .map(info => {
    return new Note(info)
  })
}
function safeEval(exp) {
  if (/[\d\/\*\-\+\%]+/.test(exp)) {
    return eval(exp)
  }
  throw new error('Unexpected expression!')
  return 0
}
export default MusicSheet
