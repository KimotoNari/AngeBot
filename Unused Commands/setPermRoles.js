const fs = require('fs');
const jsonfile = require('jsonfile');
module.exports = {
  argsn: true,
	name: 'setpermroles',
  guildOnly: true,
	description: 'Sets Mod and Admin roles.',
  usage: '[mod role id\'s separated by $] [admin role id\'s separated by $]',
	execute(message, args) {
    if(message.author.id != message.guild.owner.id) {
      return message.reply('only the guild owner can use this command!');
    }

    var perms = {};
    if(fs.existsSync('perms.json')) {
    	perms = jsonfile.readFileSync('perms.json');
    }

    if(message.guild.id in perms === false) {
			perms[message.guild.id] = {adminRoles: {},
			modRoles: {}};
		}

    const guildPerms = perms[message.guild.id];
    guildPerms.modRoles = args[0].split('$');
    guildPerms.adminRoles = args[1].split('$');
    //message.channel.send(args[1]);
    jsonfile.writeFileSync('perms.json',perms);
    message.reply('perm roles have been set.');

    //message.reply('testing');
	},
};
