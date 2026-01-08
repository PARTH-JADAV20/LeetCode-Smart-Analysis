# 🧠 LeetCode Smart Analysis Extension

A Chrome extension that enhances your LeetCode experience by providing AI-powered approach suggestions and complexity analysis directly within the LeetCode interface.

## 🌟 Features

### 💡 Approach Suggestions
Get conceptual guidance on how to solve problems without spoiling the solution:
- **Multiple Approaches**: View up to 3 different approaches (Brute Force, Optimal Solutions)
- **Conceptual Hints**: Learn through hints and bullet points, not code
- **Complexity Information**: Understand time and space complexity for each approach
- **Comparison Summary**: See trade-offs between different approaches

### 📊 Complexity Analysis
Analyze your submitted code with detailed complexity breakdowns:
- **Step-by-Step Time Complexity**: Understand how loops, recursion, and operations contribute to overall complexity
- **Space Complexity Breakdown**: Learn about auxiliary space, recursion stack, and data structures used
- **Expression Reduction**: See how complex expressions simplify (e.g., O(N + N log N) → O(N log N))

## 🎯 Why Use This Extension?

- ✅ **Learn, Don't Copy**: Focus on problem-solving skills rather than memorizing solutions
- ✅ **LeetCode-Safe**: No code spoilers, only conceptual guidance
- ✅ **Seamless Integration**: Works directly within LeetCode's UI as a native tab
- ✅ **AI-Powered**: Leverages DeepSeek API for intelligent analysis
- ✅ **Interview Preparation**: Perfect for understanding algorithmic thinking

## 🚀 Setup Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Chrome browser
- DeepSeek API key

### Installation

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd leetcode_smart_analysis_chrome_extension_4yg3zq
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure API Key
Create a configuration file or update the API key in the extension:
- Navigate to `extension/api/deepseek.ts`
- Add your DeepSeek API key

#### 4. Build the Extension
```bash
npm run build:extension
```

This will generate the production-ready extension files in the `dist-extension` folder.

#### 5. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist-extension` folder from your project directory

#### 6. Start Using!
1. Navigate to any LeetCode problem
2. Look for the **Smart Analysis** tab next to Description, Editorial, Solutions, and Submissions
3. Explore the two subtabs:
   - **Approach Suggestions**: Get hints on different solving strategies
   - **Complexity Analysis**: Analyze your submitted code's complexity

## 🛠️ Development

### Project Structure
```
extension/
├── contentScript.ts      # Injects UI into LeetCode pages
├── manifest.json         # Extension configuration
├── styles.css            # Custom styling
├── api/
│   └── deepseek.ts      # DeepSeek API integration
└── ui/
    ├── SmartTab.tsx     # Main tab component
    ├── Approaches.tsx   # Approach suggestions UI
    ├── Complexity.tsx   # Complexity analysis UI
    └── CopyCode.tsx     # Code copying utility
```

### Build for Production
```bash
npm run build:extension
```

## 🔧 Technologies Used

- **React** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **DeepSeek API** - AI-powered analysis
- **Chrome Extension API** - Browser integration

## 📝 How It Works

1. **User submits a solution** on LeetCode
2. **Extension extracts** problem description, constraints, and user's code
3. **Sends data** to DeepSeek API for analysis
4. **Receives structured analysis** with approaches and complexity breakdown
5. **Renders clean UI** in the Smart Analysis tab

## 🎨 UI Design

The extension seamlessly integrates with LeetCode's native UI:
- Matches LeetCode's tab styling
- No page redirects
- Responsive design
- Clean, minimal interface

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This extension is designed to help you learn and understand problem-solving approaches. Use it responsibly to enhance your learning experience, not to bypass the learning process.

## 🌐 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Coding! 🚀**