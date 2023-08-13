const vt = {
    log: function (a, ...l) {
        let b = "";
        l.forEach(c => b+= " " + c);
        console.log(`%c[${a}]`, "color: purple", b);
    }
}