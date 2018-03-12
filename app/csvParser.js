// CSV Parser
var csv = require('csv-parser');
var fs = require('fs')
var events = require('events').EventEmitter


var CsvReader = require('promised-csv');
var reader = new CsvReader();

var records = [];
var list = [];

reader.on('row', function (data) {
  list.push(parseInt(data[0]));
});


class csvparser{

    constructor(fileName){
        this.fileName = fileName
    }

    // // Using promised-csv
    // parseCSV(){
        
    //     //this promise will get resolved to a list of integers from the file
    //     return reader.read(this.fileName, list);
    // }

    // parseCSV(){
    //     fs.createReadStream(this.fileName)
    //     .pipe(csv())
    //     .on('data', function (data) {
    //     // var rec = {name : data.name, constructorId : data.constructorId }
    //     // console.log("We Got back some data")
    //     // console.log(rec)
    //     emitter.emit("jsonRowFound",data)
    //     });   
    // }

    parseCSV(){
        return new Promise(
            (resolve,reject) => {
                fs.createReadStream(this.fileName)
                .pipe(csv())
                .on('data', (data) => {
                records.push(data)
                })
                .on('end', () => {
                resolve(records)
                })
        })
    }
}

module.exports = csvparser;

    