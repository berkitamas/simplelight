'use strict';

var db = require('../helpers/db');
db.initCollection('cards');

module.exports = {
    retrieveAllCard : retrieveAllCard,
    retrieveCard : retrieveCard,
    addCard : addCard,
    updateCard : updateCard,
    deleteCard : deleteCard
};

function retrieveAllCard(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            let cards = db.getObjects("cards", item => item.userId === req.userId);
            res.json(cards);
        } catch (e) {
            res.json([]);
        }
    } else {
        res.status(403).json({
            message: "User only view its own cards."
        });
    }
}

function retrieveCard(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            let card = db.getObject("cards", item => item.userId === req.userId && item._id === req.swagger.params.cardId.value);
            res.json(card);
        } catch (e) {
            res.status(404).json({
                message: "Card not found!"
            });
        }
    } else {
        res.status(403).json({
            message: "User only view its own cards."
        });
    }
}

function addCard(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        let card = req.swagger.params.card.value;
        card.userId = req.userId;
        card.cardNumber = card.cardNumber.replace(/[^0-9]/g, '');
        if (card.cardNumber.length === 16) {
            var id = db.createObject("cards", card);
            card._id = id._id;
            res.status(201).json(card);
        } else {
            res.status(404).json({
                message: "Card format is invalid!"
            })
        }
    } else {
        res.status(403).json({
            message: "User only edit its own cards."
        });
    }
}

function updateCard(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            db.updateObject("cards", item => item.userIs === req.userId && item._id === req.swagger.params.cardId.value, req.swagger.params.card.value);
            res.json(req.swagger.params.card.value);
        } catch (e) {
            res.status(404).json({
                message: "Card not found!"
            });
        }
    } else {
        res.status(403).json({
            message: "User only view its own cards."
        });
    }
}

function deleteCard(req, res) {
    if (req.userId === req.swagger.params.userId.value) {
        try {
            db.deleteObject("cards", item => item.userId === req.userId && item._id === req.swagger.params.cardId.value);
            res.status(204).json();
        } catch (e) {
            res.status(404).json({
                message: "Card not found!"
            });
        }
    } else {
        res.status(403).json({
            message: "User only view its own cards."
        });
    }
}