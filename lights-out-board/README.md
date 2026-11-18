# Operation Lights Out: live board (Netlify)

Privileged and confidential. Do not forward. Fictional exercise.

A small web app for the ransomware exercise. Executives open a link in any browser, type their name, take a seat, and tick off steps together. Nobody needs a Claude account.

This version runs on Netlify: the page is a static file, the API is one Netlify Function (`netlify/functions/api.mjs`), and results are saved in Netlify Blobs. The board checks for changes every 2 seconds, so updates show up on other screens within about 2 seconds.

## Deploy

You need a free Netlify account. Netlify Drop (drag and drop) does not work for this app, because it does not deploy functions. Use one of these:

**From GitHub (recommended)**

1. Put this folder in a GitHub repository (private is fine).
2. In Netlify: **Add new project → Import an existing project → GitHub**, then pick the repository. If the app is in a subfolder, set **Base directory** to that folder. Leave the build command empty. Netlify reads the rest from `netlify.toml`.
3. Before the first deploy, or right after, go to **Project configuration → Environment variables** and add:
   - `JOIN_CODE`: the code players type, for example `LIGHTS7`.
   - `ADMIN_KEY`: a long random string. Only the facilitator gets this.
4. Deploy, or redeploy if you added the variables after the first deploy.

**From your computer with the Netlify CLI**

```
npm install
npx netlify-cli login
npx netlify-cli init          # create the project
npx netlify-cli env:set JOIN_CODE LIGHTS7
npx netlify-cli env:set ADMIN_KEY <a-long-random-string>
npx netlify-cli deploy --prod
```

## Links to send

- Players: `https://<your-site>.netlify.app/?code=<JOIN_CODE>`
- Facilitator (keep it): `https://<your-site>.netlify.app/?code=<JOIN_CODE>&admin=<ADMIN_KEY>`

After the page opens, it removes the code and key from the address bar and remembers them in that browser.

## How it works on the day

- Players take a seat, read their role, and tick steps as they are said aloud. Each step takes a note and a delay reason.
- The facilitator starts the exercise and moves through the injects. Round 1 shows a 20-minute countdown.
- The Results tab shows each first-response step against its target, a count of delay reasons, the decision log, notes, and the Playbook fixes anyone adds. Save results downloads a spreadsheet.
- Reset board (facilitator only) clears steps, seats, decisions and fixes for the next run.

## Things to know

- The board is on the public internet. The join code is the only gate, so share it only with the players and pick one that is hard to guess. Change `JOIN_CODE` and redeploy after the exercise to lock the board.
- Names are typed by each person and are not verified.
- Results are kept in Netlify Blobs for this site. Use Reset board to clear them, or delete the `lights-out` store under **Blobs** in the Netlify dashboard.
- Each open browser calls the function about every 2 seconds (every 15 seconds when the tab is in the background). Ten players for 90 minutes is roughly 30,000 calls, well inside Netlify's free allowance, but check your plan if you run it many times.
- Have Legal confirm the "Privileged and confidential" wording and who may hold the results.
