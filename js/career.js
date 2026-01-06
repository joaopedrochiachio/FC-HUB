window.renderCareerMode = function () {
    const tbody = document.getElementById('career-history-body');
    let tTit = 0, tMat = 0, tWin = 0, tGol = 0;
    let html = '';

    Object.keys(db.seasons).sort().forEach(y => {
        const s = db.seasons[y];
        tMat += parseInt(s.matches || 0); tWin += parseInt(s.wins || 0); tGol += parseInt(s.gf || 0);
        const tit = s.competitions ? s.competitions.filter(c => c.isTitle).length : 0;
        tTit += tit;
        html += `<tr><td>${y}</td><td>${db.club}</td><td class="text-center">${s.matches}</td><td class="text-center">${s.wins}</td><td class="text-center">${s.draws}</td><td class="text-center">${s.losses}</td><td class="text-center c-green">${tit > 0 ? tit : '-'}</td></tr>`;
    });

    if (tbody) tbody.innerHTML = html;
    document.getElementById('total-titles').innerText = tTit;
    document.getElementById('total-matches').innerText = tMat;
    document.getElementById('total-wins').innerText = tWin;
    document.getElementById('total-goals').innerText = tGol;

    // Modal
    document.getElementById('mc-games').innerText = tMat;
    document.getElementById('mc-wins').innerText = tWin;
    document.getElementById('mc-goals').innerText = tGol;
    document.getElementById('mc-titles').innerText = tTit;
};

window.openPresentationModal = function () {
    document.getElementById('mc-manager').innerText = db.manager;
    document.getElementById('mc-club').innerText = db.club;
    document.getElementById('mc-logo').src = document.getElementById('header-logo').src;
    document.getElementById('presentationModal').style.display = 'flex';
};
window.closePresentationModal = function () { document.getElementById('presentationModal').style.display = 'none'; };