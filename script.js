const googleAPI = "AIzaSyAPYPaD6KUcr9TJRJKDH80BXOuyc1trMVM";
const googleAPI2 = "AIzaSyDertWPMLprqokh3GH_JSEmZr_2v9Uz7xU";
const movieAPI = "766b047e79a6c5e6f6421d09567397ca";
const NYT_API ="Gu7WmhhKbLtSXGAj5Pb7hw5QpCcSOTQG"
const NYT_API_MOVIES = "d4vyF8ugAJcWXxzo71KTeJlBYsmrUGto"
const movieBaseURL = "https://api.tmdb.org/3/search/person?api_key="+movieAPI+"&query=";
var idBaseURL = "https://api.themoviedb.org/3/person/"+ id +"?api_key=" + movieAPI + "&language=en-US"
const basePicURL = "https://image.tmdb.org/t/p/w300";
const basePosterURL = "https://image.tmdb.org/t/p/w92";
var nameCall = "";
var map;
var lat1 = -34.397;
var long1 = 150.644;
var city ="New York"
var id = "1234"


// sample google call:
// https://www.google.com/maps/embed/v1/MODE?key=YOUR_API_KEY&parameters

// sample themoviedb call
// https://api.themoviedb.org/3/movie/550?api_key=766b047e79a6c5e6f6421d09567397ca

//sample themoviedb pic call
//https://image.tmdb.org/t/p/w185/xxPMucou2wRDxLrud8i2D4dsywh.jpg

//Powered by THE MOVIE DB attribution
//https://www.themoviedb.org/assets/2/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png


// Gracenote Developer API: vm845dhcs5gawes2rtbuskgb

//wolfram api:3LX6GV-QWQVKLWGK8
// http://api.wolframalpha.com/v2/query?input=pi&appid=3LX6GV-QWQVKLWGK8
//nameCall = $("#actorName").text();

function toastAlert(str){
    M.toast({html:str});
}

function initMap(){
    centerMap(city);
}
function centerMap(city) {
    var geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 8,
      fullscreenControl: false,
      linksControl: false,
      addressControl: false,
      zoomControl: false,
      enableCloseButton: false

    });
    geocoder.geocode({'address': city}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
      } else {
        toastAlert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function addPercent(name){
    return name.trim().replace(" ", "%20").toLowerCase(); 
}

function addPlus(name){
    return name.trim().replace(" ", "+").toLowerCase();
}

$(".actorName").on("submit", function(e){
    nameCall = $("#actorName").val();
    nameCall1 = addPercent(nameCall);
    nameCall2 = addPlus(nameCall);
    tmdbURL = movieBaseURL + nameCall1;
    e.preventDefault();
    //e.stopPropagation();

    $.ajax({
        url: tmdbURL,
        method: "GET"
    }).then(function(resp1){
        
        if(resp1.total_results===0){
            toastAlert("No Such Actor");
        } else {

        console.log(resp1);
        picJPG_URL = resp1.results[0].profile_path;

        $("#actorPic").attr("src",basePicURL+picJPG_URL);
        }

        $("#movieInfo").empty();
        for(i=0; i<resp1.results[0].known_for.length; i++){

            newH6_1=$("<h6>").text(resp1.results[0].known_for[i].title);
            newH6_2=$("<h6>").text(resp1.results[0].known_for[i].overview);
            newH6_3=$("<h6>").text(resp1.results[0].known_for[i].release_date);
            newImg = $("<img>").attr("src",basePosterURL+resp1.results[0].known_for[i].poster_path);
            $("#movieInfo").append(newImg, newH6_1,newH6_2,newH6_3);
        }

        var id = resp1.results[0].id;
        console.log(id);
        $.ajax({
            url: "https://api.themoviedb.org/3/person/"+ id +"?api_key=" + movieAPI + "&language=en-US",
            method:"GET"
        }).then(function(resp2){
            console.log(resp2);
            $("#birthDay").text(resp2.birthday);
            console.log(resp2.place_of_birth);
            city=resp2.place_of_birth;
            console.log("city")
            console.log(city);
            $("#actorBio").text("Actor's Bio: "+resp2.biography);
            if(city){
                centerMap(city);
            } else {console.log("no city");}
        }).catch(function(err2){console.log(err2)});

        //+nameCall2+
        nytQuery = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query="+nameCall2+"&api-key="+NYT_API_MOVIES;
        $.ajax({
            url: nytQuery,
            method:"GET"
        }).then(function(resp3){
            console.log(resp3);
            $("#reviewTitle").text(resp3.results[0].display_tile);
            $("#movieReview").text(resp3.results[0].link.suggested_link_text);
            $("#movieReview").attr("href", resp3.results[0].link.url);
        })

    }).catch(function(err1){
        console.log(err1);
    });
});
