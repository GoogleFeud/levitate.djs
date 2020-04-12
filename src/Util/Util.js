const Discord = require("discord.js");

const GuildMemberManager = require("../Managers/GuildMemberManager.js");
const GuildChannelManager = require("../Managers/GuildChannelManager.js");
const GuildEmojiManager = require("../Managers/GuildEmojiManager.js");

const PresenceManager = require("../Managers/PresenceManager.js");
const PacketHandlers = require(require.resolve("discord.js").replace("index.js","client/websocket/handlers"));

module.exports = {
    replaceManagers: function(options) {

        Discord.Structures.extend("Guild", (Guild) => {
            return class extends Guild {
                constructor(client, data) {
                    super(client, data);
                    if (options.members) this.members = new GuildMemberManager(this);
                    if (options.channels) this.channels = new GuildChannelManager(this);
                    if (options.ignoreEmojis) this.emojis = new GuildEmojiManager(this);
                    if (options.ignorePresences) this.presences = new PresenceManager(this);
                    if (options.excludeProps instanceof Array) for (let prop of options.excludeProps) delete this[prop]; 
                }
            }
        });


        if (options.channels) Discord.Channel.create = function(client, data, guild) {
            let channel;
	if(!data.guild_id && !guild) {
		if((data.recipients && data.type !== Discord.Constants.ChannelTypes.GROUP) || data.type === Discord.Constants.ChannelTypes.DM) {
			const DMChannel = Discord.Structures.get('DMChannel');
			channel = new DMChannel(client, data);
		} else if(data.type === Discord.Constants.ChannelTypes.GROUP) {
			channel = new Discord.PartialGroupDMChannel(client, data);
		}
	} else {
		guild = guild || client.guilds.cache.get(data.guild_id) || client.guilds.add({id:data.guild_id},false);
		if(guild) {
			switch(data.type) {
				case Discord.Constants.ChannelTypes.TEXT: {
					let TextChannel = Discord.Structures.get('TextChannel');
					channel = new TextChannel(guild, data);
					break;
				}
					case Discord.Constants.ChannelTypes.VOICE: {
					let VoiceChannel = Discord.Structures.get('VoiceChannel');
					channel = new VoiceChannel(guild, data);
					break;
				}
					case Discord.Constants.ChannelTypes.CATEGORY: {
					let CategoryChannel = Discord.Structures.get('CategoryChannel');
					channel = new CategoryChannel(guild, data);
					break;
				}
					case Discord.Constants.ChannelTypes.NEWS: {
					let NewsChannel = Discord.Structures.get('NewsChannel');
					channel = new NewsChannel(guild, data);
					break;
				}
					case Discord.Constants.ChannelTypes.STORE: {
					let StoreChannel = Discord.Structures.get('StoreChannel');
					channel = new StoreChannel(guild, data);
					break;
				}
			}
			if(channel && client.channels.cache.has(channel.id)) { guild.channels.cache.set(channel.id, channel); }
		}
	}
	return channel;
        }

},

setAction: function(client, actionName, handle) {
    //client.actions[actionName].handle = handle.bind(null, client.actions[actionName].handle);
    client.actions[actionName].handle = handle;
},

clearHandler(name) {
 delete PacketHandlers[name];
},

messageMentions(message, mentions) {
   Object.defineProperty(mentions, "channels", {value: (() => {
    const channels = [];
    let matches;
    while ((matches = Discord.MessageMentions.CHANNELS_PATTERN.exec(message.content)) !== null) {
    channels.push(matches[1]);
    }
    return channels;})()});
    return mentions;
}

}