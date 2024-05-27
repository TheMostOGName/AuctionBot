const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('<template>')
		.setDescription('<Template file, replace everything in angle brackets as needed>')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addIntegerOption(option =>
			option.setName('<argument>')
				.setDescription('<the value to set>')
				.setRequired(true)),
	async execute(interaction) {
		const <arg> = interaction.options.getInteger('<argument>');
        console.log(<arg>)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            console.log(<arg>)

            // Check if time is valid
            if (!<arg>) {
                return interaction.reply("Invalid <argument>");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.<argName> = <arg>;

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("<argument> set");
        } catch (Exception) {
            interaction.reply("Error setting <argument>")
            console.log(Exception)
        } 
	},
};


//REMEMBER TO SET THE NEW JSON VALUE IN update.js AND register.js!!!
