const fs = require('fs');
const path = require('path');



const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, Discord, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { token } = require('./config.json');
const fetch = require("node-fetch");  // Needs to be added for bot use
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');
const { addLog } = require('./logManager.js');
const {getLogs, getRecentLogs} = require("./logManager");

// const youtube = require('discord-bot-youtube-notifications');


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


//Logging channel
const loggingChannelId = '1087810388936114316';

let firstRun = true;
let attemptsToReconnect = 0;


const timestampFile = 'latestTimestamp.txt';
let latestTimestamp;
try {
	latestTimestamp = parseInt(fs.readFileSync(timestampFile, 'utf8'));
} catch (err) {
	latestTimestamp = new Date().getTime() / 1000;
	fs.writeFileSync(timestampFile, latestTimestamp.toString());
}



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
	addLog(`nPR: ${text}`);
	message.reply({content: text, allowedMentions: { repliedUser: false }})
		.catch(console.error);
}




async function errMsg(err, errType, msg) {
	try {
		console.log("unhandled error");
		console.log(err);

		const embed = {
			color: parseInt('ff0000', 16),
			description: `MikuBot has Encountered an Error\n${err}`,
			timestamp: new Date(),
			footer: {
				text: mikuBotVer,
				iconURL: botAvatarURL
			}
		}



		const loggingChannel = await client.channels.cache.get(`1087810388936114316`);
		if (!loggingChannel) return;
		await loggingChannel.send({ embeds: [embed] });
		await loggingChannel.send(`***ERROR HANDLER***`);
		await
		await loggingChannel.send(`Error Type:\n\`\`\`${errType}\`\`\``);
		await loggingChannel.send(`Error:\n\`\`\`${err}\`\`\``);
		await loggingChannel.send(`\`\`\`${JSON.stringify(err)}\`\`\``);
		await loggingChannel.send(`\`\`\`${JSON.stringify(err.stack)}\`\`\``);
		await loggingChannel.send(`\`\`\`${JSON.stringify(err.message)}\`\`\``);
		await loggingChannel.send(`***MSG***`);
		if (msg) {
			try {


				try {
					await loggingChannel.send(`Message:\n\`\`\`${JSON.stringify(msg)}\`\`\``);
				} catch (err) {

					await loggingChannel.send(`Message:\n\`\`\`${msg}\`\`\``);
				}
			} catch (err) {
				await loggingChannel.send(`Message:\n\`\`\`Could not stringify message\`\`\``);
			}

		}
		await delay(5000);
		await loggingChannel.send(`***LAST LOG MESSAGES***`);
		let i = 1;
		// Prints each message in lastLogs
		const lastLogs = getRecentLogs(10);
		for (const log of lastLogs) {
			await loggingChannel.send(`Log ${i}\`\`\`${log}\`\`\``);
			await delay(1000);
			i++;
		}
		await delay(5000);
		await loggingChannel.send(`<@201460040564080651> halp pls`);
	} catch (err) {
		console.log("error in error handler");
		console.log(err);
		try {
			const loggingChannel = await client.channels.cache.get(`1087810388936114316`);
			loggingChannel.send(`<@201460040564080651> halp pls. error in error handler`);
		} catch (err) {
			console.log("error in error handler error handler");
			console.log(err);
			console.error(err)
			console.error(err.stack)
		}
	}


}


// Event Triggers
client.once("ready", async client => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	client.user.setActivity('Hatsune Miku: Project DIVA Mega Mix+');
	const loggingChannelId = '1087810388936114316';
	const loggingChannel = await client.channels.fetch(loggingChannelId);
	if (!loggingChannel) return;
	const embed = {
		color: parseInt('86cecb', 16),
		description: `おはよう！ ${mikuBotVer} is Ready!`,
		timestamp: new Date()
	};
	addLog(`[READY] おはよう！ ${mikuBotVer} is ready at ${new Date()}`);
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
				addLog(`${message.author.username} sent a message with media in channel ${message.channel.name}.`);

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
		errMsg(err, "message event", message);
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
		addLog(`[MESSAGE DELETE] ${message.author.username} deleted a message in ${message.channel.name} at ${new Date()}.`);
		loggingChannel.send({ embeds: [embed] });
	} catch(err) {
		console.log("---- ERROR MESSAGEDELETE ----");
		console.log(err);
		console.log("---- ERROR MESSAGEDELETE ----");
		errMsg(err, "messageDelete event", message);
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
		errMsg(err, "messageUpdate event", `old message: ${oldMessage}, newMessage: ${newMessage}`);
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
		errMsg(err, "guildMemberAdd event", member);
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
		errMsg(err, "guildMemberRemove event", member);
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
			errMsg(err, "guildBanAdd event", `guild: ${guild}, user: ${user}`);
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
		errMsg(err, "guildBanAdd event", `guild: ${guild}, user: ${user}`);
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
		errMsg(err, "guildBanRemove event", `guild: ${guild}, user: ${user}`);
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
		addLog(`[INTERACTION at ${new Date()}] ${interaction.customId} ${interaction.user.tag} ${interaction.message.content}`);
		const { customId, user, message } = interaction;
		const banConfirmRegex = /^(.+)#(\d{4})_ban_confirm_(\d+)$/;
		const banCancelRegex = /^(.+)#(\d{4})_ban_cancel_(\d+)$/;
		const kickConfirmRegex = /^(.+)#(\d{4})_kick_confirm_(\d+)$/;
		const kickCancelRegex = /^(.+)#(\d{4})_kick_cancel_(\d+)$/;
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
			await interaction.update({ content: `Banning ${targetMember.nickname}. Requested by ${message.content}, confirmed by ${user.tag}.`, components: [] });
			try {
				const banEmbed = new EmbedBuilder()
					.setColor(0xff0000)
					.setAuthor({ name: targetUser.tag, iconUrl: targetUser.avatarURL() })
					.setTimestamp(new Date())
					.setFooter({ text: mikuBotVer, iconUrl: botAvatarURL })
					.setDescription(`**${targetUser.tag} has been banned from ${message.guild.name}.`);
				await targetMember.send({ embeds: [banEmbed] });
			} catch(err) {
				console.log("---- ERROR BAN DM ----");
				console.log(err);
				console.log("---- ERROR BAN DM ----");
				await errMsg(err, "ban command", `guild: ${message.guild}, user: ${targetUser}`);
			}
			await targetMember.ban({ reason: `Banned by ${message.content}, Confirmed by ${user.tag}` });



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
		errMsg(err, "InteractionCreate event", `interaction: ${interaction}`);
	}
});



async function checkGamebananaFeed() {
	// Check Gamebanana feed for new items
	// This is probably a terrible way to do this, but it works.
	await checkGamebananaAPI('new').then(async (newItems) => {
		await checkGamebananaAPI('updated').then(async (updatedItems) => {
			latestTimestamp = Math.max(newItems, updatedItems);
			fs.writeFileSync(timestampFile, latestTimestamp.toString());
		});
	});

}

async function checkGamebananaAPI(sort) {
	try {

		console.log("Checking Gamebanana API...");
		console.log(latestTimestamp)
		let response
		try {
			response = await fetch(`https://gamebanana.com/apiv10/Game/16522/Subfeed?_nPage=1&_nPerpage=10&_sSort=${sort}`);
			attemptsToReconnect = 0;
		} catch (err) {
			addLog(`[Gamebanana error 002 at ${new Date()}]\n${ts(err, 1800)}...`);
			await errMsg(err, "Gamebanana API", `response: ${ts(response, 1800)}...`);
			if (attemptsToReconnect < 3 || (attemptsToReconnect > 3 && attemptsToReconnect < 10)) {
				attemptsToReconnect++;
				console.log("Error fetching Gamebanana API, reconnecting...");
				await new Promise(resolve => setTimeout(resolve, 20000));
				return await checkGamebananaAPI(sort);
			} else if (attemptsToReconnect === 10) {
				addLog(`[Gamebanana error 001 at ${new Date()}]\n${ts(err, 1800)}...`);
				addLog(`giving up on reconnecting to Gamebanana API`);
				await errMsg(err, "Gamebanana API - Given Up", `response: ${ts(response, 1800)}...`);
				return 0;

			} else {
				attemptsToReconnect++;
				await client.channels.fetch(`1087783783207534604`).then(async (feedChannel) => {
					try {
						await feedChannel.send(`An error occurred while fetching the Gamebanana API. Mods may not appear in the feed until this is resolved. (<@$201460040564080651>)`);
					} catch (err) {
						console.log("Error sending message");
						console.log(err);
						await errMsg(err, "Gamebanana API", "Error sending message about Gamebanana API error");
					}
				});
			}
		}

		let data;
		try {
			data = await response.json();
		} catch (err) {
			console.log("Error parsing JSON");
			console.log(err);
			addLog(`[Gamebanana error 003 at ${new Date()}]\n${ts(JSON.stringify(response), 1800)}...`);
			errMsg(err, "Gamebanana API", `response: ${ts(JSON.stringify(response), 1800)}...`);

			return 0;
		}
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
		errMsg(err, "checkGamebananaAPI function", `sort: ${sort}`);
		const loggingChannel = await client.channels.cache.get(`1087810388936114316`);
		await loggingChannel.send(`Error checking Gamebanana API:\n\`\`\`${err}\`\`\``);
		await loggingChannel.send(`\`\`\`${JSON.stringify(err)}\`\`\``);
		await loggingChannel.send(`\`\`\`${JSON.stringify(err.stack)}\`\`\``);
		await loggingChannel.send(`\`\`\`${JSON.stringify(err.message)}\`\`\``)
		await loggingChannel.send(`<@201460040564080651> pls halp`);
		delay(1000);
		let i = 1;
		const lastLogs = getRecentLogs(10)
		for (const log of lastLogs) {
			await loggingChannel.send(`Log ${i}\`\`\`${log}\`\`\``);
			await delay(1000);
			i++;
		}

	}
}




async function processRecord(modInfo, isNew) {
	try {
		let subType = modInfo._sSingularTitle;
		if (subType === "WiP") {
			subType = "Wip";
		}
		try {
			await client.channels.fetch(`1087783783207534604`).then(async (feedChannel) => {

			});

		} catch (err) {
			console.log("Error sending typing");
			console.log(err);
			errMsg(err, "Gamebanana API Typing", "Error sending typing");
		}


		modInfo = await fetch(`https://gamebanana.com/apiv10/${subType}/${modInfo._idRow}/ProfilePage`).then(res => res.json());

		if (modInfo._nUpdatesCount > 0) {
			isNew = false;
		}

		let updateInfo;
		let changeLog = "";
		let changeLogTitle = "Changelog";
		let hasChangeLog = false;
		let changeLogDescription = "";
		if (!isNew) {
			try {
				updateInfo = await fetch(`https://gamebanana.com/apiv10/${subType}/${modInfo._idRow}/Updates`).then(res => res.json());
				let changeLog1;
				if (updateInfo._aRecords[0]._aChangeLog) {
					changeLog1 = updateInfo._aRecords[0]._aChangeLog.map(entry => `**${entry.cat}** - ${entry.text}`);
					changeLog = changeLog1.join('\n');
					addLog(`Changelog added for mod ${modInfo._sName}:\n${changeLog}`)
				} else {
					addLog(`No changelog found for mod ${modInfo._sName}:\n${JSON.stringify(updateInfo)}`)
				}

				changeLogTitle = updateInfo._aRecords[0]._sName;
				changeLogTitle = changeLogTitle !== undefined ? changeLogTitle : "Update";

				changeLogDescription = updateInfo._aRecords[0]._sText;
				changeLogDescription = changeLogDescription !== undefined ? '\n' + changeLogDescription.replace(/<[^>]*>/g, '') : "";
				if (changeLog.length > 0 && changeLogDescription.length > 0) {
					hasChangeLog = true;
				}

			} catch (err) {
				console.log("Error fetching update info");
				console.log(err);
				errMsg(err, "processRecord function", `modInfo: ${JSON.stringify(modInfo)}`);
			}
			}

		await new Promise(r => setTimeout(r, 1000));
		console.log(`New item found: ${modInfo._sName}`);
		while (!client.channels.cache.get(`1087783783207534604`)) {
			console.log(`Waiting for channel to be ready...\tCurrent item title: ${modInfo._sName}`)
			await new Promise(r => setTimeout(r, 1000));
		}
		addLog(`{ProcessRecord at ${new Date()}}\nisNew: ${isNew}\n${JSON.stringify(modInfo)}`);

		await client.channels.fetch(`1087783783207534604`).then(async (feedChannel) => {

			if (!feedChannel) {
				console.log(`Feed channel not found while loading item ${modInfo._sName}`);
				errMsg(`Feed channel not found while loading item ${modInfo._sName}`, "processRecord function", `modInfo: ${modInfo}`)
				return
			}
			addLog(`[Feed channel at ${new Date()}] ${feedChannel}`);
			var embed;
			const pathname = new URL(modInfo._sProfileUrl).pathname;
			const modsSection = pathname.split("/")[1];
			const modId = pathname.split("/")[2];


			console.log(`[${modInfo._sName}] New mod found at: ${pathname}`);
			addLog(`[${modInfo._sName}] New mod found at: ${pathname}`);
			embed = new EmbedBuilder()
				.setTitle(`${ts(modInfo._sName, 255)}`)
				.setURL(`${modInfo._sProfileUrl}`)

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
			try {
				if (modInfo._aAdditionalInfo._sVersion) {
					embed.addFields({name: 'Version', value: `${modInfo._aAdditionalInfo._sVersion}`, inline: true});
					console.log(`[${modInfo._sName}] Version: ${modInfo._aAdditionalInfo._sVersion}`);
				}
			} catch (err) {
				console.log(`[${modInfo._sName}] Version: undefined`);
				addLog(`[${modInfo._sName}] Version: could not be found and caused an error`);
			}

			if (modInfo._aPreviewMedia._aImages && modInfo._aPreviewMedia._aImages[0]._sBaseUrl && modInfo._aPreviewMedia._aImages[0]._sFile) {
				embed.setThumbnail(`${modInfo._aPreviewMedia._aImages[0]._sBaseUrl}/${modInfo._aPreviewMedia._aImages[0]._sFile}`)
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

			try {
				if (!isNew) {
					embed.setAuthor({name: `${subType} Updated`, iconURL:`${modInfo._aCategory._sIconUrl}`})
						.setColor(0x86cecb)
					console.log(`[${modInfo._sName}] ${subType} Updated: ${modInfo._tsDateUpdated}`);

				} else {
					embed.setAuthor({name: `New ${subType}`, iconURL: `${modInfo._aCategory._sIconUrl}`})
						.setColor(0x6bed78)
					console.log(`[${modInfo._sName}] New ${subType}: ${modInfo._tsDateAdded}`);

				}
				
			} catch (e) {
				if (!isNew) {
					embed.setAuthor({name: `${subType} Updated`, iconURL: "https://i.imgur.com/iJDHCx2.png"})
						.setColor(0x86cecb)
					console.log(`[${modInfo._sName}] ${subType} Updated: ${modInfo._tsDateUpdated}`);

				} else {
					embed.setAuthor({name: `New ${subType}`, iconURL: "https://i.imgur.com/eJyrdy7.png"})
						.setColor(0x6bed78)
					console.log(`[${modInfo._sName}] New ${subType}: ${modInfo._tsDateAdded}`);

				}
			}

			if (hasChangeLog) {
				try {
					embed.addFields({
						name: `${changeLogTitle} changelog`,
						value: `${ts(`${changeLog}${changeLogDescription}`, 1023)}`,
						inline: false
					});
				} catch (err) {
					addLog(`[${modInfo._sName}] Error while adding changelog: ${modInfo._sName}}`);
				}
			}

			addLog(`[${modInfo._sName}] New ${subType} found: ${modInfo._sName} by ${modInfo._aSubmitter._sName} at ${modInfo._sProfileUrl}`);

			if (embed === undefined || embed === null) {
				console.log(`[${modInfo._sName}] Embed not found while loading item ${modInfo._sName}, Skipping...`);
				return;
			}
			await new Promise(resolve => setTimeout(resolve, 2000));
			console.log(`[${modInfo._sName}] uploading embed: ${modInfo._sName}}`);
			try {
				feedChannel.send({embeds: [embed]}).then(message => {
					message.crosspost()
						.then(() => console.log("Message auto-published."))
						.catch(console.error);
				});
			} catch (err) {
				console.error(`[${modInfo._sName}] Error while uploading embed: ${modInfo._sName}}`);
				console.error(err);
				const loggingChannel = await client.channels.cache.get(`1087810388936114316`);
				loggingChannel.send(`<@201460040564080651> error when posting GameBanana Post: ${modInfo._sName}`);
				loggingChannel.send(`<@201460040564080651> ${err}`);
				loggingChannel.send(`${modInfo}`);
				errMsg(err, `Error when posting GameBanana Post: ${modInfo._sName}`, "");

			}

		})
	} catch (err) {
		console.log("---- ERROR FEEDER ----");
		console.log(err);
		console.log("---- ERROR FEEDER ----");
		errMsg(err, "Error in Feeder", "");
	}


}

client.on('messageReactionAdd', async (reaction, user) => {
	console.log("---- STARBOARD ----");
	const message = reaction.message;
	try {
		if (reaction.emoji.name === '⭐' && reaction.count === 4) {
			console.log("---- STARBOARD ----");
			// Get the starboard channel
			const starboardChannel = await client.channels.fetch('1092643863820251196');

			console.log(reaction.message.content)
			let extra = "";

			// Create the embed
			let starboardEmbed = new EmbedBuilder()
				.setAuthor({name: 'Starred Message', iconURL: reaction.message.author.avatarURL({dynamic: true})})
				.addFields(
					{name: 'Author', value: `${reaction.message.author.toString()}`, inline: true},
					{name: 'Channel', value: `<#${reaction.message.channel.id}>`, inline: true}
				)
				.setColor(0xd9c65b)
				.setTimestamp(reaction.message.createdAt);

			// Check if the message has attachments and add the first image
			if (reaction.message.attachments.size > 0) {
				if (reaction.message.attachments.size === 1) {
					const attachment = reaction.message.attachments.first();
					if (attachment.contentType.startsWith('image/')) {
						starboardEmbed.setImage(attachment.url);
					} else {
						extra = `\n\n${attachment.url}`;
					}
				} else {
					for (const attachment of reaction.message.attachments.values()) {
						extra += `\n${attachment.url}`;
					}
				}
			}

			if (reaction.message.content.length > 0) {
				starboardEmbed.setDescription(ts(message.content, 4095));
			}

			console.log(reaction.message.attachments);

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Link to original message')
						.setStyle('Link')
						.setURL(reaction.message.url)
				);

			// Post the embed in the starboard channel
			starboardChannel.send({embeds: [starboardEmbed], components: [row]});
		} else if (reaction.emoji.name === '❌' && reaction.count === 1) {
			console.log("---- DELETE ----");
			// Get the starboard channel
			const alertsChannel = await client.channels.fetch('1092866838918086666');

			// Create the embed
			let starboardEmbed = new EmbedBuilder()
				.setAuthor({name: 'Reported Message', iconURL: reaction.message.author.avatarURL({dynamic: true})})
				.addFields(
					{name: 'Author', value: `${reaction.message.author.toString()}`, inline: true},
					{name: 'Channel', value: `<#${reaction.message.channel.id}>`, inline: true}
				)
				.setColor(0xeb4034)
				.setTimestamp(reaction.message.createdAt);

			if (message.content.length > 0) {
				starboardEmbed.setDescription(ts(message.content, 4095));
			}




			console.log(reaction.message.attachments);

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Link to original message')
						.setStyle('Link')
						.setURL(reaction.message.url)
				).addComponents(
					new ButtonBuilder()
						.setLabel('Delete message (Currently WIP)')
						.setStyle('Danger')
						.setCustomId(`delete_msg_${reaction.message.id}`)
				)

			// Post the embed in the starboard channel
			alertsChannel.send({embeds: [starboardEmbed], components: [row], content: `${extra}`});
		}
	} catch (err) {
		console.log("---- ERROR MESSAGE REACTION ADD ----");
		console.log(err);
		console.log("---- ERROR MESSAGE REACTION ADD ----");
		errMsg(err, "messageReactionAdd event", `reaction: ${reaction}\tuser: ${user}`);
	}
});




// Log in to Discord with your client's token
client.login(token);
module.exports = { mikuBotVer, client, botAvatarURL};
