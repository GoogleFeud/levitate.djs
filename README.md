

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
| options.channels.ignoreText |  `Boolean` | If text channels should be cached. **Messages will STILL be received, but the channel object will be semi-partial, containing only id and type. You can still use most channel methods** |
| options.channels.ignoreCategories |  `Boolean` | If categories should be cached |
| options.channels.cacheType |  `Class that extends Collection` | A class that extends the discord.js `Collection` class. | 
| options.channels.cache |  `Boolean` | If any channels should be cached |
| options.users |  `Object` | Options regarding discord users |
| options.users.ignoreBots |  `Boolean` | If bots should be cached **Events caused by bots will NOT be received** |
| options.users.ignoreIDs |  `Boolean` | If the bot should cache the specified IDs in the array. **Events from users will still be received** |
| options.users.cacheType |  `Class that extends Collection` | A class that extends the discord.js `Collection` class. | 
| options.users.cache |  `Boolean` | If users should get cached at all |
| options.ignoreEmojis |  `Boolean` | If emojis should be cached in `client.emojis` and `guild.emojis` |
| options.ignorePresences |  `Boolean` | If presences should be cached |
| options.ignoreReactions |  `Boolean` | If reactions should be cached + events from reactions should be received |
| options.excludeProps |  `Array<String>` |  An array of property keys. These properties will be deleted from every guild. |
| options.disabledEvents |  `Array<String>` |  An array of handlers/websocket events you want to disable. [list of handlers](https://github.com/discordjs/discord.js/tree/master/src/client/websocket/handlers) |
| djsOptions | `Object` | Any options for discord.js |

Creating a client would look like this:

```js
const client = new Client({
   members: {
    ignoreBots: true, 
    ignoreIDs: [], 
    cache: true 
   },
   channels: {
      ignoreVoice: true, 
      ignoreCategories: true, 
      ignoreText: false 
   },
   users: {
      ignoreBots: true, 
      ignoreIDs: ["356819274691510293"],
   },
   ignoreEmojis: true, 
   ignorePresences: true  
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

## Message#mentions

If you aren't caching any users/members/channels then it's likely that `message.mentions.users/members/channels` will be empty. Levitate.djs replaces the `mentions` object with a new one which looks like this:

```
{
   users: [],
   roles: [],
   channels: [],
   everyone: true|false
}
```

`users` contains an array of user objects, which themselves contain a `member` property. Roles contains an array of role IDs, since roles stay cached you can get the role object via `guild.roles.cache.get`. `channels` contains an array of the mentioned channels id.

# Side Effects

There will most likely be side effects. Some obvious side effects:

- If `ignorePresences` is set to true, data in `GuildMember#presence` will likely be outdated, and may not even exist.
- If `members.cache` is set to false, `Guild.owner` will always be null.
- If `ignoreEmojis` is set to true, you won't be able to get any emoji objects from events or the caches, same with `ignorePresences`

There are a lot more.

**This setup has been well tested and it works just fine:**

```js
{
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
          ignoreReactions: true,
          disabledEvents: ["CHANNEL_CREATE", "CHANNEL_PINS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "GUILD_EMOJIS_UPDATE", "GUILD_INTEGRATIONS_UPDATE", "GUILD_MEMBER_ADD", "GUILD_MEMBER_REMOVE", "GUILD_MEMBER_UPDATE", "INVITE_CREATE", "INVITE_DELETE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "MESSAGE_REACTION_REMOVE_EMOJI", "MESSAGE_UPDATE", "PRESENCE_UPDATE", "TYPING_START", "USER_UPDATE", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"]
        }, {
            messageCacheMaxSize: 0
         }
```