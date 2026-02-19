document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAMAZ TRACKER ---
    try {
        const namazContainer = document.getElementById('namaz-container');
        if (namazContainer) {
            const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            let savedNamaz = {};
            
            try {
                savedNamaz = JSON.parse(localStorage.getItem('namazTracker')) || {};
            } catch (e) { console.warn("Local storage blocked by browser"); }

            prayers.forEach(prayer => {
                const div = document.createElement('div');
                div.className = 'namaz-card';
                div.innerHTML = `
                    <h3>${prayer}</h3>
                    <input type="checkbox" id="${prayer}" ${savedNamaz[prayer] ? 'checked' : ''}>
                `;
                namazContainer.appendChild(div);

                document.getElementById(prayer).addEventListener('change', (e) => {
                    try {
                        savedNamaz[prayer] = e.target.checked;
                        localStorage.setItem('namazTracker', JSON.stringify(savedNamaz));
                    } catch(err) {}
                });
            });

            document.getElementById('reset-tracker').addEventListener('click', () => {
                try { localStorage.removeItem('namazTracker'); } catch(e){}
                window.location.reload();
            });
        }
    } catch(error) { console.error("Tracker error", error); }

    // --- 2. DYNAMIC TIMINGS ---
    try {
        const suhoorEl = document.getElementById('suhoor-time');
        const iftarEl = document.getElementById('iftar-time');
        
        if (suhoorEl && iftarEl) {
            async function fetchTimings() {
                try {
                    const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Kolkata&country=India&method=1');
                    const data = await response.json();
                    
                    if (data.code === 200) {
                        suhoorEl.innerText = data.data.timings.Fajr;
                        iftarEl.innerText = data.data.timings.Maghrib;
                    } else {
                        suhoorEl.innerText = "Error";
                        iftarEl.innerText = "Error";
                    }
                } catch (error) {
                    suhoorEl.innerText = "Offline";
                    iftarEl.innerText = "Offline";
                }
            }
            fetchTimings();
        }
    } catch(error) { console.error("Timings error", error); }

    // --- 3. 30 DAYS CHALLENGE & DUAS ---
    try {
        const challengeGrid = document.getElementById('challenge-grid');
        if (challengeGrid) {
            const ramadanData = [
                { day: 1, challenge: "Read at least 2 pages of the Quran.", dua: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ", translation: "O Allah, bring it over us with blessing and faith, and security and Islam." },
                { day: 2, challenge: "Give a small amount to charity (Sadaqah).", dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire." },
                { day: 3, challenge: "Call or text a relative you haven't spoken to in a while.", dua: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ", translation: "My Lord, forgive me and my parents." },
                { day: 4, challenge: "Help prepare Iftar or clean up afterward.", dua: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", translation: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency." },
                { day: 5, challenge: "Memorize a new short Surah or Dua.", dua: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", translation: "O Changer of the hearts, make my heart firm upon Your religion." },
                { day: 6, challenge: "Forgive someone who has wronged you in the past.", dua: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", translation: "O Allah, You are Forgiving and love forgiveness, so forgive me." },
                { day: 7, challenge: "Feed a fasting person, even if it is just with a date or water.", dua: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ وَأَكَلَ طَعَامَكُمُ الأَبْرَارُ", translation: "May the fasting break their fast with you, and the pious eat your food." },
                { day: 8, challenge: "Pray 2 Rakaats of Duha (mid-morning) prayer.", dua: "رَبِّ زِدْنِي عِلْمًا", translation: "My Lord, increase me in knowledge." },
                { day: 9, challenge: "Make sincere Dua for the global Muslim community.", dua: "اللَّهُمَّ أَصْلِحْ أُمَّةَ مُحَمَّدٍ", translation: "O Allah, improve the state of the Ummah of Muhammad." },
                { day: 10, challenge: "Read the translation and Tafseer of Surah Al-Fatihah.", dua: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", translation: "Our Lord, let not our hearts deviate after You have guided us." },
                { day: 11, challenge: "Smile at everyone you meet today—it's a form of charity!", dua: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
                { day: 12, challenge: "Ensure you pray all 5 obligatory prayers exactly on time.", dua: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي", translation: "My Lord, make me an establisher of prayer, and [many] from my descendants." },
                { day: 13, challenge: "Go the entire day without complaining or arguing.", dua: "اللَّهُمَّ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي", translation: "O Allah, just as You have made my physical form beautiful, make my character beautiful." },
                { day: 14, challenge: "Give up one bad habit for the day.", dua: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ", translation: "O Allah, suffice me with what You have allowed instead of what You have forbidden." },
                { day: 15, challenge: "Do a random act of kindness for a family member.", dua: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", translation: "Our Lord, grant us from among our spouses and offspring comfort to our eyes." },
                { day: 16, challenge: "Send Salawat (blessings) upon Prophet Muhammad (PBUH) 100 times.", dua: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", translation: "O Allah, send blessings upon Muhammad and the family of Muhammad." },
                { day: 17, challenge: "Wake up 15 minutes earlier than usual for Tahajjud prayer.", dua: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers." },
                { day: 18, challenge: "Clean a part of your home or help tidy up the local mosque.", dua: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", translation: "O Allah, I seek refuge in You from anxiety and sorrow." },
                { day: 19, challenge: "Recite SubhanAllah, Alhamdulillah, and Allahu Akbar 33 times after every prayer.", dua: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ", translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me." },
                { day: 20, challenge: "Prepare for the last 10 nights. Set clear goals for Laylatul Qadr.", dua: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", translation: "O Allah, You are Forgiving and love forgiveness, so forgive me." },
                { day: 21, challenge: "Write down 5 blessings you are grateful for today.", dua: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", translation: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing." },
                { day: 22, challenge: "Read a story about one of the Prophets or the Sahabah.", dua: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", translation: "O Changer of the hearts, make my heart firm upon Your religion." },
                { day: 23, challenge: "Give charity again, even if it is just a tiny amount.", dua: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا", translation: "O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds." },
                { day: 24, challenge: "Spend 10 minutes making unscripted, sincere Dua from your heart.", dua: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance." },
                { day: 25, challenge: "Disconnect from social media for the entire day to focus on worship.", dua: "اللَّهُمَّ بَارِكْ لَنَا فِي أَوْقَاتِنَا", translation: "O Allah, bless our time for us." },
                { day: 26, challenge: "Make special Dua for those who are sick, struggling, or oppressed.", dua: "أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي", translation: "Remove the affliction, O Lord of mankind, and heal, You are the Healer." },
                { day: 27, challenge: "Perform I'tikaf (isolation for worship) for at least one hour today.", dua: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ", translation: "O Allah, I ask You for Paradise and seek refuge in You from the Fire." },
                { day: 28, challenge: "Plan how you will maintain at least one good habit after Ramadan.", dua: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path." },
                { day: 29, challenge: "Ask for forgiveness from anyone you may have hurt this past year.", dua: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ", translation: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your slave." },
                { day: 30, challenge: "Pay your Zakat al-Fitr, celebrate your efforts, and prepare for Eid!", dua: "تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ", translation: "May Allah accept [good deeds] from us and from you." }
            ];

            const modal = document.getElementById('challenge-modal');
            const closeBtn = document.querySelector('.close-btn');

            for(let i = 1; i <= 30; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day-card';
                dayDiv.innerText = `Day ${i}`;
                
                dayDiv.addEventListener('click', () => {
                    const data = ramadanData.find(d => d.day === i) || { challenge: "Challenge coming soon!", dua: "", translation: "" };
                    document.getElementById('modal-day').innerText = `Ramadan Day ${i}`;
                    document.getElementById('modal-challenge').innerText = data.challenge;
                    document.getElementById('modal-dua').innerText = data.dua;
                    document.getElementById('modal-translation').innerText = data.translation;
                    modal.style.display = 'flex';
                });

                challengeGrid.appendChild(dayDiv);
            }

            if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
            window.addEventListener('click', (e) => {
                if (e.target == modal) modal.style.display = 'none';
            });
        }
    } catch(error) { console.error("Challenge error", error); }

    // --- 4. 99 NAMES OF ALLAH ---
    try {
        const namesGrid = document.getElementById('names-grid');
        if (namesGrid) {
            const namesOfAllah = [
                { arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Beneficent" },
                { arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Merciful" },
                { arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King / Sovereign" },
                { arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
                { arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
                { arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Infuser of Faith" },
                { arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Guardian" },
                { arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty / Invincible" },
                { arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller" },
                { arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme" },
                { arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator" },
                { arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Evolver" },
                { arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner" },
                { arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Forgiving" },
                { arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer" },
                { arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower" },
                { arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider" },
                { arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener" },
                { arabic: "اَلْعَلِيْمُ", transliteration: "Al-Alim", meaning: "The All-Knowing" },
                { arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Constrictor" },
                { arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Expander" },
                { arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser" },
                { arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter" },
                { arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Honorer" },
                { arabic: "المُذِلُّ", transliteration: "Al-Mudhill", meaning: "The Dishonorer" },
                { arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing" },
                { arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing" },
                { arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge" },
                { arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just" },
                { arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle One" },
                { arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The Aware" },
                { arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing" },
                { arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Magnificent" },
                { arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The Great Forgiver" },
                { arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative" },
                { arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Most High" },
                { arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Most Great" },
                { arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver" },
                { arabic: "المُقيِت", transliteration: "Al-Muqit", meaning: "The Sustainer" },
                { arabic: "الْحَسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner" },
                { arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Majestic" },
                { arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous" },
                { arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful" },
                { arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive" },
                { arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The All-Encompassing" },
                { arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise" },
                { arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Loving" },
                { arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Glorious" },
                { arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector" },
                { arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness" },
                { arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth" },
                { arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee" },
                { arabic: "الْقَوِيُّ", transliteration: "Al-Qawi", meaning: "The Strong" },
                { arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm" },
                { arabic: "الْوَلِيُّ", transliteration: "Al-Wali", meaning: "The Protecting Friend" },
                { arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy" },
                { arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Accounter" },
                { arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator" },
                { arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer" },
                { arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life" },
                { arabic: "اَلْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Creator of Death" },
                { arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever-Living" },
                { arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Sustainer of Existence" },
                { arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder" },
                { arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble" },
                { arabic: "الْوَاحِدُ", transliteration: "Al-Wahid", meaning: "The Unique" },
                { arabic: "اَلاَحَدُ", transliteration: "Al-Ahad", meaning: "The One" },
                { arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal" },
                { arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Capable" },
                { arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Powerful" },
                { arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter" },
                { arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer" },
                { arabic: "الأوَّلُ", transliteration: "Al-Awwal", meaning: "The First" },
                { arabic: "الآخِرُ", transliteration: "Al-Akhir", meaning: "The Last" },
                { arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest" },
                { arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden" },
                { arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor" },
                { arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted" },
                { arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness" },
                { arabic: "التَّوَابُ", transliteration: "At-Tawwab", meaning: "The Accepter of Repentance" },
                { arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger" },
                { arabic: "العَفُوُّ", transliteration: "Al-Afu", meaning: "The Pardoner" },
                { arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Compassionate" },
                { arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "The Owner of All Sovereignty" },
                { arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ", transliteration: "Dhul-Jalal Wal-Ikram", meaning: "The Lord of Majesty and Bounty" },
                { arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable" },
                { arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer" },
                { arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient" },
                { arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher" },
                { arabic: "اَلْمَانِعُ", transliteration: "Al-Mani", meaning: "The Preventer" },
                { arabic: "الضَّارَّ", transliteration: "Ad-Darr", meaning: "The Distresser" },
                { arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Propitious" },
                { arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light" },
                { arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide" },
                { arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Incomparable" },
                { arabic: "اَلْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting" },
                { arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor" },
                { arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to the Right Path" },
                { arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient" }
            ];

            namesOfAllah.forEach(name => {
                const flipCard = document.createElement('div');
                flipCard.className = 'flip-card';
                flipCard.innerHTML = `
                    <div class="flip-card-inner">
                        <div class="flip-card-front"><div class="arabic">${name.arabic}</div><strong>${name.transliteration}</strong></div>
                        <div class="flip-card-back"><h4>${name.meaning}</h4></div>
                    </div>
                `;
                namesGrid.appendChild(flipCard);
            });
        }
    } catch(error) { console.error("Names error", error); }

    // --- 5. 30 DAYS OF SUNNAH ---
    try {
        const sunnahGrid = document.getElementById('sunnah-grid');
        if (sunnahGrid) {
            const sunnahData = [
                { day: 1, title: "Smiling at Others", desc: "Smile! The Prophet (ﷺ) said: 'Your smiling in the face of your brother is charity.'", ref: "Jami` at-Tirmidhi" },
                { day: 2, title: "Sleeping on the Right Side", desc: "Dust your bed, lie on your right side, and place your right hand under your right cheek.", ref: "Sahih al-Bukhari" },
                { day: 3, title: "Drinking Water in 3 Breaths", desc: "Sit down to drink, say Bismillah, and drink in three separate sips/breaths rather than gulping.", ref: "Sahih Muslim" },
                { day: 4, title: "Using the Miswak", desc: "Clean your teeth with a Miswak, especially before prayers. It is pleasing to Allah.", ref: "Sunan an-Nasa'i" },
                { day: 5, title: "Saying Salam First", desc: "Be the first to initiate the greeting of 'As-salamu Alaykum' when meeting someone.", ref: "Sunan Abi Dawud" },
                { day: 6, title: "Eating with the Right Hand", desc: "Say Bismillah, eat with your right hand, and eat from what is directly in front of you.", ref: "Sahih al-Bukhari" },
                { day: 7, title: "Never Criticizing Food", desc: "If the Prophet (ﷺ) liked food, he ate it; if he didn't, he simply left it without complaining.", ref: "Sahih al-Bukhari" },
                { day: 8, title: "Speaking Good or Remaining Silent", desc: "Guard your tongue. 'He who believes in Allah and the Last Day must either speak good or remain silent.'", ref: "Sahih Muslim" },
                { day: 9, title: "Entering/Exiting the Bathroom", desc: "Enter with your left foot, exit with your right foot.", ref: "Sunan Ibn Majah" },
                { day: 10, title: "Putting on Shoes", desc: "Start putting your shoes on with the right foot, and take them off starting with the left.", ref: "Sahih al-Bukhari" },
                { day: 11, title: "Sitting Down When Angry", desc: "If you get angry while standing, sit down. If the anger remains, lie down.", ref: "Sunan Abi Dawud" },
                { day: 12, title: "Visiting the Sick", desc: "Visit someone who is unwell. The angels pray for you when you do so.", ref: "Jami` at-Tirmidhi" },
                { day: 13, title: "Saying Alhamdulillah After Sneezing", desc: "When you sneeze, say 'Alhamdulillah'. If someone else sneezes and praises Allah, reply 'Yarhamukallah'.", ref: "Sahih al-Bukhari" },
                { day: 14, title: "Making Dua for Others in Secret", desc: "Make Dua for a friend/relative behind their back. An angel replies: 'Ameen, and to you the same.'", ref: "Sahih Muslim" },
                { day: 15, title: "Forgiving Others Before Sleep", desc: "Cleanse your heart of any grudges or ill feelings towards anyone before going to bed.", ref: "Sunan Ibn Majah" },
                { day: 16, title: "Removing Obstacles from the Path", desc: "Move a branch, rock, or any harmful object out of the walking path. It is a branch of faith.", ref: "Sahih Muslim" },
                { day: 17, title: "Wearing Perfume (Ittar)", desc: "Apply a pleasant scent (for men in public, for women at home). The Prophet (ﷺ) loved good scents.", ref: "Sunan an-Nasa'i" },
                { day: 18, title: "Trimming Nails on Friday", desc: "Cut your nails and groom yourself as part of your Friday (Jumu'ah) preparation.", ref: "Sahih Muslim" },
                { day: 19, title: "Saying Bismillah for All Tasks", desc: "Start cooking, working, driving, or any mundane task in the Name of Allah.", ref: "Sunan Abi Dawud" },
                { day: 20, title: "Sleeping Early", desc: "Avoid unnecessary late-night talks. Sleep soon after Isha to wake up fresh for Tahajjud and Fajr.", ref: "Sahih al-Bukhari" },
                { day: 21, title: "Keeping Promises", desc: "If you give someone your word, fulfill it completely. It is a core trait of a believer.", ref: "Sahih al-Bukhari" },
                { day: 22, title: "Being Kind to Neighbors", desc: "Share some food with your neighbor or simply check in on them.", ref: "Sahih Muslim" },
                { day: 23, title: "Expressing Gratitude to People", desc: "'He who does not thank the people is not thankful to Allah.' Express your appreciation today.", ref: "Sunan Abi Dawud" },
                { day: 24, title: "Covering the Mouth When Yawning", desc: "Try to suppress a yawn, and if you cannot, cover your mouth with your hand.", ref: "Sahih al-Bukhari" },
                { day: 25, title: "Saying Bismillah When Entering the House", desc: "Enter your home with the right foot and mention Allah's name. It keeps Shaytan out.", ref: "Sahih Muslim" },
                { day: 26, title: "Not Getting Angry", desc: "A man asked the Prophet (ﷺ) for advice, and he said: 'Do not become angry' and repeated it.", ref: "Sahih al-Bukhari" },
                { day: 27, title: "Eating Together", desc: "Eat your meals with your family rather than alone. There is blessing in eating together.", ref: "Sunan Abi Dawud" },
                { day: 28, title: "Visiting Graves", desc: "Visit the graveyard to remind yourself of the Hereafter and make Dua for the deceased.", ref: "Sahih Muslim" },
                { day: 29, title: "Looking at Those Below You", desc: "Look at those who have less wealth or health than you, so you do not belittle Allah's blessings.", ref: "Sahih Muslim" },
                { day: 30, title: "Sending Salawat on Friday", desc: "Increase your blessings upon the Prophet (ﷺ) on Fridays, as it is presented directly to him.", ref: "Sunan Abi Dawud" }
            ];

            const sunnahModal = document.getElementById('sunnah-modal');
            const closeSunnahBtn = document.getElementById('close-sunnah');

            for(let i = 1; i <= 30; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day-card';
                dayDiv.innerText = `Day ${i}`;
                
                dayDiv.addEventListener('click', () => {
                    const data = sunnahData.find(d => d.day === i);
                    if(data) {
                        document.getElementById('modal-sunnah-day').innerText = `Sunnah Day ${i}`;
                        document.getElementById('modal-sunnah-title').innerText = data.title;
                        document.getElementById('modal-sunnah-desc').innerText = data.desc;
                        document.getElementById('modal-sunnah-ref').innerText = `Reference: ${data.ref}`;
                        sunnahModal.style.display = 'flex';
                    }
                });
                sunnahGrid.appendChild(dayDiv);
            }

            if(closeSunnahBtn) closeSunnahBtn.addEventListener('click', () => sunnahModal.style.display = 'none');
            window.addEventListener('click', (e) => {
                if (e.target == sunnahModal) sunnahModal.style.display = 'none';
            });
        }
    } catch(error) { console.error("Sunnah error", error); }

});

// --- 6. ZAKAT CALCULATOR (Outside DOMContentLoaded) ---
window.calculateZakat = function() {
    const cash = parseFloat(document.getElementById('cash').value) || 0;
    const gold = parseFloat(document.getElementById('gold').value) || 0;
    const business = parseFloat(document.getElementById('business').value) || 0;
    
    const zakat = (cash + gold + business) * 0.025; 
    document.getElementById('zakat-result').innerText = `Total Zakat Owed: ₹${zakat.toFixed(2)}`;
};