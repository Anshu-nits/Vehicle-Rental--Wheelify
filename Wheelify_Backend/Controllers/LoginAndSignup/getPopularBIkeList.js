import Bike from '../../Models/Bike.js';

const getPopularBikeList = async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'provided for rent' })
      .populate('Owner', 'name email');
    res.status(200).json(bikes);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).json({ message: 'Server error while fetching bikes.' });
  }
};

export default getPopularBikeList;
