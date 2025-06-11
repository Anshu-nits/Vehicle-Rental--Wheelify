import User from "../../Models/User.js";
import mailSender from "../../Config/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const resetPasswordToken = async (req, res) => {
	/*
	1.Extract email and search for User in DB
	2.Create a token and update it in DB(later it will be used to identify user)
	3.Create password reset url using token
	4.Send this url to mail
    */
	try {
		/*--1--*/
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}

		/*--2--*/
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		/*--3--*/
		const url = `http://localhost:3000/update-password/${token}`;

		/*--4--*/
		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

const resetPassword = async (req, res) => {
	/*
	1.Extract password, confirmPassword, token from body(token provided earlier will be present in frontend)
	2.Match password and confirm password
	3.Check token Validity
	4.Find user based on token
	5.Hash password and update user
	*/
	try {
		/*--1--*/
		const { password, confirmPassword, token } = req.body;

		/*--2--*/
		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}

		/*--3--*/
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}

		/*--4--*/
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}

		/*--5--*/
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};

export {resetPasswordToken,resetPassword};