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

// Function to create site card HTML
function createSiteCard(site) {
    return `
        <a href="${site.url}" 
           class="card card-sm drop-shadow-sm hover:drop-shadow-xl duration-200">
            <div class="card-body items-center text-center p-4">
                <img src="${site.icon}" alt="${site.name}" class="w-8 h-8 mb-1">
                <h2 class="text-sm font-medium">${site.name}</h2>
            </div>
        </a>
    `;
}

async function getTopSites() {
    if (typeof browser !== 'undefined' && browser.topSites) {
        try {
            const sites = await browser.topSites.get({ limit: 5 });
            return sites.map(site => {
                const url = new URL(site.url);
                const hostname = url.hostname.replace('www.', '');
                const name = site.title || hostname.split('.')[0];
                return {
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    url: site.url,
                    icon: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
                };
            });
        } catch (e) {
            console.log('TopSites API not available:', e);
            return defaultSites;
        }
    }
    return defaultSites;
}

async function populateTopSites() {
    const topSitesContainer = document.getElementById('topSites');
    if (topSitesContainer) {
        const sites = await getTopSites();
        const siteCards = sites.map(site => createSiteCard(site)).join('');
        topSitesContainer.innerHTML = siteCards;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', populateTopSites);