/*
    Elijah Bantugan
    MIT License
    
    vtools.js
*/

const vt = {
    log: function (a, ...l) {
        let b = "";
        l.forEach(c => b+= " " + c);
        console.log(`%c[${a}]`, "color: purple", b);
    }
}

class ErrorModal {
    title = "An error occured."
    body = "Error details will appear here."
    callback = null

    constructor () {
        
    }
}