const axios = require('axios');

// Helper function to handle the request and measure the time taken
async function fetchBypassedLink(url) {
    // The API endpoint for bypassing the URL
    const apiUrl = `https://ethos.kys.gay/api/free/bypass?url=${encodeURIComponent(url)}`;
    
    // Retry logic for better resilience in case of failure
    let retries = 3;
    while (retries > 0) {
        try {
            // Start the timer before making the request
            const startTime = Date.now();

            // Make the GET request to the bypass API
            const response = await axios.get(apiUrl);
            
            // Stop the timer once the response is received
            const endTime = Date.now();

            // Calculate the time taken to fetch the bypassed link
            const timeTakenInSeconds = (endTime - startTime) / 1000; // Time in seconds

            // Return both the bypassed link and the time taken
            return { bypassedLink: response.data, timeTakenInSeconds };
        } catch (error) {
            // Log the error if the request fails
            console.error(`Attempt failed. Retries left: ${retries - 1}`);
            console.error("Error during bypass request:", error.message);

            // Reduce the retry count
            retries--;

            // If retries are exhausted, throw the error
            if (retries === 0) {
                throw new Error("Failed to bypass the link after multiple attempts. Please try again later.");
            }
        }
    }
}

module.exports = async (req, res) => {
    try {
        // Extract the URL from the query parameters
        const { url } = req.query;

        // Check if the URL is provided
        if (!url) {
            return res.status(400).send("Error: URL is required. Please provide a valid URL to bypass.");
        }

        // Log the received URL for debugging
        console.log(`Received request to bypass URL: ${url}`);

        // Fetch the bypassed link and measure the time taken
        const { bypassedLink, timeTakenInSeconds } = await fetchBypassedLink(url);

        // Log the successful completion of the request with the time taken
        console.log(`Bypass successful. Time taken: ${timeTakenInSeconds.toFixed(2)} seconds`);

        // Send a response with the bypassed link and time taken
        res.status(200).send(
            `Here's your bypassed link: ${bypassedLink}\nTime taken: ${timeTakenInSeconds.toFixed(2)} seconds`
        );
    } catch (error) {
        // Log the error and send a user-friendly message back
        console.error("Error bypassing the link:", error.message);

        // Send an error response with detailed error message
        res.status(500).send(`An error occurred while bypassing the link. ${error.message}`);
    }
};
