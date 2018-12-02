'use strict';

var db = require('../helpers/db');
db.initCollection('parkingTickets');
db.initCollection('parkingCities');
db.initCollection('parkingSpots');

module.exports = {
  retrieveAllParkingTickets : retrieveAllParkingTickets,
  retrieveParkingTicket : retrieveParkingTicket,
  addParkingTicket : addParkingTicket,
  stopParkingTicket : stopParkingTicket,
  retrieveAllParkingCity : retrieveAllParkingCity,
  retrieveAllParkingSpotInCity : retrieveAllParkingSpotInCity
};

function retrieveAllParkingTickets(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            res.json(db.getObjects("parkingTickets", (item) => item.userId === req.userId))
        } catch (e) {
            res.json([]);
        }
    } else {
        res.status(403).json({
            message: "User can only view its own parking tickets."
        });
    }
}

function retrieveParkingTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            res.json(db.getObject("parkingTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value))
        } catch (e) {
            res.status(404).json({
                message: "No tickets found!"
            })
        }
    } else {
        res.status(403).json({
            message: "User can only view its own parking tickets."
        });
    }
}

function addParkingTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        let ticket = req.swagger.params.ticket.value;
        try {
            db.getObject("cards", (item) => item.userId === req.userId && item._id === ticket.cardId);
            try {
                db.getObject("parkingSpots", (item) => item._id === ticket.zoneId);
                ticket.userId = req.userId;
                ticket.price = undefined;
                ticket.stopTime = undefined;
                ticket.purchaseDate = (new Date()).toISOString();
                db.createObject("parkingTickets", ticket);
                res.status(201).json();
            } catch (e) {
                res.status(404).json({
                    message: "Parking zone not found"
                });
            }
        }
        catch (e) {
            res.status(404).json({
                message: "Card not found!"
            })
        }
    } else {
        res.status(403).json({
            message: "User can only view its own parking tickets."
        });
    }
}

function stopParkingTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            let ticket = db.getObject("parkingTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value);
            if (!ticket.price && !ticket.stopTime) {
                let zone = db.getObject("parkingSpots", (item) => item._id === ticket.zoneId);
                let stopTime = new Date();
                let price = Math.round((Math.floor((stopTime - Date.parse(ticket.purchaseDate)) / 1000 / 60 / 15) + 1) * +zone.price).toFixed(2);
                db.updateObject("parkingTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value, {
                    stopTime: stopTime,
                    price: price
                });
                ticket.stopTime = stopTime;
                ticket.price = price;
                res.json(ticket);
            } else {
                res.status(403).json({
                    message: "Ticket is already stopped!"
                });
            }
        }
        catch (e) {
            res.status(404).json({
                message: "Ticket not found!"
            });
        }
    } else {
        res.status(403).json({
            message: "User can only view its own parking tickets."
        });
    }
}

function retrieveAllParkingCity(req, res) {
  res.json(db.getObjects("parkingCities"));
}

function retrieveAllParkingSpotInCity(req, res) {
  try {
    res.json(db.getObjects("parkingSpots", (item) =>item.city._id === req.swagger.params.cityId.value));
  } catch (e) {
      res.status(404).json({
          message: "City not found!"
      });
  }
}