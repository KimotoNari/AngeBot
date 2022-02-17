module.exports = {
  argsn: true,
	name: 'say',
  cooldown: 0,
  guildOnly: true,
	description: 'dont worry about it',
	execute(message, args) {
    if(message.author.id != message.guild.owner.id) {
      return message.reply('only the guild owner can use this command!');
    }
    const mes = message.content.substr(6);
    message.channel.send(mes);
    message.delete();
	},
};
