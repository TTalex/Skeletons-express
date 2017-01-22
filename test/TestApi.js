process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require('supertest');
var agent = request.agent("https://127.0.0.1:8080");
var assert = require('assert');
describe('TestApi', function() {
    describe('GET /api/sample', function () {
        it('should retrieve a message', function (done) {
            agent
                .get('/api/sample')
                .expect(200)
                .expect(function (res) {
                    assert(res.body.err === null);
                    assert(res.body.message === "Hello World");
                })
                .end(done);
        });
    });
    var entry_id;
    describe('POST /api/sample_entry/', function () {
        it('should add an entry', function (done) {
            agent
                .post('/api/sample_entry/')
                .send({text: "Hello World"})
                .expect(200)
                .expect(function (res) {
                    assert(res.body.err === null);
                    assert(res.body.id);
                    entry_id = res.body.id;
                })
                .end(done);
        });
    });
    describe('GET /api/sample_entry/:id', function () {
        it('should retrieve an entry', function (done) {
            agent
                .get('/api/sample_entry/' + entry_id)
                .expect(200)
                .expect(function (res) {
                    console.log(res.body);
                    assert(res.body.err === null);
                    assert(res.body.entry);
                    assert(res.body.entry.text === "Hello World");
                })
                .end(done);
        });
    });
})
