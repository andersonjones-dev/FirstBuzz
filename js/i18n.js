// Interface text in English and Kannada. Every screen reads from here.
// Quiz questions live in packs.js; quips are chosen by the host as (type, index)
// so each phone shows the quip in its own language.

export const STR = {
  en: {
    tagline: 'Fastest finger wins. Fair to the millisecond.',
    hostGame: 'Host a game', hostSub: 'Run the quiz from this device',
    joinGame: 'Join a game', joinSub: 'Got a room code? Jump in',
    demoBanner: 'Demo mode: no internet sync yet. Open more tabs on this device to join as players. Add Firebase (see README) to play across phones.',
    demoFallback: 'Could not reach the server, so this is running in Demo mode.',
    language: 'Language',
    joinTitle: 'Join a game', enterCode: 'Enter the code on the big screen', join: 'Join',
    badCode: 'No game with that code. Check the big screen and try again.', needCode: 'Type the 6-character code first.',
    roomFull: 'This room is full (30 players).', roomLabel: 'Room {c}',
    nameTitle: 'What should we call you?', namePh: 'Your name', addPhoto: 'Add a photo', changePhoto: 'Change photo',
    imIn: "I'm in!", needName: 'Add a name so the host knows who you are.', nameTaken: 'Someone already has that name. Add an initial?',
    youreIn: "You're in, {n}!", keepOpen: 'Keep this screen open. Your buzzer appears when the host starts.', leave: 'Leave room',
    waitHost: 'Wait for host', getReady: 'Get ready…', go: 'GO!', sent: 'Buzz sent ✓', tooEarly: 'Too early! Locked', locked: 'Still locked',
    youreUp: "You're up — answer!", answerTeam: 'Answer for your team!', inLine: '#{n} in line · +{ms} ms',
    buzzedFirst: '{n} buzzed first', teamAnswers: '{n} answers for your team', outQ: "You're out this question", teamOut: 'Your team is out',
    teammateFirst: 'Teammate got there first', alreadyBuzzed: 'Already buzzed', answer: 'Answer', correctBy: '{n} got it right!',
    nobodyGot: 'Nobody got it', qOf: 'Question {i} of {n}', pts: '{n} pts', place: 'You finished #{n}',
    removed: 'The host removed you from this room.', rejoin: 'Join again', roomEnded: 'This game has ended. Thanks for playing!',
    reconnecting: 'Reconnecting…', yourScore: 'Your score', backHome: 'Back to start',
    setupTitle: 'Set up your quiz', choosePack: 'Choose a quiz pack', freePlay: 'Free play', freePlaySub: 'No deck. You read your own questions.',
    customPack: 'Make your own pack', customHelp: 'One question per line, like:  Who built the ark? | Noah', customName: 'Pack name',
    saveDeck: 'Save pack', deleteDeck: 'Delete', questionsN: '{n} questions', catBible: 'Bible', catGK: 'General knowledge', catCustom: 'Your packs',
    createRoom: 'Create room', mood: 'Event mood', party: 'Party', official: 'Official',
    moodNote: 'Party: Toybox look, funny sounds, quips. Official: Broadcast look, classic sounds, no quips, negative marking.',
    scanToJoin: 'Scan to join', orCode: 'or type the room code', atSite: 'at {u}', copyInvite: 'Copy invite', copied: 'Copied ✓', selected: 'Link selected',
    inviteText: 'Join my quiz on Firstbuzz! Scan the QR, or open {u} and enter code {c}. Direct link: {l}',
    playersInRoom: 'Players in the room', addBots: '+5 demo players', startGame: 'Start game', waitingPlayers: 'Waiting for players to join…',
    kickHint: 'Tap × to remove someone. Players who drop out can rejoin with the same code and keep their score.',
    screenView: 'Open big-screen view', screenHint: 'Open this link on a laptop or smart TV connected to the projector:',
    roundN: 'Round {n}', readQ: 'Read the question, then open the buzzers', buzz: 'BUZZ!', buzzersLive: 'Buzzers are live',
    reopened: 'Buzzers reopened for everyone else', judging: 'Checking press times…', buzzedIn: 'buzzed in {ms}', nextInLine: 'next in line',
    waiting: '{n} waiting +{ms}', answering: 'Answering', timeUp: "Time's up! Mark it right or wrong.", fastest: 'Fastest finger', latencyFixed: 'Latency-corrected',
    openBuzzers: 'Open buzzers', correct: 'Correct +{p}', wrong: 'Wrong', skip: 'Skip question', reveal: 'Show answer on screen', hideAnswer: 'Hide answer',
    nextQ: 'Next question', finish: 'Finish game', confirmFinish: 'Tap again to end the game', seeResults: 'Show final results', cancel: 'Cancel', peek: 'Peek at answer', answerIs: 'Answer: {a}', endOfDeck: 'That was the last question in this pack.',
    queue: 'Buzz queue', scores: 'Scoreboard', teamScores: 'Team scores', players: 'Players', log: 'Referee log', settings: 'Settings', done: 'Done',
    endGame: 'End game and close room', confirmEnd: 'Tap again to close the room for everyone', online: 'online', offline: 'offline',
    theme: 'Theme', fun: 'Fun', officialG: 'Official', sounds: 'Sounds', sGame: 'Game show', sFunny: 'Funny', sOff: 'Off',
    answerTime: 'Answer time', playAs: 'Play as', individuals: 'Individuals', teamsN: '{n} teams', teamNote: 'In team mode the first teammate to buzz answers for the team.',
    quipsT: 'Funny quips on screen', countT: '3-2-1 countdown', earlyT: 'Lock out early buzzers', negT: 'Negative marking (−5)',
    showQScreen: 'Show question on big screen', showQPhones: 'Show question on phones', soundHere: 'Play sounds on this device', points: 'Points per question',
    finalResults: 'Final results', playAgain: 'Play again', backToLobby: 'Back to lobby', emptyQueue: 'Open the buzzers to start a round.', waitBuzz: 'Waiting for the first buzz…',
    startScreen: 'Tap to start the big screen', noRoom: 'No game with that code.', pack: 'Pack', none: 'None', demoPlayer: 'demo',
    correctLog: '{n} correct +{p}', wrongLog: '{n} wrong', passedLog: 'Passed to {n}', earlyLog: '{n} jumped the gun', openLog: 'Round {r}: buzzers open',
    winLog: 'Round {r}: {n} in {ms}', aheadLog: '{ms} ahead of {n}', fixLog: 'Latency-corrected: {a}’s signal landed first, {b} pressed first', timeoutLog: '{n} ran out of time', nobodyLog: 'Nobody got it',
    hostLeft: 'Waiting for the host…', more: '+{n} more'
  },
  kn: {
    tagline: 'ಮೊದಲು ಒತ್ತಿದವರೇ ಗೆಲ್ಲುವರು. ಮಿಲಿಸೆಕೆಂಡಿನವರೆಗೂ ನ್ಯಾಯ.',
    hostGame: 'ಆಟ ಆಯೋಜಿಸಿ', hostSub: 'ಈ ಸಾಧನದಿಂದ ರಸಪ್ರಶ್ನೆ ನಡೆಸಿ',
    joinGame: 'ಆಟಕ್ಕೆ ಸೇರಿ', joinSub: 'ರೂಮ್ ಕೋಡ್ ಇದೆಯೇ? ಸೇರಿಕೊಳ್ಳಿ',
    demoBanner: 'ಡೆಮೊ ಮೋಡ್: ಇಂಟರ್ನೆಟ್ ಸಿಂಕ್ ಇನ್ನೂ ಇಲ್ಲ. ಆಟಗಾರರಾಗಿ ಸೇರಲು ಇದೇ ಸಾಧನದಲ್ಲಿ ಇನ್ನಷ್ಟು ಟ್ಯಾಬ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ. ಫೋನ್‌ಗಳ ನಡುವೆ ಆಡಲು Firebase ಸೇರಿಸಿ.',
    demoFallback: 'ಸರ್ವರ್ ತಲುಪಲಾಗಲಿಲ್ಲ, ಆದ್ದರಿಂದ ಡೆಮೊ ಮೋಡ್‌ನಲ್ಲಿ ನಡೆಯುತ್ತಿದೆ.',
    language: 'ಭಾಷೆ',
    joinTitle: 'ಆಟಕ್ಕೆ ಸೇರಿ', enterCode: 'ದೊಡ್ಡ ಪರದೆಯ ಮೇಲಿನ ಕೋಡ್ ನಮೂದಿಸಿ', join: 'ಸೇರಿ',
    badCode: 'ಆ ಕೋಡ್‌ನ ಆಟ ಇಲ್ಲ. ದೊಡ್ಡ ಪರದೆಯನ್ನು ನೋಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', needCode: 'ಮೊದಲು 6 ಅಕ್ಷರಗಳ ಕೋಡ್ ಟೈಪ್ ಮಾಡಿ.',
    roomFull: 'ಈ ರೂಮ್ ತುಂಬಿದೆ (30 ಆಟಗಾರರು).', roomLabel: 'ರೂಮ್ {c}',
    nameTitle: 'ನಿಮ್ಮನ್ನು ಏನೆಂದು ಕರೆಯೋಣ?', namePh: 'ನಿಮ್ಮ ಹೆಸರು', addPhoto: 'ಫೋಟೋ ಸೇರಿಸಿ', changePhoto: 'ಫೋಟೋ ಬದಲಿಸಿ',
    imIn: 'ನಾನು ಸಿದ್ಧ!', needName: 'ಆಯೋಜಕರಿಗೆ ನೀವು ಯಾರೆಂದು ತಿಳಿಯಲು ಹೆಸರು ಸೇರಿಸಿ.', nameTaken: 'ಆ ಹೆಸರು ಈಗಾಗಲೇ ಇದೆ. ಒಂದು ಇನಿಶಿಯಲ್ ಸೇರಿಸಿ?',
    youreIn: 'ನೀವು ಸೇರಿದ್ದೀರಿ, {n}!', keepOpen: 'ಈ ಪರದೆಯನ್ನು ತೆರೆದಿಡಿ. ಆಯೋಜಕರು ಆರಂಭಿಸಿದಾಗ ನಿಮ್ಮ ಬಜರ್ ಕಾಣಿಸುತ್ತದೆ.', leave: 'ರೂಮ್ ಬಿಡಿ',
    waitHost: 'ಆಯೋಜಕರಿಗಾಗಿ ಕಾಯಿರಿ', getReady: 'ತಯಾರಾಗಿ…', go: 'ಒತ್ತಿ!', sent: 'ಕಳುಹಿಸಲಾಗಿದೆ ✓', tooEarly: 'ಬೇಗ ಆಯಿತು! ಲಾಕ್', locked: 'ಇನ್ನೂ ಲಾಕ್ ಆಗಿದೆ',
    youreUp: 'ನಿಮ್ಮ ಸರದಿ — ಉತ್ತರಿಸಿ!', answerTeam: 'ನಿಮ್ಮ ತಂಡಕ್ಕಾಗಿ ಉತ್ತರಿಸಿ!', inLine: 'ಸಾಲಿನಲ್ಲಿ #{n} · +{ms} ms',
    buzzedFirst: '{n} ಮೊದಲು ಒತ್ತಿದರು', teamAnswers: '{n} ನಿಮ್ಮ ತಂಡಕ್ಕಾಗಿ ಉತ್ತರಿಸುತ್ತಾರೆ', outQ: 'ಈ ಪ್ರಶ್ನೆಗೆ ನೀವು ಹೊರಗೆ', teamOut: 'ನಿಮ್ಮ ತಂಡ ಹೊರಗೆ',
    teammateFirst: 'ತಂಡದ ಸಹ ಆಟಗಾರ ಮೊದಲು ಒತ್ತಿದರು', alreadyBuzzed: 'ಈಗಾಗಲೇ ಒತ್ತಿದ್ದೀರಿ', answer: 'ಉತ್ತರ', correctBy: '{n} ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿದರು!',
    nobodyGot: 'ಯಾರಿಗೂ ಉತ್ತರ ಸಿಗಲಿಲ್ಲ', qOf: 'ಪ್ರಶ್ನೆ {i} / {n}', pts: '{n} ಅಂಕ', place: 'ನೀವು #{n} ಸ್ಥಾನ ಪಡೆದಿರಿ',
    removed: 'ಆಯೋಜಕರು ನಿಮ್ಮನ್ನು ಈ ರೂಮಿನಿಂದ ತೆಗೆದಿದ್ದಾರೆ.', rejoin: 'ಮತ್ತೆ ಸೇರಿ', roomEnded: 'ಈ ಆಟ ಮುಗಿದಿದೆ. ಆಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು!',
    reconnecting: 'ಮರುಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ…', yourScore: 'ನಿಮ್ಮ ಅಂಕ', backHome: 'ಆರಂಭಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    setupTitle: 'ನಿಮ್ಮ ರಸಪ್ರಶ್ನೆ ಸಿದ್ಧಪಡಿಸಿ', choosePack: 'ಪ್ರಶ್ನೆ ಪ್ಯಾಕ್ ಆರಿಸಿ', freePlay: 'ಉಚಿತ ಆಟ', freePlaySub: 'ಪ್ಯಾಕ್ ಇಲ್ಲ. ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ನೀವೇ ಓದಿ.',
    customPack: 'ನಿಮ್ಮದೇ ಪ್ಯಾಕ್ ಮಾಡಿ', customHelp: 'ಪ್ರತಿ ಸಾಲಿಗೆ ಒಂದು ಪ್ರಶ್ನೆ, ಉದಾ:  ನಾವೆಯನ್ನು ಕಟ್ಟಿದವರು ಯಾರು? | ನೋಹ', customName: 'ಪ್ಯಾಕ್ ಹೆಸರು',
    saveDeck: 'ಪ್ಯಾಕ್ ಉಳಿಸಿ', deleteDeck: 'ಅಳಿಸಿ', questionsN: '{n} ಪ್ರಶ್ನೆಗಳು', catBible: 'ಬೈಬಲ್', catGK: 'ಸಾಮಾನ್ಯ ಜ್ಞಾನ', catCustom: 'ನಿಮ್ಮ ಪ್ಯಾಕ್‌ಗಳು',
    createRoom: 'ರೂಮ್ ರಚಿಸಿ', mood: 'ಕಾರ್ಯಕ್ರಮದ ಶೈಲಿ', party: 'ಪಾರ್ಟಿ', official: 'ಅಧಿಕೃತ',
    moodNote: 'ಪಾರ್ಟಿ: ಟಾಯ್‌ಬಾಕ್ಸ್ ನೋಟ, ತಮಾಷೆ ಶಬ್ದಗಳು, ಹಾಸ್ಯ ಸಾಲುಗಳು. ಅಧಿಕೃತ: ಬ್ರಾಡ್‌ಕಾಸ್ಟ್ ನೋಟ, ಕ್ಲಾಸಿಕ್ ಶಬ್ದಗಳು, ಹಾಸ್ಯ ಇಲ್ಲ, ಋಣಾತ್ಮಕ ಅಂಕ.',
    scanToJoin: 'ಸೇರಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', orCode: 'ಅಥವಾ ರೂಮ್ ಕೋಡ್ ಟೈಪ್ ಮಾಡಿ', atSite: '{u} ನಲ್ಲಿ', copyInvite: 'ಆಹ್ವಾನ ನಕಲಿಸಿ', copied: 'ನಕಲಿಸಲಾಗಿದೆ ✓', selected: 'ಲಿಂಕ್ ಆಯ್ಕೆಯಾಗಿದೆ',
    inviteText: 'Firstbuzz ನಲ್ಲಿ ನನ್ನ ರಸಪ್ರಶ್ನೆಗೆ ಸೇರಿ! QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ಅಥವಾ {u} ತೆರೆದು ಕೋಡ್ {c} ನಮೂದಿಸಿ. ನೇರ ಲಿಂಕ್: {l}',
    playersInRoom: 'ರೂಮಿನಲ್ಲಿರುವ ಆಟಗಾರರು', addBots: '+5 ಡೆಮೊ ಆಟಗಾರರು', startGame: 'ಆಟ ಆರಂಭಿಸಿ', waitingPlayers: 'ಆಟಗಾರರು ಸೇರಲು ಕಾಯಲಾಗುತ್ತಿದೆ…',
    kickHint: 'ಯಾರನ್ನಾದರೂ ತೆಗೆಯಲು × ಒತ್ತಿ. ಸಂಪರ್ಕ ಕಳೆದುಕೊಂಡವರು ಅದೇ ಕೋಡ್‌ನಿಂದ ಮತ್ತೆ ಸೇರಬಹುದು, ಅಂಕಗಳು ಉಳಿಯುತ್ತವೆ.',
    screenView: 'ದೊಡ್ಡ ಪರದೆ ವೀಕ್ಷಣೆ ತೆರೆಯಿರಿ', screenHint: 'ಪ್ರೊಜೆಕ್ಟರ್‌ಗೆ ಸಂಪರ್ಕಿಸಿದ ಲ್ಯಾಪ್‌ಟಾಪ್ ಅಥವಾ ಸ್ಮಾರ್ಟ್ ಟಿವಿಯಲ್ಲಿ ಈ ಲಿಂಕ್ ತೆರೆಯಿರಿ:',
    roundN: 'ಸುತ್ತು {n}', readQ: 'ಪ್ರಶ್ನೆ ಓದಿ, ನಂತರ ಬಜರ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ', buzz: 'ಒತ್ತಿ!', buzzersLive: 'ಬಜರ್‌ಗಳು ಸಕ್ರಿಯವಾಗಿವೆ',
    reopened: 'ಉಳಿದವರಿಗಾಗಿ ಬಜರ್‌ಗಳು ಮತ್ತೆ ತೆರೆದಿವೆ', judging: 'ಒತ್ತಿದ ಸಮಯ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…', buzzedIn: '{ms} ನಲ್ಲಿ ಒತ್ತಿದರು', nextInLine: 'ಮುಂದಿನ ಸರದಿ',
    waiting: '{n} ಕಾಯುತ್ತಿದ್ದಾರೆ +{ms}', answering: 'ಉತ್ತರಿಸುತ್ತಿದ್ದಾರೆ', timeUp: 'ಸಮಯ ಮುಗಿಯಿತು! ಸರಿ ಅಥವಾ ತಪ್ಪು ಎಂದು ಗುರುತಿಸಿ.', fastest: 'ಅತಿ ವೇಗದ ಬೆರಳು', latencyFixed: 'ವಿಳಂಬ ಸರಿಪಡಿಸಲಾಗಿದೆ',
    openBuzzers: 'ಬಜರ್ ತೆರೆಯಿರಿ', correct: 'ಸರಿ +{p}', wrong: 'ತಪ್ಪು', skip: 'ಪ್ರಶ್ನೆ ಬಿಡಿ', reveal: 'ಉತ್ತರ ಪರದೆಯಲ್ಲಿ ತೋರಿಸಿ', hideAnswer: 'ಉತ್ತರ ಮರೆಮಾಡಿ',
    nextQ: 'ಮುಂದಿನ ಪ್ರಶ್ನೆ', finish: 'ಆಟ ಮುಗಿಸಿ', confirmFinish: 'ಆಟ ಮುಗಿಸಲು ಮತ್ತೆ ಒತ್ತಿ', seeResults: 'ಅಂತಿಮ ಫಲಿತಾಂಶ ತೋರಿಸಿ', cancel: 'ರದ್ದುಮಾಡಿ', peek: 'ಉತ್ತರ ನೋಡಿ', answerIs: 'ಉತ್ತರ: {a}', endOfDeck: 'ಈ ಪ್ಯಾಕ್‌ನ ಕೊನೆಯ ಪ್ರಶ್ನೆ ಇದಾಗಿತ್ತು.',
    queue: 'ಬಜರ್ ಸರದಿ', scores: 'ಅಂಕಪಟ್ಟಿ', teamScores: 'ತಂಡಗಳ ಅಂಕ', players: 'ಆಟಗಾರರು', log: 'ತೀರ್ಪುಗಾರರ ದಾಖಲೆ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', done: 'ಆಯಿತು',
    endGame: 'ಆಟ ಮುಗಿಸಿ ರೂಮ್ ಮುಚ್ಚಿ', confirmEnd: 'ಎಲ್ಲರಿಗೂ ರೂಮ್ ಮುಚ್ಚಲು ಮತ್ತೊಮ್ಮೆ ಒತ್ತಿ', online: 'ಆನ್‌ಲೈನ್', offline: 'ಆಫ್‌ಲೈನ್',
    theme: 'ಥೀಮ್', fun: 'ತಮಾಷೆ', officialG: 'ಅಧಿಕೃತ', sounds: 'ಶಬ್ದಗಳು', sGame: 'ಗೇಮ್ ಶೋ', sFunny: 'ತಮಾಷೆ', sOff: 'ಆಫ್',
    answerTime: 'ಉತ್ತರಿಸುವ ಸಮಯ', playAs: 'ಹೇಗೆ ಆಡುವುದು', individuals: 'ವೈಯಕ್ತಿಕ', teamsN: '{n} ತಂಡಗಳು', teamNote: 'ತಂಡ ಮೋಡ್‌ನಲ್ಲಿ ಮೊದಲು ಒತ್ತಿದ ಸದಸ್ಯ ತಂಡಕ್ಕಾಗಿ ಉತ್ತರಿಸುತ್ತಾರೆ.',
    quipsT: 'ಪರದೆಯ ಮೇಲೆ ಹಾಸ್ಯ ಸಾಲುಗಳು', countT: '3-2-1 ಎಣಿಕೆ', earlyT: 'ಬೇಗ ಒತ್ತಿದವರನ್ನು ಲಾಕ್ ಮಾಡಿ', negT: 'ಋಣಾತ್ಮಕ ಅಂಕ (−5)',
    showQScreen: 'ದೊಡ್ಡ ಪರದೆಯಲ್ಲಿ ಪ್ರಶ್ನೆ ತೋರಿಸಿ', showQPhones: 'ಫೋನ್‌ಗಳಲ್ಲಿ ಪ್ರಶ್ನೆ ತೋರಿಸಿ', soundHere: 'ಈ ಸಾಧನದಲ್ಲಿ ಶಬ್ದ ಹಾಕಿ', points: 'ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಅಂಕ',
    finalResults: 'ಅಂತಿಮ ಫಲಿತಾಂಶ', playAgain: 'ಮತ್ತೆ ಆಡಿ', backToLobby: 'ಲಾಬಿಗೆ ಹಿಂತಿರುಗಿ', emptyQueue: 'ಸುತ್ತು ಆರಂಭಿಸಲು ಬಜರ್ ತೆರೆಯಿರಿ.', waitBuzz: 'ಮೊದಲ ಬಜರ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ…',
    startScreen: 'ದೊಡ್ಡ ಪರದೆ ಆರಂಭಿಸಲು ಒತ್ತಿ', noRoom: 'ಆ ಕೋಡ್‌ನ ಆಟ ಇಲ್ಲ.', pack: 'ಪ್ಯಾಕ್', none: 'ಯಾವುದೂ ಇಲ್ಲ', demoPlayer: 'ಡೆಮೊ',
    correctLog: '{n} ಸರಿ +{p}', wrongLog: '{n} ತಪ್ಪು', passedLog: '{n} ಅವರಿಗೆ ವರ್ಗಾಯಿಸಲಾಗಿದೆ', earlyLog: '{n} ಬೇಗ ಒತ್ತಿದರು', openLog: 'ಸುತ್ತು {r}: ಬಜರ್ ತೆರೆಯಲಾಗಿದೆ',
    winLog: 'ಸುತ್ತು {r}: {n} {ms} ನಲ್ಲಿ', aheadLog: '{n} ಗಿಂತ {ms} ಮುಂದೆ', fixLog: 'ವಿಳಂಬ ಸರಿಪಡಿಸಲಾಗಿದೆ: {a} ಅವರ ಸಂಕೇತ ಮೊದಲು ತಲುಪಿತು, ಆದರೆ {b} ಮೊದಲು ಒತ್ತಿದರು', timeoutLog: '{n} ಅವರ ಸಮಯ ಮುಗಿಯಿತು', nobodyLog: 'ಯಾರಿಗೂ ಉತ್ತರ ಸಿಗಲಿಲ್ಲ',
    hostLeft: 'ಆಯೋಜಕರಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ…', more: '+{n} ಇನ್ನಷ್ಟು'
  }
};

export const TEAM_NAMES = {
  en: ['Red Rockets', 'Blue Whales', 'Gold Lions', 'Green Geckos'],
  kn: ['ಕೆಂಪು ರಾಕೆಟ್‌ಗಳು', 'ನೀಲಿ ತಿಮಿಂಗಿಲಗಳು', 'ಚಿನ್ನದ ಸಿಂಹಗಳು', 'ಹಸಿರು ಹಲ್ಲಿಗಳು']
};

export const QUIPS = {
  en: {
    open: ['Fingers on buzzers…', "Somebody's going to be fast. Is it you?", 'Deep breaths. Now panic.', 'Steady… steady…'],
    buzz: ['{n}! Faster than a WhatsApp forward.', 'Lightning fingers, {n}!', '{n} has clearly had their chai.', 'Blink and you missed {n}.', 'That button never stood a chance, {n}.', '{n} came in hot!'],
    photo: ['Photo finish! Just {d} in it.', '{d}! Closer than a family photo.', 'Won by a whisker: {d}.', 'The judges say {d}. Brutal.'],
    wrong: ['Bold. Wrong, but bold.', 'The confidence was there.', "Let's pretend that didn't happen.", 'Swing and a miss!', 'Ooh, so close. Not really.', 'Wrong, but we love the energy.'],
    correct: ['Big brain energy!', 'Nailed it, {n}!', 'Somebody studied!', 'Give {n} a samosa.', 'Genius level unlocked.', '{n} is on a roll!'],
    early: ['Easy, {n}! Patience is a virtue.', "{n}, the button isn't even on yet!", 'Jumped the gun, {n}.', 'Hold your horses, {n}.'],
    timeout: ['Tick tock… and it stopped.', 'The silence is deafening.', "Time's up! Thinking face won."],
    nobody: ['Tough crowd.', 'Even the quizmaster is sweating.', 'Nobody? Really? Nobody?'],
    pass: ["Over to you, {n}! No pressure.", "{n}, it's your moment.", 'Second chances, {n}!'],
    champ: ['All hail {n}!', '{n} takes the crown!', '{n}: quiz legend.']
  },
  kn: {
    open: ['ಬೆರಳುಗಳು ಬಟನ್ ಮೇಲೆ…', 'ಯಾರೋ ಒಬ್ಬರು ವೇಗವಾಗಿರುತ್ತಾರೆ. ನೀವೇನಾ?', 'ತಯಾರಾಗಿ… ತಯಾರಾಗಿ…'],
    buzz: ['{n}! ವಾಟ್ಸಾಪ್ ಫಾರ್ವರ್ಡ್‌ಗಿಂತ ವೇಗ!', 'ಮಿಂಚಿನ ಬೆರಳು, {n}!', '{n} ಈಗಷ್ಟೇ ಟೀ ಕುಡಿದು ಬಂದಂತಿದೆ!', 'ಕಣ್ಣು ಮಿಟುಕಿಸುವಷ್ಟರಲ್ಲಿ {n}!', '{n} ಬೆಂಕಿ ಹಚ್ಚಿದರು!'],
    photo: ['ಫೋಟೋ ಫಿನಿಶ್! ಕೇವಲ {d} ಅಂತರ.', '{d}! ಕೂದಲೆಳೆಯ ಅಂತರದ ಗೆಲುವು.'],
    wrong: ['ಧೈರ್ಯ ಇತ್ತು, ಉತ್ತರ ಇರಲಿಲ್ಲ!', 'ಅಯ್ಯೋ, ಸ್ವಲ್ಪದರಲ್ಲಿ ತಪ್ಪಿತು. ನಿಜವಾಗಿ ಅಲ್ಲ!', 'ಏನೂ ಆಗಿಲ್ಲ ಅಂತ ಅಂದುಕೊಳ್ಳೋಣ.', 'ತಪ್ಪು, ಆದರೆ ಉತ್ಸಾಹ ಸೂಪರ್!'],
    correct: ['ದೊಡ್ಡ ಮೆದುಳು!', 'ಸರಿಯಾಗಿ ಹೊಡೆದಿರಿ, {n}!', 'ಯಾರೋ ಚೆನ್ನಾಗಿ ಓದಿದ್ದಾರೆ!', '{n} ಅವರಿಗೆ ಒಂದು ಸಮೋಸ ಕೊಡಿ!', 'ಜೀನಿಯಸ್ ಮಟ್ಟ!'],
    early: ['ಸ್ವಲ್ಪ ತಾಳ್ಮೆ, {n}!', '{n}, ಬಟನ್ ಇನ್ನೂ ಆನ್ ಆಗಿಲ್ಲ!', 'ಬೇಗ ಓಡಿದಿರಿ, {n}!'],
    timeout: ['ಟಿಕ್ ಟಾಕ್… ಸಮಯ ಮುಗಿಯಿತು!', 'ಮೌನವೇ ಉತ್ತರ!'],
    nobody: ['ಕಠಿಣ ಪ್ರೇಕ್ಷಕರು!', 'ರಸಪ್ರಶ್ನೆ ಮಾಸ್ಟರ್ ಕೂಡ ಬೆವರುತ್ತಿದ್ದಾರೆ.', 'ಯಾರೂ ಇಲ್ಲವೇ? ನಿಜವಾಗಿಯೂ?'],
    pass: ['ಈಗ ನಿಮ್ಮ ಸರದಿ, {n}!', '{n}, ಇದು ನಿಮ್ಮ ಕ್ಷಣ!', 'ಎರಡನೇ ಅವಕಾಶ, {n}!'],
    champ: ['{n} ಅವರಿಗೆ ಜಯವಾಗಲಿ!', '{n} ಕಿರೀಟ ಗೆದ್ದರು!', '{n}: ರಸಪ್ರಶ್ನೆ ದಂತಕಥೆ!']
  }
};

let lang = 'en';
try { const l = localStorage.getItem('fb.lang'); if (l && STR[l]) lang = l; } catch (e) {}

export const getLang = () => lang;
export function setLang(l) { if (STR[l]) { lang = l; try { localStorage.setItem('fb.lang', l); } catch (e) {} document.documentElement.lang = l; } }
export function t(key, vars = {}) {
  let s = STR[lang][key] ?? STR.en[key] ?? key;
  for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
export function quipText(type, idx, vars = {}) {
  const list = QUIPS[lang][type] || QUIPS.en[type] || [''];
  let s = list[idx % list.length];
  for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
export const teamName = i => TEAM_NAMES[lang][i] || TEAM_NAMES.en[i];
document.documentElement.lang = lang;
