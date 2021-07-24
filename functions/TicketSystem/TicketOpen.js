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

let rateLimit = await lib.utils.kv['@0.1.16'].get({
  key: `rate_limit_ticket_${context.params.event.member.user.id}`
});

if (rateLimit){
  //If user is being rate limited
  let response = await lib.discord.channels['@0.1.1'].messages.create({
    "channel_id": `${context.params.event.channel_id}`,
    "content": "",
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `Cooldown`,
      "description": `You are being **rate limited** <@${context.params.event.member.user.id}>!`,
      "color": 0xff0000,
      "fields": [
        {
          "name": `Default cooldown is 30 seconds...`,
          "value": "\u200B"
        }
      ]
    }
  });
  
  await sleep(5000);
  await lib.discord.channels['@0.1.1'].messages.destroy({
    message_id: `${response.id}`,
    channel_id: `${response.channel_id}`
  });
}else{
  //If user is not being rate limited
  let queryResult = await lib.airtable.query['@1.0.0'].select({
    table: 'Tickets',
    where: [{
      User__icontains: context.params.event.member.user.id
    }]
  });
  
  if (!queryResult.rows.length) {
    //If user didnt opened a ticket
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
              "label": `Yes`,
              "custom_id": `ticket-create`,
              "disabled": false,
              "type": 2
            },
            {
              "style": 4,
              "label": `Cancel`,
              "custom_id": `help-exit`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ],
      "embed": {
        "type": "rich",
        "title": `Contact Support`,
        "description": `Are you sure you want to open a ticket?\n\n*Please note that misuse of this system will result in moderation action being taken*`,
        "color": 0xffae00
      }
    });
    
    await lib.utils.kv['@0.1.16'].set({
      key: `rate_limit_ticket_${context.params.event.member.user.id}`,
      value: `true`,
      ttl: 30 // The number of seconds to rate limit a person for.
    });
    
    try {
      await sleep(15000);
      await lib.discord.channels['@0.1.1'].messages.destroy({
        message_id: `${response.id}`,
        channel_id: `${response.channel_id}`
      });
    }catch (e){
      
    }
  }else{
    //If user already opened a ticket
    let matchedTicketRow = queryResult.rows[0];
    if (matchedTicketRow.fields.Status === "Open") {
      let response = await lib.discord.channels['@0.1.1'].messages.create({
        "channel_id": `${context.params.event.channel_id}`,
        "content": "",
        "tts": false,
        "embed": {
          "type": "rich",
          "title": `Yikes!`,
          "description": `It looks like you have an existing open ticket <@${context.params.event.member.user.id}>!`,
          "color": 0xff0000
        }
      });
      
      await sleep(5000);
      await lib.discord.channels['@0.1.1'].messages.destroy({
        message_id: `${response.id}`,
        channel_id: `${response.channel_id}`
      });
    }else{
      if (matchedTicketRow.fields.Status === "Close") {
        let response = await lib.discord.channels['@0.1.1'].messages.create({
          "channel_id": `${context.params.event.channel_id}`,
          "content": "",
          "tts": false,
          "embed": {
            "type": "rich",
            "title": `Yikes!`,
            "description": `It looks like you have an existing closed ticket <@${context.params.event.member.user.id}>!\n\nKindly contact someone from the support staff if you think this is an issue.`,
            "color": 0xff0000
          }
        });
        
        await sleep(5000);
        await lib.discord.channels['@0.1.1'].messages.destroy({
          message_id: `${response.id}`,
          channel_id: `${response.channel_id}`
        });
      }
    }
  }
}
