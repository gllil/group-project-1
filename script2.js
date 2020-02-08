var modal = document.getElementById('simpleModal');

var modalBtn =document.getElementById('modalBtn');

var closeBtn = document.getElementsByClassName('colseBtn')[0];

//Listen for click

modalBtn.addEventListener('click', openModal);

closeBtn.addEventListener('click', closeModal);

//function to open modal

function openModal(){
    modal.style.display = 'block';
}

// close modal
function closeModal(){
    modal.style.display = 'none';
}

//outside close modal click
function outsideClick(e){
    if(e.target == modal){
    modall.style.display = 'none';
    }
}

