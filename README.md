# Template
This is a template for a Discord Bot meant to be on multiple servers as the same instance.

This archetype of bot is designed to exist in multiple servers using the same web server. Because complications can arrise when saving local variables, this bot bypasses this issue and just creates a json file for each unique server it's registered in. This way, any server specific variables (like a message logging channel, blacklisted users, etc) can be stored with no issue. Furthermore, it also allows the bot to safely be shut off without losing data.


# Bot commands

Check the commands folder to see commands. The template can be copied and pasted as needed.



# Setup instructions
Prereqs: [node.js](https://nodejs.org/), linux server preferred

Navagate to the appropriate folder, and then start a new node project with `npm init`.

Install discord.js to your new project, `npm install discord.js`.

Then, import all the files from this repo. Edit the secrets.json and config.json files to include the appropriate information. Run `screen node index.js` to run the bot in a screen, so that you can close your terminal window. 






