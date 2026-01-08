import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Approaches from './Approaches';
import Complexity from './Complexity';
import CopyCode from './CopyCode';
import { Lightbulb, BarChart2 } from 'lucide-react'; // Using Lucide React for icons

// Define the LeetCode problem data structure
interface LeetCodeProblemData {
  title: string;
  description: string;
  constraints: string;
  userCode: string;
  language: string;
}

// Cache storage scoped per question - stored outside component to persist across modal open/close
// Cache expires after 1 hour
const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour
const approachCache = new Map<string, { data: string; timestamp: number }>();

const SmartTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'approaches' | 'complexity' | 'copycode'>('approaches');
  const [problemData, setProblemData] = useState<LeetCodeProblemData | null>(null);
  const [loadingProblemData, setLoadingProblemData] = useState(true);
  const [errorProblemData, setErrorProblemData] = useState<string | null>(null);
  const [questionSlug, setQuestionSlug] = useState<string>('');
  
  // Cache ONLY approach suggestions per question (scoped by slug)
  const [cachedApproaches, setCachedApproaches] = useState<string | null>(null);
  // DO NOT cache complexity analysis - it must always regenerate

  useEffect(() => {
    // Function to extract problem data from LeetCode page (robust selectors + fallbacks)
    const extractProblemData = (): { data: LeetCodeProblemData; slug: string } | null => {
      try {
        const getText = (selectors: string[]): string | null => {
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent) return el.textContent.trim();
          }
          return null;
        };

        // Extract question slug from URL for cache key
        const slugMatch = window.location.pathname.match(/problems\/([a-z0-9-]+)/i);
        const slug = slugMatch?.[1] || '';
        if (!slug) {
          console.error('[Smart Analysis] Could not extract question slug from URL');
          return null;
        }

        // Title: try multiple selectors, then fallback to URL slug
        const titleCandidates = [
          '[data-cy="question-title"]',
          'div[data-cy="question-title"] span',
          '.mr-2.text-lg.font-medium',
          'h1',
        ];
        let title = getText(titleCandidates) || '';
        if (!title) {
          title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        }
        if (!title) title = 'Unknown Problem';

        // Description container often under question-content
        const descCandidates = [
          '[data-cy="question-content"]',
          'div[class*="question-content"]',
          'div[id*="description"]',
          '.content__u3I1.question-content__JfgR', // legacy
        ];
        const description = getText(descCandidates) || 'Could not extract problem description.';

        // Constraints typically embedded within description; keep the note
        const constraints = 'Constraints are usually embedded within the problem description text.';

        // Code: LeetCode uses Monaco now; fallback to CodeMirror if present
        const monacoLines = document.querySelector('.monaco-editor .view-lines');
        const codeMirror = document.querySelector('.CodeMirror-code');
        const userCode = (monacoLines?.textContent || codeMirror?.textContent || '').trim();

        // Language: try common selectors; default to javascript
        const langCandidates = [
          '[data-cy="lang-select"], [data-cy="lang-select"] span',
          '.ant-select-selection-selected-value',
          'button[aria-label="language"] span',
        ];
        const language = (getText(langCandidates) || 'javascript').toLowerCase();

        return { 
          data: { title, description, constraints, userCode, language },
          slug
        };
      } catch (error) {
        console.error('Error extracting LeetCode problem data:', error);
        return null;
      }
    };

    setLoadingProblemData(true);
    const result = extractProblemData();
    if (result) {
      const { data, slug } = result;
      console.log('[Smart Analysis] Extracted problem data:', { 
        title: data.title, 
        slug, 
        lang: data.language, 
        codeLen: data.userCode.length 
      });
      
      // Check if question changed - invalidate cache if needed
      if (slug !== questionSlug) {
        console.log('[Smart Analysis] Question changed:', questionSlug, '->', slug);
        setQuestionSlug(slug);
        
        // Load cached approaches for this specific question (if not expired)
        const cached = approachCache.get(slug);
        if (cached) {
          const age = Date.now() - cached.timestamp;
          if (age < CACHE_EXPIRATION_MS) {
            setCachedApproaches(cached.data);
            console.log('[Smart Analysis] Cache HIT for question:', slug, `(age: ${Math.round(age / 1000 / 60)}m)`);
          } else {
            approachCache.delete(slug);
            setCachedApproaches(null);
            console.log('[Smart Analysis] Cache EXPIRED for question:', slug, `(age: ${Math.round(age / 1000 / 60)}m)`);
          }
        } else {
          setCachedApproaches(null);
          console.log('[Smart Analysis] Cache MISS for question:', slug);
        }
      }
      
      setProblemData(data);
      setErrorProblemData(null);
    } else {
      setErrorProblemData('Failed to extract problem data from LeetCode page. Please ensure you are on a problem page.');
    }
    setLoadingProblemData(false);
  }, [questionSlug]);

  if (loadingProblemData) {
    console.log('[Smart Analysis UI] Loading problem data...');
    return (
      <div className="p-6 text-textSecondary bg-surface rounded-xl shadow-lg flex items-center justify-center min-h-[200px]">
        <p>Loading problem data...</p>
      </div>
    );
  }

  if (errorProblemData) {
    console.error('[Smart Analysis UI] Error:', errorProblemData);
    return (
      <div className="p-6 text-error bg-surface rounded-xl shadow-lg flex items-center justify-center min-h-[200px]">
        <p>Error: {errorProblemData}</p>
      </div>
    );
  }

  if (!problemData) {
    console.warn('[Smart Analysis UI] No problem data available');
    return (
      <div className="p-6 text-textSecondary bg-surface rounded-xl shadow-lg flex items-center justify-center min-h-[200px]">
        <p>No problem data available.</p>
      </div>
    );
  }
  
  console.log('[Smart Analysis UI] Rendering with problem data:', problemData);

  return (
    <div className="smart-analysis-container" style={{
      backgroundColor: '#1a1a1a',
      color: 'var(--text-primary, #e8e8e8)',
      fontSize: '14px',
      lineHeight: '1.6',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    }}>
      <div className="tab-buttons" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #333',
        marginBottom: '0',
        paddingLeft: '8px',
        backgroundColor: '#1a1a1a',
        flexShrink: 0,
        zIndex: 100
      }}>
        <button
          className="tab-button"
          style={{
            color: activeSubTab === 'approaches' ? '#fff' : '#888',
            borderBottom: activeSubTab === 'approaches' ? '3px solid #3b82f6' : 'none',
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'color 0.2s',
            marginBottom: activeSubTab === 'approaches' ? '-1px' : '0'
          }}
          onClick={() => {
            console.log('[Smart Analysis] Switching to approaches tab');
            setActiveSubTab('approaches');
          }}
        >
          💡 Approach Suggestions
        </button>
        <button
          className="tab-button"
          style={{
            color: activeSubTab === 'complexity' ? '#fff' : '#888',
            borderBottom: activeSubTab === 'complexity' ? '3px solid #3b82f6' : 'none',
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'color 0.2s',
            marginBottom: activeSubTab === 'complexity' ? '-1px' : '0'
          }}
          onClick={() => {
            console.log('[Smart Analysis] Switching to complexity tab');
            setActiveSubTab('complexity');
          }}
        >
          📊 Complexity Analysis
        </button>
        <button
          className="tab-button"
          style={{
            color: activeSubTab === 'copycode' ? '#fff' : '#888',
            borderBottom: activeSubTab === 'copycode' ? '3px solid #3b82f6' : 'none',
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'color 0.2s',
            marginBottom: activeSubTab === 'copycode' ? '-1px' : '0'
          }}
          onClick={() => {
            console.log('[Smart Analysis] Switching to copycode tab');
            setActiveSubTab('copycode');
          }}
        >
          📋 Copy Code
        </button>
      </div>

      <div className="subtab-content" style={{ 
        flex: 1, 
        overflow: 'auto',
        backgroundColor: '#1a1a1a',
        padding: '16px'
      }}>
        {activeSubTab === 'approaches' && (
          <Approaches 
            problemData={problemData} 
            cachedSuggestions={cachedApproaches}
            onSuggestionsLoaded={(suggestions) => {
              // Store in per-question cache with timestamp
              approachCache.set(questionSlug, {
                data: suggestions,
                timestamp: Date.now()
              });
              setCachedApproaches(suggestions);
              console.log('[Smart Analysis] Cached approaches for question:', questionSlug);
            }}
          />
        )}
        {activeSubTab === 'complexity' && (
          <Complexity 
            problemData={problemData}
          />
        )}
        {activeSubTab === 'copycode' && (
          <CopyCode />
        )}
      </div>
    </div>
  );
};

// This part ensures the React app mounts when the smartAnalysisUI.js is loaded
// It expects a div with id 'smart-analysis-react-root' to exist, created by contentScript.ts.
const rootElement = document.getElementById('smart-analysis-react-root');
console.log('[Smart Analysis] React mounting...');
console.log('[Smart Analysis] Root element found:', !!rootElement);
if (rootElement) {
  console.log('[Smart Analysis] Creating React root and rendering SmartTab component');
  createRoot(rootElement).render(
    <React.StrictMode>
      <SmartTab />
    </React.StrictMode>
  );
  console.log('[Smart Analysis] React component rendered successfully');
} else {
  console.error("[Smart Analysis] Could not find root element for Smart Analysis React app. Ensure contentScript.ts is running.");
}

export default SmartTab;
