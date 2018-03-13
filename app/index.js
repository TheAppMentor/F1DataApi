const eventEmitter = require('events');
const express = require('express');
var fs = require('fs'); // bring in the file system api
var sys = require('util');
var promise = require('promise')

const testFolder = './data_files/';

// Connect to Mongo DB
var mongodb = require('./mongoDBHandler.js')
var mongodbobj = new mongodb()

//Parse the CSV
var csvParser = require('./csvParser.js')

getDataFiles()
    .then((fileList) => {
        for (var fileName in fileList) {
            let filePath = fileList[fileName];
            parseCSVFile(filePath)
                .then((fileData) => {
                    console.log('Parsing file :' + filePath)
                    var collectionName = fileName.slice(0, -4) // Remove .csv
                    writeCSVToDB("formula1Data", collectionName, fileData)
                    setTimeout(() => {
                        console.log("My Time out... waiting..... ")
                    }, 5000);
                })
        }
    })
    .catch ((err) => {
    console.log(err);
})


function parseCSVFile(filePath) {
    return new Promise(function (resolve, reject) {
        console.log("parseCSVFile ... Working with file Path... ")
        console.log(filePath)
        // Generate Constuctors DB
        // var theParser = new csvParser("/Users/i328244/Desktop/NodeProjects/GarageManager/constructors.csv")
        var theParser = new csvParser(filePath)

        theParser.parseCSV()
            .then(
                (data) => {
                    resolve(data)
                },
                (err) => {
                    console.log("Some Error in the parse");
                })
            .catch((err) => {
                console.log(err)
            })
    })
}

function writeCSVToDB(dbName, collectionName, csvData) {
    return new Promise((resolve, reject) => {
        //mongodbobj.insertManyValues("f1db", "constructors", data)
        console.log('insertingVlaues into DB.... ')
        mongodbobj.insertManyValues(dbName, collectionName, csvData)
        resolve()
    }),
        (err) => {
            reject(err)
        }
}

function getDataFiles() {

    var filesToLoad = {};

    return new Promise(function (resolve, reject) {
        fs.readdir(testFolder, (err, files) => {
            var nonHiddenFiles = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
            nonHiddenFiles.forEach(file => {
                var fullFilePath = "./data_files/" + file
                //console.log(fullFilePath);
                //var tempObj = {};
                filesToLoad[file] = fullFilePath
            });
            // Exclude all hidden files.
            //filesToLoad = filesToLoad.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

            console.log(filesToLoad)
            resolve(filesToLoad)
        })
    })
}


// getDataFiles().forEach(element => {
//     var fullFilePath = '/Users/i328244/Desktop/NodeProjects/GarageManager/' + element
//     console.log(element )
// });

// // Connect to Mongo DB
// var mongodb = require('./mongoDBHandler.js')
// var mongodbobj = new mongodb()

// //Parse the CSV
// var csvParser = require('./csvParser.js')

// var allFiles =  ['/Users/i328244/Desktop/NodeProjects/GarageManager/constructors.csv',
// '/Users/i328244/Desktop/NodeProjects/GarageManager/constructors.csv']

// allFiles.forEach(element => {
//     console.log("Loading files... ")
// });

// // Generate Constuctors DB
// var theParser = new csvParser("/Users/i328244/Desktop/NodeProjects/GarageManager/constructors.csv")
// theParser.parseCSV().then(
//     (data) => {
//         console.log("Parser Returned something");
//         // console.log(data);
//         mongodbobj.insertManyValues("f1db","constructors",data)
//     }, 
//     (err) => {
//         console.log("Some Error in the parse");
//     }
// )


// // Generate Constuctors DB
// var theParser = new csvParser("/Users/i328244/Desktop/NodeProjects/GarageManager/circuits.csv")
// theParser.parseCSV().then(
//     (data) => {
//         console.log("Parser Returned something");
//         // console.log(data);
//         mongodbobj.insertManyValues("f1db","circuits",data)
//     }, 
//     (err) => {
//         console.log("Some Error in the parse");
//     }
// )


// // Generate Constuctors DB
// var theParser = new csvParser("/Users/i328244/Desktop/NodeProjects/GarageManager/constructorResults.csv")
// theParser.parseCSV().then(
//     (data) => {
//         console.log("Parser Returned something");
//         // console.log(data);
//         mongodbobj.insertManyValues("f1db","constructorResults",data)
//     }, 
//     (err) => {
//         console.log("Some Error in the parse");
//     }
// )

// var mustacheExpress = require('mustache-express');
// // Register '.mustache' extension with The Mustache Express
// const app = express()
// app.engine('mustache', mustacheExpress());

// app.set('view engine', 'mustache');
// app.set('views', __dirname + '/views');


// app.get("/",function(req,res){
//     res.render('mainpage', {title: 'Hello.. Boys',names : [{name: "Prashanth"}, {name: "Sheia"}, {name: "Emma"}]});
// });

// app.get("/constructors",function(req,res){
//     console.log('Staring the /consructores route ')

//     mongodbobj.findAll('f1db','constructors').then(
//         (data) => {
//             console.log("We got back some data .. Yipee..")
//             var tempNames = [];
//                 data.forEach(element => {
//                 var tempDict = {name: element.constructorRef};
//                 tempNames.push(tempDict)
//                 });
//                 res.render('mainpage', {title: 'Constructors',names : tempNames});
//             }
//     )
// });

// app.listen(3000)