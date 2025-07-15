import { logger } from "../../utils/logger";

export default {
  name: "nodeDestroy",
  execute(client: any, node: any) {
    logger.warn(`[Riffy] ⚠️ Node "${node.name}" has been destroyed.`);
  },
};