var MongoClient = require('mongodb').MongoClient,
    logger = require('./logger');

/*
 * Provides access to documents
 */
function Store(url, collection) {
    this.url = url;
    this.collection = collection;
};

module.exports = Store;

Store.prototype.get = function(id, callback) {
     this.exec(function(err, db, collection) {
        if (!err) {
            collection.findOne({id: id}, function (err, result) {
                if (!err && result) {
                    logger.log('info', 'Retrieved document.');
                } else {
                    logger.log('error', 'No document found.');
                    err = err || 'Not found';
                }
                db.close();
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
     });
};

Store.prototype.add = function(id, doc, callback) {
     this.exec(function(err, db, collection) {
        if (!err) {
            doc['id'] = id;
            collection.insert(doc, function (err, result) {
                if (!err) {
                    logger.log('info', 'Inserted document.');
                } else {
                    logger.log('error', 'Document insert failed.');
                }
                db.close();
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
     });
};

/**
 * Remove documents with a id property matching this id
 * allow for variations on a single id
 */
Store.prototype.delete = function(id, callback) {

};

Store.prototype.clear = function() {
    logger.log("Clear store");
};

Store.prototype.exec = function(func) {
    var store = this;
    MongoClient.connect(this.url, function(err, db) {
        if (!err) {
            logger.log('info', 'Connected to server at ' + store.url);
            func(null, db, db.collection(store.collection));
        } else {
            logger.log('error', 'Connect to server failed at ' + store.url);
            func(err, null, null);
        }
    });
};
