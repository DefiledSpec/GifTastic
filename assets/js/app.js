const APIKey = 'p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6';
const host = 'https://api.giphy.com';
const search = '/v1/gifs/search?';
const gifContainer = $('.gifContainer');

function getGifs() {
    let startTime = Date.now();
    let query = $(this).attr('data-content').replace(' ', '_') || 'paul_rudd';
    
    let Q = query.replace('_', ' ');
    console.log(`Fetching ${Q} from GIPHY`);
    
    let url = host + search;
    url += $.param({
        q: query,
        limit: 10,
        api_key: APIKey,

    });
  
    $.ajax({url: url, method: 'GET'})
        .then(response => {
            console.log(`Request ${Q} to GIPHY took ${((Date.now() - startTime)/1000).toFixed(2)} seconds to complete. Response:`, response.data)
            displayGifs(response.data);
        })
        .catch(err => console.log(`Error: ${err}`));
}

function displayGifs(gifs) {
    gifContainer.empty();
    gifs.forEach(gif => {

        switch(gif.rating){
            case 'r':
            case 'pg-13':
            case 'nc-17':
                // break
            default:
                gifContainer
                    .append($('<p>').text(`Rating: ${gif.rating}`))
                    .append($('<img>').attr('src', gif.images.downsized.url))
        }
    
    })
    
}
$('#addBtn').click(function(e) {
    e.preventDefault();
    let btnContent = $('#addBtnText').val();
    if(!btnContent) { return console.log('Need Button Content')}
    $('.btnGroup').append($('<button>').addClass('gifBtn').attr('data-content', btnContent).text(btnContent))
})
$(document).on('click', '.gifBtn', getGifs);
