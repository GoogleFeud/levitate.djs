

# levitate.djs

A module for `discord.js` which allows you to choose what gets cached and what not. It uses discord.js' structuring system + overriding some of the `managers`. This module is **experimental** and also **barely tested**. There may be a better way of doing this in the future!

# Install

```npm i levitate.djs```

# Features

- Option to not cache bots / certain IDs / any members in `guild.members`
- Option to not cache bots / certain IDs in `client.users`
- Option to not cache voice / text channels / categories in `client.channels` and `guild.channels`
- Option to not cache emojis in `client.emojis` and `guild.emojis`
- Option to not cache message reactions in `message.reactions`
- Custom cache types (LimitedCollection comes out of the box)
- Remove specific properties of the guild object

# Usage

```js
const LevitatingClient = require("levitate.djs");

const client = new LevitatingClient(options, djsOptions);
```

# API

## LevitateClient

Extends `Discord.Client`. 

### constructor

| Parameter | Type | Description |
| ---         |     ---     |          --- |
| options | `Object` | Any options for levitate.djs |
| options.members |  `Object` | Options regarding guild members  |
| options.members.ignoreBots |  `Boolean` | If bots should be cached. **Events caused by bots will NOT be received** |
| options.members.ignoreIDs |  `Array<String>` | If the bot should cache the specified IDs in the array. **Events from the members will still be received** |
| options.members.cache |  `Boolean` | If the bot should cache members at all. Default is `true`. **Events from members will still be received, event parameters may be partial** | 
| options.members.cacheType |  `Class that extends Collection` | A class that extends the discord.js `Collection` class. | 
| options.channels |  `Object` | Options regarding channels |
| options.channels.ignoreVoice |  `Boolean` | If voice channels should be cached |
| options.channels.ignoreText |  `Boolean` | If text channels should be cached. **Messages will STILL be received, but the channel object will be semi-partial, containing only id and type. You can still use all the channel methods** |
| options.channels.ignoreCategories |  `Boolean` | If categories should be cached |
| options.channels.cacheType |  `Class that extends Collection` | A class that extends the discord.js `Collection` class. | 
| options.users |  `Object` | Options regarding discord users |
| options.users.ignoreBots |  `Boolean` | If bots should be cached **Events caused by bots will NOT be received** |
| options.users.ignoreIDs |  `Boolean` | If the bot should cache the specified IDs in the array. **Events from users will still be received** |
| options.users.cacheType |  `Class that extends Collection` | A class that extends the discord.js `Collection` class. | 
| options.ignoreEmojis |  `Boolean` | If emojis should be cached in `client.emojis` and `guild.emojis` |
| options.ignorePresences |  `Boolean` | If presences should be cached |
| options.excludeProps |  `Array<String>` |  An array of property keys. These properties will be deleted from every guild. |
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
   users: {
      ignoreBots: true, // Doesn't cache any bots, but the "message" event WILL fire when bots send messages!
      ignoreIDs: ["356819274691510293"], // Doesn't cache the IDs in the array. The "message" event still fires.
   },
   ignoreEmojis: true, // Doesn't cache all emojis.
   ignorePresences: true // Doesn't cache all presences. 
});
```

## Custom Caches

levitate.djs provides 1 custom cache type: `LimitedCollection`. It's similar to discord.js' limited collection. 

Example usage:

```js
const client = new Client({
   members: {
    ignoreBots: true, // Doesn't cache any bots, but the "message" event WILL fire when bots send messages!
    cacheType: Client.LimitedCollection.generate(limit, id, iterable)
   }
});
```

`limit` is how many pairs the collection can hold. If `id` is provided, the specified ID will never get deleted from the collection to make space for other objects. This was mainly added to never uncache the bot itself. 

**Suggestion:** You can use `cacheType: Client.LimitedCollection.generate(2, 'yourBotId')` in the `members` option. That will cache only your bot and one extra member. This means that `message.member` will always be accessible

# Side Effects

There will most likely be side effects. Some obvious side effects:

- If `ignorePresences` is set to true, data in `GuildMember#presence` will likely be outdated, and may not even exist.
- If `members.cache` is set to false, `Guild.owner` will always be null, `message.member` will always be null, along with other `GuildMember` properties.
- If `members.ignoreBots` is set to true, messages which are sent by bots won't have the `member` property.
- If `ignoreEmojis` is set to true, you won't be able to get any emoji objects from events or the caches, same with `ignorePresences`

There are a lot more. If you have a basic text chat bot, I suggest using this configuration:

```js
const client = new Client({
   members: {
    ignoreBots: true, // Set this to true if your bot doesn't interact with other bots, doesn't use their information. Don't use this if you have a "server info" command or similar
   },
   channels: {
      ignoreVoice: true, // If your bot only uses text channels, it should ignore voice ones
      ignoreCategories: true, // If you bot doesn't take advantage of the `channel.parent` property, keep this to true
   },
   users: {
      ignoreBots: true, // Set this to true if your bot doesn't interact with other bots, doesn't use their information. Don't use this if you have a "server info" command or similar
   },
   ignoreEmojis: true, // Leave this to true if your bot doesn't use any custom emojis / doesn't have any custom emojis related statistics.
   ignorePresences: true,
   ignoreProps: ["afkChannelID", ".applicationID", "banner", "description", "embedChannelID", "embedEnabled", "memberCount", "features", "nameAcronym", "premiumSubscriptionCount", "systemChannelID", "vanityURLCode", "verificationLevel", "verified", "voice", "voiceStates", "widgetChannelID", "region", "defaultMessageNotifications"]
});
```