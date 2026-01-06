window.renderSquadList = function (squad) {
    const tbody = document.getElementById('squad-body');
    if (tbody) {
        tbody.innerHTML = [...squad].sort((a, b) => (parseInt(b.goals) + parseInt(b.assists)) - (parseInt(a.goals) + parseInt(a.assists))).map(p => `
            <tr>
                <td><span style="background:#222; padding:2px 5px; border-radius:4px; font-size:0.7rem">${p.pos}</span></td>
                <td>${p.name} ${p.badge ? `<span class="player-badge">${p.badge}</span>` : ''}</td>
                <td class="text-center">${p.games}</td>
                <td class="text-center c-green">${p.goals}</td>
                <td class="text-center c-blue">${p.assists}</td>
                <td class="text-center" style="font-weight:800; color:#fff">${parseInt(p.goals) + parseInt(p.assists)}</td>
            </tr>
        `).join('');
    }

    // Admin List (Sem ordenação)
    const adminList = document.getElementById('admin-squad-list');
    if (adminList) {
        adminList.innerHTML = squad.map((p, i) => `
            <div class="editor-row" id="row-${i}">
                <input type="text" class="edt-name" value="${p.name}">
                <input type="text" class="edt-pos center" value="${p.pos}">
                <input type="number" class="edt-j center" value="${p.games}">
                <input type="number" class="edt-g center" value="${p.goals}" style="color:var(--accent-green)">
                <input type="number" class="edt-a center" value="${p.assists}" style="color:var(--accent-blue)">
                <input type="text" class="edt-badge center" value="${p.badge || ''}" placeholder="-">
                <div class="editor-actions">
                    <button class="btn-icon btn-save-row" onclick="updatePlayer(${i})"><i class="fa-solid fa-check"></i></button>
                    <button class="btn-icon btn-del-row" onclick="delItem('squad', ${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
};