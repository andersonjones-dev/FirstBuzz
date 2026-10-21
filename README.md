# Firstbuzz

Fastest-finger quiz buzzer for up to 30 players. Players join from their own phones by QR code, room code or invite link, with nothing to install. The host's device referees every buzz by the exact moment it was pressed, so slow Wi-Fi never costs anyone a question.

© 2026 Anderson Jones

## What's inside

| File | What it does |
|---|---|
| `index.html` | The page every device opens |
| `css/app.css` | All visuals and the 7 themes |
| `js/config.js` | **The only file you edit to go live** (Firebase settings) |
| `js/packs.js` | Quiz packs: add or edit questions here |
| `js/i18n.js` | English and Kannada interface text, quips |
| `js/host.js` | Host: setup, lobby, refereeing |
| `js/player.js` | Player phone: join and buzz |
| `js/stage.js` | The stage screen (host and big screen) |
| `js/net.js` | Live sync (Firebase) and clock syncing |
| `js/media.js` | Sounds, confetti, keep-screen-awake |
| `database.rules.json` | Security rules to paste into Firebase |
| `sw.js`, `manifest.webmanifest`, `icons/` | Install-to-home-screen and offline support |

## The four views

- **Start** `…/` Host a game or type a code.
- **Host** `…/#/host` Pick a pack, show the QR code, run the game. Reloading resumes your room.
- **Player** `…/#/join/ABC123` The phone becomes one big buzzer.
- **Big screen** `…/#/screen/ABC123` For a laptop or smart TV on the projector. Shows the stage, quips and podium.

---

## Step 1 — Put it on GitHub (from iPhone or iPad)

Everything below works in Safari. When a GitHub or Firebase page looks cramped, tap **aA** in the address bar and choose **Request Desktop Website**.

1. Save the zip to the **Files** app and tap it once. iOS unzips it into a `firstbuzz` folder.
2. On github.com, tap **+ → New repository**. Name it `firstbuzz`, set it to **Public**, tick **Add a README**, and create it.
3. Upload the top-level files. Tap **Add file → Upload files → choose your files**, then pick `index.html`, `sw.js`, `manifest.webmanifest`, `database.rules.json` and `README.md` from the folder. Commit.
4. Make the folders. GitHub can't upload a folder from iPhone, so create each one with a placeholder:
   - Tap **Add file → Create new file**, type `js/.keep` as the name, and commit.
   - Open the new `js` folder, tap **Add file → Upload files**, and select every file inside your `js` folder. Commit.
   - Repeat for `css` (one file) and `icons` (six files).
5. Turn on hosting. Go to **Settings → Pages**, set Source to **Deploy from a branch**, choose `main` and `/ (root)`, then **Save**. After a minute your app is live at `https://YOURNAME.github.io/firstbuzz/`.

**Try it right away in Demo mode.** Before Firebase is set up, the app runs in Demo mode on one device. Open the link, tap **Host a game**, then open a **second Safari tab** with the room link to join as a player. You can also use **+5 demo players** to watch the whole game flow on your own.

## Step 2 — Turn on live sync with Firebase (free)

This lets real phones play together over the internet.

1. Go to **console.firebase.google.com**, tap **Add project** and name it `firstbuzz`. Google Analytics is optional; you can turn it off.
2. Tap **Build → Authentication → Get started**. Under **Sign-in method**, enable **Anonymous** and save. Players never see a login; this just gives each phone a private ID.
3. Still in Authentication, open **Settings → Authorized domains → Add domain** and add `YOURNAME.github.io`.
4. Tap **Build → Realtime Database → Create database**, choose **Singapore (asia-southeast1)** for the lowest delay in India, and start in **locked mode**.
5. Open the database's **Rules** tab, delete everything, and paste the whole of `database.rules.json`. Tap **Publish**.
6. Tap the ⚙︎ gear → **Project settings → Your apps → Web (</>)**. Name it `firstbuzz web` and register it, without Firebase Hosting. Copy the `firebaseConfig = { … }` block it shows.
7. On GitHub, open `js/config.js` and tap the ✏️ pencil. Replace `null` in `export const FIREBASE_CONFIG = null;` with the block you copied, keeping the `;` at the end. Set `PUBLIC_URL` to `'https://YOURNAME.github.io/firstbuzz/'` and commit.
8. In `sw.js`, change `VERSION` (for example to `firstbuzz-v1.0.1`) every time you change any file, so phones fetch the new version.

The yellow Demo-mode banner disappears once the app connects. You're live.

## Step 3 — Run a quiz night

1. On the host device, open the app, tap **Host a game**, choose a mood (**Party** or **Official**) and a pack, then tap **Create room**.
2. Players scan the QR code with their camera, or open the site and type the 6-letter code. The invite button shares a link to WhatsApp.
3. For a projector, open **Open big-screen view** on a laptop or smart TV and tap to start it. It shows the stage, quips and podium.
4. Tap **Start game**, read the question aloud, then tap **Open buzzers**.
5. Mark **Correct** or **Wrong**. A wrong answer passes to the next person in the buzz queue automatically.
6. Use **Peek at answer** to see the answer privately, **Show answer on screen** to reveal it to everyone, and **Next question** to move on.
7. Tap **Finish game** for the podium.

Tips:
- Players who lose connection can rejoin with the same code and keep their score.
- Ask players to turn off Low Power Mode and keep the screen on (the app requests this automatically where the phone allows).
- Sounds play on the host device and the big screen. Turn them off on whichever device isn't near the speakers (Settings → *Play sounds on this device*).

## Quiz packs

There are nine ready-made packs, 20 questions each:

- **Bible:** Bible Basics, Old Testament Heroes, Life of Jesus, Acts and the Early Church, ಬೈಬಲ್ ಮೂಲಗಳು (Kannada)
- **General knowledge:** World General Knowledge, India Quiz, Science and Nature, Karnataka Special

Hosts can also make their own pack inside the app (**Make your own pack**). Type one question per line in the form `Question | Answer`. These packs are saved on the host's device.

To add a permanent pack for everyone, copy any block in `js/packs.js`, give it a new `id`, and edit the questions.

**Please have a fluent Kannada reader check** the Kannada interface (`js/i18n.js`) and the Kannada Bible pack before the trial run. Bible names follow the common Kannada Bible spellings, but local church usage varies.

## How the fairness works

- When a phone joins, it measures its clock against the server's several times and keeps the most accurate reading. Every phone then shares one timeline to within a few milliseconds.
- A buzz records the moment the button was pressed, not when the signal arrived.
- The host waits 0.3 s after the first buzz arrives to collect slower signals, then orders everyone by press time.
- The referee log flags any *latency-corrected* call, where one player's signal arrived first but another player pressed first.
- Buzzing before the buzzers open locks that phone for 1.5 s.

## Free-tier limits (Firebase Spark plan)

Firebase's free plan allows up to **100 phones connected at once**, which is about three full 30-player games at the same time. That's plenty for trial runs. Moving to the pay-as-you-go plan is part of the monetisation step later.

Rooms are deleted when the host taps **End game and close room**. Rooms that are abandoned stay in the database but use very little space; you can delete them under Realtime Database → Data.

---

## Later: App Store and Play Store without a Mac

You don't need a Mac. The plan, for after the trial run:

**Google Play (all in the browser)**
1. Open **pwabuilder.com**, paste your app's link, and choose **Package for stores → Android**. It builds a Play-ready file from your live site.
2. Create a Google Play Console account (one-time US$25), create the app, and upload the file.

**Apple App Store**
1. Enroll in the Apple Developer Program (US$99/year) from the **Apple Developer** app on your iPhone.
2. We wrap the app with **Capacitor**, which turns it into a real iOS app, and add native touches like haptics and a splash screen. Apple often rejects apps that are only a website in a frame.
3. Build it on **Codemagic**, which rents cloud Macs; personal accounts get 500 free build minutes a month. Connect your GitHub repo, add an App Store Connect API key (made in the browser), and Codemagic signs the app and sends it to **TestFlight**.
4. Test on your iPhone with the TestFlight app, then submit for review in **App Store Connect**.

I'll prepare the Capacitor project and the Codemagic build file when we reach this stage.
