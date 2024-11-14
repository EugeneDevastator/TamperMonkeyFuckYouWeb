// ==UserScript==
// @name         GitHub Custom Navigation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add custom navigation to GitHub repositories
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addCustomNavBar() {
        if (!window.location.pathname.match(/^\/[^\/]+\/[^\/]+/)) return;

        const [, orgName, repoName] = window.location.pathname.split('/');
        const rootUrl = `https://github.com/${orgName}/${repoName}`;

        // Check if the custom nav bar already exists
        if (document.getElementById('custom-github-nav')) return;

        const navBar = document.createElement('div');
        navBar.id = 'custom-github-nav';
        navBar.style.cssText = `
            width: 100%;
            background-color: #24292e;
            padding: 10px;
            display: flex;
            justify-content: center;
        `;

        const links = [
            { text: 'Root', url: rootUrl },
            { text: 'Branches', url: `${rootUrl}/branches` },
            { text: 'Pulls', url: `${rootUrl}/pulls` }
        ];

        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.text;
            a.style.cssText = `
                color: white;
                text-decoration: none;
                margin: 0 15px;
                font-weight: bold;
            `;
            navBar.appendChild(a);
        });

        // Find the main content container
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.parentNode.insertBefore(navBar, mainContent);
        }
    }

    // Run the function when the page loads
    addCustomNavBar();

    // Re-run the function when the URL changes (for single-page app navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            addCustomNavBar();
        }
    }).observe(document, {subtree: true, childList: true});

})();
