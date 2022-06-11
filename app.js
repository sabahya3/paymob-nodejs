const express = require("express");
const request = require("request");
const open = require("open");

const API_KEY = "put your api key here"; // put your api key here

const INTEGRATION_ID = "put your integration id here";

const ifameOne =
  "https://accept.paymob.com/api/acceptance/iframes/391769?payment_token=";

const iframeTwo =
  "https://accept.paymob.com/api/acceptance/iframes/391770?payment_token=";

const app = express();
app.use(express.json());

app.post("/visa", (req, res) => {
  var authToken = "";
  var orderId = "";
  const items = req.body.items;

  // first rquest to get token
  request.post(
    "https://accept.paymob.com/api/auth/tokens",
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: API_KEY }),
    },
    function (error, response) {
      if (error) {
        res.json("error occured");
      }
      authToken = JSON.parse(response.body).token;

      // secound request to make order
      request.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: authToken,
            delivery_needed: "false",
            amount_cents: "100",
            currency: "EGP",
            // items list from body
            items: items,
            shipping_data: {
              apartment: "803",
              email: "claudette09@exa.com",
              floor: "42",
              first_name: "Clifford",
              street: "Ethan Land",
              building: "8028",
              phone_number: "+86(8)9135210487",
              postal_code: "01898",
              extra_description: "8 Ram , 128 Giga",
              city: "Jaskolskiburgh",
              country: "CR",
              last_name: "Nicolas",
              state: "Utah",
            },
            shipping_details: {
              notes: " test",
              number_of_packages: 1,
              weight: 1,
              weight_unit: "Kilogram",
              length: 1,
              width: 1,
              height: 1,
              contents: "product of some sorts",
            },
          }),
        },
        (error, response) => {
          if (error) {
            res.json("error occured");
          }
          orderId = JSON.parse(response.body).id;

          // third request to get form link then direct to the browser
          request.post(
            "https://accept.paymob.com/api/acceptance/payment_keys",
            {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                auth_token: authToken,
                amount_cents: "100",
                expiration: 3600,
                order_id: orderId,
                billing_data: {
                  apartment: "803",
                  email: "claudette09@exa.com",
                  floor: "42",
                  first_name: "Clifford",
                  street: "Ethan Land",
                  building: "8028",
                  phone_number: "+86(8)9135210487",
                  shipping_method: "PKG",
                  postal_code: "01898",
                  city: "Jaskolskiburgh",
                  country: "CR",
                  last_name: "Nicolas",
                  state: "Utah",
                },
                currency: "EGP",
                integration_id: INTEGRATION_ID,
                lock_order_when_paid: "false",
              }),
            },
            (error, response) => {
              if (error) {
                res.json("error occured");
              }
              // if you want to open the browser
              open(ifameOne + JSON.parse(response.body).token);

              // if you want to return the link

              res.json(ifameOne + JSON.parse(response.body).token);
            }
          );
        }
      );
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
