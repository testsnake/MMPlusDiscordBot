const fs = require('fs');
const path = require('path');



const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, Discord, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { token } = require('./config.json');
const fetch = require("node-fetch");  // Needs to be added for bot use
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');

// const youtube = require('discord-bot-youtube-notifications');


//Logging channel
const loggingChannelId = '1087810388936114316';

let latestTimestamp = new Date().getTime() / 1000;
let firstRun = true;


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
	try {
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
		}

		client.channels.fetch((loggingChannelId).then(channel => {
			channel.send({ embeds: [embed] });
		})).catch(console.error);
 	} catch (err) {
		console.log("error in error handler");
		console.log(err);
	}


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
	checkGamebananaFeed();
	setInterval(checkGamebananaFeed, 2 * 60 * 1000);
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
		if(oldMessage.content === newMessage.content) return;
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

		let logEntry;
		try {
			logEntry = auditLogs.entries.first()
		} catch(err) {
			console.log("---- ERROR GUILDMEMBER BAN ----");
			console.log(err);
			console.log("---- ERROR GUILDMEMBER BAN ----");
		}

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

function truncateString(str, maxLength) {
	if (maxLength < 0 || typeof maxLength !== 'number') {
		throw new Error('maxLength must be a non-negative number');
	}

	if (str.length <= maxLength) {
		return str;
	}

	return str.slice(0, maxLength);
}

function ts(str, maxLength) {
	return truncateString(str, maxLength);
}

client.on(Events.InteractionCreate, async interaction => {
	try {
		console.log("---- INTERACTION CREATE ----");
		if (!interaction.isButton()) {
			console.log("---- INTERACTION CREATE ERROR ISBUTTON ----");
			return;
		}

		const { customId, user, message } = interaction;
		const banConfirmRegex = /^(.+)#(\d{4})_ban_confirm_(\d+)$/;
		const banCancelRegex = /^(.+)#(\d{4})_ban_cancel_(\d+)$/;
		console.log(banConfirmRegex.test(customId))

		if (banConfirmRegex.test(customId)) {
			console.log("---- BAN CONFIRM ----");
			console.log(customId);
			console.log(message.content);
			const [, requesterUsername, requesterDiscriminator, targetUserId] = customId.match(banConfirmRegex);
			console.log(`${requesterUsername}#${requesterDiscriminator}`);

			// Check if the user who clicked the button is not the one who initiated the ban request
			if (customId.startsWith(`${interaction.user.tag}`)) {
				console.log("---- BAN CONFIRM ERROR ----");
				await interaction.reply({ content: `You can't confirm your own ban request.\n\`${message.content}\``, ephemeral: true });
				return;
			}

			// Execute the ban
			const targetUser = await client.users.fetch(targetUserId);
			const targetMember = await message.guild.members.fetch(targetUser);
			await targetMember.ban({ reason: `Banned by ${message.content}, Confirmed by ${user.tag}` });

			await interaction.reply({ content: `Ban confirmed by ${user.tag}.`, components: [] });

		} else if (banCancelRegex.test(customId)) {
			console.log("---- BAN CANCEL ----");
			const [, requesterUsername, requesterDiscriminator, targetUserId] = customId.match(banCancelRegex);

			// Cancel the ban

			await interaction.update({ content: `Ban request cancelled by ${user.tag}.`, components: [] });
		} else if (kickConfirmRegex.test(customId)) {
		console.log("---- KICK CONFIRM ----");
		const [, requesterUsername, requesterDiscriminator, targetUserId] = customId.match(kickConfirmRegex);

		// Check if the user who clicked the button is not the one who initiated the kick request
		if (customId.startsWith(`${interaction.user.tag}`)) {
			console.log("---- KICK CONFIRM ERROR ----");
			await interaction.reply({ content: `You can't confirm your own kick request.\n\`${message.content}\``, ephemeral: true });
			return;
		}

		// Execute the kick
		const targetUser = await client.users.fetch(targetUserId);
		const targetMember = await message.guild.members.fetch(targetUser);
		await targetMember.kick({ reason: `Kicked by ${message.content}, Confirmed by ${user.tag}` });

		await interaction.reply({ content: `Kick confirmed by ${user.tag}.`, components: [] });

		} else if (kickCancelRegex.test(customId)) {
			console.log("---- KICK CANCEL ----");
			const [, requesterUsername, requesterDiscriminator, targetUserId] = customId.match(kickCancelRegex);

			// Cancel the kick

			await interaction.update({ content: `Kick request cancelled by ${user.tag}.`, components: [] });
		} else {
				console.log("---- UNKNOWN ERROR ----");
				await interaction.reply({content: `Unknown Error\n${interaction.customId}`, ephemeral: true});
		}
	} catch(err) {
		console.log("---- ERROR INTERACTION CREATE ----");
		console.log(err);
		console.log("---- ERROR INTERACTION CREATE ----");
		errMsg(err);
	}
});



async function checkGamebananaFeed() {
	// Check Gamebanana feed for new items
	// This is probably a terrible way to do this, but it works.
	await checkGamebananaAPI('new').then(async (newItems) => {
		await checkGamebananaAPI('updated').then(async (updatedItems) => {
			latestTimestamp = Math.max(newItems, updatedItems);
		});
	});

}

async function checkGamebananaAPI(sort) {
	try {
		console.log("Checking Gamebanana API...");
		console.log(latestTimestamp)
		let response = await fetch(`https://gamebanana.com/apiv10/Game/16522/Subfeed?_nPage=1&_nPerpage=10&_sSort=${sort}`);
		const data = await response.json();
		latestTimestampTemp = latestTimestamp;
		if (data._aRecords && data._aRecords.length > 0) {
			if (firstRun) {
				console.log("First run, setting latest timestamp.");
				//latestTimestamp = Math.max(...data._aRecords.map(record => Math.max(record._tsDateAdded, record._tsDateUpdated))) + 1;
				firstRun = false;
			}
			if (true) { // Remove this once done debugging
				for (const record of data._aRecords) {
					if (isNaN(record._tsDateUpdated)) {
						record._tsDateUpdated = 0;
					}
					const currentTimestamp = Math.max(record._tsDateAdded, record._tsDateUpdated);

					if (currentTimestamp > latestTimestamp) {

						let isNew = false;
						if (sort === "new") isNew = true;

						// Process the new or updated record
						await processRecord(record, isNew);
					 } else {
						console.log(`${currentTimestamp}\tSkipping record: ${record._sName}`)
					}

					latestTimestampTemp = Math.max(currentTimestamp, latestTimestamp, latestTimestampTemp);

				}
			}
		}
		console.log("Done checking Gamebanana API.");
		return latestTimestampTemp;

	} catch (err) {
		console.log("---- ERROR CHECKING API ----");
		console.log(err);
		console.log("---- ERROR CHECKING API ----");
		errMsg(err);
		return 0;
	}
}

client.on('messageReactionAdd', async (reaction, user) => {
	console.log("---- STARBOARD ----");
	try {
		if (reaction.emoji.name === '⭐' && reaction.count === 6) {
			console.log("---- STARBOARD ----");
			// Get the starboard channel
			const starboardChannel = await client.channels.fetch('1092643863820251196');

			console.log(reaction.message.content)

			// Create the embed
			const starboardEmbed = new EmbedBuilder()
				.setTitle('Starred Message')
				.setDescription( ts(reaction.message.content, 4095))
				.addFields(
					{name: 'Author', value: `${reaction.message.author.toString()}`, inline: true},
					{name: 'Channel', value: `<#${reaction.message.channel.id}>`, inline: true}
				)
				.setColor(0xeb4034)
				.setTimestamp(reaction.message.createdAt)

			console.log(reaction.message.attachments)

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Link to original message')
						.setStyle('Link')
						.setURL(reaction.message.url)
				);

			// Post the embed in the starboard channel
			starboardChannel.send({embeds: [starboardEmbed], components: [row]});
		}
	} catch (err) {
		console.log("---- ERROR MESSAGE REACTION ADD ----");
		console.log(err);
		console.log("---- ERROR MESSAGE REACTION ADD ----");
		errMsg(err);
	}
});


async function processRecord(modInfo, isNew) {
	try {
		const subType = modInfo._sSingularTitle;

		modInfo = await fetch(`https://gamebanana.com/apiv10/${subType}/${modInfo._idRow}/ProfilePage`).then(res => res.json());
		await new Promise(r => setTimeout(r, 1000));
		console.log(`New item found: ${modInfo._sName}`);
		while (!client.channels.cache.get(`1087783783207534604`)) {
			console.log(`Waiting for channel to be ready...\tCurrent item title: ${modInfo._sName}`)
			await new Promise(r => setTimeout(r, 1000));
		}
		await client.channels.fetch(`1087783783207534604`).then(async (feedChannel) => {

			if (!feedChannel) {
				console.log(`Feed channel not found while loading item ${modInfo._sName}`);
				return
			}
			var embed;
			const pathname = new URL(modInfo._sProfileUrl).pathname;
			const modsSection = pathname.split("/")[1];
			const modId = pathname.split("/")[2];


			console.log(`[${modInfo._sName}] New mod found at: ${pathname}`);
			embed = new EmbedBuilder()
				.setTitle(`${ts(modInfo._sName, 255)}`)
				.setURL(`${modInfo._sProfileUrl}`)
				.setThumbnail(`${modInfo._aPreviewMedia._aImages[0]._sBaseUrl}/${modInfo._aPreviewMedia._aImages[0]._sFile}`)
				.setTimestamp(new Date(modInfo._tsDateAdded * 1000))
				.addFields(
					{name: 'Submitter', value: `${ts(modInfo._aSubmitter._sName, 255)}`, inline: true},
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
				embed.setDescription(`${ts(modInfo._sDescription, 4095)}`);
				console.log(`[${modInfo._sName}] Description: ${modInfo._sDescription}`);
			}
			if (modInfo._aAdditionalInfo._sVersion !== undefined) {
				embed.addFields({name: 'Version', value: `${modInfo._aAdditionalInfo._sVersion}`, inline: true});
				console.log(`[${modInfo._sName}] Version: ${modInfo._aAdditionalInfo._sVersion}`);
			}

			var contentWarnings;

			if (modInfo._aContentRatings !== undefined) {
				console.log(`Content Warnings: ${modInfo._aContentRatings}`);
				for (var rating in modInfo._aContentRatings) {

					if (modInfo._aContentRatings[rating] !== undefined) {
						console.log(`[${modInfo._sName}] Content Ratings: ${modInfo._aContentRatings[rating]}`);
						if (contentWarnings === undefined) {
							contentWarnings = `${modInfo._aContentRatings[rating]}`;
						} else {
							contentWarnings = `${contentWarnings}, ${modInfo._aContentRatings[rating]}`;
						}
					}
				}
				console.log(contentWarnings);
				console.log(modInfo._aContentRatings);

				embed.addFields({name: 'Content Warnings', value: `${ts(contentWarnings, 1023)}`, inline: true});
			}

			if (!isNew) {
				embed.setAuthor({name: `${subType} Updated`, iconURL: "https://i.imgur.com/iJDHCx2.png"})
					.setColor(0x86cecb)
				console.log(`[${modInfo._sName}] ${subType} Updated: ${modInfo._tsDateUpdated}`);

			} else {
				embed.setAuthor({name: `New ${subType}`, iconURL: "https://i.imgur.com/eJyrdy7.png"})
					.setColor(0x6bed78)
				console.log(`[${modInfo._sName}] New ${subType}: ${modInfo._tsDateAdded}`);

			}



			if (embed === undefined || embed === null) {
				console.log(`[${modInfo._sName}] Embed not found while loading item ${modInfo._sName}, Skipping...`);
				return;
			}
			console.log(`[${modInfo._sName}] uploading embed: ${modInfo._sName}}`);
			feedChannel.send({embeds: [embed]}).then(message => {
				message.crosspost()
					.then(() => console.log("Message auto-published."))
					.catch(console.error);
			});

		})
	} catch (err) {
		console.log("---- ERROR FEEDER ----");
		console.log(err);
		console.log("---- ERROR FEEDER ----");
		errMsg(err);
	}


}



// Log in to Discord with your client's token
client.login(token);
module.exports = { mikuBotVer, client, botAvatarURL};
