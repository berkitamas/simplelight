'use strict';

var db = require('../helpers/db');
db.initCollection("users");
db.initCollection("sessions");

module.exports = {
    login : login,
    logout: logout
};

function login(req, res) {
    try {
        var user = db.getObject("users", item => item.username === req.swagger.params.credentials.value.username);
    } catch (error) {
        res.json(403, {
            message: "Username or password not found!"
        });
        return;
    }
    if (user.password !== req.swagger.params.credentials.value.password) {
        res.json(403, {
            message: "Username or password not correct!"
        });
        return;
    }
    var result = db.createObject("sessions", {
        user: user._id
    });
    res.json({
        sessionID: result._id
    });
}

function logout(req, res) {
    db.deleteObject("sessions", item => item._id === req.session_id);
    console.log("sad");
    res.status(204).json();
}