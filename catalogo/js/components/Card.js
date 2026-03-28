import { getYouTubeId, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../utils.js';

export function createCard(item) {
    const likeStorageKey = `mateus_streaming_like_${getYouTubeId(item.youtube)}`;

    const card = document.createElement('div');
    card.className = 'movie-card';
    if (item.progress) {
        card.classList.add('has-progress');
    }

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = `Movie cover`;

    const iframe = document.createElement('iframe');
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media";

    const videoId = getYouTubeId(item.youtube);

    card.appendChild(iframe);
    card.appendChild(img);

    const ageBadge = getRandomAgeBadge();

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-circle-play"></i></button>
                <button class="btn-icon btn-watch-later"><i class="fas fa-clock"></i></button>
                <button class="btn-icon btn-like-video" aria-label="Curtir video"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-circle-info"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <!--<span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getRandomDuration(item.progress)}</span>-->
            <span class="resolution">HD</span>
        </div>
        <div class="card-feedback" aria-live="polite"></div>
        <div class="details-tags">
            <span>Minecraft</span>
            <span>Roblox</span>
            <span>Diversos</span>
        </div>
    `;
    card.appendChild(details);

    const playButton = details.querySelector('.btn-play-icon');
    if (playButton) {
        playButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (item.youtube) {
                window.open(item.youtube, '_blank', 'noopener,noreferrer');
            }
        });
    }

    const watchLaterButton = details.querySelector('.btn-watch-later');
    if (watchLaterButton) {
        watchLaterButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (videoId) {
                const watchLaterUrl = `https://www.youtube.com/watch?v=${videoId}&list=WL`;
                window.open(watchLaterUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }

    const likeButton = details.querySelector('.btn-like-video');
    const feedbackMessage = details.querySelector('.card-feedback');
    let feedbackTimeout;

    const showFeedback = (message) => {
        if (!feedbackMessage) return;

        clearTimeout(feedbackTimeout);
        feedbackMessage.textContent = message;
        feedbackMessage.classList.add('is-visible');

        feedbackTimeout = setTimeout(() => {
            feedbackMessage.classList.remove('is-visible');
        }, 1400);
    };

    const updateLikeButton = () => {
        const isLiked = localStorage.getItem(likeStorageKey) === 'true';
        if (!likeButton) return;

        likeButton.classList.toggle('is-active', isLiked);
        likeButton.setAttribute('aria-pressed', String(isLiked));
        likeButton.setAttribute('title', isLiked ? 'Video curtido' : 'Curtir video');
    };

    updateLikeButton();

    if (likeButton) {
        likeButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isLiked = localStorage.getItem(likeStorageKey) === 'true';
            localStorage.setItem(likeStorageKey, String(!isLiked));
            updateLikeButton();
            showFeedback(!isLiked ? 'Curtido' : 'Curtida removida');
        });
    }


    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`;
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    let playTimeout;
    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        playTimeout = setTimeout(() => {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout);
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = "";
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    return card;
}
