/** Module used by express to route web requests
 * @module routes
 */
var sampleMiddleware,
    saveEntry,
    loadEntry,
    db_sample = require('./db_helpers/sample_helper');
module.exports = function (app) {
    app.get('/api/sample', sampleMiddleware, function (req, res) {
        res.json({
            err: req.err,
            message: req.message
        })
    });
    app.post('/api/sample_entry', saveEntry, function (req, res) {
        if (!req.body.text) {
            return res.status(400).json({err: new Error("No text parameter !")});
        }
        res.json({
            err: req.err,
            id: req.id
        })
    });
    app.get('/api/sample_entry/:id', loadEntry, function (req, res) {
        res.json({
            err: req.err,
            entry: req.entry
        })
    })
    // This route catches any call on the api not matching the previous routes
    app.use(function (req, res, next) {
        return res.status(404).json({err: 'Not Found'});
    });

    // This route catches all errors and replies with an error code
    // It should avoid the server from crashing or not replying in a json format
    app.use(function (err, req, res, next) {
        if (!res.statusCode || res.statusCode < 400) {
            res.status(400);
        }
        return res.json({err: err.message});
    });
};


/**
 * Sample middleware
 * @param  {Object}   req  Express requests
 * @param  {Object}   res  Express response
 * @param  {Function} next Function called when done
 */
sampleMiddleware = function (req, res, next) {
    req.err = null;
    req.message = "Hello World";
    next();
};

/**
 * Save a sample entry to db
 * @param  {Object}   req  Express requests
 * @param  {String}   req.body.text String to save
 * @param  {Object}   res  Express response
 * @param  {Function} next Function called when done
 */
saveEntry = function(req, res, next) {
    db_sample.add_entry(req.body.text, function(err) {
        req.err = err;
        if (!err) {
            req.id = this.lastID;
        }
        next();
    });
};

/**
 * Retrieves a sample entry from db
 * @param  {Object}   req  Express requests
 * @param  {Interger} req.params.id Identifier to retrieve
 * @param  {Object}   res  Express response
 * @param  {Function} next Function called when done
 */
loadEntry = function(req, res, next) {
    db_sample.get_entry(req.params.id, function(err, entry) {
        console.log(err);
        console.log(entry);
        req.err = err;
        if (!err) {
            req.entry = entry;
        }
        next();
    });
};
