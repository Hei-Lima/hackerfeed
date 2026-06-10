// Define top sites data
const defaultSites = [
    {
        name: 'GitHub',
        url: 'https://github.com',
        icon: 'https://github.com/favicon.ico',
        color: '#24292e'
    },
    {
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        icon: 'https://stackoverflow.com/favicon.ico',
        color: '#f48024'
    },
    {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        icon: 'https://developer.mozilla.org/favicon.ico',
        color: '#000000'
    },
    {
        name: 'Dev.to',
        url: 'https://dev.to',
        icon: 'https://dev.to/favicon.ico',
        color: '#0a0a0a'
    },
    {
        name: 'Gitlab',
        url: 'https://gitlab.com',
        icon: 'https://gitlab.com/favicon.ico',
        color: '#0a0a0a'
    }
];

function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAnklEQVQ4jWNgGDTg/3/d/zCMTw6nGmI1g9ggvWADYGx0cZghIHEYBomD5EBqwQYg24BNM7IhMM0wA5DFwAbANKNrRjaEgYGBgfE/EQCnGnQXYNOMbAheF+DTjOydb/9xAGQ16C5AVQwHonAXoIcDLs0YLkDXjM0QDANwacZmCNwAXJqRDYEbgEszsiFwA/BpRjYEbgAJmgcnAADh0mcjz+91dwAAAABJRU5ErkJggg==';
    }
}

// Function to create site card HTML
function createSiteCard(site) {
    const card = document.createElement('a');
    card.href = site.url;
    card.className = "group flex flex-col items-center select-none w-full transition-all duration-300 hover:-translate-y-1";

    const img = document.createElement('img');
    img.src = site.icon;
    img.alt = site.name;
    img.className = "w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md";
    img.onerror = function() {
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="%239ca3af"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
    };

    const title = document.createElement('span');
    title.className = "text-xs font-semibold mt-2.5 truncate text-center max-w-[6.5rem] text-secondary group-hover:text-primary transition-colors duration-200";
    title.textContent = site.name;

    card.appendChild(img);
    card.appendChild(title);

    return card;
}

async function getTopSites() {
    try {
        if (typeof chrome !== 'undefined' && chrome.topSites) {
            const sites = await new Promise((resolve, reject) => {
                chrome.topSites.get((result) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result);
                    }
                });
            });

            return sites.slice(0, 5).map(site => ({
                name: site.title || new URL(site.url).hostname.replace('www.', ''),
                url: site.url,
                icon: getFaviconUrl(site.url)
            }));
        } else if (typeof browser !== 'undefined' && browser.topSites) {
            const sites = await browser.topSites.get();
            return sites.slice(0, 5).map(site => ({
                name: site.title || new URL(site.url).hostname.replace('www.', ''),
                url: site.url,
                icon: getFaviconUrl(site.url)
            }));
        }

        console.log('No TopSites API available, using defaults');
        return defaultSites;
    } catch (e) {
        console.error('Error getting top sites:', e);
        return defaultSites;
    }
}

async function populateTopSites() {
    const topSitesContainer = document.getElementById('topSites');
    if (!topSitesContainer) return;

    try {
        const sites = await getTopSites();
        topSitesContainer.textContent = '';
        sites.forEach(site => {
            const card = createSiteCard(site);
            topSitesContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error populating top sites:', error);
        // Fallback to default sites if there's an error
        defaultSites.forEach(site => {
            const card = createSiteCard(site);
            topSitesContainer.appendChild(card);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateTopSites);
} else {
    populateTopSites();
}