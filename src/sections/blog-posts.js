/*
   * =====================================================
   * MARKDOWN CHEAT SHEET FOR WRITEUP CONTENT
   * =====================================================
   * 
   * HEADERS:
   *   ## Section Title      → <h2> large header
   *   ### Subsection        → <h3> smaller header
   * 
   * TEXT FORMATTING:
   *   **bold text**         → bold
   *   x^2 or x^{10}         → superscript (x²)
   *   x_1 or x_{10}         → subscript (x₁)
   *   
   * ESCAPE CHARACTERS:
   *   \_                    → literal underscore _
   *   \^                    → literal caret ^
   *   (use these for file names like: this\_is\_a\_file)
   *   
   * CODE:
   *   \`inline code\`         → inline code snippet
   *   \`\`\`python            → code block (use language name)
   *   code here
   *   \`\`\`
   * 
   * SOLUTION TABS (for multiple language solutions):
   *   [solutions]
   *   \`\`\`python
   *   def solution():
   *       return answer
   *   \`\`\`
   *   \`\`\`javascript
   *   function solution() {
   *       return answer;
   *   }
   *   \`\`\`
   *   [/solutions]
   * 
   *   Custom labels (for multiple solutions in same language):
   *   [solutions]
   *   \`\`\`python:Brute Force
   *   # O(n^2) solution
   *   \`\`\`
   *   \`\`\`python:Optimized
   *   # O(n) solution
   *   \`\`\`
   *   [/solutions]
   * 
   * LISTS (unordered):
   *   - Item one            → bullet point
   *   - Item two            → bullet point
   *   - Item three          → bullet point
   * 
   * NUMBERED LISTS:
   *   1. First item         → numbered list
   *   2. Second item
   *   3. Third item
   * 
   * LINE BREAKS:
   *   Single newline        → line break (<br>)
   *   Double newline        → new paragraph
   * 
   * PARAGRAPHS:
   *   Leave a blank line between paragraphs
   * 
   * EXAMPLE:
   *   content: \`
   *   ## Problem Description
   *   Given an array, do something...
   *   
   *   ## My Approach
   *   **Key insight:** Use a hash map!
   *   
   *   Time complexity: O(n^2)
   *   Variable: x_1, x_2, x_{10}
   *   File: my\_file\_name.txt
   *   
   *   - Step 1: Initialize
   *   - Step 2: Iterate
   *   - Step 3: Return result
   *   
   *   [solutions]
   *   \`\`\`python
   *   def solution():
   *       return answer
   *   \`\`\`
   *   \`\`\`javascript
   *   function solution() {
   *       return answer;
   *   }
   *   \`\`\`
   *   [/solutions]
   *   \`
   * 
   * 
   * ⸻⸻⸻⸻⸻
   * =====================================================
   */

/* LeetCode */
import shuffleTheArray from './blogs/shuffle-the-array.js';
import concatenationOfArray from './blogs/concatenation-of-array.js';
import maxConsecutiveOnes from './blogs/max-consecutive-ones.js'; 
import setMismatch from './blogs/set-mismatch.js';
import howManyNumbersAreSmallerThanTheCurrentNumber from './blogs/how-many-numbers-are-smaller-than-the-current-number.js';

/* TryHackMe */
import offensiveSecurityIntro from './blogs/offensive-security-intro.js';
import cryptographyBasics from './blogs/cryptography-basics.js';
import monikerLinkCVE202421413 from './blogs/moniker-link-cve-2024-21413.js';
import metasploitIntroduction from './blogs/metasploit-introduction.js';
import metasploitExploitation from './blogs/metasploit-exploitation.js';
import metasploitMeterpreter from './blogs/metasploit-meterpreter.js';
import webApplicationBasics from './blogs/web-application-basics.js';
import javaScriptEssentials from './blogs/javascript-essentials.js';
import sqlFundamentals from './blogs/sql-fundamentals.js';  

/* TryHackMe Challenges */
import theGameChallenge from './blogs/the-game-challenge.js';

/* Tools */
import portScannerTool from './blogs/port-scanner-tool.js';

export const blogPosts = [
    /* LeetCode */
    shuffleTheArray,
    concatenationOfArray,
    maxConsecutiveOnes,
    setMismatch,
    howManyNumbersAreSmallerThanTheCurrentNumber,

    /* TryHackMe */
    cryptographyBasics,
    offensiveSecurityIntro,
    monikerLinkCVE202421413,
    metasploitIntroduction,
    metasploitExploitation,
    metasploitMeterpreter,
    webApplicationBasics,
    javaScriptEssentials,

    /* TryHackMe Challenges */
    theGameChallenge,

    /* Tools */
    portScannerTool,
    
];