
const {Collection} = require("discord.js");


class LimitedCollection extends Collection {
  constructor(maxSize = 0, clientId, iterable = null) {
    super(iterable);
    this.maxSize = maxSize;
    this.clientID = clientId;
  }

  set(key, value) {
    if (this.maxSize === 0) return this;
    if (!this.has(key) && this.size >= this.maxSize) {
       if (this.clientID && this.keyArray()[0] === this.clientID) this.delete(this.keyArray()[1]);
       else this.delete(this.firstKey());
    }
    return super.set(key, value);
  }

  static get [Symbol.species]() {
    return Collection;
  }

  static generate(size, clientId, iterable) {
      return LimitedCollection.bind(null, size, clientId, iterable);
  }

}

module.exports = LimitedCollection;