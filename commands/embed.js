const {prefix,modRoles,adminRoles} = require('../config.json');

module.exports = {
  argsn: true,
	name: 'embed',
  cooldown: 0,
  guildOnly: true,
	description: 'Makes message into an embed.',
	execute(message, args) {
    //if(message.author.id != message.guild.owner.id) {
      //return message.reply('only the guild owner can use this command!');
    //}

    if(!(message.guild.member(message.author).roles.cache.has(`${modRoles}`) || message.guild.member(message.author).roles.cache.has(`${adminRoles}`))) {
      return message.reply('you do not have the required permissions to perform this action!')
    }
    const mes = message.content.substr(8);
    message.channel.send({embed: {
        color: 15158332,
        description: mes

      }
    });
    message.delete();
	},
};
