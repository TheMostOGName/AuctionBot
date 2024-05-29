const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

//THIS FILE IS CURRENTLY A TEMPLATE. REPLACE ANYTHING IN ANGLE BRACKETS AS NEEDED.

//This archetype of bot is designed to exist in multiple servers using the same web server. Because complications can arrise when saving local variables, this bot
//bypasses this issue and just creates a json file for each unique server it's registered in. This way, any server specific variables (like a message logging channel,
//blacklisted users, etc) can be stored with no issue. Furthermore, it also allows the bot to safely be shut off without losing data.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers the server to the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        const filePath = './guilds/' + interaction.guild.id + '.json';
        var dirPath = './guilds/' + interaction.guild.id;

        //make a directory for the server
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath, { recursive: true });
        }

        //make the json file for the server
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                //var <value1> = []
                var jsonArray = { 
                    "guildId"  :  interaction.guild.id, 
                    "normalAuctionID" : "",
                    "starAuctionID"   :  "",
                    "rule3AuctionID"    :  ""
                    }
                
                require("fs").writeFileSync(filePath, JSON.stringify(jsonArray));
                interaction.reply("Server registered")

            } else {
                interaction.reply("Error: server already registered")
            }
          });

	},
};
