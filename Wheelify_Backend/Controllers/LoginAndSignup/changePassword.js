import User from "../../Models/User.js";
import bcrypt from "bcrypt";
import mailSender from "../../Config/mailSender.js";

// "oldPassword":"12345",
// "newPassword":"123456",
// "confirmNewPassword":"123456"

const changePassword = async (req, res) => {
  try {
    /*1.Get user data from req.user
      2.Get old password, new password, and confirm new password from req.body
      3.Validate old password
      4.Match new password and confirm new password
      5.Encrypt and Update password
      6.Send notification email
    */

    /*--1--*/
    const userDetails = await User.findById(req.user.id);

    /*--2--*/
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    /*--3--*/
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    /*--4--*/
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    /*--5--*/
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    /*--6--*/
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "password changed",
        `Password updated successfully for ${updatedUserDetails.name}`
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res.status(200).json({
        success: true, 
        message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

export default changePassword;
