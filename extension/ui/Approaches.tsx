import React, { useState, useEffect } from 'react';
import { getApproachSuggestions } from '../api/deepseek';
import Markdown from 'react-markdown';

interface ApproachesProps {
  problemData: {
    title: string;
    description: string;
    constraints: string;
    userCode: string;
    language: string;
  };
  cachedSuggestions: string | null;
  onSuggestionsLoaded: (suggestions: string) => void;
}

const Approaches: React.FC<ApproachesProps> = ({ problemData, cachedSuggestions, onSuggestionsLoaded }) => {
  const [suggestions, setSuggestions] = useState<string | null>(cachedSuggestions);
  const [loading, setLoading] = useState(!cachedSuggestions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when question changes (cachedSuggestions becomes null)
    if (cachedSuggestions === null) {
      setSuggestions(null);
      setError(null);
    }
    
    // If we have cached suggestions, use them
    if (cachedSuggestions) {
      console.log('[Approaches] Using cached suggestions for this question');
      setSuggestions(cachedSuggestions);
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getApproachSuggestions(
          problemData.title,
          problemData.description,
          problemData.constraints
        );
        setSuggestions(result);
        onSuggestionsLoaded(result);
      } catch (err) {
        console.error('Error fetching approach suggestions:', err);
        setError('Failed to load approach suggestions. Please check your DeepSeek API integration.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [problemData.title, problemData.description, problemData.constraints, cachedSuggestions, onSuggestionsLoaded]);

  if (loading) {
    return (
      <div style={{ padding: '24px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p>Generating approach suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', color: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="analysis-card">
      <div className="analysis-header">
        <span className="analysis-badge">💡</span>
        <span>Approach Suggestions</span>
      </div>
      {suggestions ? (
        <div className="analysis-body">
          <Markdown
            components={{
              h1: (props) => <h2 {...props} />,
              h2: (props) => <h3 {...props} />,
              h3: (props) => <h4 {...props} />,
              ul: (props) => <ul style={{ listStyle: 'disc' }} {...props} />,
              ol: (props) => <ol style={{ listStyle: 'decimal' }} {...props} />,
              table: (props) => <table {...props} style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', border: '1px solid #444' }} />,
              thead: (props) => <thead {...props} style={{ backgroundColor: '#2a2a2a', borderBottom: '2px solid #555' }} />,
              tbody: (props) => <tbody {...props} />,
              tr: (props) => <tr {...props} style={{ borderBottom: '1px solid #333' }} />,
              th: (props) => <th {...props} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#fff', borderRight: '1px solid #444' }} />,
              td: (props) => <td {...props} style={{ padding: '10px 16px', color: '#e8e8e8', borderRight: '1px solid #333' }} />,
            }}
          >
            {suggestions}
          </Markdown>
        </div>
      ) : (
        <p style={{ color: '#888' }}>No suggestions available.</p>
      )}
    </div>
  );
};

export default Approaches;
