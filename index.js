//imports
const {prefix, token} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const jsonfile = require('jsonfile');
const random = require('random');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
//cooldown Collection
const cooldowns = new Discord.Collection();

//client ready
client.once('ready', () => {
	client.user.setPresence({ activity: { name: 'Pri Pri | prefix a!' }, status: 'online' }).then(console.log).catch(console.error);

	console.log('Ready!');
});

//Load stats json file
var stats = {};
if(fs.existsSync('stats.json')) {
	stats = jsonfile.readFileSync('stats.json');
}

//welcome
client.on('guildMemberAdd', member =>{
	member.guild.channels.cache.get('721111546473742348').send('**__Welcome to the server, <@' + member.user + '>!__**\nDon\'t forget to visit ' + member.guild.channels.cache.get('721146718489542756').toString() + 'to join your favorite character\'s team, and feel free to introduce yourself in ' + member.guild.channels.cache.get('721102906496909372').toString()+ '!');
	console.log(member.username + "has joined");
	//member.roles.add('721092575939002499');
});

client.on('guildMemberRemove', member => {
	member.guild.channels.cache.get('721111546473742348').send(member.user.tag + ' was caught by the Duke of Normandy.');
	console.log(member.username + "has left");
});

//recurring message check
client.on('message', message => {
	//if message sent by this bot then return
	if(message.author.id == client.user.id) {
		return;
	}

	//adds new member if not in guild list
	if(message.author.id in stats === false) {
			stats[message.author.id] = {
			xp: 0,
			level: 0,
			last_message:0
		};
	}

	//exp and levels
	if(message.guild != null && !message.author.bot) {
		const userStats = stats[message.author.id];
		if(Date.now() - userStats.last_message > 60000) { //limits to once per minute
			//increments exp by 15
			userStats.xp += random.int(15,25);
			//updates time of last message given exp
			userStats.last_message = Date.now();

			//calculates exp needed per level
			const xpToNextLevel = 5*Math.pow(userStats.level,2) + 50 * userStats.level + 100;

			//level check
			if(userStats.xp >= xpToNextLevel) {
				userStats.level++;
				userStats.xp = userStats.xp - xpToNextLevel;
				message.guild.channels.cache.get('721099048324432013').send('<@' + message.author + '> has reached level ' + userStats.level);
			}
			//level roles
			if(userStats.level == 100 && !message.member.roles.cache.has('721046377244917871')) {
				message.member.roles.remove('721095557418057778');
				message.member.roles.add('721046377244917871');

				message.guild.channels.cache.get('721111546473742348').send({embed: {
				    color: 3447003,
				    title: "Congrats " + message.author.username + "!",
				    description: "You are now part of Control!\nYou have been part of the spy business for so long and now you have been promoted to the hightest level of command.",
				  }
				});

			}else if(userStats.level == 75 && !message.member.roles.cache.has('721095557418057778')) {
				message.member.roles.remove('721092763420196981');
				message.member.roles.add('721095557418057778');

				message.guild.channels.cache.get('721111546473742348').send({embed: {
				    color: 3447003,
				    title: "Congrats " + message.author.username + "!",
				    description: "You are now an Elite!\nYou have been working hard as a specialist and have been promoted!",
				  }
				});

			}else if(userStats.level == 50 && !message.member.roles.cache.has('721092763420196981')) {
				message.member.roles.remove('721092715139432450');
				message.member.roles.add('721092763420196981');

				message.guild.channels.cache.get('721111546473742348').send({embed: {
				    color: 3447003,
				    title: "Congrats " + message.author.username + "!",
				    description: "You are now a Specialist!\nYou have been working as a spy for a long time and have become a specialist at what you do.",
				  }
				});

			}else if(userStats.level == 25 && !message.member.roles.cache.has('721092715139432450')) {
				message.member.roles.remove('721092660575731792');
				message.member.roles.add('721092715139432450');

				message.guild.channels.cache.get('721111546473742348').send({embed: {
				    color: 3447003,
				    title: "Congrats " + message.author.username + "!",
				    description: "You are now a Spy!\nYou have shown your worth to Control and they have acknowledged you as a full fledged spy.",

				  }
				});

			}else if(userStats.level == 10 && !message.member.roles.cache.has('721092660575731792')) {
				message.member.roles.remove('721092575939002499');
				message.member.roles.add('721092660575731792');

				message.guild.channels.cache.get('721111546473742348').send({embed: {
				    color: 3447003,
				    title: "Congrats " + message.author.username + "!",
				    description: "You are now a Rookie!\nYou have now completed your studies as a student.\nYou can now use external emojis!",

				  }
				});
			}

			//sync stats json with stats var
			jsonfile.writeFileSync('stats.json',stats);

			//console logs
			console.log(message.author.username + ' now has ' + userStats.xp);
			console.log(xpToNextLevel + ' XP needed for next level');
		}
	}


	//checks for prefix and from member
	if(!message.content.toLowerCase().startsWith(prefix) || message.author.bot) {
		return;
	}
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	//guildOnly checks
	if(command.guildOnly && message.channel.type!=='text') {
		return message.reply('I can\'t follow those orders in DMs!')
	}
	//invalid argument check
	if(command.argsn && !args.length) {
		let reply = `You didn't provide me with enough information, ${message.author}!`;
		if(command.usage) {
			reply += `\nThe proper information would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	//add to cooldown list
	if(!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	//cooldown calculator
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	//command cooldown
	if(timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	//reset cooldown
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	//command execute
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('no such command exists!');
	}
});

client.login(token);
