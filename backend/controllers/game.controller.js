import Game from '../models/Game.js'



export const getGames=async(req,res)=>{
    try{
        const games=await Game.find()
        res.json({success:true,payload:games})

    }
    catch(err){
        console.log(err)
    }
}

export const addGame=async(req,res)=>{
     try{
       const {rank,name,appId,developer,publisher,genres,playerCount,popularity,rating,totalReviews,price,photo,url}=req.body

       if(!rank || !name || !appId){
        return res.json({success:false,message:"Rank, Name and AppId are required"})
       }

       const newgame=new Game({
        rank,name,appId,developer,publisher,genres,playerCount,popularity,rating,totalReviews,price,photo,url
       })
       await newgame.save();

       res.json({success:true,payload:newgame})

    }
    catch(err){
        console.log(err)
    }
}

export const removeGame=async(req,res)=>{
    try{
        const {id}=req.params;
        const game=await Game.findById(id)
        if(!game){
            return res.json({success:false,message:"game not found"})
        }

        await Game.findByIdAndDelete(id,{new:true})

        res.json({success:true,message:"game removed successfully"})

    }
    catch(err){
        console.log(err)
    }
}