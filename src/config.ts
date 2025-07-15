import dotenv from "dotenv";
dotenv.config();

export const config = {
  token: process.env.TOKEN as string,
  clientId: process.env.CLIENT_ID as string,

  spotify: {
    clientId: process.env.SPOTIFY_ID as string,
    clientSecret: process.env.SPOTIFY_SECRET as string,
  },

  nodes: [
    {
      name: "Muno",
      host: process.env.LAVALINK_HOST || "localhost",
      port: Number(process.env.LAVALINK_PORT) || 2333,
      password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
      secure: false,
      resumeKey: "riffy-resume",
      resumeTimeout: Number(process.env.RESUME_TIMEOUT) || 60,
    },
  ],

  defaultPlatform: (process.env.DEFAULT_PLATFORM || "spsearch") as
    | "ytsearch"
    | "ytmsearch"
    | "scsearch"
    | string,
};