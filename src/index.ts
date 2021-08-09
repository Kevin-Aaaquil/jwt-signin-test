import express from "express";
import cors from "cors";
import config from "./config";
import DB from "./db";
import jwt from 'jsonwebtoken'
import { generateAuthToken, generateTokens, isLoggedIn, refreshTokens } from "./auth";
import { User } from "./Types";
const app = express();
DB().catch((err) => console.log(err));

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

app.post('/login',async (req,res)=>{
  const {username, password} = req.body
  if(!username || !password) return res.sendStatus(400)
  if(!(username === "admin" && password==="root")) return res.sendStatus(401)
  const response = await generateTokens({name: username, userID:password})
  res.status(200).json({response, user:{name : username, password:password}})
})

app.post('/token', async (req,res)=>{
  const {token} = req.body;
  if(token == null) return res.send(401)
  if(!refreshTokens.has(token)) return res.sendStatus(403);
  await jwt.verify(token, config.REFRESH_TOKEN_SECRET,async (err,user : User)=>{
    if (err) return res.sendStatus(403)
    const {name , userID} = user
    const newAccessToken = await generateAuthToken({name,userID})
    return res.json({newAccessToken})
  })
})

// protected route
app.get('/',isLoggedIn,(req,res)=>{
  res.send("This is your profile")
})

app.delete('/logout',isLoggedIn,(req,res)=>{
refreshTokens.delete(req.body.token)
res.send("logged out")
})

const port: number = parseInt(<string>config.PORT, 10);
app.listen(port, () => {
  console.log(`✅ : listening on port ${port}`);
});
