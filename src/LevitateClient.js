
const discord = require("discord.js");
const Util = require("./Util/Util.js");
const ChannelManager = require("./Managers/ChannelManager.js");
const UserManager = require("./Managers/UserManager.js");


class LevitateClient extends discord.Client {
    constructor(options = {}, djsOptions = {messageCacheMaxSize: 0}) {
        Util.clearHandler("TYPING_START");
        Util.clearHandler("GUILD_INTEGRATIONS_UPDATE")
        if (options.ignoreEmojis) Util.clearHandler("GUILD_EMOJIS_UPDATE");
        if (options.ignorePresences) Util.clearHandler("PRESENCE_UPDATE");
        if (options.channels) {
            if (options.channels.ignoreVoice || options.channels.cache === false) {
                Util.clearHandler("VOICE_SERVER_UPDATE");
                Util.clearHandler("VOICE_STATE_UPDATE");
            }
            if (options.channels.ignoreText || options.channels.cache === false) {
                Util.clearHandler("CHANNEL_CREATE");
                Util.clearHandler("CHANNEL_DELETE");
                Util.clearHandler("CHANNEL_PINS_UPDATE");
                Util.clearHandler("CHANNEL_UPDATE");
            }
        }
        if (options.members && options.members.cache === false) {
             Util.clearHandler("GUILD_MEMBER_ADD");
             Util.clearHandler("GUILD_MEMBER_REMOVE");
             Util.clearHandler("GUILD_MEMBER_UPDATE");
             Util.clearHandler("GUILD_BAN_ADD");
             Util.clearHandler("GUILD_BAN_REMOVE");
        }
        if (options.users && options.users.cache === false) Util.clearHandler("USER_UPDATE");
        if (options.ignoreReactions) {
            Util.clearHandler("MESSAGE_REACTION_ADD");
            Util.clearHandler("MESSAGE_REACTION_REMOVE")
            Util.clearHandler("MESSAGE_REACTION_REMOVE_ALL");
            Util.clearHandler("MESSAGE_REACTION_REMOVE_EMOJI");
        }
        Util.replaceManagers(options);
        super(djsOptions);
        this.levitateOptions = options;
        if (options.channels) this.channels = new ChannelManager(this);
        if (options.users) this.users = new UserManager(this);

        if (options.channels && (options.channels.ignoreText || options.channels.cache === false)) {
            Util.setAction(this, "MessageCreate", async (data) => {
            if (options.users && options.users.ignoreBots && data.author.bot) return { data };
            const client = this;
            let channel;
            let message;
            if (data.guild_id) {
                const guild = this.guilds.cache.get(data.guild_id);
                let Channel = discord.Structures.get("TextChannel");
                channel = new Channel(guild, {id: data.channel_id, type: 0});
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
            }
        else {
            if (options.users && options.users.ignoreBots && data.author.bot) return { data }
            const user = this.users.cache.get(data.author.id) || await this.users.fetch(data.author.id);
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
      client.emit("message", message);
      return { message };
    });
}
    } 


}

LevitateClient.LimitedCollection = require("./Util/LimitedCollection.js");

module.exports = LevitateClient;