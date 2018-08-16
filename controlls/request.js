const https = require('https');

exports.request  = function(url,res,cb){
    this.url = url;
    
   https.get(this.url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
                        
        data = JSON.parse(buffer);
        //console.log(buffer);
        cb(data);
    });
   });
}
