const { MessageAttachment, MessageEmbed } = require('discord.js');
let pokedexData = require("./../pokedex.json");

module.exports = {
    name: 'pokedex',
    aliases: ['pd'],
    cooldown: '5',
    description: 'Shows info about a certain pokemon',
    execute(message, args, client) {
        let pokeData;
        let isID = false;
        let pokemonData = [];

        if (module.exports.channelName) {
            if (message.channel.name !== module.exports.channelName) {
                message.reply("Wrong Channel");
            }
        }

        if (args.length !== 1) {
            message.reply("Missing Argument");
        }

        let hasData = false;
        if (!isNaN(args[0])) {
            let pokeID = args[0] - 1;
            if (pokedexData[pokeID] !== undefined) {
                pokeData = JSON.parse(JSON.stringify(pokedexData[pokeID]));
                hasData = true;
            }
            isID = true;
        } else {
            pokeData = JSON.parse(JSON.stringify(pokedexData));
            pokeData.forEach(obj => {
                let name = obj.name['english']
                if (name.toLowerCase() === args[0].toLowerCase()) {
                    pokemonData.push(obj);
                }
            })

            hasData = (pokemonData[0] !== undefined);
            isID = false;
        }

        if (hasData) {
            let pokeName = (isID) ? pokeData.name["english"] : pokemonData[0].name['english'];
            let pokeGen = (isID) ? pokeData.generation : pokemonData[0].generation;
            let pokeHP = (isID) ? pokeData.base["HP"] : pokemonData[0].base['HP'];
            let pokeAttack = (isID) ? pokeData.base["Attack"] : pokemonData[0].base['Attack'];
            let pokeDefense = (isID) ? pokeData.base["Defense"] : pokemonData[0].base['Defense'];
            let pokeSpAttack = (isID) ? pokeData.base["Sp. Attack"] : pokemonData[0].base['Sp. Attack'];
            let pokeSpDefense = (isID) ? pokeData.base["Sp. Defense"] : pokemonData[0].base['Sp. Defense'];
            let pokeSpeed = (isID) ? pokeData.base["Speed"] : pokemonData[0].base['Speed'];
            let pokeType = (isID) ? pokeData.type.join(' - ') : pokemonData[0].type.join(' - ');
            let pokeImage = (isID) ?  `./images/${args[0]}.png` : `./images/${pokemonData[0].id}.png`;
            let pokeImage_ = (isID) ?  `${args[0]}.png` : `${pokemonData[0].id}.png`;
            let pokeId = (isID) ?  pokeData.id : pokemonData[0].id;
            let pokeEvo = (isID) ?  pokeData.evolutions.join(" -> ") : pokemonData[0].evolutions.join(" -> ");

            let embedColor = "";
            switch (pokeGen) {
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

            if (pokeId > 1 && pokeId < 10) {
                pokeId = `00${pokeId}`;
            } else if (pokeId > 9 && pokeId < 100) {
                pokeId = `0${pokeId}`;
            } else {

            }

            const file = new MessageAttachment(`${pokeImage}`);
            const pokeEmbed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`#${pokeId} - ${pokeName}`)
                .setDescription('Some description here')
                .setThumbnail(`attachment://${pokeImage_}.png`)
                .addFields(
                    { name: 'HP', value: `${pokeHP}`, inline: true },
                    { name: 'Attack', value: `${pokeAttack}`, inline: true },
                    { name: 'Defense', value: `${pokeDefense}`, inline: true },
                )
                .addFields(
                    { name: 'Speed', value: `${pokeSpeed}`, inline: true },
                    { name: 'Special Attack', value: `${pokeSpAttack}`, inline: true },
                    { name: 'Special Defense', value: `${pokeSpDefense}`, inline: true },
                )
                .addFields(
                    { name: 'Type', value: `${pokeType}`, inline: true },
                    { name: 'Generation', value: `${pokeGen}`, inline: true },
                )
                .setTimestamp()
                .setFooter('PokéCatch', '');

            if (pokeEvo !== "") {
                pokeEmbed.addFields(
                    { name: 'Evolutions', value: `${pokeEvo}`, inline: true },
                )
            }

            message.channel.send({ embeds: [pokeEmbed], files: [file] });
        }
    },
};