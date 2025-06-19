import mongoose from "mongoose"; 
import User from "../../Models/User.js"; 
import Bike from "../../Models/Bike.js"; 
import Booking from "../../Models/Booking.js";  

const markAsPickedUp = async (req, res) => {   
  const { bookingId } = req.body;    

  if (!bookingId) {     
    return res.status(400).json({        
      success: false,        
      message: "Booking ID is required."      
    });   
  }    

  try {     
    const booking = await Booking.findOne({ bookingId }).populate("renter bike");      

    if (!booking) {       
      return res.status(404).json({          
        success: false,          
        message: "Booking not found."        
      });     
    }      

    // Fix: Check for both "rented" and "onRent" statuses
    const currentStatus = booking.status?.toLowerCase();
    if (currentStatus !== "rented" && currentStatus !== "onrent") {       
      return res.status(400).json({          
        success: false,          
        message: `Cannot mark as picked up. Current status: ${booking.status}`        
      });     
    }      

    // Update booking status     
    booking.status = "picked up";     
    booking.timestamps = booking.timestamps || {};     
    booking.timestamps.pickedUpAt = new Date();     
    await booking.save();      

    // Update bike status     
    const bike = booking.bike;     
    if (bike) {       
      bike.status = "picked up";       
      await bike.save();     
    }      

    // Safely update user's history     
    if (booking.renter && bike) {       
      const user = await User.findById(booking.renter._id);        

      if (user) {         
        const historyEntry = user.history.find(entry =>           
          entry.bike?.toString() === bike._id.toString()         
        );          

        if (historyEntry) {           
          historyEntry.status = "picked up"; // ✅ Required for correct button rendering in frontend           
          historyEntry.returnedAt = booking.timestamps.pickedUpAt;           
          await user.save();         
        } else {           
          console.warn("No matching history entry found to update.");         
        }       
      }     
    }      

    return res.json({        
      success: true,        
      message: "Bike marked as picked up successfully.",       
      data: {         
        bookingId: booking.bookingId,         
        status: booking.status,         
        pickedUpAt: booking.timestamps.pickedUpAt       
      }     
    });   
  } catch (err) {     
    console.error("Pickup error:", err);     
    return res.status(500).json({        
      success: false,        
      message: "Internal server error. Please try again."      
    });   
  } 
};  

export default markAsPickedUp;