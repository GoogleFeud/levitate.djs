
const Client = require("./src/LevitateClient.js");



const client = new Client({
   members: {
    ignoreBots: true,
    ignoreIDs: [],
    cache: false
   },
   channels: {
      ignoreVoice: true,
      ignoreCategories: true,
      ignoreText: false // Completely ignores text channels, say bye to the message event
   },
   messages: {
      ignoreReactions: true, // THE EVENT DOESN'T GET FIRED IF TRUE
      excludeProps: ["mentions", "embeds", "pinnable"]
   },
   users: {
      ignoreBots: true,
      ignoreIDs: ["356819274691510293"],
   },
   ignoreEmojis: true,
   ignorePresences: true
});

client.on("ready", () => console.log("I am ready!", client.guilds.cache.first().channels.cache.size))

client.on("message", async (msg) => {
   console.log(msg.author.username);
   console.log(msg.guild.presences.cache.size);
   console.log(client.users.cache.size);
});



client.login("NDg5MDg2ODcyOTM3NTYyMTEz.XoXZ1w.1SVMgmACkLbugUuP9lrozRE-86g");