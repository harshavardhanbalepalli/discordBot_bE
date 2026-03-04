const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

//Acitivty status bar
client.user.setActivity('with Gemini AI', { type: ActivityType.Playing });

//initialise gemini
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

//Initilise client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", async (message)=>{
    //ignore the bot message 
    if(message.author.bot) return;
    console.log(message.content);

    //if the message start with !ai we do not reply with ai we sent this text instead..
    if (message.content.startsWith("!ai ")) {
        message.reply("I am not ai so I can't do what he does atleast as of now, but my master has given only this line to send you, Anyway thanks for calling me..");
    return;
    }
    const prompt = message.content.trim();

    try{
        await message.channel.sendTyping();

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        //Discord has a limit of 2000 characters
        if(text.length > 2000){
            await message.reply(text.substring(0, 2000));
        }else{
            await message.reply(text);
        }
        console.log("Success...");
    }catch(error){
        console.log("Gemini error:", error);
        message.reply("Sorry I've encountered a problem while processing your request");
    }
});

client.on("interactionCreate", (interaction)=>{
    interaction.reply("pong!...");
})

client.login(process.env.BOT_TOKEN);
