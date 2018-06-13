const APIKey = `p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6`;
let query = 'donald-trump'
let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${APIKey}&q=${query}&limit=10&offset=0&rating=G&lang=en`;

fetch(queryURL)
    .then(res => res.json())
    .then(data => {
        let gifs = [...data.data];
        gifs.forEach(gif => {
            console.log(gif.images.original.url)
            // console.log(gif.url)
            $('.gifContainer')
                .append($('<img>').attr('src', gif.images.original.url))
        })
    })
    .catch(err => console.log(err))