var express = require("express");
var app = express();
var axios = require('axios');

//route to test that this server works
app.get("/api/ping", (req, res, next) => {
    res.status(200).json({ "success": true });
});

//route to get data from hatchways server
//must pass a tag value
app.get("/api/posts", async (req, res, next) => {
    //make sure a tag value exists.
    var tag = req.query.tag;
    if (tag == undefined) {
        return res.status(400).json({ "error": "Tags parameter is required" });
    }

    //make sure the sortBy param is correct
    var permittedtag = ["id", "reads", "likes", "popularity"]
    var sortBy = req.query.sortBy;
    if (sortBy == undefined || permittedtag.indexOf(sortBy) <= -1) {
        console.log(sortBy)
        return res.status(400).json({ "error": "sortBy parameter is invalid" });
    }

    //make sure the direction param is correct
    var permmiteddir = ["asc", "desc"]
    var direction = req.query.direction;
    if (direction == undefined || permmiteddir.indexOf(direction) <= -1) {
        console.log(direction)
        return res.status(400).json({ "error": "direction parameter is invalid" });
    }

    //split the tag list by comma
    var nameArr = tag.split(',');
    var array = []
    //get the data from hatchways and store it in a temporary array.
    for (var i = 0; i < nameArr.length; i++) {
        await axios.get('https://hatchways.io/api/assessment/blog/posts?tag=' + nameArr[i] + '&sortBy=' + sortBy + '&direction=' + direction)
            .then(function (response) {
                // handle success
                for (var t = 0; t < response.data.posts.length; t++) {
                    array.push(response.data.posts[t]);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    //filter out duplicates in data
    var clean = array.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.id === arr.id && t.authorId === arr.authorId)))
    //return filtered data with requested format
    return res.status(200).json({ Body: { posts: clean } });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//export the server object for testing
module.exports = app;