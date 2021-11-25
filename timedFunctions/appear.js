const { MessageAttachment, MessageEmbed } = require('discord.js');
let pokedexData = require("./../pokedex.json");

exports.appear = function (client) {
    const channel = client.channels.cache.find(channel => channel.name === "general");
    let randomID = Math.floor(Math.random() * 810);
    let pokeData = JSON.parse(JSON.stringify(pokedexData[randomID]));

    let pokeImage = `./images/${pokeData.id}.png`;
    let pokeImage_ = `${pokeData.id}.png`;

    let embedColor = "";
    switch (pokeData.generation) {
        case "I":
            embedColor = "#de0f0f";
            break;
        case "II":
            embedColor = "#dc8c3b";
            break;
        case "III":
            embedColor = "#700707";
            break;
        case "IV":
            embedColor = "#7039fa";
            break;
        case "V":
            embedColor = "#0a0a0a";
            break;
        case "VI":
            embedColor = "#000d7e";
            break;
        case "VII":
            embedColor = "#c45900";
            break;
    }

    const file = new MessageAttachment(`${pokeImage}`);
    const pokeEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`A random pokemon Appeared!`)
        .setThumbnail(`attachment://${pokeImage_}.png`)
        .setDescription(`**#${pokeData.id} - ${pokeData.name['english']}**`)
        .setTimestamp()
        .setFooter('PokéCatch - Pokemon Appeared!', '');

    channel.send({ embeds: [pokeEmbed], files : [file]}).then(pokeEmbed => {
        let PBall = pokeEmbed.guild.emojis.cache.find(emoji => emoji.name === 'PBall');
        let GBall = pokeEmbed.guild.emojis.cache.find(emoji => emoji.name === 'GBall');
        let UBall = pokeEmbed.guild.emojis.cache.find(emoji => emoji.name === 'UBall');
        let MBall = pokeEmbed.guild.emojis.cache.find(emoji => emoji.name === 'MBall');
        (PBall) ? pokeEmbed.react(PBall) : pokeEmbed.react("⭕");
        (GBall) ? pokeEmbed.react(GBall) : pokeEmbed.react("🔵");
        (UBall) ? pokeEmbed.react(UBall) : pokeEmbed.react("⚫");
        (MBall) ? pokeEmbed.react(MBall) : pokeEmbed.react("Ⓜ");
    })
}