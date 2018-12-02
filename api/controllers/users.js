'use strict';

var db = require('../helpers/db');
db.initCollection("users");
db.initCollection('motorwayTickets');
db.initCollection("cinemaTickets");
db.initCollection("parkingTickets");


module.exports = {
  retrieveUser : retrieveUser,
  register : register
};

function retrieveUser(req, res) {
    try {
        console.log(req.userId);
        console.log(req.sessionId);
        let user = db.getObject("users", (item) => item._id === req.swagger.params.userId.value);
        let motorwayTickets = [];
        let parkingTickets = [];
        let cinemaTickets = [];
        try {
            motorwayTickets = db.getObjects("motorwayTickets", (item) => item.userId === user._id);
        } catch (e) {
            motorwayTickets = [];
        }
        try {
            parkingTickets = db.getObjects("parkingTickets", (item) => item.userId === user._id);
        } catch (e) {
            parkingTickets = [];
        }
        try {
            cinemaTickets = db.getObjects("cinemaTickets", (item) => item.userId === user._id);
        } catch (e) {
            cinemaTickets = [];
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            motorwayTickets: motorwayTickets,
            parkingTickets: parkingTickets,
            cinemaTickets: cinemaTickets
        });
    }
    catch (e) {
        res.status(404).json({
           message: e.message
        });
    }
}

function register(req, res) {
    try {
        let user = req.swagger.params.user.value;
        db.createObject('users', user);

        user = db.getObject("users", (item) => item.username === user.username);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            motorwayTickets: [],
            parkingTickets: [],
            cinemaTickets: []
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}