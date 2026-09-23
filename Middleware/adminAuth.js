import { userModel } from "../Model/userModel.js";

export const adminVerification = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isAdmin) {
      return res.status(403).send({
        success: false,
        message: "Admin only access!",
      });
    }

    return next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
