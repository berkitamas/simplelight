'use strict';

var db = require('../helpers/db');
db.initCollection('motorwayTickets');
db.initCollection('motorwayPrices');


module.exports = {
  retrieveAllMotorwayTicket : retrieveAllMotorwayTicket,
  retrieveMotorwayTicket : retrieveMotorwayTicket,
  addMotorwayTicket : addMotorwayTicket,
  retrieveAllMotorwayPriceCategory : retrieveAllMotorwayPriceCategory
};

function retrieveAllMotorwayTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            res.json(db.getObjects("motorwayTickets", (item) => item.userId === req.userId))
        } catch (e) {
            res.json([]);
        }
    } else {
        res.status(403).json({
            message: "User can only view its own motorway tickets."
        });
    }
}

function retrieveMotorwayTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            res.json(db.getObject("motorwayTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value))
        } catch (e) {
            res.status(404).json({
                message: "No tickets found!"
            })
        }
    } else {
        res.status(403).json({
            message: "User can only view its own motorway tickets."
        });
    }
}

function addMotorwayTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        let ticket = req.swagger.params.ticket.value;
        db.getObject("cards", (item) => item.userId === req.userId && item._id === ticket.cardId);
        try {
            ticket.userId = req.userId;
            ticket.purchaseDate = (new Date()).toISOString();
            db.createObject("motorwayTickets", ticket);
            res.status(201).json();
        }
        catch (e) {
            res.status(404).json({
                message: "Card not found!"
            })
        }
    } else {
        res.status(403).json({
            message: "User can only view its own motorway tickets."
        });
    }
}

function retrieveAllMotorwayPriceCategory(req, res) {
  res.json(db.getObjects('motorwayPrices'));
}