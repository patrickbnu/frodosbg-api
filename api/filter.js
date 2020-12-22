// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1))

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}


module.exports = async (req, res) => {

  let filter = req.body;
 

  let registro = {};
  if(filter) {

      const db = await connectToDatabase(process.env.MONGODB_URI) 

      const collection = await db.collection('filter')
    
      registro = JSON.parse(JSON.stringify(filter.filter))
      console.log(registro)
   
      //collection.insertOne({gameName: 'Patrickcide',category: 'Categoria',onlyAvailable: false,complexityRating: 5});
      collection.insertOne(registro);
  }

  //const xx = await collection.find().toArray();
  //console.log(xx)

  // Respond with a JSON string of all users in the collection
  res.status(200).json(registro)  
  
}