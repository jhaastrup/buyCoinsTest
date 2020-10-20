 const app = require('../index')
const supertest = require ("supertest"); 

const request = supertest(app); 

test("calculate price", async (done) =>{
    request
    .post("/graphiql")
    .send({ query: '{ calculatePrice(type: buy, exchangeRate: 460, margin: 0.2)}'})
    .end(function (err, res) {
        if (err) return done(err);
        //console.log(res);
        expect(res.body.data.calculatePrice)
        done();
      });

})