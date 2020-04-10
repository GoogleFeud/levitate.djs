'use strict';


const {BaseManager, GuildMember, Message, User} = require("discord.js");


class UserManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, User, client.levitateOptions.users.cacheType);
  }

  add(data, cache = true, other) {
    if (this.client.levitateOptions.users.cache === false) cache = false;
    if (this.client.levitateOptions.users.ignoreBots && data && data.bot && this.client.user.id !== data.id) cache = false;
    if (this.client.levitateOptions.users.ignoreIDs instanceof Array && data && this.client.levitateOptions.users.ignoreIDs.includes(data.id)) cache = false;
    return super.add(data, cache, other);
  }

  resolve(user) {
    if (user instanceof GuildMember) return user.user;
    if (user instanceof Message) return user.author;
    return super.resolve(user);
  }

  resolveID(user) {
    if (user instanceof GuildMember) return user.user.id;
    if (user instanceof Message) return user.author.id;
    return super.resolveID(user);
  }

  async fetch(id, cache = true) {
    const existing = this.cache.get(id);
    if (existing && !existing.partial) return existing;
    const data = await this.client.api.users(id).get();
    return this.add(data, cache);
  }

}

module.exports = UserManager;