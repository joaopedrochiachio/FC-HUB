window.fillAdmin = function (d) {
    document.getElementById('edt-manager').value = db.manager;

    // Carrega o clube/logo específico desta temporada (ou o global se não tiver)
    document.getElementById('edt-club').value = d.club || db.club;
    document.getElementById('edt-logo').value = d.logo || db.logo;

    document.getElementById('edt-color').value = d.theme;

    document.getElementById('edt-matches').value = d.matches;
    document.getElementById('edt-wins').value = d.wins;
    document.getElementById('edt-draws').value = d.draws;
    document.getElementById('edt-losses').value = d.losses;
    document.getElementById('edt-gf').value = d.gf;
    document.getElementById('edt-ga').value = d.ga;
    document.getElementById('edt-conf').value = d.confidence;

    // Listas
    const squadList = document.getElementById('admin-squad-list');
    if (squadList && d.squad) {
        squadList.innerHTML = d.squad.map((p, i) => `
            <div class="player-edit-row" id="p-row-${i}">
                <div style="flex:2"><input type="text" class="edt-name" value="${p.name}"></div>
                <div style="flex:0.5"><input type="text" class="edt-pos center" value="${p.pos}"></div>
                <div style="flex:0.5"><input type="number" class="edt-j center" value="${p.games}"></div>
                <div style="flex:0.5"><input type="number" class="edt-g center" value="${p.goals}" style="color:var(--accent-green)"></div>
                <div style="flex:0.5"><input type="number" class="edt-a center" value="${p.assists}" style="color:var(--accent-blue)"></div>
                <div style="flex:1"><input type="text" class="edt-badge" value="${p.badge || ''}" placeholder="-"></div>
                <div style="flex:0.8; text-align:right" class="row-actions">
                    <button class="btn-row save" onclick="updatePlayer(${i})"><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class="btn-row del" onclick="delItem('squad', ${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    const compsList = document.getElementById('admin-comps-list');
    if (compsList && d.competitions) {
        compsList.innerHTML = d.competitions.map((c, i) =>
            `<div class="edit-item"><span style="flex:1">${c.name}</span><button class="btn-mini btn-del-mini" onclick="delItem('competitions', ${i})">X</button></div>`
        ).join('');
    }
};

window.saveGeneralData = function () {
    // Manager é global (você é o mesmo treinador sempre)
    db.manager = document.getElementById('edt-manager').value;

    // Clube e Logo são salvos NA TEMPORADA ATUAL também
    const clubName = document.getElementById('edt-club').value;
    const clubLogo = document.getElementById('edt-logo').value;

    // Atualiza global (para referência futura)
    db.club = clubName;
    db.logo = clubLogo;

    // Atualiza ESPECÍFICO DA TEMPORADA (Isso garante o histórico correto)
    if (db.seasons[currentYear]) {
        db.seasons[currentYear].club = clubName;
        db.seasons[currentYear].logo = clubLogo;
        db.seasons[currentYear].theme = document.getElementById('edt-color').value;
        db.seasons[currentYear].matches = document.getElementById('edt-matches').value || 0;
        db.seasons[currentYear].wins = document.getElementById('edt-wins').value || 0;
        db.seasons[currentYear].draws = document.getElementById('edt-draws').value || 0;
        db.seasons[currentYear].losses = document.getElementById('edt-losses').value || 0;
        db.seasons[currentYear].gf = document.getElementById('edt-gf').value || 0;
        db.seasons[currentYear].ga = document.getElementById('edt-ga').value || 0;
        db.seasons[currentYear].confidence = document.getElementById('edt-conf').value || 50;
    }

    saveData();
    alert("Dados da Temporada Salvos!");
};

// ... (MANTENHA AS OUTRAS FUNÇÕES: addPlayer, updatePlayer, processImage, ETC. IGUAIS À VERSÃO ANTERIOR) ...
window.addPlayer = function () {
    const name = document.getElementById('new-p-name').value;
    const pos = document.getElementById('new-p-pos').value;
    const games = document.getElementById('new-p-games').value;
    const goals = document.getElementById('new-p-goals').value;
    const assists = document.getElementById('new-p-assists').value;
    const badge = document.getElementById('new-p-badge').value;

    if (!name) { alert("Nome é obrigatório!"); return; }

    const newPlayer = {
        name: name, pos: pos,
        games: parseInt(games) || 0, goals: parseInt(goals) || 0, assists: parseInt(assists) || 0,
        badge: badge
    };

    if (!db.seasons[currentYear].squad) db.seasons[currentYear].squad = [];
    db.seasons[currentYear].squad.push(newPlayer);
    saveData();
    document.getElementById('new-p-name').value = "";
    document.getElementById('new-p-badge').value = "";
    document.getElementById('new-p-name').focus();
};

window.updatePlayer = function (index) {
    const row = document.getElementById(`p-row-${index}`);
    if (!row) return;
    db.seasons[currentYear].squad[index] = {
        name: row.querySelector('.edt-name').value,
        pos: row.querySelector('.edt-pos').value,
        games: parseInt(row.querySelector('.edt-j').value) || 0,
        goals: parseInt(row.querySelector('.edt-g').value) || 0,
        assists: parseInt(row.querySelector('.edt-a').value) || 0,
        badge: row.querySelector('.edt-badge').value
    };
    saveData();
    const btn = row.querySelector('.btn-row.save');
    btn.innerHTML = "<i class='fa-solid fa-check'></i>";
    setTimeout(() => btn.innerHTML = "<i class='fa-solid fa-floppy-disk'></i>", 1000);
};

window.processImage = function (input) {
    const file = input.files[0];
    if (!file) return;
    document.getElementById('ocr-status').innerText = "Lendo...";
    Tesseract.recognize(file, 'eng').then(({ data: { text } }) => {
        const lines = text.split('\n');
        let count = 0;
        lines.forEach(l => {
            let m = l.match(/([a-zA-Z\s\.]+)\s+(\d+)\s+(\d+)\s+(\d+)/);
            if (m) {
                db.seasons[currentYear].squad.push({ name: m[1].trim(), pos: 'ATA', games: m[2], goals: m[3], assists: m[4], badge: '' });
                count++;
            }
        });
        saveData();
        document.getElementById('ocr-status').innerText = count > 0 ? `${count} lidos` : "Falha";
    });
};

window.saveMVPImage = function () { db.mvpImage = document.getElementById('edt-mvp-img').value; saveData(); alert("Foto Salva!"); };
window.addCompetition = function () { const n = document.getElementById('new-c-name').value; if (n) { db.seasons[currentYear].competitions.push({ name: n, result: document.getElementById('new-c-result').value, isTitle: document.getElementById('new-c-title').checked }); saveData(); document.getElementById('new-c-name').value = ''; } };
window.addTransfer = function () { const n = document.getElementById('new-t-name').value; if (n) { db.seasons[currentYear].transfers[document.getElementById('new-t-type').value].push({ name: n, team: document.getElementById('new-t-team').value, price: document.getElementById('new-t-price').value }); saveData(); document.getElementById('new-t-name').value = ''; } };
window.delItem = function (arr, i) { if (confirm('Del?')) { db.seasons[currentYear][arr].splice(i, 1); saveData(); } };
window.delTransfer = function (type, i) { if (confirm('Del?')) { db.seasons[currentYear].transfers[type].splice(i, 1); saveData(); } };