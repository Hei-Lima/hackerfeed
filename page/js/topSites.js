document.addEventListener('DOMContentLoaded', function() {
    const topSitesList = document.getElementById('top-sites-list');

    // Function to fetch top sites
    async function fetchTopSites() {
        const topSites = await browser.topSites.get();
        return topSites.slice(0, 5); // Get only the top 5 sites
    }

    // Function to display top sites
    function displayTopSites(sites) {
        sites.forEach(site => {
            const siteItem = document.createElement('li');
    
            const siteFavicon = document.createElement('img');
            siteFavicon.src = site.favicon || `https://www.google.com/s2/favicons?domain=${site.url}`;
            siteFavicon.alt = `${site.title || site.url} favicon`;
    
            const siteLink = document.createElement('a');
            siteLink.href = site.url;
            siteLink.target = '_blank';
            siteLink.textContent = site.title || site.url;
    
            siteItem.appendChild(siteFavicon);
            siteItem.appendChild(siteLink);
            topSitesList.appendChild(siteItem);
        });
    }
    
    // Fetch and display top sites on load
    fetchTopSites().then(displayTopSites);
});