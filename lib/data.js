/*
 *
 * Library for storing and editing data
 * 
 */
var fs = require('fs');
var path = require('path');
var lib = {};
// base dir for folder
lib.BaseDir = path.join(__dirname, '../.data/')

// writing data to the file
lib.create = function(dir, fileNanme, data, callback) {
    // opening the file for writing
    fs.open(lib.BaseDir+dir+'/'+fileNanme+'.json','wx',function(err,fileDescriptor){ //fileDescriptor way to uniquely define a file
        if(!err && fileDescriptor) {
            // convert data to string
            var stringData = JSON.stringify(data);
            // write file and close it
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err) {
                    fs.close(fileDescriptor,function(err){
                        if(!err) {
                            callback(false);
                        } else {
                            callback('Error while closing the file')
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create a new file it might already be there');
        }
    });

}
// read data from file
lib.read = function(dir,file,callback) {
    fs.readFile(lib.BaseDir+dir+'/'+file+'.json','utf-8',function(err,data){
        callback(err,data);
    })
}
// update the data
lib.update = function(dir,file,data,callback) {
    // open the file
    fs.open(lib.BaseDir + dir + '/' + file + '.json','r+', function(err,fileDescriptor){
        if(!err && fileDescriptor) {
             // convert data to string
            var stringData = JSON.stringify(data);
            // truncate the data
            fs.ftruncate(fileDescriptor, function(err){
                if(!err) {
                    // write to the file and use it
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err) {
                            fs.close(fileDescriptor,function(err) {
                                callback(false);
                            })
                        } else {
                            callback('error while writing to existing file')
                        }
                    })
                } else {
                    callback('error truncating file')
                }
            })
        } else {
            callback('could not open the file it may not exist yet');
        }
    })
}
// delete the file 
lib.delete = function(dir,fileName, callback) {
    fs.unlink(lib.BaseDir+dir+'/'+fileName+'.json',function(err){
        if(!err) {
            callback(false);
        } else {
            callback("error while deleteing file");
        }
    })
}
module.exports = lib;
