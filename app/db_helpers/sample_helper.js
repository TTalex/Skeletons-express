var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var file = "app/databases/sample.db";
var exists = fs.existsSync(file);

if (!exists) {
    console.log("Creating DB file " + file);
    fs.openSync(file, "w");
}

var db = new sqlite3.Database(file);

db.serialize(function () {
    db.run("PRAGMA journal_mode=MEMORY");
    if (!exists) {
        db.run(
            "CREATE TABLE Sample (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "text TEXT)"
        );
    }
});

var get_entry, add_entry;

/**
 * Retrieves a sample entry
 * @param  {Integer}  id Identifier of the entry
 * @param  {Function} cb Callback when done
 */
get_entry = function(id, cb) {
    db.serialize(function () {
        db.get("SELECT * FROM Sample WHERE id = ?", id, cb);
    })
};

/**
 * Adds a sample entry
 * @param  {String}   text Text to add to the entry
 * @param  {Function} cb   Callback when done
 */
add_entry = function(text, cb) {
    db.serialize(function () {
        db.run("INSERT INTO Sample VALUES (NULL, ?)", text, cb);
    })
};
/**
 * Simplifies acces to an sqlite database
 * @module sample_helper
 */
module.exports = {
    get_entry: get_entry,
    add_entry: add_entry
}
