// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms || 0);
  });
};

let now = new Date();
let month = now.getMonth() + 1; 
let day = now.getDate();
let year = now.getFullYear();
let hour = now.getHours(); 
let min = now.getMinutes();
let seconds = now.getSeconds();

let time = `${hour}:${min}:${seconds}`;
let date = `${month}/${day}/${year}`;

if (context.params.event.member.roles.includes(`${process.env.SUPPORTROLE}`) || context.params.event.member.roles.includes(`${process.env.MODROLE}`) || context.params.event.member.roles.includes(`${process.env.DEVTEAM}`) || context.params.event.member.permission_names.includes('ADMINISTRATOR')) {
  
  let Userperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: user.id,
    channel_id: channel.id,
    allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
    deny:  `${1 << 31}`,
    type: 1
  }); 
  
  await lib.discord.channels['@0.1.2'].messages.update({
  "message_id": `${context.params.event.message.id}`,
  "channel_id": `${context.params.event.channel_id}`,
  "content": `<@${user.id}>`,
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Ticket Re-Opened`,
      "description": "",
      "color": 0x22ff00,
      "fields": [
        {
          "name": `Staff:`,
          "value": `<@${context.params.event.member.user.id}>`
        }
      ]
    }
  });
  
  let datachange = await lib.airtable.query['@1.0.0'].update({
    table: `Tickets`,
    where: [
      {
        'Ticket ID__icontains': `${context.params.event.channel_id}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'Status': `Open`
    },
    typecast: false
  });
  
  await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${process.env.LOGS}`,
    "content": "",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Ticket Re-Opened`,
      "description": "",
      "color": 0x22ff00,
      "fields": [
        {
          "name": `Staff:`,
          "value": `<@${context.params.event.member.user.id}>`,
          "inline": true
        },
        {
          "name": `Ticket Name:`,
          "value": `${channel.name}(<#${channel.id}>)`,
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
}else{
  let response = await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${context.params.event.channel_id}`,
    "content": `<@${context.params.event.member.user.id }>`,
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Yikes!`,
      "description": `This command is only for our support staff...`,
      "color": 0xff0000
    }
  });
  
  await sleep(5000);
  await lib.discord.channels['@0.1.1'].messages.destroy({
    message_id: `${response.id}`,
    channel_id: `${response.channel_id}`
  });
}
