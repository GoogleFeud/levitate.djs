

const {BaseManager, Presence} = require("discord.js");


class PresenceManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  add(data, cache) {
     return null;
  }

  resolve(presence) {
    const presenceResolvable = super.resolve(presence);
    if (presenceResolvable) return presenceResolvable;
    const UserResolvable = this.client.users.resolveID(presence);
    return super.resolve(UserResolvable) || null;
  }

  resolveID(presence) {
    const presenceResolvable = super.resolveID(presence);
    if (presenceResolvable) return presenceResolvable;
    const userResolvable = this.client.users.resolveID(presence);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }

}

module.exports = PresenceManager;