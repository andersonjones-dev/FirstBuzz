// Ready-made quiz packs. Each question: q (question), a (answer), ref (optional
// Bible reference shown with the answer). Add new packs by copying a block.
// Bible references follow the King James Version.

export const PACKS = [
  {
    id: 'bible-basics', cat: 'bible', lang: 'en', level: 'Easy', title: 'Bible Basics', blurb: 'Great first round for all ages.',
    questions: [
      { q: 'How many books are in the Protestant Bible?', a: '66' },
      { q: 'What is the first book of the Bible?', a: 'Genesis' },
      { q: 'What is the last book of the Bible?', a: 'Revelation' },
      { q: 'Who built the ark?', a: 'Noah', ref: 'Genesis 6' },
      { q: 'On which day did God rest after creation?', a: 'The seventh day', ref: 'Genesis 2:2' },
      { q: 'Who was swallowed by a great fish?', a: 'Jonah', ref: 'Jonah 1:17' },
      { q: 'In which town was Jesus born?', a: 'Bethlehem', ref: 'Matthew 2:1' },
      { q: 'Who killed Goliath?', a: 'David', ref: '1 Samuel 17' },
      { q: 'Who led the Israelites out of Egypt?', a: 'Moses', ref: 'Exodus 12–14' },
      { q: "What was the name of Adam's wife?", a: 'Eve', ref: 'Genesis 3:20' },
      { q: 'How many disciples did Jesus choose?', a: 'Twelve', ref: 'Luke 6:13' },
      { q: 'Which disciple betrayed Jesus?', a: 'Judas Iscariot', ref: 'Matthew 26:14–16' },
      { q: 'What is the shortest verse in the King James Bible?', a: '"Jesus wept."', ref: 'John 11:35' },
      { q: "Who was thrown into the lions' den?", a: 'Daniel', ref: 'Daniel 6' },
      { q: 'What did God create on the first day?', a: 'Light', ref: 'Genesis 1:3' },
      { q: 'How many commandments did God give Moses?', a: 'Ten', ref: 'Exodus 34:28' },
      { q: 'Who was the mother of Jesus?', a: 'Mary', ref: 'Luke 1:30–31' },
      { q: 'Which disciple denied Jesus three times?', a: 'Peter', ref: 'Luke 22:61' },
      { q: 'Which book of the Bible has the most chapters?', a: 'Psalms (150)' },
      { q: 'What sign did God give Noah that He would never flood the earth again?', a: 'A rainbow', ref: 'Genesis 9:13' }
    ]
  },
  {
    id: 'ot-heroes', cat: 'bible', lang: 'en', level: 'Medium', title: 'Old Testament Heroes', blurb: 'Kings, judges, prophets and brave women.',
    questions: [
      { q: 'Who was the first king of Israel?', a: 'Saul', ref: '1 Samuel 10' },
      { q: 'Which judge had great strength tied to his uncut hair?', a: 'Samson', ref: 'Judges 16:17' },
      { q: 'Who was sold into slavery by his brothers?', a: 'Joseph', ref: 'Genesis 37:28' },
      { q: 'Who said, "Whither thou goest, I will go"?', a: 'Ruth', ref: 'Ruth 1:16' },
      { q: 'Which Jewish woman became queen of Persia and saved her people?', a: 'Esther', ref: 'Esther 2:17' },
      { q: 'Which prophet was taken up to heaven in a whirlwind?', a: 'Elijah', ref: '2 Kings 2:11' },
      { q: 'Which son was born to Abraham when Abraham was 100 years old?', a: 'Isaac', ref: 'Genesis 21:5' },
      { q: 'Who led Israel after Moses died?', a: 'Joshua', ref: 'Joshua 1:1–2' },
      { q: 'The walls of which city fell after Israel marched around it for seven days?', a: 'Jericho', ref: 'Joshua 6' },
      { q: 'Which king asked God for wisdom instead of riches?', a: 'Solomon', ref: '1 Kings 3:9' },
      { q: 'Who wrestled through the night and was renamed Israel?', a: 'Jacob', ref: 'Genesis 32:28' },
      { q: 'Which boy heard God calling his name in the night?', a: 'Samuel', ref: '1 Samuel 3' },
      { q: "Name Daniel's three friends thrown into the fiery furnace.", a: 'Shadrach, Meshach and Abednego', ref: 'Daniel 3' },
      { q: 'Who defeated the Midianites with only 300 men?', a: 'Gideon', ref: 'Judges 7' },
      { q: 'Who is the oldest man recorded in the Bible?', a: 'Methuselah (969 years)', ref: 'Genesis 5:27' },
      { q: 'Which prophet saw a vision of a valley of dry bones?', a: 'Ezekiel', ref: 'Ezekiel 37' },
      { q: 'Which woman judged Israel and went to battle with Barak?', a: 'Deborah', ref: 'Judges 4' },
      { q: "What was the name of Abraham's wife?", a: 'Sarah (first called Sarai)', ref: 'Genesis 17:15' },
      { q: "Who was Moses' brother and Israel's first high priest?", a: 'Aaron', ref: 'Exodus 28:1' },
      { q: 'What did Esau sell to Jacob for a bowl of stew?', a: 'His birthright', ref: 'Genesis 25:33' }
    ]
  },
  {
    id: 'gospels', cat: 'bible', lang: 'en', level: 'Medium', title: 'Life of Jesus', blurb: 'Miracles, parables and the road to the cross.',
    questions: [
      { q: 'Where did Jesus perform his first miracle?', a: 'At a wedding in Cana', ref: 'John 2:1–11' },
      { q: 'At the wedding in Cana, what did Jesus turn water into?', a: 'Wine', ref: 'John 2:9' },
      { q: 'Who baptised Jesus?', a: 'John the Baptist', ref: 'Matthew 3:13' },
      { q: 'In which river was Jesus baptised?', a: 'The Jordan', ref: 'Mark 1:9' },
      { q: 'How many loaves and fish fed the five thousand?', a: 'Five loaves and two fish', ref: 'Matthew 14:17' },
      { q: 'Which tax collector climbed a tree to see Jesus?', a: 'Zacchaeus', ref: 'Luke 19:4' },
      { q: 'Whom did Jesus raise from the dead after four days in the tomb?', a: 'Lazarus', ref: 'John 11' },
      { q: "What is Jesus' teaching in Matthew chapters 5 to 7 commonly called?", a: 'The Sermon on the Mount' },
      { q: 'In which garden did Jesus pray before his arrest?', a: 'Gethsemane', ref: 'Matthew 26:36' },
      { q: 'For how many pieces of silver did Judas betray Jesus?', a: 'Thirty', ref: 'Matthew 26:15' },
      { q: 'Who was the Roman governor at the trial of Jesus?', a: 'Pontius Pilate', ref: 'Matthew 27:2' },
      { q: 'Who was made to carry the cross of Jesus?', a: 'Simon of Cyrene', ref: 'Luke 23:26' },
      { q: 'Which Gospel writer was a physician?', a: 'Luke', ref: 'Colossians 4:14' },
      { q: "According to Mark's Gospel, who saw the risen Jesus first?", a: 'Mary Magdalene', ref: 'Mark 16:9' },
      { q: 'In the parable, who stopped to help the wounded man on the road to Jericho?', a: 'A Samaritan (the Good Samaritan)', ref: 'Luke 10:33' },
      { q: 'What did Jesus walk on during a storm?', a: 'Water (the Sea of Galilee)', ref: 'Matthew 14:25' },
      { q: "Which disciple wanted to see the nail marks before he would believe?", a: 'Thomas', ref: 'John 20:25' },
      { q: 'What prayer did Jesus teach his disciples?', a: "The Lord's Prayer (Our Father)", ref: 'Matthew 6:9–13' },
      { q: 'What is the name of the place where Jesus was crucified?', a: 'Golgotha (Calvary)', ref: 'John 19:17' },
      { q: 'On which day did Jesus rise from the dead?', a: 'The third day (the first day of the week)', ref: 'Luke 24:1–7' }
    ]
  },
  {
    id: 'early-church', cat: 'bible', lang: 'en', level: 'Hard', title: 'Acts and the Early Church', blurb: 'Pentecost, Paul and the letters.',
    questions: [
      { q: 'Who wrote the book of Acts?', a: 'Luke' },
      { q: 'What came upon the disciples on the day of Pentecost?', a: 'The Holy Spirit (like tongues of fire)', ref: 'Acts 2:3–4' },
      { q: 'Who was the first Christian martyr?', a: 'Stephen', ref: 'Acts 7' },
      { q: "What was Paul's name before his conversion?", a: 'Saul', ref: 'Acts 13:9' },
      { q: 'On the road to which city was Saul converted?', a: 'Damascus', ref: 'Acts 9:3' },
      { q: 'Which couple lied about the price of their land?', a: 'Ananias and Sapphira', ref: 'Acts 5' },
      { q: 'Who preached at Pentecost when about 3,000 people believed?', a: 'Peter', ref: 'Acts 2:41' },
      { q: 'Who explained Isaiah to the Ethiopian official and baptised him?', a: 'Philip', ref: 'Acts 8:35–38' },
      { q: 'Where were the disciples first called Christians?', a: 'Antioch', ref: 'Acts 11:26' },
      { q: 'Which two prisoners sang hymns at midnight before an earthquake?', a: 'Paul and Silas', ref: 'Acts 16:25' },
      { q: "Which young man fell asleep and fell from a window during Paul's preaching?", a: 'Eutychus', ref: 'Acts 20:9' },
      { q: "Who travelled with Paul on his first missionary journey?", a: 'Barnabas', ref: 'Acts 13:2' },
      { q: 'On which island was Paul shipwrecked?', a: 'Malta (Melita)', ref: 'Acts 28:1' },
      { q: 'Which Roman centurion sent for Peter and received the Holy Spirit?', a: 'Cornelius', ref: 'Acts 10' },
      { q: 'Which letter says, "I can do all things through Christ which strengtheneth me"?', a: 'Philippians', ref: 'Philippians 4:13' },
      { q: 'How many New Testament letters are traditionally credited to Paul?', a: '13 (14 if Hebrews is counted)' },
      { q: 'Which seller of purple cloth believed in Philippi?', a: 'Lydia', ref: 'Acts 16:14' },
      { q: 'Who wrote the book of Revelation?', a: 'John', ref: 'Revelation 1:1' },
      { q: 'On which island did John receive the Revelation?', a: 'Patmos', ref: 'Revelation 1:9' },
      { q: "Which chapter is known as the Bible's love chapter?", a: '1 Corinthians 13' }
    ]
  },
  {
    id: 'bible-basics-kn', cat: 'bible', lang: 'kn', level: 'ಸುಲಭ', title: 'ಬೈಬಲ್ ಮೂಲಗಳು', blurb: 'ಎಲ್ಲ ವಯಸ್ಸಿನವರಿಗೆ ಕನ್ನಡ ಪ್ರಶ್ನೆಗಳು.',
    questions: [
      { q: 'ಪ್ರೊಟೆಸ್ಟೆಂಟ್ ಬೈಬಲ್‌ನಲ್ಲಿ ಎಷ್ಟು ಪುಸ್ತಕಗಳಿವೆ?', a: '66' },
      { q: 'ಬೈಬಲ್‌ನ ಮೊದಲ ಪುಸ್ತಕ ಯಾವುದು?', a: 'ಆದಿಕಾಂಡ' },
      { q: 'ಬೈಬಲ್‌ನ ಕೊನೆಯ ಪುಸ್ತಕ ಯಾವುದು?', a: 'ಪ್ರಕಟನೆ' },
      { q: 'ನಾವೆಯನ್ನು ಕಟ್ಟಿದವರು ಯಾರು?', a: 'ನೋಹ', ref: 'ಆದಿಕಾಂಡ 6' },
      { q: 'ಸೃಷ್ಟಿಯ ನಂತರ ದೇವರು ಯಾವ ದಿನ ವಿಶ್ರಮಿಸಿದನು?', a: 'ಏಳನೆಯ ದಿನ', ref: 'ಆದಿಕಾಂಡ 2:2' },
      { q: 'ದೊಡ್ಡ ಮೀನು ನುಂಗಿದ ಪ್ರವಾದಿ ಯಾರು?', a: 'ಯೋನ', ref: 'ಯೋನ 1:17' },
      { q: 'ಯೇಸು ಯಾವ ಊರಿನಲ್ಲಿ ಹುಟ್ಟಿದನು?', a: 'ಬೇತ್ಲೆಹೇಮ್', ref: 'ಮತ್ತಾಯ 2:1' },
      { q: 'ಗೊಲ್ಯಾತನನ್ನು ಕೊಂದವರು ಯಾರು?', a: 'ದಾವೀದ', ref: '1 ಸಮುವೇಲ 17' },
      { q: 'ಇಸ್ರಾಯೇಲ್ಯರನ್ನು ಐಗುಪ್ತದಿಂದ ಹೊರಗೆ ನಡೆಸಿದವರು ಯಾರು?', a: 'ಮೋಶೆ' },
      { q: 'ಆದಾಮನ ಹೆಂಡತಿಯ ಹೆಸರೇನು?', a: 'ಹವ್ವ', ref: 'ಆದಿಕಾಂಡ 3:20' },
      { q: 'ಯೇಸು ಎಷ್ಟು ಶಿಷ್ಯರನ್ನು ಆರಿಸಿಕೊಂಡನು?', a: 'ಹನ್ನೆರಡು', ref: 'ಲೂಕ 6:13' },
      { q: 'ಯೇಸುವನ್ನು ಹಿಡುಕೊಟ್ಟ ಶಿಷ್ಯನು ಯಾರು?', a: 'ಯೂದ ಇಸ್ಕರಿಯೋತ' },
      { q: 'ಸಿಂಹಗಳ ಗವಿಯಲ್ಲಿ ಹಾಕಲ್ಪಟ್ಟವನು ಯಾರು?', a: 'ದಾನಿಯೇಲ', ref: 'ದಾನಿಯೇಲ 6' },
      { q: 'ಮೊದಲನೆಯ ದಿನ ದೇವರು ಏನನ್ನು ಸೃಷ್ಟಿಸಿದನು?', a: 'ಬೆಳಕು', ref: 'ಆದಿಕಾಂಡ 1:3' },
      { q: 'ದೇವರು ಮೋಶೆಗೆ ಎಷ್ಟು ಆಜ್ಞೆಗಳನ್ನು ಕೊಟ್ಟನು?', a: 'ಹತ್ತು' },
      { q: 'ಯೇಸುವಿನ ತಾಯಿಯ ಹೆಸರೇನು?', a: 'ಮರಿಯ' },
      { q: 'ಯೇಸುವನ್ನು ಮೂರು ಸಾರಿ ಅಲ್ಲಗಳೆದ ಶಿಷ್ಯನು ಯಾರು?', a: 'ಪೇತ್ರ', ref: 'ಲೂಕ 22:61' },
      { q: 'ಯೇಸುವಿನ ಮೊದಲ ಅದ್ಭುತ ಎಲ್ಲಿ ನಡೆಯಿತು?', a: 'ಕಾನಾ ಊರಿನ ಮದುವೆಯಲ್ಲಿ', ref: 'ಯೋಹಾನ 2' },
      { q: 'ಯೇಸುವಿಗೆ ದೀಕ್ಷಾಸ್ನಾನ ಮಾಡಿಸಿದವರು ಯಾರು?', a: 'ಸ್ನಾನಿಕನಾದ ಯೋಹಾನ', ref: 'ಮತ್ತಾಯ 3:13' },
      { q: 'ಇನ್ನು ಮುಂದೆ ಜಲಪ್ರಳಯ ಮಾಡುವುದಿಲ್ಲ ಎಂಬುದಕ್ಕೆ ದೇವರು ನೋಹನಿಗೆ ಕೊಟ್ಟ ಗುರುತು ಯಾವುದು?', a: 'ಮುಗಿಲುಬಿಲ್ಲು (ಕಾಮನಬಿಲ್ಲು)', ref: 'ಆದಿಕಾಂಡ 9:13' }
    ]
  },
  {
    id: 'world-gk', cat: 'gk', lang: 'en', level: 'Easy', title: 'World General Knowledge', blurb: 'Capitals, oceans, famous firsts.',
    questions: [
      { q: 'What is the largest planet in our solar system?', a: 'Jupiter' },
      { q: 'What is the largest ocean on Earth?', a: 'The Pacific Ocean' },
      { q: 'What is the capital of Australia?', a: 'Canberra' },
      { q: 'Which river is usually called the longest in the world?', a: 'The Nile (the Amazon is a close rival)' },
      { q: 'How many continents are there?', a: 'Seven' },
      { q: 'Who painted the Mona Lisa?', a: 'Leonardo da Vinci' },
      { q: 'What is the tallest mountain above sea level?', a: 'Mount Everest' },
      { q: 'What is the currency of Japan?', a: 'The yen' },
      { q: 'Which country has the largest population?', a: 'India (it passed China in 2023)' },
      { q: 'What is the smallest country in the world?', a: 'Vatican City' },
      { q: 'Who wrote Romeo and Juliet?', a: 'William Shakespeare' },
      { q: 'Which country gave the Statue of Liberty to the United States?', a: 'France' },
      { q: 'How many players does a football (soccer) team have on the field?', a: 'Eleven' },
      { q: 'What is the capital of Canada?', a: 'Ottawa' },
      { q: 'What is the largest hot desert in the world?', a: 'The Sahara' },
      { q: 'In which city is the Colosseum?', a: 'Rome' },
      { q: 'How many sides does a hexagon have?', a: 'Six' },
      { q: 'Which planet is known as the Red Planet?', a: 'Mars' },
      { q: 'What is the largest country by area?', a: 'Russia' },
      { q: 'How often are the Summer Olympics usually held?', a: 'Every four years' }
    ]
  },
  {
    id: 'india-gk', cat: 'gk', lang: 'en', level: 'Medium', title: 'India Quiz', blurb: 'History, symbols and records.',
    questions: [
      { q: 'What is the national animal of India?', a: 'The tiger (Bengal tiger)' },
      { q: "Who wrote India's national anthem?", a: 'Rabindranath Tagore' },
      { q: 'In which year did India gain independence?', a: '1947' },
      { q: 'Who was the first Prime Minister of India?', a: 'Jawaharlal Nehru' },
      { q: 'What is the national bird of India?', a: 'The peacock (Indian peafowl)' },
      { q: 'Who is known as the father of the Indian Constitution?', a: 'Dr B. R. Ambedkar' },
      { q: 'Which is the longest river in India?', a: 'The Ganga' },
      { q: 'In which city is the Taj Mahal?', a: 'Agra' },
      { q: 'How many states does India have?', a: '28 (plus 8 union territories)' },
      { q: "What was the name of India's first satellite?", a: 'Aryabhata (1975)' },
      { q: "What is India's highest civilian award?", a: 'Bharat Ratna' },
      { q: "Which Indian mission landed near the Moon's south pole in 2023?", a: 'Chandrayaan-3' },
      { q: 'Who was the first Indian to win a Nobel Prize?', a: 'Rabindranath Tagore (1913)' },
      { q: 'Which is the largest state of India by area?', a: 'Rajasthan' },
      { q: 'Which city is called the Pink City?', a: 'Jaipur' },
      { q: 'What is the national flower of India?', a: 'The lotus' },
      { q: 'Which cricketer is known as the Master Blaster?', a: 'Sachin Tendulkar' },
      { q: 'Which is the smallest state of India by area?', a: 'Goa' },
      { q: 'Who was the first woman Prime Minister of India?', a: 'Indira Gandhi' },
      { q: 'What is the capital of India?', a: 'New Delhi' }
    ]
  },
  {
    id: 'science', cat: 'gk', lang: 'en', level: 'Easy', title: 'Science and Nature', blurb: 'Bodies, planets, animals and atoms.',
    questions: [
      { q: 'What is the chemical symbol for gold?', a: 'Au' },
      { q: 'At what temperature does water boil at sea level, in Celsius?', a: '100 °C' },
      { q: 'Which gas do plants take in from the air to make food?', a: 'Carbon dioxide' },
      { q: 'How many bones are in an adult human body?', a: '206' },
      { q: 'What is the hardest natural substance?', a: 'Diamond' },
      { q: 'What is the fastest land animal?', a: 'The cheetah' },
      { q: 'Which planet is closest to the Sun?', a: 'Mercury' },
      { q: 'Which part of the cell is called its powerhouse?', a: 'The mitochondria' },
      { q: 'What is H₂O better known as?', a: 'Water' },
      { q: 'What is the largest organ of the human body?', a: 'The skin' },
      { q: 'How many legs does a spider have?', a: 'Eight' },
      { q: 'Which blood cells fight infection?', a: 'White blood cells' },
      { q: 'Roughly how fast does light travel?', a: 'About 300,000 km per second' },
      { q: 'Who developed the theory of relativity?', a: 'Albert Einstein' },
      { q: 'What is the largest mammal?', a: 'The blue whale' },
      { q: 'What force keeps us on the ground?', a: 'Gravity' },
      { q: 'Which vitamin does sunlight help our body make?', a: 'Vitamin D' },
      { q: "Which gas makes up most of Earth's atmosphere?", a: 'Nitrogen' },
      { q: 'How many hearts does an octopus have?', a: 'Three' },
      { q: 'What do bees make from nectar?', a: 'Honey' }
    ]
  },
  {
    id: 'karnataka', cat: 'gk', lang: 'en', level: 'Medium', title: 'Karnataka Special', blurb: 'Our state, its history and its heroes.',
    questions: [
      { q: 'What is the capital of Karnataka?', a: 'Bengaluru' },
      { q: 'In which year was Mysore State renamed Karnataka?', a: '1973' },
      { q: 'On which date is Karnataka Rajyotsava celebrated?', a: '1 November' },
      { q: 'Which ruler was called the Tiger of Mysore?', a: 'Tipu Sultan' },
      { q: 'Hampi was the capital of which empire?', a: 'The Vijayanagara Empire' },
      { q: 'Which famous waterfall is formed by the Sharavathi river?', a: 'Jog Falls' },
      { q: 'Which festival is Mysuru world-famous for?', a: 'Dasara' },
      { q: 'Which major river flows from Karnataka into Tamil Nadu?', a: 'The Kaveri (Cauvery)' },
      { q: 'Where is the giant Gommateshwara statue?', a: 'Shravanabelagola' },
      { q: 'Who was the first Kannada writer to win the Jnanpith Award?', a: 'Kuvempu (1967)' },
      { q: 'How many Jnanpith Awards has Kannada literature won?', a: 'Eight' },
      { q: 'Which district is called the Scotland of India?', a: 'Kodagu (Coorg)' },
      { q: 'Which Karnataka city is famous for its silk sarees and palace?', a: 'Mysuru' },
      { q: 'Bengaluru is often called the Silicon Valley of India. What is its older nickname?', a: 'The Garden City' },
      { q: "Which legendary Kannada actor was lovingly called 'Annavru'?", a: 'Dr Rajkumar' },
      { q: 'What is the state animal of Karnataka?', a: 'The elephant' },
      { q: 'What is the highest peak in Karnataka?', a: 'Mullayanagiri' },
      { q: 'Which coastal city in Karnataka has a major port?', a: 'Mangaluru' },
      { q: 'Which 12th-century reformer founded the Anubhava Mantapa?', a: 'Basavanna' },
      { q: 'Which national park on the Mysuru–Ooty road is famous for tigers and elephants?', a: 'Bandipur' }
    ]
  }
];

// Host-made packs, saved on the host's device.
export function loadCustomPacks() {
  try { return JSON.parse(localStorage.getItem('fb.customPacks')) || []; } catch (e) { return []; }
}
export function saveCustomPacks(list) {
  try { localStorage.setItem('fb.customPacks', JSON.stringify(list)); } catch (e) {}
}
export function parseCustom(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [q, ...rest] = l.split('|');
    return { q: q.trim(), a: rest.join('|').trim() || '—' };
  }).filter(x => x.q);
}
export function findPack(id) {
  return PACKS.find(p => p.id === id) || loadCustomPacks().find(p => p.id === id) || null;
}
