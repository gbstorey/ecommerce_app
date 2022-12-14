const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dotenv = require('dotenv')

let _db;

dotenv.config()
MONGO_DB_PASS = process.env.MONGO_DB_PASS

const mongoConnect = (callback) => {
    MongoClient.connect(`mongodb+srv://admin:${MONGO_DB_PASS}@cluster0.smimobs.mongodb.net/shop?retryWrites=true&w=majority`)
        .then(client => {
            console.log('MongoDB client connected successfully.');
            _db = client.db()
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

module.exports = {
    mongoConnect,
    getDb
}