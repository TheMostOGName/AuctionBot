const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createAuction')
		.setDescription('Create a new auction')
		.addStringOption(option =>
			option.setName('auctionType')
				.setDescription('The type of auction, see #rules')
				.setRequired(true)
                .addChoices(
                    { name: 'Normal', value: 'Normal' },
                    { name: 'Star Frag', value: 'Star' },
                    { name: 'Rule 3', value: 'Rule3' },
                ))
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
                .setDescription('The number of hours from now the auction will last')
                .setRequired(true)
        ),
        //TODO: add anom options
	async execute(interaction) {
		const auctionType = interaction.options.getString('auctionType');
        const auctionItem = interaction.options.getString('auctionItem');
        const startingBid = interaction.options.getInteger('startingBid');
        const auctionLength = interaction.options.getInteger('time');

        const playerName = interaction.member.username;
        const identifierName = playerName.replace(/\s/g, "");;

        console.log(auctionLength)
        try {
            let info = require("./guilds/" + interaction.guild.id + ".json");
            var categoryID = "";

            //Get the correct category ID 
            switch(auctionType.toLowerCase) {
                case "normal":
                    categoryID = info.normalAuctionID
                    break;
                case "star":
                    categoryID = info.starAuctionID
                    break;
                case "rule3":
                    categoryID = info.rule3AuctionID
                    break;
                default: 
                    throw new Error("Invalid Auction Type")
            }


            const guildId = interaction.guild.id;
            //TODO: come up with a unique identifier system for each player and/or auction that can be accessed (probably via command?)
            const identifier = (identifierName + (Math.random() + 1).toString(36).substring(7)).toLowerCase;

            const filePath = path.resolve(__dirname, `../../guilds/${guildId}/${identifier}.json`);
            

            // Check if all the arguments are valid
            if (!auctionType || !auctionItem || !startingBid || !auctionLength) {
                return interaction.reply("Invalid arguments");
            }

            //Create the new auction channel
            const channelName = interaction.user.username + identifier
            const auctionChannel = await interaction.guild.channels.create(identifier).then(channel => {
              channel.setParent(categoryID);
            })
            .catch(err => {
              console.log(err)
            });

            //get custom timestamp ready
             // Get the current time and add the duration to it
            const currentTime = new Date();
            const endTime = new Date(currentTime.getTime() + duration * 60 * 60 * 1000);

            // Convert the end time to a Unix timestamp (in seconds, not milliseconds)
            const endTimestamp = Math.floor(endTime.getTime() / 1000);

            auctionChannel.send({content: `User <@${interaction.user.id}> has created a ${auctionType} for ${auctionItem}. The auction will end at <t:${endTimestamp}>, and the starting bid is ${startingBid}`})

            // Create JSON file
            var jsonArray = { 
                "guildId"  :  interaction.guild.id,
                "channelID" : auctionChannel.id,
                "auctionOwner"  : interaction.user.id,
                "auctionID" : identifier,
                "auctionType"   :  auctionType,
                "auctionItem"   :  auctionItem,
                "startingBid"   :  startingBid,
                "auctionLength" :  auctionLength,
                "currentBid"    :  0
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
