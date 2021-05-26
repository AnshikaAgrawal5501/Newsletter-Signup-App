const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv').config();

console.log(process.env.API_KEY);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) {

    const apiKey = process.env.API_KEY;
    const listId = '6c35550be3';

    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    //console.log(fName, lName, email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = `https://us6.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: `anshika:${apiKey}`
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});