'use strict';

module.exports = {
    healthCheck : healthCheck
};

function healthCheck(req, res) {
    res.status(204).end();
}