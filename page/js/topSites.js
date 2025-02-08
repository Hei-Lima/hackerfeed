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
    if (typeof chrome !== 'undefined' && chrome.topSites) {
        try {
            const sites = await chrome.topSites.get();
            return sites.slice(0, 5).map(site => {
                const url = new URL(site.url);
                const hostname = url.hostname.replace('www.', '');
                const name = site.title || hostname.split('.')[0];
                return {
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    url: site.url,
                    icon: getFaviconUrl(site.url)
                };
            });
        } catch (e) {
            console.log('Chrome TopSites API error:', e);
            return defaultSites;
        }
    }
    console.log('Using default sites');
    return defaultSites;
}

async function populateTopSites() {
    const topSitesContainer = document.getElementById('topSites');
    if (topSitesContainer) {
        const sites = await getTopSites();
        // Clear existing content
        topSitesContainer.textContent = '';
        // Append each card directly
        sites.forEach(site => {
            const card = createSiteCard(site);
            topSitesContainer.appendChild(card);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', populateTopSites);