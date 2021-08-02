import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}

app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
//validate the image_url query
    if ( !req.query.image_url ) {
      return res.status(400)
                .send(`image url is required`);
    }
//check if url is valid
 let param = req.query.image_url.toString();
 try {new URL(param);}
 catch(error) {return res.status(422).send("invalid image url");}
//filter the image
 try {var filteredpath = await filterImageFromURL(param);} catch(error) {return res.status(422).send(error);}
 let stringPath = filteredpath.toString();
 //check if the file exists before sending it and delete it when the response is sent
  if (!fs.existsSync(stringPath)) {return res.status(404).send("image url not found. please try again");}
    res.status(200)
       .sendFile(stringPath, () => {deleteLocalFiles([stringPath])});
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
