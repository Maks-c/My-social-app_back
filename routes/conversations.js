const Conversation = require('../models/Conversation')
const router = require('express').Router();


// NEW CONV

router.post('/', async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });
    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    } catch (e){
        res.status(500).json(e)
    }
});

//GET CONV OF A USER

router.get('/:userId', async (req,res)=>{
    try{
        const conversation=await Conversation.find({
            members: {
                $in:[req.params.userId]
            },
        })
        res.status(200).json(conversation)
    }catch (e){
        res.status(500).json(e)
    }

})


module.exports = router