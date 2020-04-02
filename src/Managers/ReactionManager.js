

'use strict';

const {BaseManager, MessageReaction} = require("discord.js");

class ReactionManager extends BaseManager {
  constructor(message, iterable) {
    super(message.client, iterable, MessageReaction);
    this.message = message;
  }

  add(data, cache) {
     return null;
  }

  removeAll() {
    return this.client.api
      .channels(this.message.channel.id)
      .messages(this.message.id)
      .reactions.delete()
      .then(() => this.message);
  }
}

module.exports = ReactionManager;