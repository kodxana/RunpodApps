async function callRunpodApi(url, headers, payload) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = `Error ${response.status}: ${response.statusText}`;
          console.error(errorText);
          alert(`Server responded with an error: "${errorText}". Please check your input values and API token.`);
          return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error contacting the API", error);
        throw error;
    }
}

const form = document.getElementById("api-form");
const outputImage = document.getElementById("output-image");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    document.getElementById("loading-animation").style.display = "block";
    
    const apiToken = document.getElementById('api_token').value;
    const promptInput = document.getElementById('prompt').value;
    const negativePrompt = document.getElementById('negative_prompt').value;
    const negativePriorPrompt = document.getElementById('negative_prior_prompt').value;
    const negativeDecoderPrompt = document.getElementById('negative_decoder_prompt').value;
    const height = document.getElementById('h').value;
    const width = document.getElementById('w').value;
    const sampler = document.getElementById('sampler').value;
    const numSteps = document.getElementById('num_steps').value;

    const API_URL = "https://api.runpod.ai/v2/kandinsky-v2/runsync";
    const HEADERS = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': apiToken
    };

    const payload = {
        input: {
            prompt: promptInput,
            negative_prompt: negativePrompt,
            negative_prior_prompt: negativePriorPrompt,
            negative_decoder_prompt: negativeDecoderPrompt,
            h: parseInt(height),
            w: parseInt(width),
            sampler: sampler,
            num_steps: parseInt(numSteps),
            batch_size: 1,
        },
    };

    try {
        const result = await callRunpodApi(API_URL, HEADERS, payload);
        document.getElementById("loading-animation").style.display = "none";

        if (result === null) {
            return;
        }

        const imageUrl = result.output?.image_url;
    
        if (!imageUrl) {
            console.error('Image URL not found in the response.');
            alert('Image URL not found in the response. Please check the API documentation or contact support.');
            return;
        }
    
        outputImage.src = imageUrl;

    } catch (error) {
        document.getElementById("loading-animation").style.display = "none";
        console.error('Error communicating with the API: ', error);
        alert('Error communicating with the API. Check your connection and API token.');
    }
});

function toggleSection(id) {
    const content = document.getElementById("section-content-" + id);
    content.style.display = content.style.display === "none" ? "block" : "none";
}

// When the image is successfully loaded, show the output-section and hide the spinner
outputImage.onload = () => {
    document.getElementById("output-section").style.display = "block";
    document.getElementById("loading-animation").style.display = "none";
};

// When an error occurs while loading the image, hide the spinner and show an alert
outputImage.onerror = () => {
    document.getElementById("loading-animation").style.display = "none";
    alert("Error loading the image. Please verify the image URL or try again later.");
};
