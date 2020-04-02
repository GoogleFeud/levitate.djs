

# levitate.djs

A module for `discord.js` which allows you to choose what gets cached and what not. It uses discord.js' structuring system + overriding some of the `managers`. This module is **experimental** and also **barely tested**. I'm sure there is a better way of doing this!

# Features

- Don't cache bots / certain IDs / any members in `guild.members`
- Don't cache bots / certain IDs in `client.users`
- Don't cache voice / text channels / categories in `client.channels` and `guild.channels`
- Don't cache emojis in `client.emojis` and `guild.emojis`
- Don't cache message reactions in `message.reactions`
- Remove specific properties of objects

# Usage

```js
const LevitateClient = require("levitate.djs");

const client = new LevitateClient(options, djsOptions);
```

# API

## LevitateClient

Extends `Discord.Client`. 

### constructor

| Parameter | Type | Description |
| ---         |     ---     |          --- |
| options | `Object` | Any options for levitate.djs |
| options.members |  `Object` | Options regarding guild members  |
| options.members.ignoreBots |  `Boolean` | If bots should be cached. **Message events from bots will still be received** |
| options.members.ignoreIDs |  `Array<String>` | If the bot should cache the specified IDs in the array. **Message events from the users will still be received** |
| options.members.cache |  `Boolean` | If the bot should cache users at all. Default is `true` **Message events will still be received**
| options.channels |  `Object` | Options regarding channels |
| options.channels.ignoreVoice |  `Boolean` | If voice channels should be cached |
| options.channels.ignoreText |  `Boolean` | If text channels should be cached |
| options.channels.ignoreCategories |  `Boolean` | If categories should be cached |
| options.messages |  `Object` | Options regarding messages |
| options.messages.ignoreReactions |  `Boolean` | If reactions should be cached |
| options.messages.excludeProps |  `Array<String>` | An array of property keys. These properties will be deleted. |
| options.users |  `Object` | Options regarding discord users |
| options.users.ignoreBots |  `Boolean` | If bots should be cached **Message events from bots will still be received** |
| options.users.ignoreIDs |  `Boolean` | If the bot should cache the specified IDs in the array. **Message events from the users will still be received** |
| options.users.excludeProps |  `Array<String>` | An array of property keys. These properties will be deleted. |
| options.ignoreEmojis |  `Boolean` | If emojis should be cached in `client.emojis` and `guild.emojis` |
| options.ignorePresences |  `Boolean` | If presences should be cached |
| options.excludeProps |  `Array<String>` |  An array of property keys **of guilds**. These properties will be deleted. |
| djsOptions | `Object` | Any options for discord.js |

Creating a client would look like this:

```js
const client = new Client({
   members: {
    ignoreBots: true, // Doesn't cache any bots, but the "message" event WILL fire when bots send messages!
    ignoreIDs: [], // Doesn't cache the IDs in the array. The "message" event still fires.
    cache: true // Doesn't cache any members. The "message" event still fires.
   },
   channels: {
      ignoreVoice: true, // Doesn't cache any voice channels. The "voiceStateUpdate" event still fires!
      ignoreCategories: true, // Doesn't cache any categories.
      ignoreText: false // Completely ignores text channels, say bye to the message event
   },
   messages: {
      ignoreReactions: true, // THE "onReactionAdd" (and probably "onReactionRemove") event doesn't fire if this is true.
      excludeProps: ["mentions", "embeds"]
   },
   users: {
      ignoreBots: true, // Doesn't cache any bots, but the "message" event WILL fire when bots send messages!
      ignoreIDs: ["356819274691510293"], // Doesn't cache the IDs in the array. The "message" event still fires.
   },
   ignoreEmojis: true, // Doesn't cache all emojis.
   ignorePresences: true // Doesn't cache all presences. 
});
```