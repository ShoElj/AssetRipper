document.getElementById('fetchAssetsButton').addEventListener('click', fetchAssets);
document.getElementById('filter').addEventListener('change', filterAssets);
document.getElementById('sort').addEventListener('change', sortAssets);
document.getElementById('searchInput').addEventListener('input', searchAssets);

async function fetchAssets() {
    const url = document.getElementById('urlInput').value;
    const response = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    const data = await response.json();
    displayAssets(data.images, data.videos);
}

function displayAssets(images, videos) {
    const container = document.getElementById('imagesContainer');
    container.innerHTML = '';

    images.forEach(src => {
        const imgDiv = document.createElement('div');
        const img = document.createElement('img');
        img.src = src;
        imgDiv.appendChild(img);
        container.appendChild(imgDiv);
    });

    videos.forEach(src => {
        const videoDiv = document.createElement('div');
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        videoDiv.appendChild(video);
        container.appendChild(videoDiv);
    });
}

function filterAssets() {
    const type = document.getElementById('filter').value;
    const images = document.querySelectorAll('#imagesContainer img');
    const videos = document.querySelectorAll('#imagesContainer video');
    
    images.forEach(img => {
        if (type === 'all' || img.src.endsWith(type)) {
            img.parentElement.style.display = '';
        } else {
            img.parentElement.style.display = 'none';
        }
    });

    videos.forEach(video => {
        if (type === 'all' || video.src.endsWith(type)) {
            video.parentElement.style.display = '';
        } else {
            video.parentElement.style.display = 'none';
        }
    });
}

function sortAssets() {
    const sortType = document.getElementById('sort').value;
    const container = document.getElementById('imagesContainer');
    const assets = Array.from(container.children);

    assets.sort((a, b) => {
        const aSrc = a.querySelector('img') ? a.querySelector('img').src : a.querySelector('video').src;
        const bSrc = b.querySelector('img') ? b.querySelector('img').src : b.querySelector('video').src;

        if (sortType === 'size') {
            const aSize = a.querySelector('img') ? a.querySelector('img').naturalWidth : a.querySelector('video').videoWidth;
            const bSize = b.querySelector('img') ? b.querySelector('img').naturalWidth : b.querySelector('video').videoWidth;
            return bSize - aSize;
        } else if (sortType === 'name') {
            return aSrc.localeCompare(bSrc);
        }
    });

    assets.forEach(assetDiv => container.appendChild(assetDiv));
}

function searchAssets() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const images = document.querySelectorAll('#imagesContainer img');
    const videos = document.querySelectorAll('#imagesContainer video');
    
    images.forEach(img => {
        if (img.src.toLowerCase().includes(query)) {
            img.parentElement.style.display = '';
        } else {
            img.parentElement.style.display = 'none';
        }
    });

    videos.forEach(video => {
        if (video.src.toLowerCase().includes(query)) {
            video.parentElement.style.display = '';
        } else {
            video.parentElement.style.display = 'none';
        }
    });
}
