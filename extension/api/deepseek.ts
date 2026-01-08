/// <reference types="vite/client" />
// This file contains mock DeepSeek API calls.
// In a real extension, you would replace these with actual API requests to DeepSeek.

// Mock data for Approach Suggestions
const mockApproachSuggestions = (title: string, description: string, constraints: string): string => {
  console.log(`Mock DeepSeek: Generating approaches for "${title}"`);
  console.log('Description:', description);
  console.log('Constraints:', constraints);

  return `
### Approach 1: Brute Force
*   **Describe the naive idea clearly:** Iterate through all possible combinations or permutations to find a solution, checking each one against the problem's conditions. This often involves nested loops or recursive backtracking without memoization.
*   **Explain how elements are iterated or compared:** For an array problem, this might involve two nested loops to compare every pair of elements. For a string problem, it could be generating all substrings.
*   **Mention key operations:** Typically involves simple loops, basic arithmetic, and direct comparisons.
*   **Identify where inefficiency occurs:** Redundant computations, re-evaluating the same subproblems multiple times, or exploring branches that cannot lead to a solution.
*   **Time Complexity:** O(N^2) or O(2^N) depending on the problem.
*   **Space Complexity:** O(1) or O(N) for recursion stack.

### Approach 2: Optimal Approach 1 (e.g., Using a Hash Map or Two Pointers)
*   **Core optimization idea:** Reduce the search space or avoid repeated work by storing intermediate results or using properties of the input.
*   **What data structure is introduced and why:** A hash map (or dictionary) can store seen elements and their properties for O(1) average-time lookups, avoiding O(N) scans. Two pointers can efficiently traverse sorted arrays or linked lists.
*   **How repeated work is avoided:** By quickly checking if a complement exists in a hash map, or by narrowing the search window with two pointers.
*   **Key observations or patterns:** For "Two Sum", the observation is that \`target - current_num\` needs to be found. For sorted arrays, monotonicity allows two pointers.
*   **Time Complexity:** O(N)
*   **Space Complexity:** O(N) for the hash map.

### Summary & Comparison
*   **Brute Force vs Optimal:** Brute force is slow due to its exhaustive search, often leading to quadratic or exponential time complexity. Optimal approaches leverage data structures or algorithmic insights to reduce this to linear or log-linear time.
*   **Trade-offs between time and space:** The optimal approach often uses O(N) space (e.g., for a hash map) to achieve O(N) time, whereas brute force might use O(1) space but take much longer.
*   **Which approach is most optimal and why:** The hash map approach is most optimal for "Two Sum" because it achieves O(N) time complexity by trading off O(N) space, which is generally acceptable.
*   **When a less optimal approach might still be acceptable:** For very small input sizes (N < 20), or if memory is extremely constrained and time is less critical.
`;
};

// Mock data for Complexity Analysis
const mockComplexityAnalysis = (userCode: string, language: string): string => {
  console.log(`Mock DeepSeek: Analyzing complexity for ${language} code.`);
  console.log('User Code:', userCode);

  // Simple heuristic for mock analysis based on common patterns
  let timeComplexity = "O(1)";
  let spaceComplexity = "O(1)";
  let timeBreakdown: string[] = [];
  let spaceBreakdown: string[] = [];

  if (userCode.includes('for') || userCode.includes('while')) {
    if ((userCode.match(/for/g) || []).length >= 2 || (userCode.match(/while/g) || []).length >= 2 || (userCode.includes('for') && userCode.includes('while'))) {
      timeComplexity = "O(N^2)";
      timeBreakdown.push("• Nested loops detected, potentially running N*N times → O(N^2)");
    } else {
      timeComplexity = "O(N)";
      timeBreakdown.push("• Single loop runs N times → O(N)");
    }
  }
  if (userCode.includes('sort')) {
    timeComplexity = "O(N log N)";
    timeBreakdown.push("• Sorting operation detected → O(N log N)");
  }
  if (userCode.includes('map') || userCode.includes('set') || userCode.includes('dict') || userCode.includes('hash')) {
    spaceComplexity = "O(N)";
    spaceBreakdown.push("• Hash map/set/dictionary storing N elements → O(N)");
  }
  if (userCode.includes('new Array') || userCode.includes('vector') || userCode.includes('list')) {
    spaceComplexity = "O(N)";
    spaceBreakdown.push("• Extra array/list of size N → O(N)");
  }
  // Very basic recursion detection
  if (userCode.includes('function') && userCode.includes('return') && (userCode.match(/function/g)?.length || 0) > 1 && userCode.includes('(') && userCode.includes(')')) {
    timeBreakdown.push("• Recursive function calls, depth depends on input → O(N) or O(2^N)");
    spaceBreakdown.push("• Recursion call stack depth → O(N)");
  }

  if (timeBreakdown.length === 0) timeBreakdown.push("• No significant loops or operations detected → O(1)");
  if (spaceBreakdown.length === 0) spaceBreakdown.push("• No significant data structures or recursion stack detected → O(1)");


  return `
## Time Complexity Breakdown

| Operation | Complexity | Notes |
|-----------|------------|-------|
${timeBreakdown.map(item => `| ${item.replace('• ', '')} | ${timeComplexity} | Detected in code |`).join('\n')}

**Final Time Complexity: ${timeComplexity}**

## Space Complexity Breakdown

| Component | Complexity | Notes |
|-----------|------------|-------|
${spaceBreakdown.map(item => `| ${item.replace('• ', '')} | ${spaceComplexity} | Auxiliary space |`).join('\n')}

**Total Space Complexity: ${spaceComplexity}**
`;
};

export const getApproachSuggestions = async (
  title: string,
  description: string,
  constraints: string
): Promise<string> => {
  // Prefer OpenRouter; fall back to legacy DeepSeek env var if present
  // Use static access so Vite replaces values at build time
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'deepseek/deepseek-chat';

  if (!apiKey) {
    console.warn('OpenRouter API key not found. Falling back to mock data.');
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockApproachSuggestions(title, description, constraints)), 1500);
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Title': 'LeetCode Smart Analysis',
        // 'HTTP-Referer': window.location.origin // optional, recommended if you host a site
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an expert algorithm assistant providing conceptual hints.' },
          { role: 'user', content: `Provide up to 3 conceptual approaches (Brute Force, Optimal 1, Optimal 2 if applicable) for the LeetCode problem: "${title}". Description: "${description}". Constraints: "${constraints}". Do NOT provide any code or pseudocode. Use bullet points for explanations. Include Time and Space Complexity for each approach. Also include a "Summary & Comparison" section.` }
        ],
        temperature: 0.2,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? 'No content returned by OpenRouter.';
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    console.warn('Falling back to mock data.');
    return mockApproachSuggestions(title, description, constraints);
  }
};

export const getComplexityAnalysis = async (
  userCode: string,
  language: string
): Promise<string> => {
  // Prefer OpenRouter; fall back to legacy DeepSeek env var if present
  // Use static access so Vite replaces values at build time
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'deepseek/deepseek-chat';

  if (!apiKey) {
    console.warn('OpenRouter API key not found. Falling back to mock data.');
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockComplexityAnalysis(userCode, language)), 1500);
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Title': 'LeetCode Smart Analysis'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an expert code complexity analyzer.' },
          { role: 'user', content: `Analyze the time and space complexity of the following ${language} code step-by-step. Explain each loop, recursion, or data structure usage. Show how expressions reduce.\nCode:\n\`\`\`${language}\n${userCode}\n\`\`\`\nProvide a "Time Complexity Breakdown" and "Space Complexity Breakdown" section.` }
        ],
        temperature: 0.2,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? 'No content returned by OpenRouter.';
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    console.warn('Falling back to mock data.');
    return mockComplexityAnalysis(userCode, language);
  }
};
