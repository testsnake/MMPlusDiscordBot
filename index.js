const fs = require('fs');
const path = require('path');
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter({ skipFirstLoad: true });
const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, Discord } = require('discord.js');
const { token } = require('./config.json');
const fetch = require("node-fetch");  // Needs to be added for bot use
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');
// const youtube = require('discord-bot-youtube-notifications');


//Logging channel
const loggingChannelId = '1087810388936114316';
const rssChannelId = '1087783783207534604';


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
	client.user.setActivity('Hatsune Miku: Project DIVA MegaMix+');
	const loggingChannelId = '1087810388936114316';
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
		if (message.author.bot) return;
		console.log(`[${message.author.username}]: ${message.content}`);

		if (message.channel.id === '1087921223251542088') {
			let hasMedia = false;

			// Check if the message has any attachments
			if (message.attachments.size > 0) {
				hasMedia = true;
			}

			// Check if the message has any embeds with media
			message.embeds.forEach((embed) => {
				if (embed.type === 'image' || embed.type === 'video' || embed.type === 'gifv') {
					hasMedia = true;
				}
			});

			// Check if the message has any links to media files
			const mediaExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.avi', '.mov', '.wmv'];
			const messageContent = message.content.toLowerCase();
			for (const extension of mediaExtensions) {
				if (messageContent.includes(extension)) {
					hasMedia = true;
					break;
				}
			}
	
			// Check if the message has a Tenor GIF link
			if (message.content.includes('tenor.com/view/')) {
				hasMedia = true;
			}


			if (hasMedia) {
				console.log(`${message.author.username} sent a message with media in channel ${message.channel.name}.`);

				// Add the role to the user
				const roleToAdd = message.guild.roles.cache.get('1087921322832699412');
				if (roleToAdd) {
					message.member.roles.add(roleToAdd)
						.then(() => console.log(`Added role ${roleToAdd.name} to ${message.author.username}.`))
						.catch(console.error);
				} else {
					console.error('Role not found.');
				}
			}
		}


		// if (rxt(message, /\bass\b/i)) {
		// 	nPR(message, 'https://cdn.discordapp.com/attachments/421865513820618752/1071615776127201424/169F55F1-C038-41DD-9264-BD3D9E8C6D60.gif');
		// }

	} catch(err) {
		console.log("---- ERROR MESSAGE EVENT ----");
		console.log(err);
		console.log("---- ERROR MESSAGE EVENT ----");
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
		console.log("---- ERROR MESSAGE UPDATE ----");
		console.log(err);
		console.log("---- ERROR MESSAGE UPDATE ----");
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
		console.log("---- ERROR GUILDMEMBER ADD ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBER ADD ----");
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
		console.log("---- ERROR GUILDMEMBER REMOVE ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBER REMOVE ----");
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
		console.log("---- ERROR GUILDMEMBER BAN ----");
		console.log(err);
		console.log("---- ERROR GUILDMEMBER BAN ----");
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

//RSS Feed
feeder.add({
	url: 'https://api.gamebanana.com/Rss/New?gameid=16522&include_updated=1',
	refresh: 150000
})

feeder.on('new-item', async function (item) {
	console.log(item);
	const feedChannel = await client.channels.fetch(`1087783783207534604`);
	if (!feedChannel) {
		console.log("Feed channel not found");
		return
	}

	const pathname = new URL(item.link).pathname;
	const modsSection = pathname.split("/")[1];
	const modId = pathname.split("/")[2];
	if (modsSection !== 'mods') return;


	const modInfo = await fetch(`https://gamebanana.com/apiv10/Mod/${modId}/ProfilePage`).then(res => res.json());
	var embed = new EmbedBuilder()
		.setTitle(`${modInfo._sName}`)
		.setURL(`${modInfo._sProfileUrl}`)
		.setThumbnail(`${modInfo._aPreviewMedia._aImages[0]._sBaseUrl}/${modInfo._aPreviewMedia._aImages[0]._sFile}`)
		.setTimestamp(new Date(modInfo._tsDateAdded * 1000))
		.addFields(
			{name: 'Submitter', value: `${modInfo._aSubmitter._sName}`, inline: true},
			{
				name: 'Likes',
				value: `${modInfo._nLikeCount !== undefined ? modInfo._nLikeCount : 0}`,
				inline: true
			},
			{
				name: 'Views',
				value: `${modInfo._nViewCount !== undefined ? modInfo._nViewCount : 0}`,
				inline: true
			},
		)
		.setFooter({text: `${mikuBotVer}`})
	if (modInfo._sDescription !== undefined) {
		embed.setDescription(`${modInfo._sDescription}`);
	}
	if (modInfo._aAdditionalInfo._sversion !== undefined) {
		embed.addFields({name: 'Version', value: `${modInfo._aAdditionalInfo._sversion}`, inline: true});
	}
	var contentWarnings;

	if (modInfo._aContentRatings !== undefined) {
		for (var rating in modInfo._aContentRatings) {

			if (modInfo._aContentRatings[rating] !== undefined) {
				console.log(modInfo._aContentRatings[rating]);
				if (contentWarnings === undefined) {
					contentWarnings = `${modInfo._aContentRatings[rating]}`;
				} else {
					contentWarnings = `${contentWarnings}, ${modInfo._aContentRatings[rating]}`;
				}
			}
		}
		console.log(contentWarnings);
		console.log(modInfo._aContentRatings);

		embed.addFields({name: 'Content Warnings', value: `${contentWarnings}`, inline: true});
	}

	if (modInfo._tsDateUpdated !== null && modInfo._tsDateUpdated !== undefined && modInfo_.tsDateUpdated > modInfo_.tsDateAdded) {
		embed.setAuthor({ name: "Post Updated", iconURL: "https://i.imgur.com/iJDHCx2.png"})
			.setColor(0x6bed78)

	} else {
		embed.setAuthor({ name: "New Post", iconURL: "https://i.imgur.com/eJyrdy7.png"})
			.setColor(0x86cecb)

	}

	feedChannel.send({ embeds: [embed] });
	// Current time
})

// Log in to Discord with your client's token
client.login(token);
module.exports = { mikuBotVer, client, botAvatarURL};
