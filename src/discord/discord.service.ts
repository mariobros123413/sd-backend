import { Injectable } from '@nestjs/common';
import { Client, MessagePayload,  TextChannel } from 'discord.js';

@Injectable()
export class DiscordService {
//   private readonly client: Client;

//   constructor() {
//     this.client = new Client({
//       intents: [
//         Intents.FLAGS.GUILDS,
//         Intents.FLAGS.GUILD_MESSAGES,
//         Intents.FLAGS.DIRECT_MESSAGES,
//       ],
//     });

//     this.client.login('TU_TOKEN_DE_DISCORD');

//     this.client.once('ready', () => {
//       console.log(`Logged in as ${this.client.user.tag}`);
//     });
//   }

//   async sendMessageWithAttachment(userId: string, attachment: Buffer, fileName: string) {
//     const user = await this.client.users.fetch(userId);

//     const channel = await user.createDM(); // Assuming you want to send a direct message

//     const attachmentPayload = new MessagePayload()
//       .setFiles([
//         {
//           attachment: attachment,
//           name: fileName,
//         },
//       ]);

//     channel.send(attachmentPayload);
//   }
}
