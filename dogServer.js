const http = require("http");
const path = require("path");
const express = require("express"); 
const app = express(); 
const portNumber = Number(process.argv[2]);
const fs = require("fs");
process.stdin.setEncoding("utf8");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname));
const router = express.Router();
app.use("/", router);




const breeds =["Labrador","German Shepherd","Pug","Husky","Beagle","Bulldog","Golden Retriever"];


app.listen(Number(process.argv[2]));

if (process.argv.length != 3) {
  process.stdout.write(`Usage dogServer.js portNumber`);
  process.exit(0);
}


process.stdout.write(`Web server started and running at http://localhost:${portNumber} \n`);
const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
  const dataInput = process.stdin.read();
  if (dataInput !== null) {
    const command = dataInput.trim();
      if(command === "stop") {
      process.stdout.write("Shutting down the server\n");
      process.exit(0);
    } else {
      process.stdout.write("Invalid command: " + command + "\n");
    }
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});


require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const databaseName = "dogInformation";
const collectionName = "voteData";
const uri = process.env.MONGO_CONNECTION_STRING;
let collection;

async function main() {
  
   const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });


      await client.connect();
      const database = client.db(databaseName);
      collection = database.collection(collectionName);
   
  }

  main();

app.set("view engine", "ejs");

app.set("views", path.resolve(__dirname, "templates"));


router.get("/", (request, response) => {
  response.render("index");
});

router.get("/dogGenerator", (request, response)=>{
    response.render("generateImage.ejs");
})


app.get("/dogVoting", (request, response)=>{
    response.render("VotingPage.ejs");
})

app.post("/dogVoting", async (req, res) => {
  const { name,breed } = req.body;
  await collection.updateOne({breed},{$inc:{votes:1} },{upsert:true});
  res.redirect("/dogTable");

});

app.get("/dogTable", async (req, res) => {
  const allDogs=await collection.find({}).toArray();
  const table =allDogs.map(d => `<tr><td>${d.breed}</td><td>${d.votes || 0}</td></tr>`).join("");
  // const filter = {};
  // cursor = collection.find(filter);
  // result = await cursor.toArray();
  res.render("ProcessVotingPage", { table });

});
