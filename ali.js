// ==UserScript==
// @name         AliExpress Custom Search with Orders and Cart
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add custom search bar to AliExpress with links to Orders and Cart
// @match        https://www.aliexpress.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addCustomSearchBar() {
        // Check if the custom search bar already exists
        if (document.getElementById('custom-aliexpress-search')) return;

        const searchBar = document.createElement('div');
        searchBar.id = 'custom-aliexpress-search';
        searchBar.style.cssText = `
            width: 100%;
            background-color: #ff4747;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter search term...';
        input.style.cssText = `
            width: 300px;
            padding: 5px;
            margin-right: 10px;
        `;

        const button = document.createElement('button');
        button.textContent = 'Search';
        button.style.cssText = `
            padding: 5px 10px;
            background-color: #fff;
            border: none;
            cursor: pointer;
            margin-right: 10px;
        `;

        const ordersLink = createLink('Orders', 'https://www.aliexpress.com/p/order/index.html');
        const cartLink = createLink('Cart', 'https://www.aliexpress.com/p/shoppingcart/index.html');

        button.addEventListener('click', performSearch);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        searchBar.appendChild(input);
        searchBar.appendChild(button);
        searchBar.appendChild(ordersLink);
        searchBar.appendChild(cartLink);

        document.body.insertBefore(searchBar, document.body.firstChild);
        document.body.style.marginTop = '50px';
    }

    function createLink(text, href) {
        const link = document.createElement('a');
        link.textContent = text;
        link.href = href;
        link.style.cssText = `
            color: #fff;
            text-decoration: none;
            margin-right: 10px;
            font-weight: bold;
        `;
        return link;
    }

    function performSearch() {
        const searchTerm = document.querySelector('#custom-aliexpress-search input').value;
        if (searchTerm) {
            const encodedSearchTerm = encodeURIComponent(searchTerm.replace(/\s+/g, '-'));
            window.location.href = `https://www.aliexpress.com/w/wholesale-${encodedSearchTerm}.html?spm=a2g0o.home.search.0`;
        }
    }

    // Run the function when the page loads
    addCustomSearchBar();

    // Re-run the function when the URL changes (for single-page app navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            addCustomSearchBar();
        }
    }).observe(document, {subtree: true, childList: true});

})();
