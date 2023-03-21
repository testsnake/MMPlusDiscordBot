const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, Discord } = require('discord.js');
const { token } = require('./config.json');  // Needs to be added for bot use
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');
// const youtube = require('discord-bot-youtube-notifications');


//Logging channel
const loggingChannelId = '1008978799989362808';

const notificationChannelId = `1037117351868514396`;

const youtubeIdFile = 'youtube.txt';

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		]
});



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


// // Youtube Notification Handeling
// const Notifier = new youtube.notifier(client, {
// 	message: "**{author}** just published a new video!\n{url}"
// });

// // Adds notifier for each youtube ID in youtube.txt
// fs.readFile(youtubeIdFile, 'utf-8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   const lines = data.trim().split('\n');

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].toString(); // Convert each line to a string
//     Notifier.addNotifier(line, notificationChannelId);
//     console.log(line);
//   }
// });


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	console.log(command);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(event);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


//shorthand regex test
function rxt(message, regExPattern) {
	return regExPattern.test(message.content);
}

// No Ping Reply
function nPR(message, text) {
	message.reply({content: text, allowedMentions: { repliedUser: false }})
	.catch(console.error);
}


function errMsg(err) {
	
	console.log("unhandled error");
	console.log(err);

	const embed = {
			color: parseInt('ff0000', 16),
			author: {
				name: user.tag,
				iconURL: user.avatarURL()
			},
			description: `MikuBot has Encountered an Error\n${err}`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		client.channels.fetch(loggingChannelId).send({ embeds: [embed] });

}


// Event Triggers
client.once("ready", async client => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	client.user.setActivity('Eden Project');
	const loggingChannelId = '1008978799989362808';
	const loggingChannel = await client.channels.fetch(loggingChannelId);
	if (!loggingChannel) return;
	const embed = {
		color: parseInt('86cecb', 16),
		description: `おはよう！ ${mikuBotVer} is Ready!`,
		timestamp: new Date()
	};
	loggingChannel.send({ embeds: [embed] });
});

client.on('messageCreate', (message) => {
	try {
		if(message.author.bot) return;
		console.log("Received a message: " + message.content);

		const channelIdEmergancy = '1008921373000863754';
	  	// Check if the message is in #emergency-meeting

		if (message.channel.id === channelIdEmergancy) {
			if (rxt(message, /brogamer/i)) {


				message.reply(`Go to <#1033012124311617577> pls.`)
				.then(msg => {
					setTimeout(() => msg.delete(), 5000)
				})
				.catch(console.error);
			}
		}


		if (rxt(message, /\bass\b/i)) {
			nPR(message, 'https://cdn.discordapp.com/attachments/421865513820618752/1071615776127201424/169F55F1-C038-41DD-9264-BD3D9E8C6D60.gif');
		} else if (rxt(message, /brazil/i)) {
			message.reply(`<@276054611972849664> https://cdn.discordapp.com/attachments/1033012124311617577/1071113408281317416/image.png`);
		} else if (rxt(message, /communism/i)) {
			nPR(message, `https://images-ext-2.discordapp.net/external/qa4Sl-sOX5SfKTB_N5_RQIXeOFJYL14ZkIshPJqcEsY/https/media.tenor.com/YVq45h9PxJ4AAAPo/cat.mp4`);
		} else if (rxt(message, /stop cum/i)) {
			nPR(message, `https://ca.res.keymedia.com/files/image/ssfnwsdwdnjfno.jpg`);
		} else if (rxt(message, /sexe/i) || rxt(message, /sperme/i)) {
			nPR(message, ` https://cdn.discordapp.com/attachments/1008978799989362808/1075640066912833536/ezgif.com-add-text.gif`);
		} else if (rxt(message, /cum/i) || rxt(message, /sex/i)) {
			if (Math.floor(Math.random() * 100 == 1)) {
				nPR(message, `In the videogame Skyrim, I create mods that spawn cheese, kill Fondle, and slaughter zombies with a potato. I also replace the statue of a woman holding a statue of a sword with a weeping man holding a statue of a sword that isn't an actual sword. And then I buy the woman a copy of Limbo.\n\nI'm a god.\n\nI call myself Diablo the Cheater. As far as I know, I'm the only person who writes a list of cheating cheats and uses it in-game. My mod turned the game into an interdimensional sex simulator (powered by a fucking necromancer), and I use that game on a daily basis. To date, I've cheated in thirty games. Twenty-one of them were developed by other users, and the other two were made by me.\n\nAnd today, this motherfucker is named after me.\n\nI use a relatively simple cheat to game console games. What I do is turn the switch on the controller I use into a button on the console, and then I press it to trigger cheats that give me a better experience. Here's what those che`);
			} else {
				nPR(message, `https://tenor.com/view/my-true-reaction-cat-funny-gif-26404518`);
			}
		} else if (rxt(message, /deez nuts/i)) {
			nPR(message, ` https://tenor.com/view/non-fa-niente-ritill-e-vabb%C3%A8-gif-26307508 `);
		} else if (rxt(message, /dragon/i)) {
			nPR(message, `https://tenor.com/view/dragon-tale-dragon-covered-fell-down-here-gif-5524123`);
		} else if (rxt(message, /honse/i)) {
			nPR(message, `https://i.kym-cdn.com/entries/icons/original/000/034/680/EWrC68tXkAE8ouz.jpeg `);
		} else if (rxt(message, /horse/i)) {
			nPR(message, `https://tenor.com/view/you-have-alerted-the-horse-horse-gt-when-the-gif-24722142`);
		} else if (rxt(message, /hp/i)) {
			nPR(message, `https://cdn.discordapp.com/attachments/1033012124311617577/1072738423787491408/image0.gif`);
		} else if (rxt(message, /in eden when/i)) {
			nPR(message, `https://tenor.com/view/cat-gif-25491298`);
		} else if (rxt(message, /\bl r\b/i)) {
			nPR(message, `https://i.redd.it/k8ve1kjctgw91.gif`);
		} else if (rxt(message, /\bmao/i)) {
			nPR(message, `https://tenor.com/view/mao-zedong-hello-chat-mao-gif-22461031`);
		} else if (rxt(message, /my pussy/i)) {
			nPR(message, `https://gfycat.com/PinkJubilantArgentinehornedfrog`);
		} else if (rxt(message, /outdated macros/i)) {
			nPR(message, `https://cdn.discordapp.com/attachments/603835223691624451/1069887396667211796/79e3sy.gif`);
		} else if (rxt(message, /pdm2 drama/i)) {
			nPR(message, `https://tenor.com/view/discord-discord-drama-discord-user-drama-discord-users-gif-24707797`);
		} else if (rxt(message, /poggers/i)) {
			nPR(message, `https://tenor.com/view/lesbian-yuri-kiss-anime-gif-23631557`);
		} else if (rxt(message, /politic/i)) {
			nPR(message, `https://cdn.discordapp.com/attachments/1008978799989362808/1075928778032808017/image.png`);
		} else if (rxt(message, /rule 10/i)) {
			nPR(message, `**RULE 10**\nIf its any time of day don't listen to <@418087601841635338> they can't be trusted`);
		} else if (rxt(message, /rule 34/i)) {
			nPR(message, `https://cdn.discordapp.com/attachments/1009649075227984062/1075903061429604442/image.png`); 
		} else if (rxt(message, /rule 39/i)) {
			nPR(message, `https://psychicpostpirate.files.wordpress.com/2016/05/laws_of_anime__39_by_catsvrsdogscatswin-d79n81y.jpg?w=469`);
		} else if (rxt(message, /rule 419/i)) {
			nPR(message, `https://cdn.discordapp.com/attachments/1008978799989362808/1075931020144164954/image.png`);
		} else if (rxt(message, /rule 420/i)) {
			nPR(message, `https://media.discordapp.net/attachments/1023036018015871037/1070150951639466014/ZAZA_DETECTED.gif`);
		} else if (rxt(message, /snoozle/i)) {
			nPR(message, `https://cdn2.hubspot.net/hubfs/1641088/Snozzle%20Piercing%20Nozzle.jpg`);
		} else if (rxt(message, /\bweed\b/i) || rxt(message, /zaza/i)) {
			nPR(message, `https://media.discordapp.net/attachments/1023036018015871037/1070150951639466014/ZAZA_DETECTED.gif`);
		} else if (rxt(message, /whos there/i) || rxt(message, /who's there/i)) {
			nPR(message, `https://gfycat.com/PinkJubilantArgentinehornedfrog`);
		} else if (rxt(message, /中国/)) {
			nPR(message, `https://tenor.com/view/chinese-china-zhonguo-gif-20748132`);
		}
	} catch(err) {
		console.log("---- ERROR MESSAGEEVENT ----");
		console.log(err);
		console.log("---- ERROR MESSAGEEVENT ----");
		errMsg(err);
	}

});

// Log deleted messages
client.on('messageDelete', async (message) => {
	try {
		const loggingChannel = await client.channels.fetch(loggingChannelId);
		if (!loggingChannel) return;

		const embed = {
			color: parseInt('ff0000', 16),
			author: {
				name: message.author.tag,
				iconURL: message.author.avatarURL()
			},
			description: `**Message deleted in ${message.channel}**\nID: ${message.id}\n${message.content}`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR MESSAGEDELETE ----");
		console.log(err);
		console.log("---- ERROR MESSAGEDELETE ----");
		errMsg(err);
	}
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
	try {
		if(oldMessage.author.bot) return;
		if(oldMessage.content == newMessage.content) return;
		const loggingChannel = await client.channels.fetch(loggingChannelId);
		if (!loggingChannel) return;

		const embed = {
			color: parseInt("ffff00", 16),
			author: {
				name: oldMessage.author.tag,
				iconURL: oldMessage.author.avatarURL()
			},
			fields: [
			{
				name: 'Original Message',
				value: oldMessage.content
			},
			{
				name: 'Edited Message',
				value: newMessage.content
			},
			{
				name: 'Channel',
				value: oldMessage.channel.toString()
			}
			],
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR MESSAGEUPDATE ----");
		console.log(err);
		console.log("---- ERROR MESSAGEUPDATE ----");
		errMsg(err);
	}
});


// Log user joins
client.on('guildMemberAdd', async (member) => {
	try {
		const loggingChannel = await client.channels.fetch(loggingChannelId);
		if (!loggingChannel) return;

		const embed = {
			color: parseInt('00ff00', 16),
			author: {
				name: member.user.tag,
				iconURL: member.user.avatarURL()
			},
			description: `**${member.user.tag} has joined the server!**\nUsers in server: ${member.guild.memberCount}`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR GUILDMEMBERADD ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBERADD ----");
		errMsg(err);
	}
});

// Log user leaves
client.on('guildMemberRemove', async (member) => {
	try {
		const loggingChannel = await client.channels.fetch(loggingChannelId);
		if (!loggingChannel) return;

		const embed = {
			color: parseInt('ff0000', 16),
			author: {
				name: member.user.tag,
				iconURL: member.user.avatarURL()
			},
			description: `**${member.user.tag} has left the server.**\nRoles: ${member.roles.cache.map(role => role.name).join(', ')}`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR GUILDMEMBERREMOVE ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBERREMOVE ----");
		errMsg(err);
	}
});

// Log user bans
client.on('guildBanAdd', async (guild, user) => {
	try {
		const loggingChannel = await client.channels.fetch(loggingChannelId);
		if (!loggingChannel) return;

		const auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
		const logEntry = auditLogs.entries.first();

		let reason = 'unknown';
		if (logEntry) {
			const { executor, reason: banReason } = logEntry;
			if (executor) {
				reason = banReason || 'unknown';
				reason += `\nBanned by: ${executor.tag}`;
			}
		}

		const embed = {
			color: parseInt('ff0000', 16),
			author: {
				name: user.tag,
				iconURL: user.avatarURL()
			},
			description: `**${user.tag} has been banned from the server.**\nReason: ${reason}`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR GUILDMEMBERBAN ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBERBAN ----");
		errMsg(err);
	}
});


// Log user unbans
client.on('guildBanRemove', async (guild, user) => {
	try {
		const loggingChannel = await client.channels.fetch(loggingChannelId);
		if (!loggingChannel) return;

		const embed = {
			color: parseInt('00ff00', 16),
			author: {
				name: user.tag,
				iconURL: user.avatarURL()
			},
			description: `**${user.tag} has been unbanned from the server.**`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		};

		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR GUILDMEMBERREBANREMOVE ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBERREBANREMOVE ----");
		errMsg(err);
	}	
});

// Log in to Discord with your client's token
client.login(token);
module.exports = { mikuBotVer, client, botAvatarURL};
