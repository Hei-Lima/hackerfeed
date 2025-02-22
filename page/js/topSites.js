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
    card.className = "card card-sm drop-shadow-sm hover:drop-shadow-xl duration-200";
    
    const cardBody = document.createElement('div');
    cardBody.className = "card-body items-center text-center p-4";
    
    const img = document.createElement('img');
    img.src = site.icon;
    img.alt = site.name;
    img.className = "w-8 h-8 mb-1";
    
    const title = document.createElement('h2');
    title.className = "text-sm font-medium";
    title.textContent = site.name;
    
    cardBody.appendChild(img);
    cardBody.appendChild(title);
    card.appendChild(cardBody);
    
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