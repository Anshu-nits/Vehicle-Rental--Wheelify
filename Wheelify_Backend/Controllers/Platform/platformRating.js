import { Rating } from '../../Models/PlatformRate.js';

// Create or update a rating
const createRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Validate review
    if (!review || review.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Review is required' 
      });
    }

    // Check if user already has a rating
    let existingRating = await Rating.findOne({ user: userId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review.trim();
      await existingRating.save();
      
      await existingRating.populate('user', 'name');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Rating updated successfully',
        data: existingRating
      });
    } else {
      // Create new rating
      const newRating = new Rating({
        user: userId,
        rating,
        review: review.trim()
      });

      await newRating.save();
      await newRating.populate('user', 'name');

      return res.status(201).json({ 
        success: true, 
        message: 'Rating created successfully',
        data: newRating
      });
    }
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get top 3 ratings for testimonials
const getTopRatings = async (req, res) => {
  try {
    const topRatings = await Rating.find()
      .populate('user', 'name')
      .sort({ rating: -1, createdAt: -1 }) // Sort by rating desc, then by newest
      .limit(3);

    const testimonials = topRatings.map(rating => ({
      id: rating._id,
      name: rating.user.name,
      stars: rating.rating,
      text: rating.review,
      createdAt: rating.createdAt
    }));

    return res.status(200).json({ 
      success: true, 
      data: testimonials 
    });
  } catch (error) {
    console.error('Error fetching top ratings:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get user's own rating
const getUserRating = async (req, res) => {
  try {
    console.log("hit")
    const userId = req.user.id;
    
    const userRating = await Rating.findOne({ user: userId })
      .populate('user', 'name');

    if (!userRating) {
      return res.status(404).json({ 
        success: false, 
        message: 'No rating found for this user' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: {
        id: userRating._id,
        rating: userRating.rating,
        review: userRating.review,
        createdAt: userRating.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export {
  createRating,
  getTopRatings,
  getUserRating
};