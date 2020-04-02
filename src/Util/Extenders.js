const Discord = require("discord.js");

const GuildMemberManager = require("../Managers/GuildMemberManager.js");
const GuildChannelManager = require("../Managers/GuildChannelManager.js");
const GuildEmojiManager = require("../Managers/GuildEmojiManager.js");

const ReactionManager = require("../Managers/ReactionManager.js");
const PresenceManager = require("../Managers/PresenceManager.js");

module.exports = function(options) {

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

        if (options.messages) Discord.Structures.extend("Message", (Message) => {
            return class extends Message {
                constructor(client, data, channel) {
                    super(client, data, channel);
                    if (options.messages.ignoreReactions) this.reactions = new ReactionManager(this);
                    if (options.messages.excludeProps instanceof Array) for (let prop of options.messages.excludeProps) delete this[prop];
                }
            }
        });

        if (options.users && options.users.excludeProps) {
            Discord.Structures.extend("User", (User) => {
                return class extends User {
                    constructor(client, data) {
                        super(client, data);
                        if (options.users.excludeProps instanceof Array) for (let prop of options.users.excludeProps) delete this[prop];
                    }
                }
            })
        }

}