
const discord = require("discord.js");
const Util = require("./Util/Util.js");
const ChannelManager = require("./Managers/ChannelManager.js");
const UserManager = require("./Managers/UserManager.js");

class LevitateClient extends discord.Client {
    constructor(options = {}, djsOptions = {messageCacheMaxSize: 0}) {
        if (options.disabledEvents instanceof Array) for (let ev of options.disabledEvents) Util.clearHandler(ev);
        Util.replaceManagers(options);
        super(djsOptions);
        this.levitateOptions = options;
        if (options.channels) this.channels = new ChannelManager(this);
        if (options.users) this.users = new UserManager(this);

        if ( options.channels && (options.channels.ignoreText || options.channels.cache === false) ) {
            let lastMSG;
            Util.setAction(this, "MessageCreate", (data) => {
            if (lastMSG && lastMSG.id === data.id) return {message: lastMSG}
            const client = this;
            let channel;
            let message;
            if (data.guild_id) {
                const guild = client.guilds.cache.get(data.guild_id);
                channel = client.channels.cache.get(data.channel_id);
                if (!channel) {
                let Channel = discord.Structures.get("TextChannel");
                channel = new Channel(guild, {id: data.channel_id, type: 0});
                }else {
                    const existing = channel.messages.cache.get(data.id);
                    if (existing) return { message: existing };
                }
                message = channel.messages.add(data);
                message.mentions = Util.messageMentions(message, {
                    users: data.mentions,
                    roles: data.mention_roles,
                    everyone: data.mention_everyone,
                    channels: []
                });
                const user = message.author;
                if (!message.member) {
                    let Member = discord.Structures.get("GuildMember");
                    const m = new Member(this, {user: data.author, ...data.member}, guild)
                    Object.defineProperty(message, "member", {get: () => m});
                }
                channel.lastMessageID = data.id;
                if (user) {
                user.lastMessageID = data.id;
                user.lastMessageChannelID = channel.id;
                }
                if (message.member) {
                    message.member.lastMessageID = data.id;
                    message.member.lastMessageChannelID = channel.id;
               }
            } else {
            const user = this.users.cache.get(data.channel_id) || new discord.User(client, {id: data.channel_id});
            const DMChannel = discord.Structures.get("DMChannel");
            channel = new DMChannel(this, {recipients: [user], id: data.channel_id, type: 1});
            message = channel.messages.add(data);
           message.mentions = Util.messageMentions(message, {
                users: data.mentions,
                roles: data.mention_roles,
                everyone: data.mention_everyone,
                channels: []
            });
        }
      lastMSG = message;
      if (options.users && options.users.ignoreBots && data.author.bot) return {message};
      client.emit("message", message);
      return {message};
    });
}
    } 


}

LevitateClient.LimitedCollection = require("./Util/LimitedCollection.js");

module.exports = LevitateClient;