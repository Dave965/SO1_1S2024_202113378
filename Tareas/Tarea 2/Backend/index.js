const express = require("express");
var cors = require('cors')
const app = express();
const PORT = process.env.PORT || 9000;
const {MongoClient} = require("mongodb");

const uri = "mongodb://mongodb:27017/SO1_T2_DB";
const client = new MongoClient(uri);
client.connect();
const fotos_db = client.db("SO1_T2_DB");
const fotos_c = fotos_db.collection("fotos");

app.use(express.json());
app.use(cors());

app.post('/cargar_foto', function(req,res){
const query = {foto: ""};
const update = {
	$set:{
		foto: req.body.foto,
		timestamp: req.body.fecha
	}
};
const options = {upsert: true};

fotos_c.updateOne(query,update,options);
res.send({"mensaje": "se ha agregado la foto a la base de datos"});
});

app.get('/ultima_foto', async function(req,res){
const filter = {};
const sort = {
  'timestamp': -1
};

const cursor = fotos_c.find(filter, { sort });
const result = await cursor.toArray();

if(result.length == 0){
	res.send({"resultado":false, "mensaje": "No hay fotos en la base de datos"})
}else{
	res.send({"resultado":true, "mensaje": result[0]})
}

});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});