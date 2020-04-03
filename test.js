
const Client = require("./src/LevitateClient.js");

const client = new Client({
   members: {
    ignoreBots: true
  },
   channels: {
      ignoreVoice: true,
      ignoreCategories: true,
   },
   messages: {
      ignoreReactions: true,
      excludeProps: ["mentions", "embeds", "pinnable"]
   },
   users: {
      ignoreBots: true
   },
   ignoreEmojis: true,
   ignorePresences: true
});

client.on("ready", () => console.log("I am ready!", client.guilds.cache.first().channels.cache.size))

client.on("message", async (msg) => {
   console.log(msg.author.username);
   console.log("Users cache:", client.users.cache.size);
   console.log("Members cache:", msg.guild.members.cache.size);
   console.log("Guild Emojis cache:", msg.guild.emojis.cache.size);
   console.log("Emoijis cache:", client.emojis.cache.size);
   console.log("Channels cache", client.channels.cache.size);
   console.log("Guild Channels cache:", msg.guild.channels.cache.size);
   console.log("Guild presences cache:", msg.guild.presences.cache.size)
});



client.login("NDg5MDg2ODcyOTM3NTYyMTEz.Xobsfg.cntrZLCmobH6jdAkhNMepN2q5zw");