module.exports = {
  argsn: true,
	name: 'suggest',
  cooldown: 86400,
	description: 'Adds a suggestion to the suggestions channel.',
  guildOnly: true,
  usage: '[suggestion]',
	execute(msg, args) {
    let id;
    msg.member.guild.channels.cache.get('721212425701163039').send(msg.content.substr(10)).then(message => {
      message.react('✅').then(() => message.react('❌'));
    });
    //const msg = message.member.guild.channels.cache.get('720509526490480671').messages.fetch(id);

    msg.delete();
    return;
	},
};
