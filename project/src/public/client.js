let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
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
    console.log("state rovers is ", state)

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            ${SelectRovers(rovers)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
                ${displayRoversAndImageSlicer(roverData)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}
const displayRoversAndImageSlicer = (roverData) => {
    if(!roverData){
        return
    }
    else{
        return roverData.photos.map(photo => photo.img_src) 

    }
}
// display selection box for rovers

const SelectRovers = (rovers) => {
    let roverSelect = rovers.map(rover => `<option value=${rover} > ${rover} </option>`)
    return `
        <select id="mySelect" onchange="myFunction()">${roverSelect}</select>
    `
}
function myFunction() {
    let x = document.getElementById("mySelect").value;
    getRoverDetails(x)
    alert(x)
}
// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        console.log("looking for apod")
        getImageOfTheDay(store)
    }
    console.log( "image of the day type ", apod)
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async (state) => {
    let { apod } = state

    let data = await fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => {
            console.log( apod)
            updateStore(store, { apod })
    })

    return data
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
            updateStore(store, { roverData : roversdata.rovers })
        })

    return data
}