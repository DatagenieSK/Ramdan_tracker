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
        { arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: "The Source of Peace" }
        // Add more names here...
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
