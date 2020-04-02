
const discord = require("discord.js");
const Extenders = require("./Util/Extenders.js");
const ChannelManager = require("./Managers/ChannelManager.js");
const UserManager = require("./Managers/UserManager.js");

class LevitateClient extends discord.Client {
    constructor(options = {}, djsOptions) {
        Extenders(options);
        super(djsOptions);
        this.levitateOptions = options;
        if (options.channels) this.channels = new ChannelManager(this);
        if (options.users) this.users = new UserManager(this);
    }
}

module.exports = LevitateClient;