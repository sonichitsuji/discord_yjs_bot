const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
    new SlashCommandBuilder()
    .setName("add")
    .setDescription("語録を追加します")
    .addStringOption(option =>
        option
        .setName("word")
        .setDescription("追加する語録")
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("スラッシュコマンド登録中...");
        await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );
    console.log("登録完了！");
    } catch (error) {
    console.error(error);
    }
})();
