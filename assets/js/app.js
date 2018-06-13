const APIKey = '&api_key=p7EUf5FD5oJ7QMqy1k7MUXA6OYXpedP6';
const host = 'https://api.giphy.com';
const search = '/v1/gifs/search/q=';

let query = 'paul+rudd';

let queryURL = host + search + query + APIKey; 

$.ajax({url: queryURL, method: 'GET'})
    .then(response => {
        console.log(response)
    });