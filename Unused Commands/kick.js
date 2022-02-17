//imports
const {prefix,modRoles,adminRoles} = require('../config.json');
const fs = require('fs');
const jsonfile = require('jsonfile');

//module
module.exports = {
  //vars
  argsn: true,
	name: 'kick',
  guildOnly: true,
  cooldown: 3,
	description: 'Kicks requested member.',
  //function
	execute(message, args) {
      //perm check
      if(!(message.guild.member(message.author).roles.cache.has(`${modRoles}`) || message.guild.member(message.author).roles.cache.has(`${adminRoles}`))) {
        return message.reply('you do not have the required permissions to perform this action!')
      }
      //arg check
      if(!args.length) {
        return message.channel.send('You did not specify a person!');
      }

      if (!args[1]) return message.reply('You forgot to enter a reason for this kick!');
      let user = message.mentions.users.first();
      if(user) {
        if (user === message.author) return message.channel.send('You can\'t kick yourself');
        if (!message.guild.member(user).bannable) return message.reply('You can\'t kick this user because you the bot has not sufficient permissions!');
        const member = message.guild.member(user);
        if(member) {
          args.shift();
          member.send('You have been kicked. \nReason: ' + args);
          member.kick(args).then(() => {
            message.reply(`Successfully kicked ${user.tag}`);
          });

        } else {
          message.reply('that user does not exist.');
        }
      }else {
        //try {
          user = message.guild.members.fetch(args[0]);
          //user = user.user;
          if (user === message.author) return message.channel.send('You can\'t kick yourself');
          //if (!user.bannable) return message.reply('You can\'t kick this user because you the bot has not sufficient permissions!');
          const member = message.guild.member(user);
          member.kick(args).then(() => {
            message.reply(`Successfully kicked ${user.tag}`);
          });
        //} catch(error) {
        //  return message.reply('that user does not exist, or is unable to be banned by the bot.');
        //}
      }



	},
};
