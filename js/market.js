window.renderTransfers = function(t) {
    // Função auxiliar para criar o Card Premium
    const renderCard = (item, type) => `
        <div class="t-card-new ${type}">
            <div class="t-main">
                <div class="t-icon-box">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="t-info">
                    <h4>${item.name}</h4>
                    <p>
                        <i class="fa-solid ${type === 'in' ? 'fa-arrow-left' : 'fa-arrow-right'}"></i> 
                        ${item.team}
                    </p>
                </div>
            </div>
            <div class="t-value ${type}">${item.price}</div>
        </div>
    `;

    const inList = document.getElementById('transfers-in');
    const outList = document.getElementById('transfers-out');

    // Renderiza Chegadas
    if (inList) {
        inList.innerHTML = t.in.length > 0 
            ? t.in.map(x => renderCard(x, 'in')).join('') 
            : '<div style="color:#666; padding:10px; font-style:italic;">Nenhuma contratação registrada.</div>';
    }

    // Renderiza Saídas
    if (outList) {
        outList.innerHTML = t.out.length > 0 
            ? t.out.map(x => renderCard(x, 'out')).join('') 
            : '<div style="color:#666; padding:10px; font-style:italic;">Nenhuma saída registrada.</div>';
    }
    
    // Lista do Admin (Simplificada para edição)
    const adminList = document.getElementById('admin-transfers-list');
    if (adminList) {
        const all = [...t.in.map((x, i) => ({ ...x, type: 'in', idx: i })), ...t.out.map((x, i) => ({ ...x, type: 'out', idx: i }))];
        
        adminList.innerHTML = all.length > 0 ? all.map(x => `
            <div class="edit-item">
                <span style="flex:1; font-size:0.85rem; color:${x.type == 'in' ? 'var(--accent-green)' : 'var(--accent-red)'}">
                    ${x.type == 'in' ? 'COMPRA' : 'VENDA'}: ${x.name}
                </span>
                <button class="btn-mini btn-del-mini" onclick="delTransfer('${x.type}', ${x.idx})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('') : '<div style="text-align:center; color:#444; font-size:0.8rem; margin-top:10px;">Sem movimentações.</div>';
    }
};