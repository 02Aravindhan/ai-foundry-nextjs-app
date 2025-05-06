'use client';

// This file implements a streaming interface for Azure AI responses.
// Streaming allows the user to see the AI's response in real-time.

import { useState, useRef, useEffect } from 'react';
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { createSseStream } from "@azure/core-sse";

// Environment variables are used for sensitive information like API keys.
const endpoint = process.env.NEXT_PUBLIC_AI_INFERENCE_ENDPOINT;
const apiKey = process.env.NEXT_PUBLIC_AZURE_API_KEY;
const modelName = process.env.NEXT_PUBLIC_AZURE_MODEL_ID;

const client = new ModelClient(endpoint, new AzureKeyCredential(apiKey));

// Converts a string into a ReadableStream for streaming processing.
function stringToReadableStream(str) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(str));
      controller.close();
    },
  });
}

export default function Stream() {
  // State variables for managing the streaming process.
  const [prompt, setPrompt] = useState(''); // User input
  const [output, setOutput] = useState(''); // AI's streamed output
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(''); // Error messages
  const [isStreaming, setIsStreaming] = useState(false); // Streaming status
  const streamReader = useRef(null); // Reference to the stream reader

  // Handles form submission and starts the streaming process.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isStreaming) return; // Prevent multiple streams

    setLoading(true);
    setIsStreaming(true);
    setOutput('');
    setError('');
    streamReader.current = null;

    try {
      // Sends a request to Azure AI with streaming enabled.
      const streamResponse = await client.path("/chat/completions").post({
        body: {
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4096,
          temperature: 1,
          top_p: 1,
          model: modelName,
          stream: true, // Enables streaming
        },
      });

      if (streamResponse.status === "200" && streamResponse.body) {
        const readableStream = stringToReadableStream(streamResponse.body);
        const sseStream = createSseStream(readableStream);
        streamReader.current = sseStream.getReader();

        let accumulatedOutput = '';
        while (true) {
          const { done, value } = await streamReader.current.read();
          if (done) break; // End of stream
          if (value?.data) {
            if (value.data === '[DONE]') break; // End signal
            try {
              const parsedData = JSON.parse(value.data);
              const text = parsedData?.choices?.[0]?.delta?.content || '';
              accumulatedOutput += text;
              setOutput(accumulatedOutput); // Update output in real-time
            } catch (e) {
              setError('Error parsing streamed data.');
            }
          }
        }
      } else {
        setError(`Error during streaming: ${streamResponse.status}`);
      }
    } catch (err) {
      setError('Failed to start streaming.');
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  // Cleans up the stream on component unmount.
  useEffect(() => {
    return () => {
      if (streamReader.current) {
        try {
          if (!streamReader.current.locked) {
            streamReader.current.cancel();
          }
        } catch (cancelError) {
          console.error("Error cancelling stream on unmount:", cancelError);
        }
      }
    };
  }, []);

  return (
       <div style={{ padding: '20px', backgroundColor: '#fff0f6', borderRadius: '8px' }}>
      <h1 style={{ color: '#eb2f96', marginBottom: '15px' }}>Streaming Output</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Enter your prompt:</label><br />
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          cols={50}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '16px' }}
        />
        <br />
        <button
          type="submit"
          disabled={loading || isStreaming}
          style={{ backgroundColor: '#eb2f96', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s ease' }}
        >
          {loading ? 'Loading...' : isStreaming ? 'Streaming...' : 'Submit'}
        </button>
      </form>
      {error && <p style={{ color: '#ff4d4f', marginTop: '10px' }}>Error: {error}</p>}
      <h2 style={{ marginTop: '20px', color: '#eb2f96' }}>Streamed Output:</h2>
      <div style={{ whiteSpace: 'pre-wrap', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#fff', fontFamily: 'monospace' }}>{output}</div>
    </div>
  );
}