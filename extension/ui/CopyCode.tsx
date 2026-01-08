import React, { useState, useEffect } from 'react';

const CopyCode: React.FC = () => {
  const [selectedQuote, setSelectedQuote] = useState<string>('');

  const quotes = [
    `You don't need a ready-made solution.
You already have enough hints to solve this.
Start with the simplest approach and improve it.
Every failed attempt sharpens your understanding.
Trust your thinking and code it out.`,
    
    `This tab is intentionally misleading 😉
No code is shown here on purpose.
The goal is to help you think, not copy.
Even a partial solution is a win.
Try solving it yourself before checking anything else.`,
    
    `No implementation here — intentionally.
Think through the approach first.
Write the logic in your own words.
Code it, test it, fail, improve.
That's how real problem-solving works.`,
    
    `Your dream role is waiting for you.
Companies like Google, Amazon, and Meta won't accept copy-paste thinking.
This problem is one step on that path.
Struggle now, succeed later.
Try solving it yourself first.`,
    
    `Your dream company is waiting.
It won't ask for copied solutions.
It will ask how you think.
This problem is your practice ground.
Solve it yourself.`
  ];

  useEffect(() => {
    // Pick a random quote when component mounts
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setSelectedQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="analysis-card">
      <div className="analysis-header">
        <span className="analysis-badge">📋</span>
        <span>Copy Code</span>
      </div>
      <div className="analysis-body">
        <h2 style={{ 
          color: '#f59e0b', 
          marginTop: '8px',
          marginBottom: '16px',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          🤔 You're here? That means you gave up!
        </h2>
        
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '20px 24px',
          margin: '20px 0',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)'
        }}>
          <p style={{ 
            fontSize: '15px',
            lineHeight: '1.75',
            color: '#e8e8e8',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            margin: 0,
            fontStyle: 'italic'
          }}>
            {selectedQuote}
          </p>
        </div>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '13px',
          marginTop: '24px',
          fontStyle: 'italic'
        }}>
          Remember: The struggle is part of the journey. 💪
        </p>
      </div>
    </div>
  );
};

export default CopyCode;
