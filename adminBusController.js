const busModel = require("../models/busModel");
const bookModel=require("../models/bookedModel");
const { createBus } = require("../utils/util");

// Create a new bus
const createBusControler = async (req, res) => {
    const ob = createBus();
    try {
        const newBus = new busModel({
            name: req.body.name,
            from: req.body.from.toLowerCase(),
            to: req.body.to.toLowerCase(),
            price: req.body.price,
            seats: ob,
        });

        const saved = await newBus.save();
        res.status(200).json(saved);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// View bookings for a specific bus
const mongoose=require('mongoose');

const viewBookingsController = async (req, res) => {
    try {
        const { busId } = req.params;  // Retrieve busId from the request parameters
        const bus = await busModel.findById(busId);

        if (!bus) return res.status(404).json({ message: "Bus not found" });
        
        const busObjectId = new mongoose.Types.ObjectId(busId);

        // Find all the bookings for the specific busId
        const bookings = await bookModel.find({ busId: busObjectId })
            .populate('userId', 'name email'); // Populate user details from the `user` model

        // If no bookings are found
        if (bookings.length === 0) {
            return res.status(200).json({
                message: "No bookings found for this bus."
            });
        }

        // If bookings are found, return the bookings with user details
        res.status(200).json({
            businfo:bus,
            bookings: bookings.map(booking => ({
                seatNo: booking.seatNo,
                user: booking.userId ? { name: booking.userId.name, email: booking.userId.email } : null
            }))
        });
    } catch (error) {
        console.error("Error while fetching bookings:", error);  // Log the error for debugging
        res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
}

// Reset a bus: Undo all ticket bookings
const resetBusController = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await busModel.findById(busId);

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        Object.keys(bus.seats).forEach((seat) => {
            bus.seats[seat] = { isBooked: false, userId: null };
        });

        await bus.save();
        res.status(200).json({ message: "Bus reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to reset bus", error: error.message });
    }
};


// Get all buses
const getAllBusesController = async (req, res) => {
    try {
        const buses = await busModel.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch buses", error: error.message });
    }
};

module.exports = {
    createBusControler,
    viewBookingsController,
    resetBusController,
    getAllBusesController,
};
