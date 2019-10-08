var test = require('tape');
var request = require('supertest');
var app = require('./server');
//declare first test
test('First test!', function (t) {
    t.end();
});
//run first test
test('test the ping method', function (t) {
    request(app)
        .get('/api/ping')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            var expectedUsers = { "success": true };

            t.error(err, 'No error');
            t.same(res.body, expectedUsers, 'ping and returned data succes: true as expected');
            t.end();
        });
});

//declare second test
test('Second test!', function (t) {
    t.end();
});
//run second test
test('Test the posts method', function (t) {
    request(app)
        .get('/api/posts?tag=tech,history&sortBy=id&direction=desc')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.error(err, 'No error, passed data and no errors, response 200');
            t.end();
        });
});