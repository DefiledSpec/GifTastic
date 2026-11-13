const APIKey = 'p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6';
const host = 'https://api.giphy.com';
const search = '/v1/gifs/search?';
const gifContainer = $('.gifContainer');
const btnContainer = $('.btnGroup');
const usersBtnContainer = $('.usersButtons');
const $resultsTotal = $('#resultsTotal');
const $activeTitle = $('#active-topic-title span');
const $copyright = $('#copyright');

const btns = [
    'Paul Rudd',
    'Donald Trump',
    'Chris Pratt',
    'Nick Offerman',
    'Tina Fey',
    'John Krasinski',
    'Will Ferrell'
];

let currentGifs = [];
let currentTopic = 'Tina Fey';

// Load saved buttons safely
let usersButtons = JSON.parse(localStorage.getItem('buttons'));
if (!Array.isArray(usersButtons)) {
    usersButtons = ['Will Ferrell'];
    localStorage.setItem('buttons', JSON.stringify(usersButtons));
}

function displayButtons(activeQuery = currentTopic) {
    usersBtnContainer.empty();
    if (usersButtons.length === 0) {
        usersBtnContainer.append('<span class="empty-hint">No saved buttons yet. Add one above!</span>');
    } else {
        usersButtons.forEach(btn => {
            const isActive = btn.toLowerCase() === activeQuery.toLowerCase() ? 'active-btn' : '';
            usersBtnContainer.append(
                $('<button>')
                    .addClass(`gifBtn ${isActive}`)
                    .attr('data-content', btn)
                    .text(btn)
            );
        });
    }

    btnContainer.empty();
    btns.forEach(btn => {
        const isActive = btn.toLowerCase() === activeQuery.toLowerCase() ? 'active-btn' : '';
        btnContainer.append(
            $('<button>')
                .addClass(`gifBtn ${isActive}`)
                .attr('data-content', btn)
                .text(btn)
        );
    });
}

function getGifs() {
    const startTime = Date.now();
    const Q = $(this).attr('data-content') || currentTopic;
    currentTopic = Q;

    $activeTitle.text(Q);
    displayButtons(Q);
    $('#toggleAllBtn').text('Play All');
    gifContainer.html('<div class="loader">Fetching GIFs from GIPHY...</div>');

    const url = `${host}${search}${$.param({
        q: Q.trim(),
        limit: 50,
        api_key: APIKey,
    })}`;

    $.ajax({ url: url, method: 'GET' })
        .then(res => {
            if (!res.data || res.data.length === 0) {
                throw new Error(`No GIFs found for "${Q}"`);
            }
            currentGifs = res.data;
            renderFilteredGifs(startTime);
        })
        .catch(err => {
            currentGifs = [];
            gifContainer.html(`<div class="empty-state">${err.message}</div>`);
            $resultsTotal.text('0');
        });
}

function renderFilteredGifs(startTime = Date.now()) {
    const selectedRating = $('#ratingFilter').val();
    gifContainer.empty();
    let displayedCount = 0;

    currentGifs.forEach(gif => {
        const rating = gif.rating.toLowerCase();
        const isAllowedRating = rating === 'g' || rating === 'pg';
        const matchesFilter = selectedRating === 'all' || rating === selectedRating;

        if (isAllowedRating && matchesFilter) {
            displayedCount++;
            const card = $('<div>').addClass('gif-card');

            const imgWrapper = $('<div>').addClass('img-wrapper');
            const gifImg = $('<img>')
                .attr({
                    src: gif.images.downsized_still.url,
                    alt: gif.title || 'GIPHY GIF',
                    loading: 'lazy',
                    'data-still': gif.images.downsized_still.url,
                    'data-animate': gif.images.downsized.url,
                    'data-state': 'still'
                })
                .addClass('gifImg');

            const badge = $('<span>').addClass('play-badge').text('GIF');
            imgWrapper.append(gifImg, badge);

            const meta = $('<div>').addClass('card-meta');
            const ratingPill = $('<span>').addClass('rating-pill').text(rating.toUpperCase());

            const actions = $('<div>').addClass('card-actions');
            const copyBtn = $('<button>')
                .attr('type', 'button')
                .addClass('copy-btn')
                .attr('data-url', gif.images.original.url)
                .text('Copy Link');

            const link = $('<a>')
                .attr({ href: gif.url, target: '_blank', rel: 'noopener noreferrer' })
                .text('GIPHY ↗');

            actions.append(copyBtn, link);
            meta.append(ratingPill, actions);
            card.append(imgWrapper, meta);
            gifContainer.append(card);
        }
    });

    if (displayedCount === 0 && currentGifs.length > 0) {
        gifContainer.html('<div class="empty-state">No GIFs match this rating filter.</div>');
    }

    $resultsTotal.text(displayedCount);
}

// Initial Load
(function () {
    displayButtons(currentTopic);
    getGifs();
    $copyright.html(`&copy; Copyright 2018 - ${new Date().getFullYear()}`);
})();

// Add Custom Button
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
    currentTopic = btnContent;
    displayButtons(btnContent);
    getGifs.call($(`<button data-content="${btnContent}">`)[0]);
});

// Topic Button Click
$(document).on('click', '.gifBtn', getGifs);

// Single GIF Play/Pause Toggle
$(document).on('click', '.img-wrapper', function () {
    const wrapper = $(this);
    const gif = wrapper.find('.gifImg');
    const isStill = gif.attr('data-state') === 'still';

    gif.attr('src', isStill ? gif.attr('data-animate') : gif.attr('data-still'));
    gif.attr('data-state', isStill ? 'playing' : 'still');
    wrapper.toggleClass('is-playing', isStill);
});

// Play All / Pause All Toggle
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

// Rating Filter Change
$('#ratingFilter').on('change', function () {
    $('#toggleAllBtn').text('Play All');
    renderFilteredGifs();
});

// Copy GIF URL to Clipboard
$(document).on('click', '.copy-btn', function () {
    const btn = $(this);
    const url = btn.attr('data-url');
    navigator.clipboard.writeText(url).then(() => {
        btn.text('Copied!').addClass('copied');
        setTimeout(() => btn.text('Copy Link').removeClass('copied'), 1500);
    });
});

// Reset Saved Buttons
$('.resetBtn').on('click', function () {
    usersButtons = [];
    localStorage.setItem('buttons', JSON.stringify(usersButtons));
    displayButtons();
});
