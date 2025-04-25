import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import ReduxProvider from "./redux/ReduxProvider";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Spotify App",
	description: "Spotify app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ReduxProvider>
					<div className="flex h-screen bg-black text-white">
						<Sidebar />
						{children}
					</div>
					<ToastContainer />
				</ReduxProvider>
			</body>
		</html>
	);
}
