import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected ");
	} catch (error) {
		console.log(error?.data?.message || error.error);
		process.exit(1);
	}
};

String.prototype.toCapitalize = function () {
	return this.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export default connectDB;
