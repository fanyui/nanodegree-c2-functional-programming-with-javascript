// import { List } from 'immutable'
// const { List } = require('immutable');
/*
I resulted to using the browser immutable js
since i wasn't able to import it directly from nodemodules in this file.
as such I chosed to use it as in
Immutable.List 
*/

let store = {
    user: { name: "Student" },
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
}

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
                ${renderRovers(rovers, Options)}
                <section class="slider-container">
                    ${displayRoversAndImageSlicer(roverData, thumbnailImages)}
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

const thumbnailImages = (elt, id) => `<div class="column">
        <img class="demo cursor " src=${elt.img_src} style="width:100%" onclick="currentSlide(${id + 1})" alt=${elt.camera.full_name}>
        </div>`
// this function takes in an array of images and returns the specified data expected as well as the slider for displaying theimages
const displayRoversAndImageSlicer = (roverData, thumbnailImages) => {
    if(!roverData){
        return "";
    }
    else if(roverData && roverData.photos.length==0){
        return `<div class="numbertext"> No images for this rover on sole 2540 please choose another rover </div>`;
    }
    else{
        let pht = roverData.photos.map((photo, key, array) => `<div class="mySlides">
        <div class="numbertext"> ${key+1} / ${array.length} <br />
            <label>Rover Name: ${photo.rover.name} <lable> <br/>
            <label>Launch Date: ${photo.rover.launch_date} <lable> <br/>
            <label>Landing Date: ${photo.rover.landing_date} <lable> <br/>
            <label>Status: ${photo.rover.status} <lable> <br/>
            <label>Date Taken: ${photo.rover.max_date} <lable> <br/>
            <label>Total photos: ${photo.rover.total_photos} <lable> <br/>
        </div>
        <img class="slider-image" src=${photo.img_src} >
        </div>`)
        
        let thumbnail = roverData.photos.map((elt, id) => thumbnailImages(elt, id))
        
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
const Options = (rover) => `<option value=${rover} > ${rover} </option>`
const renderRovers = (rovers, Option) => {
    let roverSelect = rovers.map(rover => Option( rover))
    return `
        <select class="select-field" onChange="selectRover(event)"  >${roverSelect}</select>
    `
}
function selectRover(e) {
    let selectedRover = e.target.value
    if (!selectedRover) {
        return
    }
    getRoverDetails(selectedRover)

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
        /*find it index in the state. reason is we need to update the ui
        to reflext the currently bding displayed rovers information in the select
        box and because the render function runs and things refresh. we have to reorder
        them here.
        */
            // let rover = roversdata.rovers.photos[0].rover.name //get the name of the rover
            let rover = body.rover //get the name of the rover
           let index = rovers.indexOf(rover)
           let newRovers = rovers.splice(index,1)
            updateStore(store, { rovers: newRovers.unshift(rover), roverData: roversdata.rovers })
        })

    return data
}
