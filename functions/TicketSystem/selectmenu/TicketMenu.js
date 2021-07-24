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

let result = context.params.event.data.values[0]

if (result === "bug-report"){
  //When user chose bug-report
  await lib.discord.channels['@0.1.2'].messages.update({
    "message_id": `${context.params.event.message.id}`,
    "channel_id": `${context.params.event.channel_id}`,
    "content": "@here",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Ticket Details`,
      "description": "",
      "color": 0xff4300,
      "fields": [
        {
          "name": `Topic`,
          "value": "Bug Report"
        },
        {
          "name": `User`,
          "value": `<@${context.params.event.member.user.id}>`
        },
        {
          "name": `Staff`,
          "value": "<@&863779714677342208>"
        }
      ]
    }
  });
  
  let Userperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${context.params.event.member.user.id}`,
    channel_id: channel.id,
    allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
    deny:  `${1 << 31}`,
    type: 1
  });
  
  let Supportperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.SUPPORTROLE}`,
    channel_id: channel.id,
    deny: `${1 << 10}`,
    type: 0
  });
  
  let Devperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.DEVTEAM}`,
    channel_id: channel.id,
    allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
    type: 0
  });
  
  let Modperms = await lib.discord.channels['@0.1.1'].permissions.update({
    overwrite_id: `${process.env.MODROLE}`,
    channel_id: channel.id,
    deny: `${1 << 10}`,
    type: 0
  });
  
  await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${process.env.LOGS}`,
    "content": "",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Ticket Topic`,
      "description": "",
      "color": 0xffdd00,
      "fields": [
        {
          "name": `Ticket Name:`,
          "value": `${channel.name}(<#${channel.id}>)`,
          "inline": true
        },
        {
          "name": `Topic:`,
          "value": "Bug-Report",
          "inline": true
        },
        {
          "name": `Staff:`,
          "value": "<@&863779714677342208>",
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
  
  let result = await lib.airtable.query['@1.0.0'].update({
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
      'Topic': `bug-report`,
      'Staff': `<@&863779714677342208>`
    },
    typecast: false
  });
  
}else{
  if (result === "business"){
    //When user chose business
    await lib.discord.channels['@0.1.2'].messages.update({
      "message_id": `${context.params.event.message.id}`,
      "channel_id": `${context.params.event.channel_id}`,
      "content": "@here",
      "tts": false,
      "embed": {
        "type": "rich",
        "title": `Ticket Details`,
        "description": "",
        "color": 0xff4300,
        "fields": [
          {
            "name": `Topic`,
            "value": "Business"
          },
          {
            "name": `User`,
            "value": `<@${context.params.event.member.user.id}>`
          },
          {
            "name": `Staff`,
            "value": "<@&842396296391426098>, <@&832033476194205737>, <@&863603332706336799>"
          }
        ]
      }
    });
    
    let Userperms = await lib.discord.channels['@0.1.1'].permissions.update({
      overwrite_id: `${context.params.event.member.user.id}`,
      channel_id: channel.id,
      allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
      deny:  `${1 << 31}`,
      type: 1
    });
    
    let Supportperms = await lib.discord.channels['@0.1.1'].permissions.update({
      overwrite_id: `${process.env.SUPPORTROLE}`,
      channel_id: channel.id,
      deny: `${1 << 10}`,
      type: 0
    });
    
    let Devperms = await lib.discord.channels['@0.1.1'].permissions.update({
      overwrite_id: `${process.env.DEVTEAM}`,
      channel_id: channel.id,
      deny: `${1 << 10}`,
      type: 0
    });
    
    let Modperms = await lib.discord.channels['@0.1.1'].permissions.update({
      overwrite_id: `${process.env.MODROLE}`,
      channel_id: channel.id,
      deny: `${1 << 10}`,
      type: 0
    });
    
    await lib.discord.channels['@0.1.1'].messages.create({
      "channel_id": `${process.env.LOGS}`,
      "content": "",
      "tts": false,
      "embed": {
        "type": "rich",
        "title": `Ticket Topic`,
        "description": "",
        "color": 0xffdd00,
        "fields": [
          {
            "name": `Ticket Name:`,
            "value": `${channel.name}(<#${channel.id}>)`,
            "inline": true
          },
          {
            "name": `Topic:`,
            "value": "Business",
            "inline": true
          },
          {
            "name": `Staff:`,
            "value": "<@&842396296391426098>, <@&832033476194205737>, <@&863603332706336799>",
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
    
    let result = await lib.airtable.query['@1.0.0'].update({
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
        'Topic': `Business`,
        'Staff': `<@&842396296391426098>, <@&832033476194205737>, <@&863603332706336799>`
      },
      typecast: false
    });
    
  }else{
    if (result === "technical-support"){
      //When user chose technical
      await lib.discord.channels['@0.1.2'].messages.update({
        "message_id": `${context.params.event.message.id}`,
        "channel_id": `${context.params.event.channel_id}`,
        "content": "@here",
        "tts": false,
        "embed": {
          "type": "rich",
          "title": `Ticket Details`,
          "description": "",
          "color": 0xff4300,
          "fields": [
            {
              "name": `Topic`,
              "value": "Technical Support"
            },
            {
              "name": `User`,
              "value": `<@${context.params.event.member.user.id}>`
            },
            {
              "name": `Staff`,
              "value": "<@&863779714677342208>, <@&863775063386750996>"
            }
          ]
        }
      });
      
      let Userperms = await lib.discord.channels['@0.1.1'].permissions.update({
        overwrite_id: `${context.params.event.member.user.id}`,
        channel_id: channel.id,
        allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
        deny:  `${1 << 31}`,
        type: 1
      });
      
      let Supportperms = await lib.discord.channels['@0.1.1'].permissions.update({
        overwrite_id: `${process.env.SUPPORTROLE}`,
        channel_id: channel.id,
        allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
        type: 0
      });
      
      let Devperms = await lib.discord.channels['@0.1.1'].permissions.update({
        overwrite_id: `${process.env.DEVTEAM}`,
        channel_id: channel.id,
        allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
        deny:  `${1 << 31}`,
        type: 0
      });
      
      let Modperms = await lib.discord.channels['@0.1.1'].permissions.update({
        overwrite_id: `${process.env.MODROLE}`,
        channel_id: channel.id,
        deny: `${1 << 10}`,
        type: 0
      });
      
      await lib.discord.channels['@0.1.1'].messages.create({
        "channel_id": `${process.env.LOGS}`,
        "content": "",
        "tts": false,
        "embed": {
          "type": "rich",
          "title": `Ticket Topic`,
          "description": "",
          "color": 0xffdd00,
          "fields": [
            {
              "name": `Ticket Name:`,
              "value": `${channel.name}(<#${channel.id}>)`,
              "inline": true
            },
            {
              "name": `Topic:`,
              "value": "Technical Support",
              "inline": true
            },
            {
              "name": `Staff:`,
              "value": "<@&863779714677342208>, <@&863775063386750996>",
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
      
      let result = await lib.airtable.query['@1.0.0'].update({
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
          'Topic': `technical-support`,
          'Staff': `<@&863779714677342208>, <@&863775063386750996>`
        },
        typecast: false
      });
      
    }else{
      if (result === "others"){
        //When user chose others
        await lib.discord.channels['@0.1.2'].messages.update({
          "message_id": `${context.params.event.message.id}`,
          "channel_id": `${context.params.event.channel_id}`,
          "content": "@here",
          "tts": false,
          "embed": {
            "type": "rich",
            "title": `Ticket Details`,
            "description": "",
            "color": 0xff4300,
            "fields": [
              {
                "name": `Topic`,
                "value": "Others"
              },
              {
                "name": `User`,
                "value": `<@${context.params.event.member.user.id}>`
              },
              {
                "name": `Staff`,
                "value": "<@&863757382420922418>, <@&863779714677342208>, <@&863775063386750996>"
              }
            ]
          }
        });
        
        let Userperms = await lib.discord.channels['@0.1.1'].permissions.update({
          overwrite_id: `${context.params.event.member.user.id}`,
          channel_id: channel.id,
          allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
          deny:  `${1 << 31}`,
          type: 1
        });
        
        let Supportperms = await lib.discord.channels['@0.1.1'].permissions.update({
          overwrite_id: `${process.env.SUPPORTROLE}`,
          channel_id: channel.id,
          allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
          type: 0
        });
        
        let Devperms = await lib.discord.channels['@0.1.1'].permissions.update({
          overwrite_id: `${process.env.DEVTEAM}`,
          channel_id: channel.id,
          allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
          deny:  `${1 << 31}`,
          type: 0
        });
        
        let Modperms = await lib.discord.channels['@0.1.1'].permissions.update({
          overwrite_id: `${process.env.MODROLE}`,
          channel_id: channel.id,
          allow: `${1 << 10 | 1 << 11 | 1 << 14 | 1 << 15 | 1 << 16}`,
          deny:  `${1 << 31}`,
          type: 0
        });
        
        await lib.discord.channels['@0.1.1'].messages.create({
          "channel_id": `${process.env.LOGS}`,
          "content": "",
          "tts": false,
          "embed": {
            "type": "rich",
            "title": `Ticket Topic`,
            "description": "",
            "color": 0xffdd00,
            "fields": [
              {
                "name": `Ticket Name:`,
                "value": `${channel.name}(<#${channel.id}>)`,
                "inline": true
              },
              {
                "name": `Topic:`,
                "value": "Others",
                "inline": true
              },
              {
                "name": `Staff:`,
                "value": "<@&863757382420922418>, <@&863779714677342208>, <@&863775063386750996>",
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
        
        let result = await lib.airtable.query['@1.0.0'].update({
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
            'Topic': `others`,
            'Staff': `<@&863757382420922418>, <@&863779714677342208>, <@&863775063386750996>`
          },
          typecast: false
        });
        
      }
    }
  }
}
