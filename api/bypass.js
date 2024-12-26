const axios = require('axios');

// Helper function to fetch the bypassed link from the external API
async function fetchBypassedLink(url) {
    const apiUrl = `https://ethos.kys.gay/api/free/bypass?url=${encodeURIComponent(url)}`;
    
    try {
        console.log(`Requesting bypass API with URL: ${apiUrl}`);

        // Make the GET request to the external bypass API
        const response = await axios.get(apiUrl);
        
        // Log the response from the bypass API for debugging
        console.log("Bypass API response:", response.data);

        // Return the bypassed link from the response
        return response.data;
    } catch (error) {
        console.error("Error during bypass request:", error.message);
        throw new Error("Failed to bypass the link. Please try again later.");
    }
}

module.exports = async (req, res) => {
    try {
        const { url } = req.query;

        // Check if the URL parameter is provided
        if (!url) {
            return res.status(400).send("Error: URL is required. Please provide a valid URL.");
        }

        console.log(`Received request to bypass URL: ${url}`);

        // Fetch the bypassed link from the external API
        const bypassedLink = await fetchBypassedLink(url);

        // Send back the bypassed link in the response
        res.status(200).send(`Here's your bypassed link: ${bypassedLink}`);
    } catch (error) {
        // Log the error and send a user-friendly error message back
        console.error("Error bypassing the link:", error.message);
        res.status(500).send(`An error occurred while bypassing the link. ${error.message}`);
    }
};
