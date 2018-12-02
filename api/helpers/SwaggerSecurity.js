var db = require('./db');
db.initCollection("sessions");

module.exports = {
    swaggerSecurityHandlers: {
        ApiKeyAuth: function(req, authOrSecDef, scopesOrApiKey, callback) {
            if (scopesOrApiKey) {
                try {
                    const session = db.getObject("sessions", item => item._id === scopesOrApiKey);
                    req.userId = session.user;
                    req.sessionId = scopesOrApiKey;

                    callback();
                } catch ( e) {
                    callback(new Error('Api key missing or not registered'));
                }
            } else {
                callback(new Error('Api key missing or not registered'));
            }
        }
    }
};