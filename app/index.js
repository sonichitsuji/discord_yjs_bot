const { Client, GatewayIntentBits, Partials } = require('discord.js'); //discord.js から読み込む

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
}); //clientインスタンスを作成する

//import・require
const analects = require('./analects.js');
const fs = require("fs");
const path = require("path");
const http = require("http");

// 語録読み込み
const analectsPath = path.join(__dirname, "analects.js");

client.once('clientReady', () => { //ここにボットが起動した際のコードを書く(一度のみ実行)
	console.log('起動完了'); //コンソールに表示
});

client.on("messageCreate", async msg => {
	if (msg.author.bot) return;
	const matched = analects.find(word => msg.content.includes(word));
	if (matched) {
		msg.reply(
			`淫夢語録を検出しました。\n該当部分:「${matched}」`);
		return;
	}
});

// スラッシュコマンド
client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (interaction.commandName === "add") {
    const word = interaction.options.getString("word");
    if (analects.includes(word)) {
		return interaction.reply({
        content: "その語録はもう登録されています。",
        ephemeral: true,
		});
    }
    analects.push(word);
    fs.writeFileSync(
		analectsPath,
		"module.exports = " + JSON.stringify(analects, null, 2) + ";"
    );
    await interaction.reply(`語録を追加しました：「${word}」`);
	}
});

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
	if (req.url === "/health") {
    	res.writeHead(200, { "Content-Type": "text/plain" });
    	res.end("OK");
	} else {
    	res.writeHead(404);
    	res.end();
	}
}).listen(PORT, () => {
	console.log(`Health check server running on port ${PORT}`);
});

const token = process.env.DISCORD_TOKEN;
client.login(token); //Discordにログインする