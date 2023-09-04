
const fs = require('fs');
const jsonfile = require('jsonfile');
const { createCanvas, loadImage} = require('canvas');
const {MessageAttachment} = require('discord.js');
const {join} = require('path');
const canvacord = require("canvacord");

module.exports = {
  argsn: false,
  guildOnly: false,
	name: 'rank',
  cooldown: 10,
	description: 'Displays current level and exp.',
	execute(message, args) {
    var stats = {};
    if(fs.existsSync('stats.json')) {
    	stats = jsonfile.readFileSync('stats.json');
    }
    let userStats = stats[message.author.id];
    if(args.length && args in stats === true) {
      userStats = stats[args];
    }

    const rank = new canvacord.Rank();

    rank.setAvatar(message.author.displayAvatarURL({dynamic:false, format: 'png'}));
    rank.setCurrentXP(userStats.xp);
    rank.setRequiredXP(5*Math.pow(userStats.level,2) + 50 * userStats.level + 100);
    rank.setStatus(message.member.presence.status);
    rank.setProgressBar('#FFA500',"COLOR");
    rank.setUsername(message.author.username);
    rank.setDiscriminator(message.author.discriminator);
    rank.setLevel(userStats.level);
    rank.setRank(1,'Rank',false);

    rank.build().then(data => {
        const attachment = new MessageAttachment(data,'rank.png');
        message.author.send(attachment);
        message.delete();
      });
  },
};
