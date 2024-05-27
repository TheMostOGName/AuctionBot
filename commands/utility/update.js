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
                //THIS FILE IS CURRENTLY A TEMPLATE. REPLACE ANYTHING IN ANGLE BRACKETS AS NEEDED.

                //<Value1> (Array)
                if (typeof currInfo.<value1> === 'undefined' || currInfo.<value1> === null) {
                    var <value1> = [];
                } else {
                    var <value1> = currInfo.<value1>
                }

                //<Value2> (String)
                if (typeof currInfo.<value2> === 'undefined' || currInfo.<value2> === null) {
                    var <value2> = "";
                } else {
                    var logID = currInfo.logID
                }

                var jsonArray = { 
                    "guildId"  :  interaction.guild.id, 
                    "<value1Name>" : <value1>,
                    "<value2Name>"   :  <value2>,
                    }
                
                
                // Convert JSON object to a formatted string with proper spacing
                const jsonString = JSON.stringify(jsonArray, null, 2);

                // Write the formatted JSON string to file
                require("fs").writeFileSync(filePath, jsonString);

                interaction.reply("Server updated")
                }
	},
};
