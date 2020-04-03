
const Client = require("./src/LevitateClient.js");

const client = new Client({
   members: {
    ignoreBots: true, // Set this to true if your bot doesn't interact with other bots, doesn't use their information. Don't use this if you have a "server info" command or similar
   },
   channels: {
      ignoreVoice: true, // If your bot only uses text channels, it should ignore voice ones
      ignoreCategories: true, // If you bot doesn't take advantage of the `channel.parent` property, keep this to true
   },
   messages: {
      ignoreReactions: true, // Depends on the purpose of your bot. Leave this to true if your bot doesn't listen for reactions, doesn't get reactions from messages.
   },
   users: {
      ignoreBots: true, // Set this to true if your bot doesn't interact with other bots, doesn't use their information. Don't use this if you have a "server info" command or similar
   },
   ignoreEmojis: true, // Leave this to true if your bot doesn't use any custom emojis / doesn't have any custom emojis related statistics.
   ignorePresences: true,
   ignoreProps: ["afkChannelID", ".applicationID", "banner", "description", "embedChannelID", "embedEnabled", "memberCount", "features", "nameAcronym", "ownerID", "premiumSubscriptionCount", "systemChannelID", "vanityURLCode", "verificationLevel", "verified", "voice", "voiceStates", "widgetChannelID"]
});

client.on("ready", () => console.log("I am ready!", client.guilds.cache.first().channels.cache.size))

client.on("message", async (msg) => {
   console.log("Users cache:", client.users.cache.size);
   console.log("Members cache:", msg.guild.members.cache.size);
   console.log("Guild Emojis cache:", msg.guild.emojis.cache.size);
   console.log("Emoijis cache:", client.emojis.cache.size);
   console.log("Channels cache", client.channels.cache.size);
   console.log("Guild Channels cache:", msg.guild.channels.cache.size);
   console.log("Guild presences cache:", msg.guild.presences.cache.size)
});



client.login("");