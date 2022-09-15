const { fork } = require("child_process");


const forkRandoms = (req, res) => {
        const forked = fork("./fork/random.js");
        forked.on("message", (msg) => {
        msg == "listo"
        ? forked.send(req.query.cant ? req.query.cant.toString() : "")
        : res.send(msg);
    });
    }
;

module.exports = {forkRandoms};