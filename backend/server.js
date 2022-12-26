const express=require('express');
const app=express();
const port=8000;
app.get('/',(req,res,next)=>{
	res.status(200).send("Hello world!");
})
app.listen(port,()=>{
	console.log(`Listening on port ${port}`);
})
