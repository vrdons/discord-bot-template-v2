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
/**
 * d => 03/05/2023
 
 * D => March 5, 2023

 * t => 2:22 PM

 * T => 2:22:00 PM

 * f => March 5, 2023 2:22 PM

 * F => Sunday, March 5, 2023 2:22 PM

 * R => A minute ago
 */
export type TIMESTAMP_TYPE = "d" | "D" | "t" | "T" | "f" | "F" | "R";
export function formatTimesamp(timestamp: number, type: TIMESTAMP_TYPE) {
  return `<t:${Math.floor(timestamp / 1000)}${type ? `:${type}` : ""}>`;
}
