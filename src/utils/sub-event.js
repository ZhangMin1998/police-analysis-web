class Publisher {
  constructor () {
    this._subsMap = {}
  }

  subscripe (type, cb) {
    if (this._subsMap[type]) {
      if (!this._subsMap[type].includes(cb)) {
        this._subsMap[type].push(cb)
      }
    } else {
      this._subsMap[type] = [cb]
    }
  }

  unsubscripe (type, cb) {
    if (!this._subsMap[type] ||
      !this._subsMap[type].includes(cb)) return;
    const idx = this._subsMap[type].indexOf(cb)
    this._subsMap[type].splice(idx, 1)
  }

  notify (type, ...payload) {
    if (!this._subsMap[type]) return
    this._subsMap[type].forEach(cb => cb(...payload))
  }
}

const _bus = new Publisher()

window._bus = _bus