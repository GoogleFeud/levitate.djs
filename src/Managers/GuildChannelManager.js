

'use strict';

const {BaseManager, GuildChannel, PermissionOverwrites, Constants} = require("discord.js");
const { ChannelTypes } = Constants;


class GuildChannelManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildChannel);
    this.guild = guild;
  }

  add(channel) {
    const existing = this.cache.get(channel.id);
    if (existing) return existing;
    if (this.client.levitateOptions.channels.ignoreVoice && channel.type === "voice") return channel;
    if (this.client.levitateOptions.channels.ignoreCategories && channel.type === "category") return channel;
    if (this.client.levitateOptions.channels.ignoreText && channel.type === "text") return channel;
    this.cache.set(channel.id, channel);
    return channel;
  }

  async create(name, options = {}) {
    let {
      type,
      topic,
      nsfw,
      bitrate,
      userLimit,
      parent,
      permissionOverwrites,
      position,
      rateLimitPerUser,
      reason,
    } = options;
    if (parent) parent = this.client.channels.resolveID(parent);
    if (permissionOverwrites) {
      permissionOverwrites = permissionOverwrites.map(o => PermissionOverwrites.resolve(o, this.guild));
    }

    const data = await this.client.api.guilds(this.guild.id).channels.post({
      data: {
        name,
        topic,
        type: type ? ChannelTypes[type.toUpperCase()] : ChannelTypes.TEXT,
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent,
        position,
        permission_overwrites: permissionOverwrites,
        rate_limit_per_user: rateLimitPerUser,
      },
      reason,
    });
    return this.client.actions.ChannelCreate.handle(data).channel;
  }
}

module.exports = GuildChannelManager;