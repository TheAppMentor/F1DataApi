var eventEmitter = require('events').EventEmitter
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var promise = require('promise')

class MongoDBHandler {

  connect(dbName,collectionName) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect("mongodb://localhost:27017/" + dbName, function (err, db) {
        if (err) reject(err);
        var dbo = db.db(dbName);
        console.log('💚 Connected to DB ->' + dbName)
        dbo.createCollection(collectionName)
        console.log('💚 Collection names are :')
        console.log(dbo.collections.count)
        resolve(dbo)
      });
      (err) => {
        console.log('🔴 Error in connecting.... ')
        console.log(err)
        reject(err)
      }
    })
  }

  insertValue(dbName, collectionName, object) {
    return new promise(
      (resolve, reject) => {
        this.connect(dbName)
          .then(
            function (dbo) {
              dbo.collection(collectionName).insertOne(object, function (err, res) {
                if (err) throw err;
                console.log("Inserted : %s", object.name);
                resolve()
              });
            }, function (err) {
              console.log(err)
              reject()
            })
      })
  }

  insertManyValues(dbName, collectionName, objectsArray) {
    console.log('\t mongH : insertManValues : Start')
    return new Promise(
      (resolve, reject) => {
        this.connect(dbName, collectionName)
          .then(
            (dbo) => {
              console.log('\t\t mongH : insertManValues : connected')
              // This is the promise success function.
              dbo.collection(collectionName).insert(objectsArray)
                .then(
                  (result) => {
                    console.log('\t\t\t mongH : insertManValues : Inserted')
                    console.log("We were able to insert many")
                    resolve()
                  }
                ), (err) => {
                  console.log(err)
                }
            })
            .catch((err)=>{
            console.log('🔴 We have an error in MondDB -> insertManyValues')
            console.log(err)
            reject(err)
            })
      })
  }

  findAll(dbName, collectionName) {
    // Insert a record into the database man.
    return new Promise(
      (resolve, reject) => {
        this.connect(dbName)
          .then(
            function (dbo) {
              console.log('IN the find all then.. .... ')
              dbo.collection(collectionName).find({}, { _id: 1 }).toArray(function (err, result) {
                if (err) throw err;
                console.log('WE will now resovle ...  ')
                resolve(result)
                // result.forEach(element => {
                //   console.log('IN the find all then.. .... ')
                //   resolve()
                // });
              }, function (err) {
                console.log(err)
                reject()
              })
            }
          )
      })
  }

  findRecordWithID(dbname,collectionName,recID) {
    // Insert a record into the database man.
    return new Promise(
      (resolve, reject) => {
        this.connect(dbName)
          .then(
            function (dbo) {
              dbo.collection(collectionName).find({ "_id": ObjectId("5aa410aea2f7e7b94b27a499") }, { _id: 1 }).toArray(function (err, result) {
                if (err) throw err;
                result.forEach(element => {
                  console.log(element);
                  resolve()
                });
              }, function (err) {
                console.log(err)
                reject()
              })
            }
          )
      })
  }

  deleteAllRecords(dbName) {
    // Insert a record into the database man.
    return new Promise(
      (resolve, reject) => {
        this.connect(dbName)
          .then(
            function (dbo) {
              dbo.remove()
              resolve()
            });
      }, function (err) {
        console.log(err)
        reject()
      })
  }


  closeDB(db) {
    db.close();
  }
}

module.exports = MongoDBHandler;