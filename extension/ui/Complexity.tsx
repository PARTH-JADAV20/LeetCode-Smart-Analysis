import React, { useState, useEffect } from 'react';
import { getComplexityAnalysis } from '../api/deepseek';
import Markdown from 'react-markdown';

interface ComplexityProps {
  problemData: {
    title: string;
    description: string;
    constraints: string;
    userCode: string;
    language: string;
  };
}

const Complexity: React.FC<ComplexityProps> = ({ problemData }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string>('');

  // Extract fresh code from editor when component mounts/updates
  useEffect(() => {
    const extractCurrentCode = (): string => {
      // Try Monaco editor first (current LeetCode)
      const monacoLines = document.querySelector('.monaco-editor .view-lines');
      if (monacoLines?.textContent) {
        return monacoLines.textContent.trim();
      }
      
      // Fallback to CodeMirror
      const codeMirror = document.querySelector('.CodeMirror-code');
      if (codeMirror?.textContent) {
        return codeMirror.textContent.trim();
      }
      
      return '';
    };

    const code = extractCurrentCode();
    setCurrentCode(code);
    console.log('[Complexity] Extracted current code length:', code.length);
  }, []);

  useEffect(() => {
    // DO NOT use cache - complexity analysis must always regenerate from current code
    const checkForErrors = (code: string): string | null => {
      // Only check if editor is truly empty
      const trimmed = code.trim();
      if (!trimmed) return 'Editor is empty';
      
      // Skip bracket/brace checking as Monaco editor text extraction can be unreliable
      // Let the API handle actual syntax validation
      
      return null;
    };

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      // Check for syntax errors first
      const syntaxError = checkForErrors(currentCode);
      if (syntaxError) {
        setAnalysis(`⚠️ **Code Issue Detected**\n\n${syntaxError}. Please complete or fix your code in the editor before analyzing complexity.`);
        setLoading(false);
        return;
      }
      
      try {
        const result = await getComplexityAnalysis(
          currentCode,
          problemData.language
        );
        setAnalysis(result);
      } catch (err) {
        console.error('Error fetching complexity analysis:', err);
        setError('Failed to load complexity analysis. Please check your DeepSeek API integration.');
      } finally {
        setLoading(false);
      }
    };

    if (currentCode && currentCode.trim() !== '') {
      fetchAnalysis();
    } else {
      setAnalysis("💭 **No Code Found**\n\nPlease write your solution in the LeetCode editor to get a complexity analysis.");
      setLoading(false);
    }
  }, [currentCode, problemData.language]);

  if (loading) {
    return (
      <div style={{ padding: '24px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p>Analyzing your code complexity...</p>
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
        <span className="analysis-badge">📊</span>
        <span>Complexity Analysis</span>
      </div>
      {analysis ? (
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
            {analysis}
          </Markdown>
        </div>
      ) : (
        <p style={{ color: '#888' }}>No analysis available.</p>
      )}
    </div>
  );
};

export default Complexity;
