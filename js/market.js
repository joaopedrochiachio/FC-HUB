window.renderTransfers = function(t) {
    const renderCard = (item, type) => `<div class="trans-card ${type}"><div class="tc-info"><strong>${item.name}</strong><span>${item.team}</span></div><div class="tc-price ${type}">${item.price}</div></div>`;
    document.getElementById('transfers-in').innerHTML = t.in.length ? t.in.map(x => renderCard(x, 'in')).join('') : '<small>Vazio</small>';
    document.getElementById('transfers-out').innerHTML = t.out.length ? t.out.map(x => renderCard(x, 'out')).join('') : '<small>Vazio</small>';
    
    const adminList = document.getElementById('admin-transfers-list');
    if(adminList) {
        const all = [...t.in.map((x,i)=>({...x, type:'in', idx:i})), ...t.out.map((x,i)=>({...x, type:'out', idx:i}))];
        adminList.innerHTML = all.map(x => `
            <div class="edit-item">
                <span style="flex:1; color:${x.type=='in'?'#0f0':'#f00'}">${x.name}</span>
                <button class="btn-mini btn-del-mini" onclick="delTransfer('${x.type}', ${x.idx})">X</button>
            </div>
        `).join('');
    }
};