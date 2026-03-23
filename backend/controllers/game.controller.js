  import Game from '../models/Game.js'
  import User from '../models/User.js'
  import {io} from '../config/socket.js'
  import {returnUsersocket} from '../config/socket.js'

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

  //add a new game to user

  export const addGametoUser=async(req,res)=>{
      try{
          const {userId}=req;
          const {gameId}=req.body;

          const user=await User.findById(userId);
          if(!user){
              return res.json({success:false,message:"user not found to add a game"})
          }
          const game=await Game.findById(gameId);
          if(!game){
              return res.json({success:false,message:"game not found to add a user"})
          }

          const alreadyAdded=user.games.find((g)=>g.game.toString()===gameId.toString())
  if(alreadyAdded){
              return res.json({success:false,message:"game already added to user"})
          }

          await User.updateOne(
        { _id: userId },
        {
        $push: {
  games: {
    game: gameId,
    totalTimePlayed: 0,
    startTime: null,
    status: "Completed"
  }
}
        }
      );
          

          res.json({success:true,message:"game added to user successfully"})

      }
      catch(err){
          console.log(err)
      }
      
  }


  export const calculateTimePlayed = async (req, res) => {
    try {
      const { userId } = req;
      const { gameId } = req.body;

      const user = await User.findOne(
        {
          _id: userId,
          "games.game": gameId
        },
        {
          "games.$": 1
        }
      );

      if (!user || !user.games.length) {
        return res.json({ success: false, message: "Game not found for user" });
      }

      const gameData = user.games[0];

      if (!gameData.startTime) {
        return res.json({ success: false, message: "Game was not started" });
      }

      const now = new Date();
      const diffMs = now - new Date(gameData.startTime);
      const diffMin = Math.floor(diffMs / 60000);
      

      const game=await Game.findById(gameId)

      await User.updateOne(
        {
          _id: userId,
          "games.game": gameId
        },
        {
          $inc: {
            "games.$.totalTimePlayed": diffMin
          },
          $set: {
            "games.$.startTime": null,
            "games.$.status": "Completed",
            "currentlyPlaying":"",
            "prevPlayed":game?.name || "",
            "prevPlayingTime":diffMin,
            
          }
        }
      );

      io.emit('userCurrentPlaying',{
        _id:userId,
        currentlyPlaying:"",
        status: "Completed",
        prevPlayed:game?.name || "",
        prevPlayingTime:diffMin,
        gameId
      })

      res.json({
        success: true,
        message: "time played updated successfully",
        
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const startGame = async (req, res) => {
    try {
      const { userId } = req;
      const { gameId } = req.body;

      const user = await User.findOne(
        {
          _id: userId,
          "games.game": gameId
        },
        {
          "games.$": 1
        }
      );

      if (!user || !user.games.length) {
        return res.json({ success: false, message: "Game not found for user" });
      }

      const gameData = user.games[0];
  const game = await Game.findById(gameId);
      if (gameData.status === "Playing") {
        return res.json({ success: false, message: "Game already running" });
      }

      await User.updateOne(
        {
          _id: userId,
          "games.game": gameId
        },
        {
          $set: {
            "games.$.startTime": new Date(),
            "games.$.status": "Playing",
            "currentlyPlaying":game?.name || ""
          }
        }
      );
      io.emit('userCurrentPlaying',{
        _id:userId,
        currentlyPlaying:game?.name || "",
        status: "Playing",
        gameId
      })

      res.json({ success: true, message: "game started successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const markGameAway = async (req, res) => {
    try {
      const { userId } = req;
      const { gameId } = req.body;
      const game=await Game.findById(gameId)

      await User.updateOne(
        {
          _id: userId,
          "games.game": gameId
        },
        {
          $set: {
            "games.$.status": "Away",
            
            
          }
        }
      );

      io.emit('userCurrentPlaying',{
        _id:userId,
        currentlyPlaying:game.name,
        status: "Away",
        gameId
      })
      

      res.json({ success: true, message: "status changed to Away" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };