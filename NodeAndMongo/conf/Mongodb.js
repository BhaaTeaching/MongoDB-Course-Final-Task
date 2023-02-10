import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://test:bhaa123@lec12.um8ucmk.mongodb.net/?retryWrites=true&w=majority"; //put your connection url
const client = new MongoClient(url);
const database = client.db("Lec12"); //put your db name
export default database; //export the db
