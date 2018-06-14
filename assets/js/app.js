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