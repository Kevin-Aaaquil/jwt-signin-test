import express from 'express'
import cors from 'cors'
import config from './config';
const app = express();





const port : number = parseInt(<string>config.PORT,10);
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})