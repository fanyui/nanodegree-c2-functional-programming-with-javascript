// import { List } from 'immutable'
// const { List } = require('immutable');

let store = {
    user: { name: "Student" },
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
}
let slideIndex = 1;

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod, roverData } = state

    return `
        <header></header>
        <main>
    <div id="background"></div>
    <div id="midground"></div>
    <div id="foreground"></div>
    <div class="page-wrap">
            ${SelectRovers(rovers)}
                <section class="slider-container">
                ${displayRoversAndImageSlicer(roverData)}
                </section>
    </div>
        </main>
        <footer></footer>
    `
}
// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS


// this function takes in an array of images and returns the specified data expected as well as the slider for displaying theimages
const displayRoversAndImageSlicer = (roverData) => {
    if(!roverData){
        return "";
    }
    else{
        
        let pht = roverData.photos.map((photo, key, array) => `<div class="mySlides">
        <div class="numbertext"> ${key+1} / ${array.length} <br />
            <label>Rover Name: ${photo.rover.name} <lable> <br/>
            <label>Launch Date: ${photo.rover.launch_date} <lable> <br/>
            <label>Landing Date: ${photo.rover.landing_date} <lable> <br/>
            <label>Status: ${photo.rover.status} <lable> <br/>
            <label>Total photos: ${photo.rover.total_photos} <lable> <br/>
        </div>
        <img class="slider-image" src=${photo.img_src} >
        </div>`)
        
        let thumbnail = roverData.photos.map((elt, id) => `<div class="column">
        <img class="demo cursor " src=${elt.img_src} style="width:100%" onclick="currentSlide(${id+1})" alt=${elt.camera.full_name}>
        </div>`
        )
        
        return `<div id="innital-render" class="container"> ${pht.join('')}  
        <a class="prev" onclick="plusSlides(-1)">❮</a>
        <a class="next" onclick="plusSlides(1)">❯</a>
        <div class="caption-container">
        <p id="caption"></p>
        </div>
        <div class="row">
        ${thumbnail.join('')}
        </div>

        </div>`
        
    }
}


// display selection box for rovers to choose the options of rover they want to see.

const SelectRovers = (rovers) => {
    let roverSelect = rovers.map(rover => `<option value=${rover} > ${rover} </option>`)
    return `
        <select id="mySelect" onchange="myFunction()">${roverSelect}</select>
    `
}
function myFunction() {
    let x = document.getElementById("mySelect").value;
    getRoverDetails(x)
}


const getRoverDetails = (rover) => {
    let body = { rover: rover }
   let data =  fetch(`http://localhost:3000/rover`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(roversdata => {
            const {rovers} = store
            let rover = roversdata.rovers.photos[0].rover.name
           let index = rovers.indexOf(rover)
           let newRovers = rovers.splice(index,1)
            updateStore(store, { rovers: newRovers.unshift(rover), roverData: roversdata.rovers })
        })

    return data
}
//showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}


function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("demo");
    let captionText = document.getElementById("caption");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    captionText.innerHTML = dots[slideIndex - 1].alt;
}
