'use strict';

const {BaseManager, Channel, Constants} = require("discord.js")
const { Events } = Constants;


class ChannelManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Channel, client.levitateOptions.channels.cacheType);
  }


  add(data, guild, cache = (this.client.levitateOptions.channels.cache !== false)) {
    const existing = this.cache.get(data.id);
    if (existing) {
      if (existing._patch && cache) existing._patch(data);
      if (this.client.levitateOptions.channels.ignoreVoice && existing.type === "voice") return existing;
      if (this.client.levitateOptions.channels.ignoreCategories && existing.type === "category") return existing;
      if (this.client.levitateOptions.channels.ignoreText && existing.type === "text") return existing;
      if (guild) guild.channels.add(existing);
      return existing;
    }

    const channel = Channel.create(this.client, data, guild);

    if (!channel) {
      this.client.emit(Events.DEBUG, `Failed to find guild, or unknown type for channel ${data.id} ${data.type}`);
      return null;
    }
    
    if ((this.client.levitateOptions.channels.ignoreVoice && channel.type === "voice") || (this.client.levitateOptions.channels.ignoreCategories && channel.type === "category") || (this.client.levitateOptions.channels.ignoreCategories && channel.type === "text") ) {
        guild.channels.cache.delete(channel.id);
        return channel;
    }

    return channel;
  }

  remove(id) {
    const channel = this.cache.get(id);
    if (channel.guild) channel.guild.channels.cache.delete(id);
    this.cache.delete(id);
  }

  async fetch(id, cache = true) {
    const existing = this.cache.get(id);
    if (existing && !existing.partial) return existing;

    const data = await this.client.api.channels(id).get();
    return this.add(data, null, cache);
  }
}

module.exports = ChannelManager;
