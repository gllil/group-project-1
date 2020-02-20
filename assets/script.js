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

function titleCase(s){
  s=s.toLowerCase().trim();

  l = s.split(" ");
  for(i=0; i<l.length; i++){
      l[i] = l[i][0].toUpperCase() + l[i].slice(1);
  };
  s = l.join(" ");
  return s;
}

function initMap(){
    centerMap(city);
}
function centerMap(city) {
    var geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 8,
      disableDefaultUI: true
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

function noLeadZero(datePart){
  if(datePart[0]==="0") {
    datePart = datePart.slice(1);
  };
  return datePart;

}

function formatDate(dateStr){
  mnthObj ={"1":"January", "2":"February", "3":"March", "4":"April", "5":"May", "6":"June", "7":"July", "8":"August", "9":"September", "10":"October",  "11":"November", "12":"December"}
  dateArray = dateStr.split("-");
  dateArray[1] = noLeadZero(dateArray[1])
  dateArray[2]= noLeadZero(dateArray[2])
  console.log(dateArray);
  console.log(mnthObj[dateArray[1]]+" "+ dateArray[2]+", "+dateArray[0])
  return mnthObj[dateArray[1]]+" "+ dateArray[2]+", "+dateArray[0];
}

$(document).ready(function(){
  $('.collapsible').collapsible();
 });


$(".actorName").on("submit", function(e){
    nameCall = titleCase($("#actorName").val());
    nameCall1 = addPercent(nameCall);
    nameCall2 = addPlus(nameCall);
    tmdbURL = movieBaseURL + nameCall1;
    $("#actorName").val("");
    e.preventDefault();
    //e.stopPropagation();

    $.ajax({
        url: tmdbURL,
        method: "GET"
    }).then(function(resp1){
        
        if(resp1.total_results===0){
            toastAlert("No Such Actor");
              $("#headerTitle").text("No News Items");
              $("#reviewTitle").text("");
              $("#movieReview").text("");
              $("#movieReview").attr("href", "");
              $("#review").attr("style", "display:none");
        } else {


         picJPG_URL = resp1.results[0].profile_path;

        /*$("#actorPic").attr("src",basePicURL+picJPG_URL);
        $("#actorPic").attr("style", "display:block");*/
        }

        $("#movieInfo").empty();
        for(i=0; i<resp1.results[0].known_for.length; i++){

    htmlBlank = `
              
    <div class="card-image waves-effect waves-block waves-light">
      <img style="display:block" class="activator" src="`+basePosterURL+resp1.results[0].known_for[i].poster_path+`">
    </div>
    <div class="card-content">
      <span style="font-size: 110%; line-height:18px" class="card-title activator grey-text text-darken-4">`+ resp1.results[0].known_for[i].title +`<i class="material-icons right">more_vert</i></span>
      <p style="font-size: small">`+"Release Date: "+ formatDate(resp1.results[0].known_for[i].release_date) + `</p>
    </div>
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">`+resp1.results[0].known_for[i].title+`<i class="material-icons right">close</i></span>
      <p>`+ resp1.results[0].known_for[i].overview +`</p>
    </div>`
           

            newDiv = $("<div>").html(htmlBlank).attr("class","card col s12 m3").attr("style", "height: 550px");

            $("#movieInfo").append(newDiv);
        }

        var id = resp1.results[0].id;

        $.ajax({
            url: "https://api.themoviedb.org/3/person/"+ id +"?api_key=" + movieAPI + "&language=en-US",
            method:"GET"
        }).then(function(resp2){
            $("#tempMap").empty();
            htmlAct = `
            <div class="card-image waves-effect waves-block waves-light">
            <img style="width:90%; display:block" class="activator" src="`+basePicURL+picJPG_URL+`">
          </div>
          <div class="card-content">
            <span style="font-size: 110%" class="card-title activator grey-text text-darken-4">`+ nameCall +`<i class="material-icons right">more_vert</i></span>
            <p>`+"Birthday: "+ formatDate(resp2.birthday) + `</p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">`+nameCall+`<i class="material-icons right">close</i></span>
            <p>`+ resp2.biography +`</p>
            <div id = "map" style = "height: 200px; width: 200px; display: block" ></div>
            <span style="font-size: 110%" id ="homeTown"></span>
          </div>
            `
            newDiv2 = $("<div>").html(htmlAct).attr("class","card col s12 m3").attr("style", "height: 550px");
            $("#movieInfo").prepend(newDiv2);


 
            city=resp2.place_of_birth;
 
            if(city){
                centerMap(city);

                $("#homeTown").text("Birthplace: "+city);
                $("#map").attr("style", "height:200px", "width:200px", "display:block");
            } else {console.log("no city");}
        }).catch(function(err2){console.log(err2)});

        //+nameCall2+
        nytQuery = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query="+nameCall2+"&api-key="+NYT_API_MOVIES;
        $.ajax({
            url: nytQuery,
            method:"GET"
        }).then(function(resp3){
          console.log(resp3);
           if(resp3.has_more){
              $("#headerTitle").text(nameCall + " in the news");
              $("#reviewTitle").text(resp3.results[0].display_title+": "+resp3.results[0].summary_short);
              $("#movieReview").text(resp3.results[0].link.suggested_link_text);
              $("#movieReview").attr("href", resp3.results[0].link.url);
              $("#review").attr("style", "display:block");
           } else {
              $("#headerTitle").text("No News Items");
              $("#reviewTitle").text("");
              $("#movieReview").text("");
              $("#movieReview").attr("href", "");
              $("#review").attr("style", "display:none");
           }
        })

    }).catch(function(err1){
        console.log(err1);
    });
});
