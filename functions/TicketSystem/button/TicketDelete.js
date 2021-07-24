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

let channel = await lib.discord.channels['@0.1.2'].retrieve({
  channel_id: context.params.event.channel_id
});

const sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms || 0);
  });
};

if (context.params.event.member.roles.includes(`${process.env.SUPPORTROLE}`) || context.params.event.member.roles.includes(`${process.env.MODROLE}`) || context.params.event.member.roles.includes(`${process.env.DEVTEAM}`) || context.params.event.member.permission_names.includes('ADMINISTRATOR')) {
  
  let datachange = await lib.airtable.query['@1.0.0'].update({
    table: `Tickets`,
    where: [
      {
        'TicketID__icontains': `${context.params.event.channel_id}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'Status': `deleted`,
      'DateDeleted': `${date} | ${time}UTC`
    },
    typecast: false
  });
  
  await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${process.env.LOGS}`,
    "content": "",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Ticket Deleted!`,
      "description": "",
      "color": 0xff0000,
      "fields": [
        {
          "name": `User:`,
          "value": `<@${channel.topic}>`,
          "inline": true
        },
        {
          "name": `Ticket Name:`,
          "value": `${channel.name}(<#${channel.id}>)`,
          "inline": true
        },
        {
          "name": `Staff:`,
          "value": `<@${context.params.event.member.user.id}>`,
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
  
  let data = await lib.airtable.query['@1.0.0'].delete({
    table: `Tickets`,
    where: [
      {
        'User__icontains': `${channel.topic}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    }
  });
  
  let result = await lib.discord.channels['@0.1.2'].destroy({
    channel_id: `${context.params.event.channel_id}`
  });
  
  try {
    let dm = await lib.discord.users['@0.1.4'].dms.create({
    recipient_id: `${channel.topic}`,
    content: "",
    "tts": false,
      "embed": {
        "type": "rich",
        "title": `Support Team`,
        "description": `Thank you for contacting us, we hope we solve your issues or talked about your concerns.\n\nIf you want to contact us again, don't hesitate to open a ticket.`,
        "color": 0x77ff00
      }
    });
  }catch (e){
    
  }
}else{
  let response = await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${context.params.event.channel_id}`,
    "content": `${context.params.event.member.user.id}`,
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
