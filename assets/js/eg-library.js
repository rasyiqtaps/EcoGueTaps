/* Modul ui: Eco Library, detail artikel, filter, dan Contact (demo). */
(function () {
    'use strict';
    var articles = window.EcoGueTapsArticles || [];
    var $ = function (id) { return document.getElementById(id); };
    var listing = $('eg-library-cards');
    if (!listing) { return; }
    var selected = 'Semua';
    var categories = ['Semua'].concat(Array.from(new Set(articles.map(function (a) { return a.category; }))));
    var dialog = $('eg-article-dialog');
    var body = $('eg-article-body');

    function el(tag, className, content) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (content !== undefined) { node.textContent = content; }
        return node;
    }
    function renderCategories() {
        var wrap = $('eg-library-filters');
        wrap.replaceChildren();
        categories.forEach(function (category) {
            var button = el('button', 'eg-ui-filter' + (category === selected ? ' is-active' : ''), category);
            button.type = 'button';
            button.dataset.category = category;
            button.setAttribute('aria-pressed', String(category === selected));
            wrap.append(button);
        });
    }
    function createArticleCard(a) {
        var card = el('article', 'eg-ui-article eg-ui-glass');
        var art = el('div', 'eg-ui-article__art eg-tone-' + a.tone);
        art.setAttribute('aria-hidden', 'true');
        art.append(el('span', '', a.icon));
        card.append(art, el('span', 'eg-ui-article__category', a.category));
        card.append(el('h3', '', a.title), el('p', 'eg-ui-article__summary', a.summary));
        var foot = el('div', 'eg-ui-article__foot');
        foot.append(el('span', '', a.minutes + ' menit baca'));
        var button = el('button', 'eg-ui-open', 'Baca Cerita  →');
        button.type = 'button';
        button.dataset.article = a.id;
        foot.append(button);
        card.append(foot);
        return card;
    }
    function renderArticles() {
        var term = $('eg-library-search').value.trim().toLocaleLowerCase('id-ID');
        var matches = articles.filter(function (a) {
            var fitsCategory = selected === 'Semua' || a.category === selected;
            var fitsSearch = [a.title, a.category, a.summary].join(' ').toLocaleLowerCase('id-ID').includes(term);
            return fitsCategory && fitsSearch;
        });
        listing.replaceChildren();
        matches.forEach(function (a) { listing.append(createArticleCard(a)); });
        $('eg-library-count').textContent = matches.length + ' artikel ditemukan';
        $('eg-library-empty').hidden = matches.length !== 0;
    }
    function openArticle(id) {
        var article = articles.find(function (a) { return a.id === id; });
        if (!article) { return; }
        body.replaceChildren();
        body.append(el('span', 'eg-ui-article__category', article.category));
        var heading = el('h3', '', article.title);
        heading.id = 'eg-article-title';
        body.append(heading, el('p', 'eg-ui-reading-time', article.minutes + ' menit baca'));
        article.paragraphs.forEach(function (p) { body.append(el('p', 'eg-ui-reading-paragraph', p)); });
        var tip = el('p', 'eg-ui-article-note', 'Konten edukasi umum. Pendampingan orang dewasa disarankan untuk aktivitas anak.');
        body.append(tip);
        if (typeof dialog.showModal === 'function') { dialog.showModal(); }
        else { dialog.setAttribute('open', ''); }
    }
    $('eg-library-filters').addEventListener('click', function (e) {
        var button = e.target.closest('[data-category]');
        if (!button) { return; }
        selected = button.dataset.category;
        renderCategories();
        renderArticles();
    });
    $('eg-library-search').addEventListener('input', renderArticles);
    listing.addEventListener('click', function (e) {
        var button = e.target.closest('[data-article]');
        if (button) { openArticle(button.dataset.article); }
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) { dialog.close(); } });

    renderCategories();
    renderArticles();
})();
