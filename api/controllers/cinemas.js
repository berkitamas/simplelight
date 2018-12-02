'use strict';

var db = require('../helpers/db');
db.initCollection("cards");
db.initCollection("cinemas");
db.initCollection('shows');
db.initCollection("cinemaTickets");

module.exports = {
  retrieveAllCinemaTicket : retrieveAllCinemaTicket,
  retrieveCinemaTicket : retrieveCinemaTicket,
  addCinemaTicket : addCinemaTicket,
  deleteCinemaTicket : deleteCinemaTicket,
  retrieveAllCinema : retrieveAllCinema,
  retrieveAllShowInCinema : retrieveAllShowInCinema
};

function retrieveAllCinemaTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
      try {
        res.json(db.getObjects("cinemaTickets", (item) => item.userId === req.userId))
      } catch (e) {
          res.json([]);
      }
    } else {
        res.status(403).json({
            message: "User can only view its own cinema tickets."
        });
    }
}

function retrieveCinemaTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            res.json(db.getObject("cinemaTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value))
        } catch (e) {
            res.status(404).json({
                message: "No tickets found!"
            })
        }
    } else {
        res.status(403).json({
            message: "User can only view its own cinema tickets."
        });
    }
}

function addCinemaTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
          var ticket = req.swagger.params.ticket.value;
          db.getObject("cards", (item) => item.userId === req.userId && item._id === ticket.cardId);
          try {
              var show = db.getObject("shows", (item) => item._id === ticket.showId);
              if (show.freePositions.some((item) => item.row === ticket.row && item.seat === ticket.seat)) {
                db.updateObject("shows", (item) => item._id === ticket.showId, {
                  freePositions: show.freePositions.filter((item) => item.row !== ticket.row || item.seat !== ticket.seat)
                });
                ticket.purchaseDate = (new Date()).toISOString();
                ticket.userId = req.userId;
                let id = db.createObject("cinemaTickets", ticket);
                ticket._id = id._id;
                res.status(201).json();
              } else {
                  res.status(403).json({
                      message: "Position already taken!"
                  })
              }
          }
          catch (e) {
              res.status(404).json({
                  message: "Card not found!"
              })
          }
        } catch (e) {
            res.status(404).json({
                message: "Card not found!"
            })
        }
    } else {
        res.status(403).json({
            message: "User only view its own cinema tickets."
        });
    }
}

function deleteCinemaTicket(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            let ticket = db.getObject("cinemaTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value);
            let show = db.getObject("shows", (item) => item._id === ticket.showId);
            if ((new Date() - Date.parse(show.startTime)) < 0) {
              show.freePositions.push({
                  row: ticket.row,
                  seat: ticket.seat
              });
              db.updateObject("shows", (item) => item._id === ticket.showId, {
                freePositions: show.freePositions
              });
              db.deleteObject("cinemaTickets", (item) => item.userId === req.userId && item._id === req.swagger.params.ticketId.value);
              res.status(204).json();
            } else {
              res.status(403).json({
                  message: "Show has already been started!"
              })
            }
        } catch (e) {
            res.status(404).json({
                message: e.message
            })
        }
    } else {
        res.status(403).json({
            message: "User only delete its own cinema tickets."
        });
    }
}

function retrieveAllCinema(req, res) {
  try {
      res.json(db.getObjects("cinemas", (item) => (typeof req.swagger.params.city.value !== 'undefined') ?
          item.city.toLowerCase().includes(req.swagger.params.city.value.toLowerCase()) :
          true
      ));
  } catch (e) {
      res.status(404).json({
          message: "Cinema not found!"
      });
  }
}

function retrieveAllShowInCinema(req, res) {
  try {
      var cinema = db.getObject("cinemas", (item) => item._id === req.swagger.params.cinemaId.value);
      var shows = db.getObjects("shows", (item) => item.cinemaId === req.swagger.params.cinemaId.value);
      res.json({
          summary: cinema,
          shows: shows
      })
  } catch (e) {
      res.status(404).json({
          message: e.message
      });
  }
}

