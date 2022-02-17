const fs = require('fs');
const jsonfile = require('jsonfile');

module.exports = {
  argsn: true,
	name: 'team',
  cooldown: 3,
	description: 'Adds specified team role.',
  guildOnly: true,
  usage: '[team name]',
	execute(message, args) {
    if(message.channel != message.member.guild.channels.cache.get('721146718489542756')) {
      return message.delete();
    }
    var roles = {};
    if(fs.existsSync('roleMap.json')) {
    	roles = jsonfile.readFileSync('roleMap.json');
    }
    const a = args[0].toLowerCase();
    let role = roles[a];
    try{
      if(message.guild.member(message.author).roles.cache.has(role.roleID)) {
        message.member.roles.remove(role.roleID);
        const name = args[0].substr(0,1).toUpperCase() + args[0].substr(1).toLowerCase();
        return message.member.guild.channels.cache.get('721146718489542756').send('<@' + message.author + '>, you have left Team ' + name);
      }else {
        message.member.roles.add(role.roleID);
        const name = args[0].substr(0,1).toUpperCase() + args[0].substr(1).toLowerCase();
        return message.member.guild.channels.cache.get('721146718489542756').send('<@' + message.author + '>, you have joined Team ' + name);
      }

    }catch(error) {
      console.error(error);
      return message.reply('this team does not exist.')
    }
	},
};
