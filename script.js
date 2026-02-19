document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAMAZ TRACKER ---
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const namazContainer = document.getElementById('namaz-container');
    
    // Load saved data or create empty object
    let savedNamaz = JSON.parse(localStorage.getItem('namazTracker')) || {};

    prayers.forEach(prayer => {
        const div = document.createElement('div');
        div.className = 'namaz-card';
        div.innerHTML = `
            <h3>${prayer}</h3>
            <input type="checkbox" id="${prayer}" ${savedNamaz[prayer] ? 'checked' : ''}>
        `;
        namazContainer.appendChild(div);

        // Save on click
        document.getElementById(prayer).addEventListener('change', (e) => {
            savedNamaz[prayer] = e.target.checked;
            localStorage.setItem('namazTracker', JSON.stringify(savedNamaz));
        });
    });

    document.getElementById('reset-tracker').addEventListener('click', () => {
        localStorage.removeItem('namazTracker');
        window.location.reload();
    });

    // --- 2. 30 DAYS CHALLENGE & DUAS ---
    // NOTE: Here are the first 3 days. You can copy this format up to day 30!
    const ramadanData = [
        { day: 1, challenge: "Read at least 2 pages of the Quran.", dua: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ", translation: "O Allah, bring it over us with blessing and faith, and security and Islam." },
        { day: 2, challenge: "Give a small amount to charity (Sadaqah).", dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire." },
        { day: 3, challenge: "Call or text a relative you haven't spoken to in a while.", dua: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ", translation: "My Lord, forgive me and my parents." },
        // Add more days here: { day: 4, challenge: "...", dua: "...", translation: "..." }
    ];

    const challengeGrid = document.getElementById('challenge-grid');
    const modal = document.getElementById('challenge-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Create a card for all 30 days
    for(let i = 1; i <= 30; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-card';
        dayDiv.innerText = `Day ${i}`;
        
        dayDiv.addEventListener('click', () => {
            // Find data or show placeholder if not added yet
            const data = ramadanData.find(d => d.day === i) || { challenge: "Challenge coming soon!", dua: "", translation: "" };
            
            document.getElementById('modal-day').innerText = `Ramadan Day ${i}`;
            document.getElementById('modal-challenge').innerText = data.challenge;
            document.getElementById('modal-dua').innerText = data.dua;
            document.getElementById('modal-translation').innerText = data.translation;
            
            modal.style.display = 'flex';
        });

        challengeGrid.appendChild(dayDiv);
    }

    // Close Modal Logic
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    // --- 3. 99 NAMES OF ALLAH ---
    // NOTE: Here are the first 5 names. You can copy this format to add the rest!
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
    

    const namesGrid = document.getElementById('names-grid');

    namesOfAllah.forEach(name => {
        const flipCard = document.createElement('div');
        flipCard.className = 'flip-card';
        flipCard.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="arabic">${name.arabic}</div>
                    <strong>${name.transliteration}</strong>
                </div>
                <div class="flip-card-back">
                    <h4>${name.meaning}</h4>
                </div>
            </div>
        `;
        namesGrid.appendChild(flipCard);
    });

});
