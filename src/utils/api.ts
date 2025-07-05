import { Interaction, Message, User } from "discord.js";
export function getUser(interaction: Interaction | Message | User): User {
  if (interaction instanceof User) return interaction;
  return (interaction as Message).author ?? (interaction as Interaction).user;
}
export function getUserOrClientAvatar(interaction: Interaction | Message | User): string | undefined {
  const user = getUser(interaction);
  let userAvatar = user.avatarURL({ extension: "webp" });
  if (userAvatar) return userAvatar;
  userAvatar = user.displayAvatarURL({ extension: "webp" });
  if (userAvatar) return userAvatar;
  userAvatar = interaction.client.user.avatarURL({ extension: "webp" });
  if (userAvatar) return userAvatar;
  userAvatar = interaction.client.user.displayAvatarURL({ extension: "webp" });
  if (userAvatar) return userAvatar;
}
