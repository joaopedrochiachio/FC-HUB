const CAREER_TROPHY_ICONS = {
    "brasileirão": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Trofeu_cbf_brasileirao.png/170px-Trofeu_cbf_brasileirao.png",
    "libertadores": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Trofeo_Copa_Libertadores.png/200px-Trofeo_Copa_Libertadores.png",
    "copa do brasil": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Copa_do_Brasil_de_Futebol_Trophy.png/180px-Copa_do_Brasil_de_Futebol_Trophy.png",
    "champions": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Trofeo_de_la_Liga_de_Campeones.svg/166px-Trofeo_de_la_Liga_de_Campeones.svg.png",
    "default": "https://cdn-icons-png.flaticon.com/512/3112/3112946.png"
};

window.renderCareerMode = function () {
    const timelineContainer = document.getElementById('career-timeline');
    let tTit = 0, tMat = 0, tWin = 0, tGol = 0;

    const seasonsHtml = Object.keys(db.seasons).sort().reverse().map(year => {
        const s = db.seasons[year];
        const m = parseInt(s.matches || 0), w = parseInt(s.wins || 0), l = parseInt(s.losses || 0), g = parseInt(s.gf || 0);
        tMat += m; tWin += w; tGol += g;

        const winRate = m > 0 ? Math.round((w / m) * 100) : 0;

        const titles = s.competitions ? s.competitions.filter(c => c.isTitle) : [];
        const hasTitles = titles.length > 0;
        tTit += titles.length;

        const trophiesHtml = hasTitles ? titles.map(t => {
            let imgUrl = CAREER_TROPHY_ICONS["default"];
            const lowerName = t.name.toLowerCase();
            if (lowerName.includes("brasil") || lowerName.includes("série a")) imgUrl = CAREER_TROPHY_ICONS["brasileirão"];
            else if (lowerName.includes("liberta")) imgUrl = CAREER_TROPHY_ICONS["libertadores"];
            else if (lowerName.includes("copa")) imgUrl = CAREER_TROPHY_ICONS["copa do brasil"];
            return `<div class="mini-trophy"><img src="${imgUrl}" title="${t.name}"></div>`;
        }).join('') : '<span class="no-trophy">Sem títulos</span>';

        // AQUI ESTÁ A MÁGICA: Usa o clube salvo NA TEMPORADA, ou o atual se não tiver
        const seasonClubName = s.club || db.club;
        const seasonClubLogo = s.logo || db.logo || `https://ui-avatars.com/api/?name=${seasonClubName}&background=222&color=fff`;

        return `
            <div class="season-card ${hasTitles ? 'golden-season' : ''}">
                <div class="season-year">${year}</div>
                <div class="season-club">
                    <img src="${seasonClubLogo}" onerror="this.style.display='none'">
                    <div>
                        <h3>${seasonClubName}</h3>
                        <div class="season-stats-mini">
                            ${m}J • ${w}V • ${g}GP
                            <span class="win-rate">${winRate}% Apr.</span>
                        </div>
                    </div>
                </div>
                <div class="season-trophies">${trophiesHtml}</div>
            </div>
        `;
    }).join('');

    if (timelineContainer) timelineContainer.innerHTML = seasonsHtml || '<div style="text-align:center; padding:20px; color:#666;">Vazio</div>';

    if (document.getElementById('total-titles')) document.getElementById('total-titles').innerText = tTit;
    if (document.getElementById('total-matches')) document.getElementById('total-matches').innerText = tMat;
    if (document.getElementById('total-wins')) document.getElementById('total-wins').innerText = tWin;
    if (document.getElementById('total-goals')) document.getElementById('total-goals').innerText = tGol;
    if (document.getElementById('mc-games')) document.getElementById('mc-games').innerText = tMat;
    if (document.getElementById('mc-wins')) document.getElementById('mc-wins').innerText = tWin;
    if (document.getElementById('mc-goals')) document.getElementById('mc-goals').innerText = tGol;
    if (document.getElementById('mc-titles')) document.getElementById('mc-titles').innerText = tTit;
};

window.openPresentationModal = function () {
    document.getElementById('mc-manager').innerText = db.manager;
    document.getElementById('mc-club').innerText = db.club;
    const headerLogoSrc = document.getElementById('header-logo').src;
    document.getElementById('mc-logo').src = headerLogoSrc;
    const modalCard = document.querySelector('.manager-card-presentation');
    if (modalCard) modalCard.style.setProperty('--club-bg-image', `url('${headerLogoSrc}')`);
    document.getElementById('presentationModal').style.display = 'flex';
};

window.closePresentationModal = function () { document.getElementById('presentationModal').style.display = 'none'; };