const dotenv = require('dotenv');
const tmi = require('tmi.js');


dotenv.config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);

	}
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// TWITCH BOT SECTION

  
  // Create a client with our options
  const twitchClient = new tmi.client(process.env.identity, process.env.channels);
  
  // Register our event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  
  // Connect to Twitch:
  twitchClient.connect();
  
  // Called every time a message comes in
  function onMessageHandler (target, context, msg, self) {
	if (self) { return; } // Ignore messages from the bot
  
	// Remove whitespace from chat message
	const commandName = msg.trim();
  
	// If the command is known, let's execute it
	if (commandName === '!dice') {
	  const num = rollDice();
	  twitchClient.say(target, `You rolled a ${num}`);
	  console.log(`* Executed ${commandName} command`);
	} else {
	  console.log(`* Unknown command ${commandName}`);
	}
  }
  
  // Function called when the "dice" command is issued
  function rollDice () {
	const sides = 6;
	return Math.floor(Math.random() * sides) + 1;
  }
  
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
  }