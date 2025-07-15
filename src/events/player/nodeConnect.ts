import { Client } from "discord.js";
import { logger } from "../../utils/logger";

export const name = "nodeConnect";
export const once = false;

export function execute(client: Client, node: any) {
  logger.success(`[Riffy] Node "${node.name}" connected!`);
}