let chart = null;
const TROPHY_IMAGES = {
    "brasileirão": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Trofeu_cbf_brasileirao.png/170px-Trofeu_cbf_brasileirao.png",
    "libertadores": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Trofeo_Copa_Libertadores.png/200px-Trofeo_Copa_Libertadores.png",
    "copa do brasil": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Copa_do_Brasil_de_Futebol_Trophy.png/180px-Copa_do_Brasil_de_Futebol_Trophy.png",
    "default": "https://cdn-icons-png.flaticon.com/512/3112/3112946.png"
};

window.renderDashboard = function (data) {
    // MVP
    const name = document.getElementById('mvp-name');
    const stats = document.getElementById('mvp-stats');
    const list = document.getElementById('top-players-list');
    const mvpImg = document.getElementById('mvp-img');
    const mvpPlace = document.getElementById('mvp-placeholder');

    // Imagem
    if (db.mvpImage && db.mvpImage.length > 5) {
        mvpImg.src = db.mvpImage; mvpImg.style.display = 'block'; mvpPlace.style.display = 'none';
    } else {
        mvpImg.style.display = 'none'; mvpPlace.style.display = 'block';
    }

    if (data.squad.length > 0) {
        const sorted = [...data.squad].sort((a, b) => (parseInt(b.goals) + parseInt(b.assists)) - (parseInt(a.goals) + parseInt(a.assists)));
        const mvp = sorted[0];
        name.innerText = mvp.name;
        stats.innerText = `${mvp.goals} Gols | ${mvp.assists} Assis`;

        list.innerHTML = sorted.slice(1, 4).map((p, i) => `
            <div class="rank-row">
                <span><span class="rank-hl">#${i + 2}</span> ${p.name}</span>
                <span class="rank-hl">${parseInt(p.goals) + parseInt(p.assists)}</span>
            </div>
        `).join('');
    } else {
        name.innerText = "-"; stats.innerText = "0 | 0"; list.innerHTML = "<small>Vazio</small>";
    }

    // Gráfico
    const ctx = document.getElementById('goalsChart');
    const diff = parseInt(data.gf) - parseInt(data.ga);
    document.getElementById('goal-diff').innerText = diff > 0 ? `+${diff}` : diff;

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Pró', 'Contra'], datasets: [{ data: [data.gf, data.ga], backgroundColor: ['#00ff88', '#ff3333'], borderWidth: 0 }] },
        options: { responsive: true, cutout: '85%', plugins: { legend: { display: false } } }
    });

    // Troféus e Comps
    const tList = document.getElementById('trophy-room');
    const cList = document.getElementById('comps-list');
    tList.innerHTML = ""; cList.innerHTML = "";

    data.competitions.forEach(c => {
        cList.innerHTML += `<div class="comp-row"><span>${c.name}</span><span class="comp-res ${c.isTitle ? 'gold' : ''}">${c.result}</span></div>`;
        if (c.isTitle) {
            let imgUrl = TROPHY_IMAGES["default"];
            const lower = c.name.toLowerCase();
            if (lower.includes("brasil") || lower.includes("série a")) imgUrl = TROPHY_IMAGES["brasileirão"];
            else if (lower.includes("liberta")) imgUrl = TROPHY_IMAGES["libertadores"];
            else if (lower.includes("copa do brasil")) imgUrl = TROPHY_IMAGES["copa do brasil"];
            tList.innerHTML += `<div class="trophy-item"><img src="${imgUrl}"><span class="trophy-name">${c.name}</span></div>`;
        }
    });
};