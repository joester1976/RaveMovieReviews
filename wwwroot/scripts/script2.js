window.onload = initializeComponents;

var upcomingMovieListSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/upcoming?page=1&language=en-US&api_key=643e2ad50ae9c04872a7d22c61736bdc",
    "method": "GET",
    "headers": {},
    "data": "{}"
}

var moviesNowPlayingSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/now_playing?api_key=643e2ad50ae9c04872a7d22c61736bdc&language=en-US&page=1",
    "method": "GET",
    "headers": {},
    "data": "{}"
}

var upcomingMovieList;
var moviesNowPlaying;

function initializeComponents() {

    getNowPlayingMovies(moviesNowPlayingSettings);
        
}

function getNowPlayingMovies(settings) {

    // if (moviesNowPlaying == null) {

        $.ajax(settings).done(function (response) {

            setNowPlayingMoviesIntoArray(response);

        });
    // }

    displayNowPlayingMovies(moviesNowPlaying);
    
}

function getUpcomingMovieList(settings) {

    if (upcomingMovieList == null) {

        $.ajax(settings).done(function (response) {

            setUpcomingMoviesIntoArray(response);

        });

    }

    displayUpcomingMovies();

}

// Set Arrays up section.

function setNowPlayingMoviesIntoArray(response) {
    moviesNowPlaying = [];

    for (var i = 0; i < response.results.length; i++) {
        moviesNowPlaying.push(response.results[i].poster_path);
    }

    displayNowPlayingMovies();
}

function setUpcomingMoviesIntoArray(response) {
    upcomingMovieList = [];

    for (var i = 0; i < response.results.length; i++) {
        upcomingMovieList.push([response.results[i].title, response.results[i].release_date]);
    }

    displayUpcomingMovies();
}


// Display data functions.

function displayNowPlayingMovies() {
    for (var i = 0; i < 9; i++) {
        $("#image-" + i).attr('src', 'https://image.tmdb.org/t/p/original/' + moviesNowPlaying[i])
    }

    getUpcomingMovieList(upcomingMovieListSettings);
}

function displayUpcomingMovies() {

    var el = document.getElementById('release-date-list');

    for (var i = 0; 1 < 15; i++) {

        el.innerHTML += "<li><span class='movie-title'>" + upcomingMovieList[i][0] + " - </span > <span class='release-date'>" + upcomingMovieList[i][1] + "</span ></li > ";

    }
}

