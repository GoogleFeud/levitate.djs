const Discord = require("discord.js");

const GuildMemberManager = require("../Managers/GuildMemberManager.js");
const GuildChannelManager = require("../Managers/GuildChannelManager.js");
const GuildEmojiManager = require("../Managers/GuildEmojiManager.js");

const PresenceManager = require("../Managers/PresenceManager.js");

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

},

setAction: function(client, actionName, handle) {
    //client.actions[actionName].handle = handle.bind(null, client.actions[actionName].handle);
    client.actions[actionName].handle = handle;
},

}