'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

const swaggerSecurity = require('./api/helpers/SwaggerSecurity');

var db = require('./api/helpers/db');

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: swaggerSecurity.swaggerSecurityHandlers
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

    db.initCollection('cinemas');
    db.initCollection('shows');
    db.initCollection('parkingCities');
    db.initCollection('parkingSpots');
    db.initCollection('motorwayPrices');

    var cinema1 = db.createObject('cinemas', {
        cinemaName: "Cinema City",
        zip: "6000",
        city: "Kecskemét",
        street: "Korona u.",
        address: "1."
    });
    var cinema2 = db.createObject('cinemas', {
        cinemaName: "Cinema City Simple IMAX Arena",
        zip: "1087",
        city: "Budapest",
        street: "Kerepesi út",
        address: "9."
    });
    db.createObject('shows', {
        cinemaId: cinema1._id,
        startTime: new Date("2018-10-22 10:10:00").toISOString(),
        movie: {
            name: "Bohemian Rhapsody",
            summary: "A chronicle of the years leading up to Queen's legendary appearance at the Live Aid (1985) concert.",
            coverUrl: "https://m.media-amazon.com/images/M/MV5BNDg2NjIxMDUyNF5BMl5BanBnXkFtZTgwMzEzNTE1NTM@._V1_SY1000_CR0,0,629,1000_AL_.jpg",
            imdbLink: "https://www.imdb.com/title/tt1727824"
        },
        price: "2199",
        hall: "2",
        maxRows: 10,
        maxSeatsPerRow: 15,
        freePositions: [
            {
                row: 4,
                seat: 12
            },
            {
                row: 4,
                seat: 13
            },
            {
                row: 4,
                seat: 14
            },
            {
                row: 12,
                seat: 1
            },
            {
                row: 12,
                seat: 2
            },
            {
                row: 1,
                seat: 1
            }
        ]
    });
    db.createObject('shows', {
        cinemaId: cinema1._id,
        startTime: new Date("2022-12-23 10:10:00").toISOString(),
        movie: {
            name: "Fantastic Beasts: The Crimes of Grindelwald",
            summary: "The second installment of the \"Fantastic Beasts\" series featuring the adventures of Magizoologist Newt Scamander.",
            coverUrl: "https://m.media-amazon.com/images/M/MV5BZjFiMGUzMTAtNDAwMC00ZjRhLTk0OTUtMmJiMzM5ZmVjODQxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
            imdbLink: "https://www.imdb.com/title/tt4123430"
        },
        price: "2299",
        hall: "1",
        maxRows: 10,
        maxSeatsPerRow: 10,
        freePositions: [
            {
                row: 4,
                seat: 8
            },
            {
                row: 4,
                seat: 6
            },
            {
                row: 4,
                seat: 3
            },
            {
                row: 1,
                seat: 1
            },
            {
                row: 1,
                seat: 2
            },
            {
                row: 1,
                seat: 3
            }
        ]
    });
    db.createObject('shows', {
        cinemaId: cinema2._id,
        startTime: new Date("2018-10-24 10:10:00").toISOString(),
        movie: {
            name: "Bohemian Rhapsody",
            summary: "A chronicle of the years leading up to Queen's legendary appearance at the Live Aid (1985) concert.",
            coverUrl: "https://m.media-amazon.com/images/M/MV5BNDg2NjIxMDUyNF5BMl5BanBnXkFtZTgwMzEzNTE1NTM@._V1_SY1000_CR0,0,629,1000_AL_.jpg",
            imdbLink: "https://www.imdb.com/title/tt1727824"
        },
        price: "2199",
        hall: "2",
        maxRows: 20,
        maxSeatsPerRow: 30,
        freePositions: [
            {
                row: 12,
                seat: 23
            },
            {
                row: 12,
                seat: 24
            },
            {
                row: 12,
                seat: 25
            },
            {
                row: 1,
                seat: 1
            },
            {
                row: 2,
                seat: 4
            },
            {
                row: 5,
                seat: 3
            }
        ]
    });
    var city1 = db.createObject('parkingCities', {
        name: "Kecskemét",
        posX: 46.8857078,
        posY: 19.5389735
    });
    var city2 = db.createObject('parkingCities', {
        name: "Szeged",
        posX: 46.232941,
        posY: 20.0003851
    });
    db.createObject('parkingSpots', {
        city: {
            _id: city1._id,
            name: "Kecskemét",
            posX: 46.8857078,
            posY: 19.5389735
        },
        zone: "1",
        price: "400.00",
        areaPoly: [
            { x: 46.8857278, y: 19.5389735},
            { x: 46.8857278, y: 19.5389835},
            { x: 46.8857478, y: 19.5389835},
            { x: 46.8857278, y: 19.5389735}
        ]
    });
    db.createObject('parkingSpots', {
        city: {
            _id: city1._id,
            name: "Kecskemét",
            posX: 46.8857078,
            posY: 19.5389735
        },
        zone: "2",
        price: "350.00",
        areaPoly: [
            { x: 46.8857478, y: 19.5389735},
            { x: 46.8857678, y: 19.5389235},
            { x: 46.8857478, y: 19.5389835},
            { x: 46.8857478, y: 19.5389735}
        ]
    });
     db.createObject('parkingSpots', {
        city: {
            id: city2._id,
            name: "Szeged",
            posX: 46.232941,
            posY: 20.0003851
        },
        zone: "1",
        price: "420.00",
        areaPoly: [
            { x: 46.232941, y: 20.0003951},
            { x: 46.233041, y: 20.0003851},
            { x: 46.233041, y: 20.0003851},
            { x: 46.232941, y: 20.0003951}
        ]
    });
    db.createObject('motorwayPrices', {
        priceCategory: "Weekly",
        price: "2975",
        duration: 7
    });
    db.createObject('motorwayPrices', {
        priceCategory: "Monthly",
        price: "4780",
        duration: 30
    });
    db.createObject('motorwayPrices', {
        priceCategory: "Yearly",
        price: "42980",
        duration: 365
    });


    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 10010;
    app.listen(port);
});
