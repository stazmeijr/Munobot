import { Riffy } from "riffy";
import { Client } from "discord.js";
import { config } from "../config";
import { logger } from "../utils/logger";
import SpotifyWebApi from "spotify-web-api-node";

export class RiffyClient extends Riffy {
  public spotify: SpotifyWebApi;

  constructor(client: Client) {
    const spotify = new SpotifyWebApi({
      clientId: config.spotify.clientId,
      clientSecret: config.spotify.clientSecret,
    });

    super(client, config.nodes, {
      send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
      },
      defaultSearchPlatform: config.defaultPlatform,
      restVersion: "v4",
      plugins: [],
      bypassChecks: {
        nodeFetchInfo: true,
      },
    });

    this.spotify = spotify;
  }

  async getSpotifyToken() {
    try {
      const data = await this.spotify.clientCredentialsGrant();
      this.spotify.setAccessToken(data.body.access_token);
      logger.success("✅ Spotify token updated");
    } catch (error) {
      logger.error("❌ Error getting Spotify token");
    }
  }
}