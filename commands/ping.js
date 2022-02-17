module.exports = {
  argsn: false,
	name: 'ping',
  cooldown: 30,
	description: 'Returns current response delay.',
	execute(message, args) {
    message.channel.send('pinging').then(m => {
    m.edit(`🏓Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
  });
	},
};
