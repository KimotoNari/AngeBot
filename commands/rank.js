
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
    /*const canvas = createCanvas(1000, 333);
    const ctx = canvas.getContext("2d");
    loadImage(join(__dirname, "..", "img", "background.jpg")).then((background) => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    });

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#000000";
    ctx.fillRect(180,216,770,65);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeRect(180, 216,770,65);
    ctx.stroke();

    ctx.fillStyle = "#e67e22";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(180,216, ((100/(5*Math.pow(userStats.level,2) + 50 * userStats.level + 100)*userStats.xp)*7.7),65);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${userStats.xp}/${5*Math.pow(userStats.level,2) + 50 * userStats.level + 100} XP`, 600, 260);

    ctx.textAlign = "left";
    ctx.fillText(message.author.tag,300, 120);

    ctx.font = "50px Arial";
    ctx.fillText("Level:", 300,180);
    ctx.fillText(userStats.level,470,180);

    ctx.arc(170, 160, 120, 0, Math.PI*2,true);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    loadImage(message.author.displayAvatarURL({format:"jpg"})).then(avatar => {ctx.drawImage(avatar,40,40,250,250);});

    const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");

    message.channel.send(attachment);*/

  },
};
