
const discord = require("discord.js");
const Util = require("./Util/Util.js");
const ChannelManager = require("./Managers/ChannelManager.js");
const UserManager = require("./Managers/UserManager.js");


class LevitateClient extends discord.Client {
    constructor(options = {}, djsOptions = {messageCacheMaxSize: 0}) {
        Util.replaceManagers(options);
        super(djsOptions);
        this.levitateOptions = options;
        if (options.channels) this.channels = new ChannelManager(this);
        if (options.users) this.users = new UserManager(this);

        if (options.channels && options.channels.ignoreText) {
            Util.setAction(this, "MessageCreate", async (data) => {
            if (options.members.ignoreBots && data.author.bot) return { data };
            const client = this;
            let channel;
            let message;
            if (data.guild_id) {
                channel = new discord.TextChannel(this.guilds.cache.get(data.guild_id), {id: data.channel_id, type: 0});
                message = channel.messages.add(data);
                message.rawMentions = {
                    users: data.mentions,
                    roles: data.mention_roles,
                    everyone: data.mention_everyone
                }
                const user = message.author;
                const member = message.member;
                channel.lastMessageID = data.id;
                if (user) {
                user.lastMessageID = data.id;
                user.lastMessageChannelID = channel.id;
                }
                if (member) {
                member.lastMessageID = data.id;
                member.lastMessageChannelID = channel.id;
               }
            }
        else {
            if (options.members.ignoreBots && data.author.bot) return { data }
            const user = this.users.cache.get(data.author.id) || await this.users.fetch(data.author.id);
            channel = new discord.DMChannel(this, {recipients: [user], id: data.channel_id, type: 1});
            message = channel.messages.add(data);
            message.rawMentions = {
                users: data.mentions,
                roles: data.mention_roles,
                everyone: data.mention_everyone
            }
        }
      client.emit("message", message);
      return { message };
    });
}
    } 

}

LevitateClient.LimitedCollection = require("./Util/LimitedCollection.js");

module.exports = LevitateClient;