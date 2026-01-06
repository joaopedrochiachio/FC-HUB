// --- PREENCHER ADMIN ---
window.fillAdmin = function (d) {
    document.getElementById('edt-manager').value = db.manager;
    document.getElementById('edt-club').value = db.club;
    document.getElementById('edt-logo').value = db.logo;
    document.getElementById('edt-color').value = d.theme;

    // Preencher Stats
    document.getElementById('edt-matches').value = d.matches;
    document.getElementById('edt-wins').value = d.wins;
    document.getElementById('edt-draws').value = d.draws;
    document.getElementById('edt-losses').value = d.losses;
    document.getElementById('edt-gf').value = d.gf;
    document.getElementById('edt-ga').value = d.ga;
    document.getElementById('edt-conf').value = d.confidence;

    // Preencher Lista de Elenco (Novo Layout)
    const squadList = document.getElementById('admin-squad-list');
    if (squadList) {
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

    // Preencher Competições
    const compsList = document.getElementById('admin-comps-list');
    if (compsList) {
        compsList.innerHTML = d.competitions.map((c, i) =>
            `<div class="edit-item"><span style="flex:1">${c.name}</span><button class="btn-del-mini" onclick="delItem('competitions', ${i})">X</button></div>`
        ).join('');
    }
};

// --- ADICIONAR JOGADOR (Manual) ---
window.addPlayer = function () {
    const name = document.getElementById('new-p-name').value;
    const pos = document.getElementById('new-p-pos').value;
    const games = document.getElementById('new-p-games').value;
    const goals = document.getElementById('new-p-goals').value;
    const assists = document.getElementById('new-p-assists').value;
    const badge = document.getElementById('new-p-badge').value;

    if (!name) { alert("Nome é obrigatório!"); return; }

    const newPlayer = {
        name: name,
        pos: pos,
        games: parseInt(games) || 0,
        goals: parseInt(goals) || 0,
        assists: parseInt(assists) || 0,
        badge: badge
    };

    // Garante que o array existe
    if (!db.seasons[currentYear].squad) db.seasons[currentYear].squad = [];

    db.seasons[currentYear].squad.push(newPlayer);
    saveData(); // Função global do core.js

    // Limpa campos
    document.getElementById('new-p-name').value = "";
    document.getElementById('new-p-badge').value = "";
    document.getElementById('new-p-games').value = "";
    document.getElementById('new-p-goals').value = "";
    document.getElementById('new-p-assists').value = "";
    document.getElementById('new-p-name').focus();
};

// --- ATUALIZAR JOGADOR (Edição na lista) ---
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

    // Feedback visual
    const btn = row.querySelector('.btn-row.save');
    btn.innerHTML = "<i class='fa-solid fa-check'></i>";
    setTimeout(() => btn.innerHTML = "<i class='fa-solid fa-floppy-disk'></i>", 1000);
};

// --- IA / TESSERACT (LÓGICA BLINDADA) ---
window.processImage = function (input) {
    const file = input.files[0];
    if (!file) return;

    const loading = document.getElementById('ocr-loading');
    const textStatus = document.getElementById('ocr-status-text');

    // Mostra loading
    if (loading) loading.style.display = "flex";
    if (textStatus) textStatus.innerText = "Iniciando motor de IA...";

    Tesseract.recognize(
        file,
        'eng',
        {
            logger: m => {
                // Atualiza o status visualmente se possível
                if (m.status === 'recognizing text') {
                    if (textStatus) textStatus.innerText = `Lendo: ${Math.round(m.progress * 100)}%`;
                }
            }
        }
    ).then(({ data: { text } }) => {
        if (textStatus) textStatus.innerText = "Processando dados...";
        parseOCRText(text);
        if (loading) setTimeout(() => loading.style.display = "none", 2000);
    }).catch(err => {
        console.error(err);
        if (textStatus) textStatus.innerText = "Erro ao ler imagem.";
        alert("A IA não conseguiu ler essa imagem. Tente uma imagem com fundo mais limpo ou maior contraste.");
        if (loading) loading.style.display = "none";
    });
};

function parseOCRText(text) {
    const lines = text.split('\n');
    let count = 0;

    // Assegura array
    if (!db.seasons[currentYear].squad) db.seasons[currentYear].squad = [];

    lines.forEach(line => {
        // Limpa caracteres especiais, mantendo letras, numeros e espaços
        let cleanLine = line.trim();

        // Tenta achar padrão: Nome [Espaço] Numero [Espaço] Numero
        // Ex: "Neymar 10 5"
        let match = cleanLine.match(/([a-zA-Z\.\s]+)\s+(\d+)\s+(\d+)\s*(\d*)/);

        if (match) {
            let name = match[1].trim();
            // Evita capturar cabeçalhos como "Nome Jogos Gols"
            if (name.length > 2 && !name.toLowerCase().includes("jogos") && !name.toLowerCase().includes("nome")) {

                let games = parseInt(match[2]) || 0;
                let goals = parseInt(match[3]) || 0;
                let assists = parseInt(match[4]) || 0;

                db.seasons[currentYear].squad.push({
                    name: name,
                    pos: "??", // Posição desconhecida pela IA
                    games: games,
                    goals: goals,
                    assists: assists,
                    badge: ""
                });
                count++;
            }
        }
    });

    if (count > 0) {
        saveData(); // Salva e atualiza UI
        alert(`Sucesso! ${count} jogadores encontrados. Verifique a lista abaixo para corrigir posições.`);
    } else {
        alert("A IA leu o texto, mas não encontrou o padrão 'Nome Jogos Gols'. Tente digitar manualmente.");
    }
}

// Funções de Save Gerais
window.saveGeneralData = function () {
    db.manager = document.getElementById('edt-manager').value;
    db.club = document.getElementById('edt-club').value;
    db.logo = document.getElementById('edt-logo').value;

    const s = db.seasons[currentYear];
    s.theme = document.getElementById('edt-color').value;
    s.matches = document.getElementById('edt-matches').value || 0;
    s.wins = document.getElementById('edt-wins').value || 0;
    s.draws = document.getElementById('edt-draws').value || 0;
    s.losses = document.getElementById('edt-losses').value || 0;
    s.gf = document.getElementById('edt-gf').value || 0;
    s.ga = document.getElementById('edt-ga').value || 0;
    s.confidence = document.getElementById('edt-conf').value || 50;

    saveData();
    alert("Dados Gerais Salvos com Sucesso!");
};

window.saveMVPImage = function () {
    db.mvpImage = document.getElementById('edt-mvp-img').value;
    saveData();
    alert("Foto do Craque Salva!");
};

window.addCompetition = function () {
    const n = document.getElementById('new-c-name').value;
    if (n) {
        db.seasons[currentYear].competitions.push({
            name: n,
            result: document.getElementById('new-c-result').value,
            isTitle: document.getElementById('new-c-title').checked
        });
        saveData();
        document.getElementById('new-c-name').value = '';
    }
};

window.addTransfer = function () {
    const n = document.getElementById('new-t-name').value;
    if (n) {
        db.seasons[currentYear].transfers[document.getElementById('new-t-type').value].push({
            name: n,
            team: document.getElementById('new-t-team').value,
            price: document.getElementById('new-t-price').value
        });
        saveData();
        document.getElementById('new-t-name').value = '';
    }
};

window.delItem = function (arr, i) {
    if (confirm('Tem certeza?')) {
        db.seasons[currentYear][arr].splice(i, 1);
        saveData();
    }
};

window.delTransfer = function (type, i) {
    if (confirm('Tem certeza?')) {
        db.seasons[currentYear].transfers[type].splice(i, 1);
        saveData();
    }
};