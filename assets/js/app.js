const APIKey = '&api_key=p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6';
const host = 'https://api.giphy.com';
const search = '/v1/gifs/search/q=';

let query = 'paul+rudd';

let queryURL = host + search + query + APIKey; 

$.ajax({url: queryURL, method: 'GET'})
    .then(response => {
        console.log(response)
    });
// const APIKey = config.APIKey;
// // let query = 'donald-trump'



// function getGifs() {
//     let query = $(this).attr('data-query') || 'cat';


//     let queryURL = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${APIKey}&limit=10&rating=pg`;
//     //let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${APIKey}&q=${query}&limit=10&offset=0&rating=G&lang=en`;
//     fetch(queryURL)
//         .then(res => res.json())
//         .then(data => {
//             let gifs = data.data;
//             gifs.forEach(gif => {
//                 console.log(gif.images.original.url)
//                 console.log(gif.url)
//                 switch(gif.rating){
//                     case 'r':
//                     case 'pg-13':
//                         break;
//                     default:
//                         $('.gifContainer')
//                             .append($('<p>').text(`Rating: ${gif.rating}`))
//                             .append($('<img>').attr('src', gif.images.original.url))
//                 }

//             })
//         })
//         .catch(err => console.log(err))

// }
// $(document).on('click', '.gifBtn', getGifs);
