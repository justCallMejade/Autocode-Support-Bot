// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let reason = context.params.event.data.options[0].value

const sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms || 0);
  });
};

let channel = await lib.discord.channels['@0.1.2'].retrieve({
  channel_id: `${context.params.event.channel_id}`
});

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
  
  if (channel.parent_id === `${process.env.CATEGORY}`){
    
    if(channel.id === "863787880778170438" || channel.id === `${process.env.LOGS}`) {
      let response= await lib.discord.channels['@0.1.1'].messages.create({
        "channel_id": `${context.params.event.channel_id}`,
        "content": "",
        "tts": false,
        "embed": {
          "type": "rich",
          "title": `Error`,
          "description": `It looks like you are tying to close a non-ticket channel...`,
          "color": 0xff0000
        }
      });
      
      await sleep(5000);
      await lib.discord.channels['@0.1.1'].messages.destroy({
        message_id: `${response.id}`,
        channel_id: `${response.channel_id}`
      });
    }else{
      
      let data = await lib.airtable.query['@1.0.0'].select({
        table: `Tickets`,
        where: [
          {
            'TicketID__icontains': `${context.params.event.channel_id}`
          }
        ],
        limit: {
          'count': 0,
          'offset': 0
        }
      });
      
      let datareult = data.rows[0];
      
      if (datareult.fields.Status === "Close"){
        let response = await lib.discord.channels['@0.1.1'].messages.create({
          "channel_id": `${context.params.event.channel_id}`,
          "content": "",
          "tts": false,
          "embed": {
            "type": "rich",
            "title": `Error`,
            "description": `Ticket is already closed`,
            "color": 0xff0000
          }
        });
        
        await sleep(5000);
        await lib.discord.channels['@0.1.1'].messages.destroy({
          message_id: `${response.id}`,
          channel_id: `${response.channel_id}`
        });
      }else{
        let response = await lib.discord.channels['@0.1.1'].messages.create({
          "channel_id": `${context.params.event.channel_id}`,
          "content": "",
          "tts": false,
          "components": [
            {
              "type": 1,
              "components": [
                {
                  "style": 2,
                  "label": `Re-Open Ticket`,
                  "custom_id": `ticket-reopen`,
                  "disabled": false,
                  "type": 2
                },
                {
                  "style": 4,
                  "label": `Delete Ticket`,
                  "custom_id": `ticket-delete`,
                  "disabled": false,
                  "type": 2
                }
              ]
            }
          ],
          "embed": {
            "type": "rich",
            "title": `Ticket Closed`,
            "description": `Ticket succesfully closed, user is restricted temporarily.`,
            "color": 0xff0000,
            "fields": [
              {
                "name": `Staff`,
                "value": `<@${context.params.event.member.user.id}>`,
                "inline": true
              },
              {
                "name": `Reason:`,
                "value": `${reason}`
              },
              {
                "name": `Date and Time:`,
                "value": `${date} | ${time}UTC`,
                "inline": true
              }
            ]
          }
        });
        
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
            'Status': `Close`
          },
          typecast: false
        });
        
        await lib.discord.channels['@0.1.1'].messages.create({
          "channel_id": `${process.env.LOGS}`,
          "content": "",
          "tts": false,
          "embed": {
            "type": "rich",
            "title": `Ticket Closed`,
            "description": "",
            "color": 0xff5e00,
            "fields": [
              {
                "name": `Staff`,
                "value": `<@${context.params.event.member.user.id}>`,
                "inline": true
              },
              {
                "name": `Ticket Name:`,
                "value": `${channel.name}`,
                "inline": true
              },
              {
                "name": `Reason:`,
                "value": `${reason}`
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
    }
  }else{
    let response= await lib.discord.channels['@0.1.1'].messages.create({
      "channel_id": `${context.params.event.channel_id}`,
      "content": "",
      "tts": false,
      "embed": {
        "type": "rich",
        "title": `Error`,
        "description": `It looks like you are tying to close a non-ticket channel...`,
        "color": 0xff0000
      }
    });
    
    await sleep(5000);
    await lib.discord.channels['@0.1.1'].messages.destroy({
      message_id: `${response.id}`,
      channel_id: `${response.channel_id}`
    });
  }
  
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
