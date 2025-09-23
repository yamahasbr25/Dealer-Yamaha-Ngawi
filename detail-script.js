document.addEventListener('DOMContentLoaded', function() {
    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');
    const params = new URLSearchParams(window.location.search);
    const keywordFromQuery = params.get('q') || '';
    const keyword = keywordFromQuery.replace(/-/g, ' ').trim();
    
    function capitalizeEachWord(str) { if (!str) return ''; return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }
    function generateSeoTitle(baseKeyword) { const hookWords = ['Promo Yamaha Madiun', 'Promo Yamaha Ngawi', 'Promo Yamaha Caruban', 'Dealer Yamaha Madiun', 'Promo Yamaha Magetan', 'Dealer Yamaha Ngawi', 'Dealer Yamaha Caruban', 'Dealer Yamaha Magetan', 'Yamaha Motor Ngawi', 'Yamaha Motor Madiun', 'Yamaha Motor Magetan', 'Yamaha Motor Caruban', 'Dealer Yamaha Motor Ngawi', 'Dealer Yamaha Motor Madiun', 'Dealer Yamaha Motor Caruban', 'Dealer Yamaha Motor Magetan', 'Harga Motor Yamaha Ngawi', 'Harga Motor Yamaha Madiun', 'Harga Motor Yamaha Magetan', 'Harga Motor Yamaha Caruban', 'Yamaha SBR Ngawi', 'Yamaha SBR Madiun', 'Yamaha SBR Magetan', 'Yamaha SBR Caruban', 'Brosur Kredit Motor Yamaha Ngawi', 'Brosur Kredit Motor Yamaha Madiun', 'Brosur Kredit Motor Yamaha Caruban', 'Brosur Kredit Motor Yamaha Magetan']; const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)]; const randomNumber = Math.floor(Math.random() * (50 - 10 + 1)) + 10; const capitalizedKeyword = capitalizeEachWord(baseKeyword); return `${randomHook} ${capitalizedKeyword}`; }

    // ▼▼▼ FUNGSI BARU: Untuk memproses Spintax {a|b|c} ▼▼▼
    function processSpintax(text) {
        const spintaxPattern = /{([^{}]+)}/g;
        while (spintaxPattern.test(text)) {
            text = text.replace(spintaxPattern, (match, choices) => {
                const options = choices.split('|');
                return options[Math.floor(Math.random() * options.length)];
            });
        }
        return text;
    }

    if (!keyword) { detailTitle.textContent = 'Recipe Not Found'; detailBody.innerHTML = '<p>Sorry, the requested recipe could not be found. Please return to the <a href="index.html">homepage</a>.</p>'; if (relatedPostsContainer) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; } return; }

    function populateMainContent(term) {
        const newTitle = generateSeoTitle(term);
        const capitalizedTermForArticle = capitalizeEachWord(term);
        document.title = `${newTitle} | RecipeFiesta`;
        detailTitle.textContent = newTitle;

        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(term)}&w=1200&h=800&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
        detailImageContainer.innerHTML = `<img src="${imageUrl}" alt="${newTitle}">`;

        // ▼▼▼ ARTIKEL BARU: Template artikel dengan format Spintax ▼▼▼
        const spintaxArticleTemplate = `
            <p>TERMURAH! Beli Yamaha Sekarang, Hemat Besar! wa 089657404440 </p>

 <p>Melayani:</p>
 <p>✅ Pembelian cash / kredit</p>
 <p>✅ Tukar tambah motor</p>

 <p>Syarat kredit:  Cukup kirim KTP + KK, prosses ACC motor kami kirim kerumah Anda.</p>

 <p>✅ Tanya-tanya dulu boleh wa 089657404440</p>
 <p>✅ Tidak bisa datang ke dealer? Tenang, bisa janjian di tempat / rumah.</p>

 <p>Bonus:</p>
 <p>✅ Helem</p>
 <p>✅ 4x service gratis</p>
 <p>✅ 1x ganti oli gratis</p>
 <p>✅ Jas hujan, pompa portabel, p3k</p>

 <p>CATATAN: Harga promo sewaktu-waktu bisa berubah</p>
        `;

        // Proses Spintax dan tampilkan hasilnya
        detailBody.innerHTML = processSpintax(spintaxArticleTemplate);
    }

    function generateRelatedPosts(term) {
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleRelatedSuggest&hl=en&client=firefox&q=${encodeURIComponent(term)}`;
        document.head.appendChild(script);
        script.onload = () => script.remove();
        script.onerror = () => { relatedPostsContainer.innerHTML = '<div class="loading-placeholder">Could not load related recipes.</div>'; script.remove(); }
    }

    window.handleRelatedSuggest = function(data) {
        const suggestions = data[1];
        relatedPostsContainer.innerHTML = '';
        if (!suggestions || suggestions.length === 0) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; return; }
        const originalKeyword = keyword.toLowerCase();
        let relatedCount = 0;
        suggestions.forEach(relatedTerm => {
            if (relatedTerm.toLowerCase() === originalKeyword || relatedCount >= 11) return;
            relatedCount++;
            const keywordForUrl = relatedTerm.replace(/\s/g, '-').toLowerCase();
            const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;
            
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(relatedTerm)}&w=600&h=900&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
            const newRelatedTitle = generateSeoTitle(relatedTerm);
            const card = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newRelatedTitle}" loading="lazy"><div class="content-card-body"><h3>${newRelatedTitle}</h3></div></a></article>`;
            relatedPostsContainer.innerHTML += card;
        });
        if (relatedCount === 0) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; }
    };

    populateMainContent(keyword);
    generateRelatedPosts(keyword);
});
