var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require("axios");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    calculatePrice(type: Exchange, margin: Float, exchangeRate: Int) : Float
  }
  enum Exchange {
    buy
    sell
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  calculatePrice:async (args) =>{
    const url = "https://api.coindesk.com/v1/bpi/currentprice.json";
    const data = await axios.get(url);
    //console.log(data.data);
    let USDRes = data.data.bpi.USD.rate_float;
    let marginPercent = args.margin/100
    if(args.type === "buy") {
      let resBuy = USDRes + marginPercent;
      let finalRes = resBuy * args.exchangeRate;
      //console.log("BuY",finalRes);
      return finalRes;
    }
    if(args.type === "sell") {
      let resSell = USDRes - marginPercent;
      let finalRes = resSell * args.exchangeRate;
     // console.log("SeLL",finalRes);
      return finalRes 
    }
  },

};

var app = express();
app.use('/graphiql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');