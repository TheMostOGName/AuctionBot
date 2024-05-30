const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createauction')
        .setDescription('Create a new auction')
        .addStringOption(option =>
            option.setName('auctiontype')
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
            option.setName('startingbid')
                .setDescription('The starting bid')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('The number of hours from now the auction will last')
                .setRequired(true)
        ),
    async execute(interaction) {
        const auctionType = interaction.options.getString('auctiontype');
        const auctionItem = interaction.options.getString('item');
        const startingBid = interaction.options.getInteger('startingbid');
        const auctionLength = interaction.options.getInteger('time');

        const playerName = interaction.user.username;
        const identifierName = playerName.replace(/\s/g, "");

        console.log(auctionLength);
        try {
            // Resolve the path to the guild's JSON file
            const guildJsonPath = path.resolve(__dirname, `../../guilds/${interaction.guild.id}.json`);
            if (!fs.existsSync(guildJsonPath)) {
                throw new Error(`File not found: ${guildJsonPath}`);
            }
            let info = require(guildJsonPath);
            let categoryID = "";

            // Get the correct category ID 
            switch (auctionType.toLowerCase()) {
                case "normal":
                    categoryID = info.normalAuctionID;
                    break;
                case "star":
                    categoryID = info.starAuctionID;
                    break;
                case "rule3":
                    categoryID = info.rule3AuctionID;
                    break;
                default:
                    throw new Error("Invalid Auction Type");
            }

            const guildId = interaction.guild.id;
            const identifier = (identifierName + "-" + (Math.random() + 1).toString(36).substring(7)).toLowerCase();

            const filePath = path.resolve(__dirname, `../../guilds/${guildId}/${identifier}.json`);

            // Check if all the arguments are valid
            if (!auctionType || !auctionItem || !startingBid || !auctionLength) {
                return interaction.reply("Invalid arguments");
            }

            // Create the new auction channel
            const channelName = `${identifier}`;
            const auctionChannel = await interaction.guild.channels.create({
                name: channelName,
                type: 0, // Corrected to use integer value for GUILD_TEXT
                parent: categoryID,
            });            

            // Get the current time and add the duration to it
            const currentTime = new Date();
            const endTime = new Date(currentTime.getTime() + auctionLength * 60 * 60 * 1000);
            const endTimestamp = Math.floor(endTime.getTime() / 1000);

            await auctionChannel.send({ content: `User <@${interaction.user.id}> has created a ${auctionType} auction for \`${auctionItem}\`. The auction will end at <t:${endTimestamp}>, and the starting bid is \`${startingBid}\`` });

            await auctionChannel.send({ content: `The ID for this auction is: \`${identifier}\`. Use this identifier to specify which auction you are bidding on.`})

            // Create JSON file
            const jsonArray = {
                "guildId": interaction.guild.id,
                "channelID": auctionChannel.id,
                "auctionOwner": interaction.user.id,
                "auctionID": identifier,
                "auctionType": auctionType,
                "auctionItem": auctionItem,
                "startingBid": startingBid,
                "auctionLength": auctionLength,
                "currentBid": 0
            };

            // Ensure the directory exists
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(jsonArray));

            // Reply to interaction
            interaction.reply("Auction created");
        } catch (error) {
            interaction.reply("Error creating auction");
            console.error(error);
        }
    },
};
