

const Client = require("./src/LevitateClient.js");
const LimitedCollection = require("./src/Util/LimitedCollection.js");
const Discord = require("discord.js");

const client = new Client({
   channels: {
      cache: false
},
users: {
    cache: false,
    ignoreBots: true
},
members: {
   cache: false,
},
ignoreEmojis: true, 
ignorePresences: true,
ignoreReactions: true
});

client.on("ready", () => console.log("I am ready!", client.guilds.cache.first().channels.cache.size))

client.on("message", async (msg) => {
      //if (msg.author.bot) return;
      if (msg.channel.type !== "dm") {
      console.log("Users cache:", client.users.cache.size);
      console.log("Members cache:", msg.guild.members.cache.size);
      console.log("Guild Emojis cache:", msg.guild.emojis.cache.size);
      console.log("Emoijis cache:", client.emojis.cache.size);
      console.log("Channels cache", client.channels.cache.size);
      console.log("Guild Channels cache:", msg.guild.channels.cache.size);
      console.log("Guild presences cache:", msg.guild.presences.cache.size);
      console.log("Permission check:", msg.member.roles.cache.has("527789717152989186"))
      }
      console.log(await msg.channel.send("Some content!"));
});



client.login("");