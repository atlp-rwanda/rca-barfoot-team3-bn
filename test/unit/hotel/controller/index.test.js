const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');

chai.use(chaiHttp);


describe('GET /', () => {
    it('should return status code 200 and a message', (done) => {
      chai.request('http://localhost:3000')
        .get('/')
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.text, 'Hello World!');
          done();
        });
    });
  });
  