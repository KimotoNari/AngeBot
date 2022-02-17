const fs = require('fs');
const jsonfile = require('jsonfile');

module.exports = {
  argsn: true,
	name: 'teamadd',
  cooldown: 3,
	description: 'Adds specified team role to list of avaliable team roles',
  guildOnly: true,
  usage: '[team name] [role id]',
	execute(message, args) {
    if(message.author.id != message.guild.owner.id) {
      return message.reply('only the guild owner can use this command!');
    }
    var roles = {};
    if(fs.existsSync('roleMap.json')) {
    	roles = jsonfile.readFileSync('roleMap.json');
    }
    if(args[0] in roles === false) {
      roles[args[0]] = {
        roleID: args[1]
      }
    }else {
      return message.reply('team role has already been added.');
    }
    jsonfile.writeFileSync('roleMap.json',roles);
    return message.reply('team role has been added to the list.');
	},
};
