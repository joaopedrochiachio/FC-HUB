window.generateNews = function() {
    const data = db.seasons[currentYear];
    const feed = document.getElementById('news-feed');
    const wins = parseInt(data.wins), matches = parseInt(data.matches);
    const winRate = wins / (matches || 1);
    let news = [];
    
    if(matches === 0) {
        news.push({source:"Clube", text:`Temporada ${currentYear} começando!`, type:"neutral"});
    } else if(winRate > 0.6) {
        news.push({source:"Globo Esporte", text:`O ${db.club} vive fase mágica!`, type:"good"});
    } else {
        news.push({source:"Corneta", text:`Torcida exige melhores resultados.`, type:"bad"});
    }
    feed.innerHTML = news.map(n => `<div class="news-item ${n.type}"><span class="news-source">${n.source}</span><div class="news-text">${n.text}</div></div>`).join('');
};