

'use strict';
const {BaseManager, GuildMember, Constants, Collection} = require("discord.js");
const {Events, OPCodes} = Constants;
const {Error, TypeError} = require("discord.js/src/errors/index.js");

class GuildMemberManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildMember);
    this.guild = guild;
  }

  add(data, cache = (this.client.levitateOptions.members.cache !== false)) {
    if (this.client.levitateOptions.members.ignoreBots && data && data.user && data.user.bot) return;
    if (this.client.levitateOptions.members.ignoreIDs instanceof Array && data && data.user && this.client.levitateOptions.members.ignoreIDs.includes(data.user.id)) return;
    return super.add(data, cache, { id: data.user.id, extras: [this.guild] });
  }
  
  resolve(member) {
    const memberResolvable = super.resolve(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveID(member);
    if (userResolvable) return super.resolve(userResolvable);
    return null;
  }

  resolveID(member) {
    const memberResolvable = super.resolveID(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveID(member);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }

  fetch(options) {
    if (!options) return this._fetchMany();
    const user = this.client.users.resolveID(options);
    if (user) return this._fetchSingle({ user, cache: true });
    if (options.user) {
      if (Array.isArray(options.user)) {
        options.user = options.user.map(u => this.client.users.resolveID(u));
        return this._fetchMany(options);
      } else {
        options.user = this.client.users.resolveID(options.user);
      }
      if (!options.limit && !options.withPresences) return this._fetchSingle(options);
    }
    return this._fetchMany(options);
  }

  prune({ days = 7, dry = false, count = true, reason } = {}) {
    if (typeof days !== 'number') throw new TypeError('PRUNE_DAYS_TYPE');
    return this.client.api
      .guilds(this.guild.id)
      .prune[dry ? 'get' : 'post']({
        query: {
          days,
          compute_prune_count: count,
        },
        reason,
      })
      .then(data => data.pruned);
  }

  ban(user, options = { days: 0 }) {
    if (options.days) options['delete-message-days'] = options.days;
    const id = this.client.users.resolveID(user);
    if (!id) return Promise.reject(new Error('BAN_RESOLVE_ID', true));
    return this.client.api
      .guilds(this.guild.id)
      .bans[id].put({ query: options })
      .then(() => {
        if (user instanceof GuildMember) return user;
        const _user = this.client.users.resolve(id);
        if (_user) {
          const member = this.resolve(_user);
          return member || _user;
        }
        return id;
      });
  }

  unban(user, reason) {
    const id = this.client.users.resolveID(user);
    if (!id) return Promise.reject(new Error('BAN_RESOLVE_ID'));
    return this.client.api
      .guilds(this.guild.id)
      .bans[id].delete({ reason })
      .then(() => this.client.users.resolve(user));
  }

  _fetchSingle({ user, cache }) {
    const existing = this.cache.get(user);
    if (existing && !existing.partial) return Promise.resolve(existing);
    return this.client.api
      .guilds(this.guild.id)
      .members(user)
      .get()
      .then(data => this.add(data, cache));
  }

  _fetchMany({ limit = 0, withPresences: presences = false, user: user_ids, query } = {}) {
    return new Promise((resolve, reject) => {
      if (this.guild.memberCount === this.cache.size && !query && !limit && !presences && !user_ids) {
        resolve(this.cache);
        return;
      }
      if (!query && !user_ids) query = '';
      this.guild.shard.send({
        op: OPCodes.REQUEST_GUILD_MEMBERS,
        d: {
          guild_id: this.guild.id,
          presences,
          user_ids,
          query,
          limit,
        },
      });
      const fetchedMembers = new Collection();
      const option = query || limit || presences || user_ids;
      const handler = (members, guild) => {
        if (guild.id !== this.guild.id) return;
        timeout.refresh();
        for (const member of members.values()) {
          if (option) fetchedMembers.set(member.id, member);
        }
        if (
          this.guild.memberCount <= this.cache.size ||
          (option && members.size < 1000) ||
          (limit && fetchedMembers.size >= limit)
        ) {
          this.guild.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
          let fetched = option ? fetchedMembers : this.cache;
          if (user_ids && !Array.isArray(user_ids) && fetched.size) fetched = fetched.first();
          resolve(fetched);
        }
      };
      const timeout = this.guild.client.setTimeout(() => {
        this.guild.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
        reject(new Error('GUILD_MEMBERS_TIMEOUT'));
      }, 120e3);
      this.guild.client.on(Events.GUILD_MEMBERS_CHUNK, handler);
    });
  }
}

module.exports = GuildMemberManager;