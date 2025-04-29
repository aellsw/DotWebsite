const axios = require("axios");

exports.handler = async (event) => {
    const code = event.queryStringParameters.code;

    if (!code) {
        return {
            statusCode: 400,
            body: "Missing OAuth code.",
        };
    }

    const client_id = "YOUR_CLIENT_ID"; // Replace with your actual client ID
    const client_secret = process.env.DISCORD_CLIENT_SECRET;
    const redirect_uri = "https://thedawnoftime.netlify.app/oauth/callback";

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post(
            "https://discord.com/api/v10/oauth2/token",
            new URLSearchParams({
                client_id,
                client_secret,
                code,
                grant_type: "authorization_code",
                redirect_uri,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, token_type } = tokenResponse.data;

        // (Optional) Use the token to fetch user info
        const userResponse = await axios.get("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: `${token_type} ${access_token}`,
            },
        });

        const user = userResponse.data;

        return {
            statusCode: 200,
            body: `Hello, ${user.username}#${user.discriminator}! OAuth success.`,
        };
    } catch (err) {
        console.error("OAuth Error:", err.response?.data || err.message);
        return {
            statusCode: 500,
            body: "OAuth failed: " + (err.response?.data?.error_description || err.message),
        };
    }
};
