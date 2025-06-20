
const rideModel=require('../model/ride.model');
const {publishToQueue}=require('../service/rabbit');
const mongoose=require('mongoose');

//Yaha par ek ride create hui par captain ko kaise pata chalege ki ride create hui hai 
// aur ride accept karne ke liye rideId kaise milega captain service mai jaakar hume inform karna hai 

module.exports.createRide = async (req, res, next) => {


    const { pickup, destination } = req.body;


    const newRide = new rideModel({
        user: req.user._id,
        pickup,
        destination
    })

 
  
    await newRide.save();

       //Publish the ride creation event to Rabbit MQ 
    //The Queue name is 'new-ride
    //This will allow the captain  service to listen 
    await publishToQueue('new-ride', newRide);
 
  res.status(201).json({message:"Ride created successfully",
    ride: newRide
  })




}

module.exports.acceptRide = async (req, res, next) => {

    //The query parameter rideId is used to identify the ride that the captains want to accept.
    //Does params and query are same ?


    // const { rideId } = req.query;
    const rideId = req.query.rideId.replace(/"/g, '');
if (!mongoose.Types.ObjectId.isValid(rideId)) {
  return res.status(400).json({ message: 'Invalid rideId' });
}

    const ride = await rideModel.findById(rideId);
    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
    }

    ride.status = 'accepted';
    publishToQueue('ride-accepted',JSON.stringify(ride));
    await ride.save();
 
    res.send(ride);
}