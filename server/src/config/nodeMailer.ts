import { google } from "googleapis";
import nodemailer, { Transport, TransportOptions } from "nodemailer";
import config from "./config.ts";
import logger from "./logger.ts";

const createTransporter = async () => {
  const OAuth2 = google.auth.OAuth2;
  const { clientId, email, clientSecret, redirectUri, refreshToken } =
    config.getOAuthConfig();
  const OAuthClient = new OAuth2(clientId, clientSecret, redirectUri);
  OAuthClient.setCredentials({ refresh_token: refreshToken });
  try {
    const { token } = await OAuthClient.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: email,
        clientId,
        clientSecret,
        refreshToken,
        accessToken: token,
      },
    } as unknown as TransportOptions);

    return transporter;
  } catch (error: unknown) {
    logger.error(`Error in get accessing token from google auth, ${error}`);
    throw error;
  }
};


export default createTransporter;