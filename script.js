const googleAPI = "AIzaSyAPYPaD6KUcr9TJRJKDH80BXOuyc1trMVM";
const movieAPI = "766b047e79a6c5e6f6421d09567397ca";
const movieBaseURL = "https://api.tmdb.org/3/search/person?api_key="+movieAPI+"&query=";
const basePicURL = "https://image.tmdb.org/t/p/w300";
const basePosterURL = "https://image.tmdb.org/t/p/w92";
var nameCall = "";



// sample google call:
// https://www.google.com/maps/embed/v1/MODE?key=YOUR_API_KEY&parameters

// sample themoviedb call
// https://api.themoviedb.org/3/movie/550?api_key=766b047e79a6c5e6f6421d09567397ca

//sample themoviedb pic call
//https://image.tmdb.org/t/p/w185/xxPMucou2wRDxLrud8i2D4dsywh.jpg

nameCall = $("#actorName").text();

function addPercent(name){
    return name.trim().replace(" ", "%20").toLowerCase(); 
}

$("#actorName").on("change",function(e){
    e.preventDefault();
    console.log("listerworks");
    nameCall = $(this).val();
    nameCall = addPercent(nameCall);
    console.log(nameCall);
    tmdbURL = movieBaseURL + nameCall;
    $.ajax({
        url: tmdbURL,
        method: "GET"
    }).then(function(resp1){
        
        if(resp1.total_results===0){
            alert("No Such Actor");
        } else {
            console.log(resp1);
        picJPG_URL = resp1.results[0].profile_path;
        $("#actorPic").attr("src",basePicURL+picJPG_URL);
        }
        console.log();
        console.log();

        for(i=0; i<resp1.results[0].known_for.length; i++){

            newH6_1=$("<h6>").text(resp1.results[0].known_for[i].title);
            newH6_2=$("<h6>").text(resp1.results[0].known_for[i].overview);
            newH6_3=$("<h6>").text(resp1.results[0].known_for[i].release_date);
            newImg = $("<img>").attr("src",basePosterURL+resp1.results[0].known_for[i].poster_path);
            $("#movieInfo").append(newImg, newH6_1,newH6_2,newH6_3);
        }
    }).catch(function(err1){
        console.log(err1);
    });


});

