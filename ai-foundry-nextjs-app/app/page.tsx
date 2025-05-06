import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-page">
      <h1><strong>Welcome to Technology with Faizal and build AI Foundry App!</strong></h1>
      <p>Explore different ways to interact with the AI:</p>
      <br></br>

      <section style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#eb2f96', marginBottom: '15px' }}><strong>Single Message</strong></h1>
        <p><strong>Concept:</strong> Sends a single, independent request to the AI and receives a response. The AI has no memory of previous interactions within this mode.</p>
        <p><strong>Use Case:</strong> Simple queries, quick information retrieval, or tasks that don't require context.</p>
        <p><strong>Example Prompt:</strong> "What is the capital of Singapore?"</p>
        <p><strong>Example Prompt:</strong> "When is election?"</p>
      </section>
            <section style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#eb2f96', marginBottom: '15px' }}><strong>Conversation</strong></h1>
        <p><strong>Concept:</strong> Engages in a multi-turn dialogue with the AI. The AI remembers the history of the conversation, allowing for contextual and follow-up questions.</p>
        <p><strong>Use Case:</strong> Complex problem-solving, creative brainstorming, or simulating a conversation with an assistant.</p>
        <p><strong>Example Prompts:</strong></p>
        <ol>
          <li>"I'm planning a trip to Singapore. What are some must-see attractions?"</li>
          <li>"Great, and how can I get around the city?"</li>
        </ol>
      </section>

      <section>
        <h1 style={{ color: '#eb2f96', marginBottom: '15px' }}><strong>Stream</strong></h1>
        <p><strong>Concept:</strong> Receives the AI's response in real-time, as it's being generated, rather than waiting for the entire response to be complete. This provides a more interactive and engaging experience.</p>
        <p><strong>Use Case:</strong> Situations where immediate feedback is desired, or when the AI is generating longer, more thoughtful responses.</p>
        <p><strong>Example Prompts:</strong></p>
        <ol>
          <li>"Describe the process of starting a vegetable garden, step by step."</li>
          <li>"Tell me a short story about a robot learning to love."</li>
        </ol>
      </section>

      </div>
  );
}