import Stripe from "stripe";
import { showModel } from "../Model/showModel.js";
import bookingModel from "../Model/bookingModel.js";

const stripe = new Stripe(process.env.stripeSecretKey);

const createCheckoutSession = async (req, res) => {
  try {
    const { showId, selectedSeats } = req.body;

    const show = await showModel.findById(showId).populate("movie");

    if (!show) {
      return res.status(404).send({
        success: false,
        message: "Show not found!",
      });
    }

    // Check whether selected seats are already booked
    const alreadyBooked = selectedSeats.some((seat) =>
      show.bookedSeats.includes(seat),
    );

    if (alreadyBooked) {
      return res.status(400).send({
        success: false,
        message: "One or more selected seats are already booked!",
      });
    }

    const amount = selectedSeats.length * show.ticketPrice;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${show.movie.title} - Movie Ticket`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancelled`,

      metadata: {
        userId: req.userId,
        showId: showId.toString(),
        selectedSeats: JSON.stringify(selectedSeats),
      },
    });

    res.status(200).send({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).send({
        success: false,
        message: "Payment not completed!",
      });
    }

    //chech if the current user matched the user that created this payment/seesion, avoiding a user to copied sessionId
    //to create booking on his name.
    if (session.metadata.userId !== req.userId.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized payment session!",
      });
    }

    //check if the session already exist , i.e if the page is refresed, then we avoid creating duplicate booking
    //object for one single booking/payment
    const existingBooking = await bookingModel.findOne({
      sessionId: session.id,
    });

    if (existingBooking) {
      return res.status(200).send({
        success: true,
        message: "Booking already exists!",
      });
    }
    // update booked seats
    const showData = await showModel.findById(session.metadata.showId);
    const userSeats = JSON.parse(session.metadata.selectedSeats);

    //multiple booking check
    const alreadyBooked = userSeats.some((seat) =>
      showData.bookedSeats.includes(seat),
    );

    if (alreadyBooked) {
      return res.status(400).send({
        success: false,
        message: "One or more selected seats are already booked!",
      });
    }

    const updatedBookedSeats = [...userSeats, ...showData.bookedSeats];
    await showModel.findByIdAndUpdate(session.metadata.showId, {
      bookedSeats: updatedBookedSeats,
    });

    // create booking
    const ticket = new bookingModel({
      show: session.metadata.showId,
      user: req.userId,
      seats: userSeats,
      sessionId: sessionId,
      paymentStatus: session.payment_status,
    });
    const ticketData = await ticket.save();

    return res.status(200).send({
      success: true,
      message: "Booking confirmed!",
      data: ticketData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getBookingByUserId = async (req, res) => {
  try {
    const allBookings = await bookingModel
      .find({ user: req.userId })
      .populate("show")
      .populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theater" }],
      });
    res.status(200).send({
      success: true,
      message: "User Bookings fetched!",
      data: allBookings || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await bookingModel.findByIdAndDelete(req.body.bookingId);
    res.status(200).send({
      success: true,
      message: "Ticket deleted successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

export {
  createCheckoutSession,
  verifyPayment,
  getBookingByUserId,
  deleteBooking,
};
