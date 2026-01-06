const DEFAULT_DB = {
    manager: "MANAGER NAME",
    club: "CLUB NAME",
    logo: "",
    mvpImage: "",
    currentSeason: "2026",
    seasons: {
        "2026": {
            club: "CLUB NAME", // Agora salva o clube DENTRO da temporada
            logo: "",
            theme: "#ccff00",
            matches: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, confidence: 80,
            competitions: [], squad: [], transfers: { in: [], out: [] }
        }
    }
};

let db = {};
let currentYear = "";

window.onload = () => {
    try { loadData(); updateUI(); }
    catch (e) { console.error(e); alert("Erro ao carregar. Resete o app se necessário."); }
};

function loadData() {
    const saved = localStorage.getItem('fc_hub_v19');
    db = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_DB));
    currentYear = db.currentSeason;
    if (!db.seasons[currentYear]) db.currentSeason = Object.keys(db.seasons)[0];
}

function saveData() {
    localStorage.setItem('fc_hub_v19', JSON.stringify(db));
    updateUI();
}

function updateUI() {
    const data = db.seasons[currentYear];

    // Header (Mostra sempre os dados da temporada ATUAL selecionada)
    // Se a temporada tiver um clube específico salvo, usa ele. Se não, usa o global.
    const displayClub = data.club || db.club;
    const displayLogo = data.logo || db.logo;

    document.getElementById('header-manager').innerText = db.manager;
    document.getElementById('header-club').innerText = displayClub;

    const logoImg = document.getElementById('header-logo');
    logoImg.src = (displayLogo && displayLogo.length > 5) ? displayLogo : `https://ui-avatars.com/api/?name=${displayClub.substring(0, 2)}&background=222&color=fff&size=128`;

    document.documentElement.style.setProperty('--primary', data.theme);

    // KPIs
    document.getElementById('kpi-matches').innerText = data.matches;
    document.getElementById('kpi-wins').innerText = data.wins;
    document.getElementById('kpi-losses').innerText = data.losses;

    // Dispara atualizações
    if (window.renderDashboard) renderDashboard(data);
    if (window.renderSquadList) renderSquadList(data.squad);
    if (window.renderTransfers) renderTransfers(data.transfers);
    if (window.renderCareerMode) renderCareerMode();
    if (window.fillAdmin) fillAdmin(data);

    updateSeasonSelect();
}

// Utils
function navigate(id) {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const btn = [...document.querySelectorAll('.nav-btn')].find(b => b.onclick.toString().includes(id));
    if (btn) btn.classList.add('active');
}

function updateSeasonSelect() {
    const s = document.getElementById('season-select');
    s.innerHTML = Object.keys(db.seasons).map(y => `<option value="${y}">${y}</option>`).join('');
    s.value = currentYear;
}

function createNewSeason() {
    const y = prompt("Ano da Nova Temporada:");
    if (y && !db.seasons[y]) {
        // Clona a estrutura padrão
        const newSeason = JSON.parse(JSON.stringify(DEFAULT_DB.seasons["2026"]));

        // Mantém o clube e logo atuais como ponto de partida (o usuário muda depois se trocar de time)
        newSeason.club = db.club;
        newSeason.logo = db.logo;
        newSeason.theme = db.seasons[currentYear].theme; // Mantém a cor também

        db.seasons[y] = newSeason;
        db.currentSeason = y;
        currentYear = y;
        saveData();
    }
}

function changeSeason(y) { db.currentSeason = y; currentYear = y; saveData(); }
function saveDataFile() { const a = document.createElement('a'); a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db)); a.download = "fc_save.json"; a.click(); }
function loadDataFile(i) { const r = new FileReader(); r.onload = e => { try { db = JSON.parse(e.target.result); saveData(); location.reload(); } catch (e) { alert("Erro"); } }; r.readAsText(i.files[0]); }
function resetApp() { if (confirm("Reset?")) { localStorage.removeItem('fc_hub_v19'); location.reload(); } }