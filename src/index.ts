import { Client, Events, REST, Routes, SlashCommandBuilder } from "discord.js";

let commands: SlashCommandBuilder[] = [];

class Parameter {
    name: string;
    description: string;
    type: "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE";
    required: boolean;

    constructor(name: string, description: string, type: "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE", required?: boolean) {
        if (required) this.required = required;
        else this.required = true;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}

export function command(client: Client, commandName: string, description: string, parameters?: Parameter[]) {
    let commandbuilder = new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(description);
    
    if (parameters) {
        for (const parameter of parameters) {
            if (parameter.type === "STRING") commandbuilder.addStringOption(option => option
                .setName(parameter.name)
                .setDescription(parameter.description)
                .setRequired(parameter.required));
            if (parameter.type === "INTEGER") commandbuilder.addIntegerOption(option => option
                .setName(parameter.name)
                .setDescription(parameter.description)
                .setRequired(parameter.required));
            if (parameter.type === "BOOLEAN") commandbuilder.addBooleanOption(option => option
                .setName(parameter.name)
                .setDescription(parameter.description)
                .setRequired(parameter.required));
            if (parameter.type === "USER") commandbuilder.addUserOption(option => option
                .setName(parameter.name)
                .setDescription(parameter.description)
                .setRequired(parameter.required));
            if (parameter.type === "CHANNEL") commandbuilder.addChannelOption(option => option
                .setName(parameter.name)
                .setDescription(parameter.description)
                .setRequired(parameter.required));
            if (parameter.type === "ROLE") commandbuilder.addRoleOption(option => option
                .setName(parameter.name)
                .setDescription(parameter.description)
                .setRequired(parameter.required));
        }
    }
    
    commands = commands.concat([commandbuilder]);
    
    return (target: any, propteryKey: string, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;
        client.on(Events.InteractionCreate, interaction => {
            if (!interaction.isChatInputCommand()) return;
            if (interaction.commandName !== commandName) return;
            // @ts-ignore
            original.call(this, interaction);
            console.log(interaction);
        });
    }
}


export async function syncCommands(client: Client, token: string) {
    const rest = new REST().setToken(token);
    const data = await rest.put(
        Routes.applicationCommands(client.user?.id as string),
        { body: commands },
    );
}