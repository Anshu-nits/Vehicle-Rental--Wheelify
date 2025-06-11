import otpGenerator from "otp-generator";
import OTP from "../../Models/OTP.js";

const generateOTP = async (req, res) => {
	/*
	1.Generate OTP
	2.Check for its uniqueness, if not unique keep re-generating
	3.create otp entry in db
	*/
	try {
		const { email } = req.body;

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpBody = await OTP.create({
			email,
			otp,
		});
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

export default generateOTP;
