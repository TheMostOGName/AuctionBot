const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createAuction')
		.setDescription('Create a new auction')
		.addIntegerOption(option =>
			option.setName('auctionType')
				.setDescription('The type of auction, see #rules')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item you want to auction')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('startingBid')
                .setDescription('The starting bid')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('time')
                .setDescription('The number of hours the auction will last')
                .setRequired(true)
        ),
        //TODO: add anom options
	async execute(interaction) {
		const auctionType = interaction.options.getInteger('auctionType');
        const auctionItem = interaction.options.getInteger('auctionType');
        const startingBid = interaction.options.getInteger('auctionType');
        const auctionLength = interaction.options.getInteger('auctionType');

        console.log(auctionLength)
        try {
            const guildId = interaction.guild.id;
            //TODO: come up with a unique identifier system for each player and/or auction that can be accessed (probably via command?)

            const identifier = "";

            const filePath = path.resolve(__dirname, `../../guilds/${guildId}/${identifier}.json`);
            

            // Check if all the arguments are valid
            if (!auctionType || !auctionItem || !startingBid || auctionLength) {
                return interaction.reply("Invalid arguments");
            }

            //Create the new auction channel
            const channelName = interaction.user.username + identifier
            const auctionChannel = await interaction.guild.channels.create(channelName, "text");

            //TODO: make the bot send the message with the auction info. Also create some way for the auction creator 

            // Create JSON file
            var jsonArray = { 
                "guildId"  :  interaction.guild.id,
                "channelID" : auctionChannel.id,
                "auctionOwner"  : interaction.user.id,
                "auctionID" : identifier,
                "auctionType"   :  auctionType,
                "auctionItem"   :  auctionItem,
                "startingBid"   :  startingBid,
                "auctionLength" :  auctionLength
                }


            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(jsonArray)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Auction created");
        } catch (Exception) {
            interaction.reply("Error creating auction")
            console.log(Exception)
        } 
	},
};


//REMEMBER TO SET THE NEW JSON VALUE IN update.js AND register.js!!!
