const dotenv = require('dotenv');
const tmi = require('tmi.js');
const { Client: twitch } = require('tmi.js')


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


// Twitch Bot

// Define configuration options
const opts = {
	identity: {
	  username: process.env.BOT_USERNAME,
	  password: process.env.OAUTH_TOKEN,
	},
	channels: [process.env.CHANNEL_NAME],
  };
  
  // Create a client with our options
  const twitchBot = new tmi.client(opts);
  
  // Register our event handlers (defined below)
  twitchBot.on("message", onMessageHandler);
  twitchBot.on("connected", onConnectedHandler);
  
  // Connect to Twitch:
  twitchBot.connect();
  
  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self) {
	if (self) {
	  return;
	} // Ignore messages from the bot
  
	// Remove whitespace from chat message
	const commandName = msg.trim();
  
	// If the command is known, let's execute it
	if (commandName === "!dice") {
	  const num = rollDice(commandName);
	  twitchBot.say(
		target,
		`You rolled a 12-sided dice. It's a ${num}!`
	  );
  
	  if (num === 7) {
		  
	  }
  
	  console.log(`* Executed ${commandName} command`);
	} else {
	  console.log(`* Unknown command ${commandName}`);
	}
  }
  
  // Function called when the "dice" command is issued
  function rollDice() {
	const sides = 12;
	return Math.floor(Math.random() * sides) + 1;
  }
  
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
	
  }