// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let now = new Date();
let month = now.getMonth() + 1; 
let day = now.getDate();
let year = now.getFullYear();
let hour = now.getHours(); 
let min = now.getMinutes();
let seconds = now.getSeconds();

let time = `${hour}:${min}:${seconds}`;
let date = `${month}/${day}/${year}`;

const sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms || 0);
  });
};

let rateLimit = await lib.utils.kv['@0.1.16'].get({
  key: `rate_limit_ticketcreate_${context.params.event.member.user.id}`
});

if (rateLimit) {
  let response = await lib.discord.channels['@0.1.1'].messages.update({
    "message_id": `${context.params.event.message.id}`,
    "channel_id": `${context.params.event.channel_id}`,
    "content": "",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Cooldown`,
      "description": `You are being **rate limited** <@${context.params.event.member.user.id}>!`,
      "color": 0xff0000,
      "footer": {
        "text": `Default cooldown is 2 hours...`
      }
    }
  });
  
  await sleep(5000);
  await lib.discord.channels['@0.1.1'].messages.destroy({
    message_id: `${response.id}`,
    channel_id: `${response.channel_id}`
  });
}else{
  await lib.discord.channels['@0.1.1'].messages.destroy({
    message_id: `${context.params.event.message.id}`,
    channel_id: `${context.params.event.message.channel_id}`
  });
  //Creating a channel...
  let channel = await lib.discord.guilds['@0.1.0'].channels.create({
    guild_id: `${process.env.GUILDID}`,
    name: `${context.params.event.member.user.username}`,
    parent_id: `${process.env.CATEGORY}`,
    topic: `${context.params.event.member.user.id}`
  });
  //Setting rate limit
  await lib.utils.kv['@0.1.16'].set({
    key: `rate_limit_ticketcreate_${context.params.event.member.user.id}`,
    value: `true`,
    ttl: 7200 // The number of seconds to rate limit a person for.
  });
  //Setting channel permissions...
  //User Permissions
  let Userperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${context.params.event.member.user.id}`,
    channel_id: channel.id,
    allow: `${1 << 10 | 1 << 16}`,
    type: 1
  });
  //Support Staff Permissions
  let Supportperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.SUPPORTROLE}`,
    channel_id: channel.id,
    deny: `${1 << 10}`,
    type: 0
  });
  //Members Permission
  let Everyone = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.EVERYONE}`,
    channel_id: channel.id,
    deny: `${1 << 10}`,
    type: 0
  });
  //Dev Staff Permissions
  let Devperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.DEVTEAM}`,
    channel_id: channel.id,
    deny: `${1 << 10}`,
    type: 0
  });
  //Senior Moderators Permissions
  let Modperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.MODROLE}`,
    channel_id: channel.id,
    deny: `${1 << 10}`,
    type: 0
  });
  //Sending data to database
  let data = await lib.airtable.query['@1.0.0'].insert({
    table: `Tickets`,
    fieldsets: [
      {
        'TicketID': `${channel.id}`,
        'Status': `Open`,
        'User': `${context.params.event.member.user.id}`,
        'Topic': `---`,
        'Staff': `---`,
        'DateOpened': `${date}|${time}UTC`,
        'DateDeleted': `---`
      }
    ],
    typecast: false
  });
  
  try {
    //Trying to DM user
    let DMs = await lib.discord.users['@0.1.3'].dms.create({
      recipient_id: `${context.params.event.member.user.id}`,
      content: ``,
      tts: false,
      embed: {
        type: "rich",
        title: "Support Requested!",
        description: `Kindly check <#${channel.id}> for your requested support...`,
        color: 0x51ff00
      }
    });
  }catch (e){
    //If cant DM user
    let response = await lib.discord.channels['@0.1.1'].messages.update({
    "message_id": `${context.params.event.message.id}`,
    "channel_id": `${context.params.event.channel_id}`,
      "content": `<@${context.params.event.member.user.id}>`,
      "tts": false,
      "embed": {
        "type": "rich",
        "title": `Ticket Opened!`,
        "description": `Kindly check <#${channel.id}> for your requested support...`,
        "color": 0x51fb03
      }
    });
    
    await sleep(5000);
    await lib.discord.channels['@0.1.1'].messages.destroy({
      message_id: `${response.id}`,
      channel_id: `${response.channel_id}`
    });
  }
  //Main Message
  await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: `${channel.id}`,
    content: `<@!${context.params.event.member.user.id}>`,
    tts: false,
    embed: {
      type: "rich",
      title: "Thanks for Requesting Support!",
      description: `Thanks for contacting support, here at **${process.env.SERVERNAME}**. \n\nOur amazing support team will be with you shortly and hope to solve your issues. \n\n*If you have any information leave it below*`,
      color: 0xfbff00
    }
  });
  //Quick Setup Message
  await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${channel.id}`,
    "content": "",
    "tts": false,
    "components": [
      {
        "type": 1,
        "components": [
          {
            "custom_id": `ticket-menu`,
            "placeholder": `Click me`,
            "options": [
              {
                "label": `Bug Report`,
                "value": `bug-report`,
                "description": `I found a bug, and I want to report it.`,
                "emoji": {
                  "id": null,
                  "name": `🐞`
                },
                "default": false
              },
              {
                "label": `Business`,
                "value": `business`,
                "description": `Partnership, and other bussiness concerns.`,
                "emoji": {
                  "id": null,
                  "name": `⌨`
                },
                "default": false
              },
              {
                "label": `Technical Support`,
                "value": `technical-support`,
                "description": `Importing Problems, Download Issues`,
                "emoji": {
                  "id": null,
                  "name": `📱`
                },
                "default": false
              },
              {
                "label": `Others`,
                "value": `others`,
                "description": `I want to talk about something not listed here.`,
                "emoji": {
                  "id": null,
                  "name": `❔`
                },
                "default": false
              }
            ],
            "min_values": 1,
            "max_values": 4,
            "type": 3
          }
        ]
      }
    ],
    "embed": {
      "type": "rich",
      "title": `Quick Setup`,
      "description": `Hi! I'm your temporary temporary support staff, I'm here to setup things to help our human support staff before they step-in to help you.`,
      "color": 0xff4300
    }
  });
  //Logging System
  await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${process.env.LOGS}`,
    "content": "",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Ticket Opened!`,
      "description": "",
      "color": 0x5eff00,
      "fields": [
        {
          "name": `User:`,
          "value": `<@${context.params.event.member.user.id}>`,
          "inline": true
        },
        {
          "name": `Ticket Name:`,
          "value": `${channel.name}`,
          "inline": true
        },
        {
          "name": `Date and Time:`,
          "value": `${date} | ${time}UTC`,
          "inline": true
        }
      ]
    }
  });
}
