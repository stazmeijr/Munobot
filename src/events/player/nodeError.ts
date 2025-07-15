import { logger } from "../../utils/logger";

export default {
  name: "nodeError",
  execute(client: any, node: any, error: any) {
    logger.error(`[Riffy] ❌ Node "${node.name}" encountered an error: ${error?.message || error}`);
  },
};