const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

// Require MailChimp and Async
const mailchimp = require('@mailchimp/mailchimp_marketing');
const async = require('async');
const {
    response
} = require('express');

const app = express();
const port = 3000;


// Setting Up Static Path and Body Parser
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Configure MailChimp Settings
mailchimp.setConfig({
    apiKey: "2b2083797181d748ad01b77bb655f011-us6",
    server: 'us6'
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const listID = "b4eeeeafce";

    // Declares a function to be used later. It will be used to send info to MailChimp
    async function run() {
        // Try/Catch is used on async functions to catch any errors that come back
        try {
            const response = await mailchimp.lists.addListMember(listID, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            });
            res.sendFile(__dirname + "/success.html");

        } catch (err) {
            console.log(err);
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();

    //res.send("Thanks for the signup, " + firstName + "!");

});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});