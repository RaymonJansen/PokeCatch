// Requirements
const fs = require('fs');
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const { token, prefix } = require('./config.json');
const database = require('./database.json');
const { createConnection } = require('mysql');

// Other
const appear = new require('./timedFunctions/appear.js');
const cooldowns = new Discord.Collection();

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let con = createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database
});

con.connect(err => {
    if (err) {
        sendConnErr(err);
        throw err;
    }
    console.log("Connected to Database!");
});

function sendConnErr(error) {
    console.log(`[MYSQL ERR] : ${error}`);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    client.user.setStatus('available')
    client.user.setPresence({ activities: [{ name: 'POKEMON' }] });

    console.log('Bot is Ready!');

    pokePear();
    setInterval(pokePear, 300000);
});

function pokePear() {
    appear.appear(client);
}

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        return;
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`:x: please wait **${timeLeft.toFixed(0)}** more second(s) before using the \`.${command.name}\` command again.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

// Login to Discord with your client's token
client.login(token).then(r => {
    console.log("Client Login Done");
});

// TODO:
// Add Gen 8 Pokemons -> Pokedex + Images
// Add Evolutions to All Pokemons
// Find a way for a user to get PokeBalls -> Also make DataBase Table for users "Inventory", "CatchedPokemons"
// Find a way for Spawn Rates (Like Mythical, Rare, Common etc.)
// Let a user Catch a pokemon.
// Use CatchPercentage per pokeball