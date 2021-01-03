const mongodb = require('mongodb'),
MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb)=>{
    MongoClient.connect('mongodb://localhost:27017/bookShop')
        .then(client=>{
            console.log('<-------------------> D B   C O N N E C T E D ! <------------------->');
            _db = client.db();
            cb();
        })
        .catch(err=>{
            console.log(err);
            throw err;
        });

};


const getDB =()=>{
    if(_db)
        return _db
    throw '---> E R O R R <-- N O  D B  F O U N D !';
};


exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
