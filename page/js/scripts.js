document.addEventListener('DOMContentLoaded', function() {
    const storiesContainer = document.getElementById('stories');

    // Função para buscar IDs das histórias populares
    async function fetchTopStories() {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const topStoriesIds = await response.json();
        return topStoriesIds.slice(0, 9); // Pegue apenas as 10 principais histórias
    }

    // Função para buscar os detalhes de uma história
    async function fetchStory(id) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        return response.json();
    }

    // Função para exibir uma história
    function displayStory(story) {
        const storyElement = document.createElement('div');
        storyElement.className = 'story-container';
        storyElement.innerHTML = `
            <h2><a href="${story.url}" target="_blank">${story.title}</a></h2>
            <p>by ${story.by}</p>
            <p>${story.descendants} comments</p>
        `;
        storiesContainer.appendChild(storyElement);
    }

    // Função principal para buscar e exibir as histórias
    async function displayTopStories() {
        let topStories = JSON.parse(localStorage.getItem('topStories'));
        const cacheTime = localStorage.getItem('cacheTime');
        const now = new Date().getTime();

        // Verifica se os dados estão no cache e se não estão desatualizados (1 hora)
        if (!topStories || !cacheTime || now - cacheTime > 3600000) {
            const topStoryIds = await fetchTopStories();
            topStories = [];
            for (const id of topStoryIds) {
                const story = await fetchStory(id);
                topStories.push(story);
            }
            localStorage.setItem('topStories', JSON.stringify(topStories));
            localStorage.setItem('cacheTime', now);
        }

        // Exibe as histórias do cache
        topStories.forEach(story => displayStory(story));
    }

    displayTopStories();
});