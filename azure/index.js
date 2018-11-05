var request = require("async-request");


module.exports = async function(context, req) {
    
        context.log('starting..');
        let auth = "Basic " + new Buffer(req.body.client_id + ":" + req.body.client_secret).toString("base64");
        
        var obj = {
            method: "POST",
            data: "grant_type=client_credentials",
            headers: {
                "Accept": "application/json",
                "Authorization": auth
            }
        };

        let res = await request("https://api.paypal.com/v1/oauth2/token",obj);
        
        if (res.statusCode!=200) {
            context.res = { status: res.statusCode, body: JSON.parse(res.body).error_description };
            context.done();
            return;
        }

        
        var access_token = JSON.parse(res.body).access_token;
        console.log(access_token);


        obj={};
        
        var obj = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + access_token,
                "Accept": "application/json",
                "Content-Type":"application/json"
            }
        };

        if (req.body.payload) obj.data = (typeof req.body.payload=='string') ? JSON.parse(req.body.payload) : req.body.payload;
        

        var res2;
        try{
            res2 = await request(req.body.url, obj);


            if (res2.statusCode!=200) {
                context.res = { status: res2.statusCode, body: JSON.parse(res2.body).error_description };
                context.done();
                return;
            }

        }
        catch(err){
            console.log(err);
        }
        
        context.res = { status: res2.statusCode, body: res2.body };
        context.done();

};