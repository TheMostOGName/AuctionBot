const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Update the server info to the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        const guildId = interaction.guild.id;
        const path = require('path')
        const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
        var tryUpdate = true

        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            // File exists, continue with processing
        } catch (err) {
            // Handle error, file doesn't exist
            interaction.reply("Error: server not registered");
            tryUpdate = false;
        }


        if (tryUpdate) {
            let currInfo = require(filePath); 
                
                //Check if array vars for server specfic features have been defined. Keep their value if they do. Add more values as needed

                //NormalID (String)
                if (typeof currInfo.normalAuctionID === 'undefined' || currInfo.normalAuctionID === null) {
                    var normalAuctionID = "";
                } else {
                    var normalAuctionID = currInfo.normalAuctionID
                }

                //starAuctionID (String)
                if (typeof currInfo.starAuctionID === 'undefined' || currInfo.starAuctionID === null) {
                    var starAuctionID = "";
                } else {
                    var starAuctionID = currInfo.starAuctionID
                }

                //rule3AuctionID (String)
                if (typeof currInfo.rule3AuctionID === 'undefined' || currInfo.rule3AuctionID === null) {
                    var rule3AuctionID = "";
                } else {
                    var rule3AuctionID = currInfo.rule3AuctionID
                }

                var jsonArray = { 
                    "guildId"  :  interaction.guild.id, 
                    "normalAuctionID" :  normalAuctionID,
                    "starAuctionID"   :  starAuctionID,
                    "rule3AuctionID"  :  rule3AuctionID
                    }
                
                
                // Convert JSON object to a formatted string with proper spacing
                const jsonString = JSON.stringify(jsonArray, null, 2);

                // Write the formatted JSON string to file
                require("fs").writeFileSync(filePath, jsonString);

                interaction.reply("Server updated")
                }
	},
};
