export const formatFollowers = (count) => {
	if (count >= 1e6) {
		return (count / 1e6).toFixed(1) + "M+"; // Format in millions
	} else if (count >= 1e3) {
		return Math.floor(count / 1e3) + "K+"; // Format in thousands
	} else {
		return count.toString(); // Return the number as is for counts less than 1000
	}
};

export const formatDuration = (milliseconds) => {
	const totalSeconds = Math.ceil(milliseconds / 1000); // Convert milliseconds to seconds
	const minutes = Math.floor(totalSeconds / 60); // Get the minutes
	const seconds = totalSeconds % 60; // Get the remaining seconds

	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

	return `${minutes}:${formattedSeconds}`;
};

export const extractTrackName = (trackName) => {
	const match = trackName.match(/^(.*?)\s*\(.*?\)$/);
	return match ? match[1].trim() : trackName; // If it doesn't match, return the original name
};
