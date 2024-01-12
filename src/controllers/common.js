// common.js
import dotenv from 'dotenv';
import fetch from "node-fetch";
dotenv.config();

const {
  PAYPAL_BASE,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET
} = dotenv.config().parsed;

export const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

export const handleResponse = async (response) => {
  try {
    const text = await response.text();

    const jsonResponse = JSON.parse(text);

    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    return {
      jsonResponse: {
        error: response.statusText || "Failed to parse response"
      },
      httpStatusCode: response.status,
    };
  }
};