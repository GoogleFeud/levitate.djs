'use strict';

const {BaseManager, GuildEmoji, ReactionEmoji, Collection, DataResolver} = require("discord.js")
const { TypeError } = require("discord.js/src/errors/index.js")


class GuildEmojiManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildEmoji);
    this.guild = guild;
  }


  add(data) {
    return null;
  }
  
  async create(attachment, name, { roles, reason } = {}) {
    attachment = await DataResolver.resolveImage(attachment);
    if (!attachment) throw new TypeError('REQ_RESOURCE_TYPE');

    const data = { image: attachment, name };
    if (roles) {
      data.roles = [];
      for (let role of roles instanceof Collection ? roles.values() : roles) {
        role = this.guild.roles.resolve(role);
        if (!role) {
          return Promise.reject(
            new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true),
          );
        }
        data.roles.push(role.id);
      }
    }

    return this.client.api
      .guilds(this.guild.id)
      .emojis.post({ data, reason })
      .then(emoji => this.client.actions.GuildEmojiCreate.handle(this.guild, emoji).emoji);
  }

  resolve(emoji) {
    if (emoji instanceof ReactionEmoji) return super.resolve(emoji.id);
    return super.resolve(emoji);
  }

  resolveID(emoji) {
    if (emoji instanceof ReactionEmoji) return emoji.id;
    return super.resolveID(emoji);
  }

  resolveIdentifier(emoji) {
    const emojiResolvable = this.resolve(emoji);
    if (emojiResolvable) return emojiResolvable.identifier;
    if (emoji instanceof ReactionEmoji) return emoji.identifier;
    if (typeof emoji === 'string') {
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
      else return emoji;
    }
    return null;
  }
}

module.exports = GuildEmojiManager;