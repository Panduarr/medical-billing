const fs = require("fs");
const path = require("path");
const http = require("http");
const { URL } = require("url");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
];

const CREDENTIALS_PATH = path.join(
  __dirname,
  "../credentials/credentials.json"
);

const TOKEN_PATH = path.join(
  __dirname,
  "../token.json"
);

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

async function main() {
  // Read Google credentials
  const credentials = JSON.parse(
    fs.readFileSync(CREDENTIALS_PATH, "utf8")
  );

  const config = credentials.installed;

  if (!config) {
    throw new Error(
      "credentials.json must contain an installed section."
    );
  }

  // Create OAuth client
  const auth = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    REDIRECT_URI
  );

  // Create authorization URL
  const authUrl = auth.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  // Start local callback server
  const server = http.createServer(
    async (req, res) => {
      try {
        const requestUrl = new URL(
          req.url,
          REDIRECT_URI
        );

        if (
          requestUrl.pathname !==
          "/oauth2callback"
        ) {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }

        const error =
          requestUrl.searchParams.get("error");

        if (error) {
          res.writeHead(400);
          res.end(
            `Google authorization failed: ${error}`
          );

          server.close();
          return;
        }

        const code =
          requestUrl.searchParams.get("code");

        if (!code) {
          res.writeHead(400);
          res.end("Authorization code not found.");
          return;
        }

        // Exchange code for tokens
        const { tokens } =
          await auth.getToken(code);

        // Save token
        fs.writeFileSync(
          TOKEN_PATH,
          JSON.stringify(tokens, null, 2)
        );

        res.writeHead(200, {
          "Content-Type": "text/html",
        });

        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Google Authorization</title>
          </head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>✅ Google Authorization Successful</h1>
            <p>You can close this browser tab.</p>
          </body>
          </html>
        `);

        console.log(
          "\n================================="
        );

        console.log(
          "GOOGLE AUTHORIZATION SUCCESS"
        );

        console.log(
          "================================="
        );

        console.log(
          `\nToken saved to:\n${TOKEN_PATH}\n`
        );

        setTimeout(() => {
          server.close();
        }, 500);
      } catch (err) {
        console.error(
          "\nOAuth Error:",
          err.message
        );

        res.writeHead(500);
        res.end(
          "Google authorization failed. Check the terminal."
        );

        server.close();
      }
    }
  );

  server.listen(PORT, () => {
    console.log(
      "\n================================="
    );

    console.log(
      "GOOGLE AUTHORIZATION"
    );

    console.log(
      "=================================\n"
    );

    console.log(
      "Open this URL in your browser:\n"
    );

    console.log(authUrl);

    console.log(
      `\nWaiting for Google callback on:\n${REDIRECT_URI}\n`
    );
  });
}

main().catch((error) => {
  console.error(
    "\nError:",
    error.message
  );
});