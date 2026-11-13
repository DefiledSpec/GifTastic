const APIKey = 'p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6';
const SEARCH_URL = 'https://api.giphy.com/v1/gifs/search';
const TRENDING_URL = 'https://api.giphy.com/v1/gifs/trending';

const gifContainer = $('.gifContainer');
const btnContainer = $('.btnGroup');
const usersBtnContainer = $('.usersButtons');
const $resultsTotal = $('#resultsTotal');
const $activeTitle = $('#active-topic-title span');
const $copyright = $('#copyright');
const $loadMoreBtn = $('#loadMoreBtn');

const presetBtns = [
    'Paul Rudd', 'Donald Trump', 'Chris Pratt',
    'Nick Offerman', 'Tina Fey', 'John Krasinski', 'Will Ferrell'
];

let currentGifs = [];
let currentTopic = 'Tina Fey';
let currentMode = 'search';
let currentOffset = 0;
const LIMIT = 24;

let usersButtons = JSON.parse(localStorage.getItem('buttons'));
if (!Array.isArray(usersButtons)) {
    usersButtons = ['Will Ferrell'];
    localStorage.setItem('buttons', JSON.stringify(usersButtons));
}

let favoriteGifs = JSON.parse(localStorage.getItem('favoriteGifs')) || [];

function updateFavCount() {
    $('#favCount').text(favoriteGifs.length);
}

function displayButtons(activeQuery = currentTopic) {
    usersBtnContainer.empty();
    if (usersButtons.length === 0) {
        usersBtnContainer.append('<span class="empty-hint">No saved buttons yet. Add one above!</span>');
    } else {
        usersButtons.forEach(btn => {
            const isActive = currentMode === 'search' && btn.toLowerCase() === activeQuery.toLowerCase() ? 'active-btn' : '';
            const pill = $('<div>').addClass(`user-btn-pill ${isActive}`);
            const topicBtn = $('<button>').attr('type', 'button').addClass('gifBtn').attr('data-content', btn).text(btn);
            const removeBtn = $('<button>').attr('type', 'button').addClass('delete-topic-btn').attr('data-content', btn).html('&times;');
            pill.append(topicBtn, removeBtn);
            usersBtnContainer.append(pill);
        });
    }

    btnContainer.empty();
    presetBtns.forEach(btn => {
        const isActive = currentMode === 'search' && btn.toLowerCase() === activeQuery.toLowerCase() ? 'active-btn' : '';
        btnContainer.append(
            $('<button>').attr('type', 'button').addClass(`gifBtn preset-pill ${isActive}`).attr('data-content', btn).text(btn)
        );
    });
}

function fetchGifs({ mode = 'search', query = currentTopic, append = false } = {}) {
    currentMode = mode;
    if (!append) {
        currentOffset = 0;
        currentGifs = [];
        gifContainer.html('<div class="loader">Fetching GIFs from GIPHY...</div>');
        $('#toggleAllBtn').text('Play All');
    } else {
        $loadMoreBtn.text('Loading...').prop('disabled', true);
    }

    if (mode === 'trending') {
        $activeTitle.text('🔥 Trending Now');
        displayButtons('');
        $('#trendingBtn').addClass('active-mode');
        $('#favoritesViewBtn').removeClass('active-mode');
    } else {
        currentTopic = query;
        $activeTitle.text(query);
        displayButtons(query);
        $('#trendingBtn').removeClass('active-mode');
        $('#favoritesViewBtn').removeClass('active-mode');
    }

    const endpoint = mode === 'trending' ? TRENDING_URL : SEARCH_URL;
    const params = { limit: LIMIT, offset: currentOffset, api_key: APIKey, key: APIKey };
    if (mode === 'search') params.q = query.trim();

    $.ajax({ url: `${endpoint}?${$.param(params)}`, method: 'GET' })
        .then(res => {
            const newBatch = res.data || [];
            if (!append && newBatch.length === 0) throw new Error(`No GIFs found for "${query}"`);
            currentGifs = append ? currentGifs.concat(newBatch) : newBatch;
            currentOffset += newBatch.length;
            renderFilteredGifs();
            $loadMoreBtn.toggle(newBatch.length === LIMIT).text('Load More GIFs').prop('disabled', false);
        })
        .catch(err => {
            if (!append) {
                gifContainer.html(`<div class="empty-state">${err.message}</div>`);
                $resultsTotal.text('0');
            }
            $loadMoreBtn.hide().text('Load More GIFs').prop('disabled', false);
        });
}

function renderFilteredGifs() {
    const selectedRating = $('#ratingFilter').val();
    const sourceList = currentMode === 'favorites' ? favoriteGifs : currentGifs;
    gifContainer.empty();
    let displayedCount = 0;

    sourceList.forEach(gif => {
        const rating = (gif.rating || 'g').toLowerCase();
        const isAllowedRating = rating === 'g' || rating === 'pg';
        const matchesFilter = selectedRating === 'all' || rating === selectedRating;

        if (isAllowedRating && matchesFilter) {
            displayedCount++;
            const isFav = favoriteGifs.some(f => f.id === gif.id);
            const card = $('<div>').addClass('gif-card');

            const imgWrapper = $('<div>').addClass('img-wrapper');
            const gifImg = $('<img>').attr({
                src: gif.images.downsized_still.url,
                alt: gif.title || 'GIPHY GIF',
                loading: 'lazy',
                'data-still': gif.images.downsized_still.url,
                'data-animate': gif.images.downsized.url,
                'data-state': 'still'
            }).addClass('gifImg');

            const badge = $('<span>').addClass('play-badge').text('GIF');
            const expandBtn = $('<button>').attr('type', 'button').addClass('expand-btn').data('gif', gif).html('⤢');
            imgWrapper.append(gifImg, badge, expandBtn);

            const meta = $('<div>').addClass('card-meta');
            const leftMeta = $('<div>').addClass('meta-left');
            const ratingPill = $('<span>').addClass('rating-pill').text(rating.toUpperCase());
            const favBtn = $('<button>').attr('type', 'button').addClass(`fav-btn ${isFav ? 'is-fav' : ''}`).data('gif', gif).html(isFav ? '♥' : '♡');
            leftMeta.append(ratingPill, favBtn);

            const actions = $('<div>').addClass('card-actions');
            const copyBtn = $('<button>').attr('type', 'button').addClass('copy-btn').attr('data-url', gif.images.original.url).text('Copy');
            const link = $('<a>').attr({ href: gif.url, target: '_blank', rel: 'noopener noreferrer' }).text('GIPHY ↗');
            actions.append(copyBtn, link);

            meta.append(leftMeta, actions);
            card.append(imgWrapper, meta);
            gifContainer.append(card);
        }
    });

    if (displayedCount === 0) {
        const msg = currentMode === 'favorites'
            ? 'No saved GIFs yet. Click the ♡ on any card to save it!'
            : 'No GIFs match this rating filter.';
        gifContainer.html(`<div class="empty-state">${msg}</div>`);
    }
    $resultsTotal.text(displayedCount);
}

(function () {
    updateFavCount();
    displayButtons(currentTopic);
    fetchGifs({ mode: 'search', query: currentTopic });
    $copyright.html(`&copy; Copyright 2018 - ${new Date().getFullYear()}`);
})();

$('#add-topic-form').on('submit', function (e) {
    e.preventDefault();
    const input = $('#addBtnText');
    const btnContent = input.val().trim();
    if (!btnContent) return;
    if (!usersButtons.some(b => b.toLowerCase() === btnContent.toLowerCase())) {
        usersButtons.push(btnContent);
        localStorage.setItem('buttons', JSON.stringify(usersButtons));
    }
    input.val('');
    fetchGifs({ mode: 'search', query: btnContent });
});

$(document).on('click', '.gifBtn', function () {
    fetchGifs({ mode: 'search', query: $(this).attr('data-content') });
});

$(document).on('click', '.delete-topic-btn', function (e) {
    e.stopPropagation();
    const toRemove = $(this).attr('data-content');
    usersButtons = usersButtons.filter(b => b !== toRemove);
    localStorage.setItem('buttons', JSON.stringify(usersButtons));
    displayButtons();
});

$('#trendingBtn').on('click', () => fetchGifs({ mode: 'trending' }));

$('#favoritesViewBtn').on('click', function () {
    currentMode = 'favorites';
    $activeTitle.text('♥ Saved Favorites');
    displayButtons('');
    $('#favoritesViewBtn').addClass('active-mode');
    $('#trendingBtn').removeClass('active-mode');
    $loadMoreBtn.hide();
    renderFilteredGifs();
});

$('#loadMoreBtn').on('click', () => fetchGifs({ mode: currentMode, query: currentTopic, append: true }));

$(document).on('click', '.img-wrapper', function (e) {
    if ($(e.target).closest('.expand-btn').length) return;
    const wrapper = $(this);
    const gif = wrapper.find('.gifImg');
    const isStill = gif.attr('data-state') === 'still';
    gif.attr('src', isStill ? gif.attr('data-animate') : gif.attr('data-still'));
    gif.attr('data-state', isStill ? 'playing' : 'still');
    wrapper.toggleClass('is-playing', isStill);
});

$(document).on('click', '.fav-btn', function () {
    const btn = $(this);
    const gif = btn.data('gif');
    const idx = favoriteGifs.findIndex(f => f.id === gif.id);
    if (idx > -1) {
        favoriteGifs.splice(idx, 1);
        btn.removeClass('is-fav').html('♡');
        if (currentMode === 'favorites') renderFilteredGifs();
    } else {
        favoriteGifs.unshift(gif);
        btn.addClass('is-fav').html('♥');
    }
    localStorage.setItem('favoriteGifs', JSON.stringify(favoriteGifs));
    updateFavCount();
});

$(document).on('click', '.expand-btn', function (e) {
    e.stopPropagation();
    const gif = $(this).data('gif');
    $('#modalImg').attr('src', gif.images.original.url);
    $('#modalTitle').text(gif.title || 'Untitled GIF');
    $('#modalMeta').text(`${(gif.rating || 'g').toUpperCase()} • ${gif.images.original.width}×${gif.images.original.height}`);
    $('#modalCopyBtn').attr('data-url', gif.images.original.url).text('Copy Direct Link');
    $('#modalGiphyLink').attr('href', gif.url);
    $('#gifModal').addClass('open').attr('aria-hidden', 'false');
});

$('#closeModalBtn, #gifModal').on('click', function (e) {
    if (e.target === this) {
        $('#gifModal').removeClass('open').attr('aria-hidden', 'true');
        $('#modalImg').attr('src', '');
    }
});

$(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#gifModal').hasClass('open')) {
        $('#gifModal').removeClass('open').attr('aria-hidden', 'true');
        $('#modalImg').attr('src', '');
    }
});

$('#toggleAllBtn').on('click', function () {
    const btn = $(this);
    const shouldPlay = btn.text() === 'Play All';
    $('.img-wrapper').each(function () {
        const wrapper = $(this);
        const gif = wrapper.find('.gifImg');
        gif.attr('src', shouldPlay ? gif.attr('data-animate') : gif.attr('data-still'));
        gif.attr('data-state', shouldPlay ? 'playing' : 'still');
        wrapper.toggleClass('is-playing', shouldPlay);
    });
    btn.text(shouldPlay ? 'Pause All' : 'Play All');
});

$('#ratingFilter').on('change', function () {
    $('#toggleAllBtn').text('Play All');
    renderFilteredGifs();
});

$(document).on('click', '.copy-btn', function () {
    const btn = $(this);
    const orig = btn.text();
    navigator.clipboard.writeText(btn.attr('data-url')).then(() => {
        btn.text('Copied!').addClass('copied');
        setTimeout(() => btn.text(orig).removeClass('copied'), 1500);
    });
});

$('.resetBtn').on('click', function () {
    usersButtons = [];
    localStorage.setItem('buttons', JSON.stringify(usersButtons));
    displayButtons();
});

$(document).on('mouseenter', '.img-wrapper', function () {
    const wrapper = $(this);
    const gif = wrapper.find('.gifImg');
    gif.attr('src', gif.attr('data-animate'));
    gif.attr('data-state', 'playing');
    wrapper.addClass('is-playing');
});

$(document).on('mouseleave', '.img-wrapper', function () {
    if ($('#toggleAllBtn').text() === 'Pause All') return;
    const wrapper = $(this);
    const gif = wrapper.find('.gifImg');
    gif.attr('src', gif.attr('data-still'));
    gif.attr('data-state', 'still');
    wrapper.removeClass('is-playing');
});
