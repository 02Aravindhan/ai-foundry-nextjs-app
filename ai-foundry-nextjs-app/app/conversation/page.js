'use client';
import { useState } from 'react';
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Use environment variables to securely store sensitive information like API keys and endpoints.
const endpoint = process.env.NEXT_PUBLIC_AI_INFERENCE_ENDPOINT; 
const apiKey = process.env.NEXT_PUBLIC_AZURE_API_KEY; 
const modelName = process.env.NEXT_PUBLIC_AZURE_MODEL_ID; 

const client = new ModelClient(endpoint, new AzureKeyCredential(apiKey));

// This is the main React component for the chat interface.
export default function ChatInterface() {

  // These state variables manage user input and chat history.
  
  const [userInput, setUserInput] = useState(''); // Tracks the user's input
  const [chatHistory, setChatHistory] = useState([{ role: 'system', content: 'You are a helpful assistant.' }]); 
 
const [loading, setLoading] = useState(false);
const [error, setError] = useState(''); // Stores any error messages


  // This function updates the `userInput` state whenever the user types in the input field.
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // This function sends the user's message to the Azure AI service and updates the chat history.
  const handleSendMessage = async () => {
    if (!userInput.trim()) return; 

    // Add the user's message to the chat history
    const newUserMessage = { role: 'user', content: userInput };
    const updatedChatHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedChatHistory);
    setUserInput(''); 
    setLoading(true); 
    setError('');

    try {
      // Send the chat history to the Azure AI service
      const response = await client.path("/chat/completions").post({
        body: {
          messages: updatedChatHistory, 
          max_tokens: 4096, 
          temperature: 1, 
          top_p: 1,
          model: modelName,
        },
      });

      // Handle the AI's response
      if (response.status === "200") {
        const aiResponseMessage = response.body.choices[0].message;
        if (aiResponseMessage?.content) {
          
          setChatHistory([...updatedChatHistory, aiResponseMessage]);
        } else {
          setError('No response received.');
        }
      } else {
        setError(`Error in chat: ${response.status}`);
        console.error("Chat completion error:", response);
      }
    } catch (err) {
      console.error("The sample encountered an error:", err);
      setError("Failed to send message.");
    } finally {
      setLoading(false); // Hide the loading indicator
    }
  };

  const chatMessageStyle = (role) => ({
    marginBottom: '8px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: role === 'user' ? '#d1e7dd' : '#f8d7da', // Green for user, red for AI
  });

  return (
    <div>
      <h1>Conversation with AI</h1>
      <div style={{ marginBottom: '10px' }}>
        {/* Display the chat history */}
        {chatHistory.slice(1).map((msg, index) => (
          <div key={index} style={chatMessageStyle(msg.role)}>
            <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong>{' '}
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}
        {/* Display error messages */}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {/* Display loading indicator */}
        {loading && <p>Loading...</p>}
      </div>
      <div>
        {/* Input field for user messages */}
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          style={{ width: '70%', padding: '8px' }}
        />
        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={loading}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

