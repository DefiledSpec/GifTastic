const APIKey = 'p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6';
const host = 'https://api.giphy.com';
const search = '/v1/gifs/search?';
const gifContainer = $('.gifContainer');
const btnContainer = $('.btnGroup');
const usersBtnContainer = $('.usersButtons');
const $resultsTotal = $('#resultsTotal');
const $copyright = $('#copyright');

let startTime;

const btns = [
    'Paul Rudd',
    'Donald Trump',
    'Chris Pratt',
	// 'Nick Offerman',
	// 'Tina Fey',
    // 'Tracy Morgan',
    // 'John Krasinski',
    // 'Will Ferrell',
    // 'Zach Galifianakis',
];
let usersButtons = [];
if(localStorage.length < 1) {
    initLocalStorage();
    displayButtons();
}
function initLocalStorage() {
    usersButtons.push('Will Ferrel')
    localStorage.setItem('buttons', JSON.stringify(usersButtons))
}
function displayButtons() {
    usersBtnContainer.empty();
    let userData = JSON.parse(localStorage.getItem('buttons'));
    if(userData !== null && localStorage.length > 0) {
        userData.forEach(btn =>usersBtnContainer.append($('<button>').addClass('gifBtn btn btn-secondary').attr('data-content', btn).text(btn)));
    }
    btnContainer.empty();
    btns.forEach(btn => btnContainer.append($('<button>').addClass('gifBtn btn btn-secondary').attr('data-content', btn).text(btn)));
};
displayButtons();

function getGifs() {
    startTime = Date.now();
    let Q = $(this).attr('data-content') || 'Tina Fey';
    console.log(`Fetching "${Q}" from GIPHY`);
    
    let query = Q.replace(' ', '_');
    
    let url = host + search;
    url += $.param({
        q: query,
        limit: 50,
        api_key: APIKey,
    });
  
    $.ajax({url: url, method: 'GET'})
        .then(res => {
            if(res.data.length === 0) { throw new Error(`No gifs found for query: "${Q}"`) };
            console.log(`Request "${Q}" to GIPHY took ${((Date.now() - startTime)/1000).toFixed(2)} seconds to return ${res.data.length} results. Response:`, res.data)
            displayGifs(res.data, startTime);
        })
        .catch(err => console.log(`${err}`));
}

function displayGifs(gifs, startTime) {
    gifContainer.empty();
    gifs.forEach(gif => {      
        if(gif.rating === 'g' || gif.rating === 'pg') {
            let card = $('<div>').addClass('card text-center mt-2 mb-2')
            let gifImg = $('<img>').attr({
                src: gif.images.downsized_still.url,
                width: 360, height: 203,
                'data-gifLink': gif.images.downsized.url
                }).addClass('gifImg card-img-top');
            let rating = $('<p>').addClass('text-info').text(`Rating: ${gif.rating.toUpperCase()}`);
            let link = $('<a>').attr({href: gif.url}).text('View Original');
            gifContainer.append(card.append([card, gifImg, rating, link]))
        }
    });
    console.log(`Request took ${((Date.now() - startTime)/1000).toFixed(2)} seconds to display ${gifs.length} results.`)
    $resultsTotal.text(`${gifs.length}`)
}
(function () {
    getGifs();
    $copyright.html(`&copy; Copyright 2018 - ${(new Date()).getFullYear()}`)
})();
$('#addBtn').click(function(e) {
    e.preventDefault();
    let btnContent = $('#addBtnText').val();
    if(!btnContent) { return console.log('Need Button Content') };
    usersButtons.push(btnContent);
    localStorage.removeItem('buttons');
    localStorage.setItem('buttons', JSON.stringify(usersButtons));
    displayButtons();
})
$(document).on('click', '.gifBtn', getGifs);
$(document).on('click', '.gifImg', function() {
    const gif = $(this);
    let temp = gif.attr('src');
    gif.attr('src', gif.attr('data-gifLink'));
    gif.attr('data-gifLink', temp); 

});
$('.resetBtn').click(function () {
    usersButtons = [];
    console.log(usersButtons)
    localStorage.clear();
    displayButtons();
});
$('#addBtnText').on('focus', function() {
    $(this).attr('placeholder', '');
});
$('#addBtnText').on('blur', function() {
    $(this).attr('placeholder', 'Tina Fey');
});
