const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setStarAuctionID')
		.setDescription('Set the category ID for star frag auctions')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addIntegerOption(option =>
			option.setName('categoryid')
				.setDescription('The category ID')
				.setRequired(true)),
	async execute(interaction) {
		const id = interaction.options.getInteger('categoryid');
        console.log(id)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            console.log(id)

            // Check if time is valid
            if (!id) {
                return interaction.reply("Invalid ID");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.starAuctionID = id;

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("ID set");
        } catch (Exception) {
            interaction.reply("Error setting ID")
            console.log(Exception)
        } 
	},
};


//REMEMBER TO SET THE NEW JSON VALUE IN update.js AND register.js!!!
