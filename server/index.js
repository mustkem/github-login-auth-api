const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
var cors = require("cors");
const { client_id, client_secret } = require("./config");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
//   next();
// });

app.post("/authenticate", (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", client_id);
  data.append("client_secret", client_secret);
  data.append("code", code);

  console.log("test sdasd asdasd asdasd ");

  let access_token = "";

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      access_token = params.get("access_token");
      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      console.log("access_token", access_token);
      return res
        .status(200)
        .json({ access_token, isAuthenticated: true, ...response });
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.get("/", (req, res) => {
  return res.status(200).json({ success: true });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on ${port}`));
