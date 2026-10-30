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
   * TABS/INDENTATION:
   *   [tab]                 → tab indent (2 em spaces)
   *   \t (actual tab)       → tab indent (2 em spaces)
   *   4 spaces              → tab indent (at line start)
   *   2 spaces              → tab indent (at line start)
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
    * COLLAPSIBLE DROPDOWNS:
    *   [dropdown:Section Title]
    *   Any markdown content here...
    *   [/dropdown]
    * 
    * COLLAPSIBLE DROPDOWN TABS:
    *   [dropdown-tabs:Tab Group Title]
    *   [tab:Overview]
    *   Markdown for overview tab...
    *   [/tab]
    *   [tab:Details]
    *   Markdown for details tab...
    *   [/tab]
    *   [/dropdown-tabs]
    *   (optional labels also work: [dropdown-tabs] ... [tab]Content[/tab] ... [/dropdown-tabs])
    *   (if no [tab] blocks are provided, all content still renders inside one collapsible section)
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
   * TABLES:
   *   Easy syntax (recommended):
   *   [table]
   *   Header 1 | Header 2 | Header 3
   *   Cell 1 | Cell 2 | Cell 3
   *   Cell 4 | Cell 5 | Cell 6
   *   [/table]
   *   
   *   Standard markdown syntax (with alignment):
   *   | Header 1 | Header 2 | Header 3 |
   *   |----------|----------|----------|
   *   | Cell 1   | Cell 2   | Cell 3   |
   *   | Cell 4   | Cell 5   | Cell 6   |
   *   
   *   Alignment options (in separator row):
   *   |:---------|  → left align (default)
   *   |:--------:|  → center align
   *   |---------:|  → right align
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

/*
   * =====================================================
   * LAYOUT CHEATSHEET
   * =====================================================

export default {
    id: '',
    title: '',
    category: '',
    difficulty: '',
    tags: [''],
    date: '',
    excerpt: '',
    content: `
`
}

*/

/* LeetCode */
import shuffleTheArray from '../../sections/blogs/shuffle-the-array.js';
import concatenationOfArray from '../../sections/blogs/concatenation-of-array.js';
import maxConsecutiveOnes from '../../sections/blogs/max-consecutive-ones.js'; 
import setMismatch from '../../sections/blogs/set-mismatch.js';
import howManyNumbersAreSmallerThanTheCurrentNumber from '../../sections/blogs/how-many-numbers-are-smaller-than-the-current-number.js';
import findAllNumbersDisappearedInAnArray from '../../sections/blogs/find-all-numbers-disappeared-in-an-array.js';
import buildAnArrayWithStackOperations from '../../sections/blogs/build-an-array-with-stack-operations.js';

/* TryHackMe */
import offensiveSecurityIntro from '../../sections/blogs/offensive-security-intro.js';
import cryptographyBasics from '../../sections/blogs/cryptography-basics.js';
import monikerLinkCVE202421413 from '../../sections/blogs/moniker-link-cve-2024-21413.js';
import metasploitIntroduction from '../../sections/blogs/metasploit-introduction.js';
import metasploitExploitation from '../../sections/blogs/metasploit-exploitation.js';
import metasploitMeterpreter from '../../sections/blogs/metasploit-meterpreter.js';
import webApplicationBasics from '../../sections/blogs/web-application-basics.js';
import javaScriptEssentials from '../../sections/blogs/javascript-essentials.js';
import sqlFundamentals from '../../sections/blogs/sql-fundamentals.js';  
import burpSuiteTheBasics from '../../sections/blogs/burp-suite-the-basics.js';
import hydra from '../../sections/blogs/hydra.js';
import gobusterTheBasics from '../../sections/blogs/gobuster-the-basics.js';
import shellsOverview from '../../sections/blogs/shells-overview.js';
import sqlmapTheBasics from '../../sections/blogs/sqlmap-the-basics.js';
import socFundamentals from '../../sections/blogs/soc-fundamentals.js';
import digitalForensicsFundamentals from '../../sections/blogs/digital-forensics-fundamentals.js';
import incidentResponseFundamentals from '../../sections/blogs/incident-response-fundamentals.js';
import logsFundamentals from '../../sections/blogs/logs-fundamentals.js';
import introductionToSIEM from '../../sections/blogs/introduction-to-siem.js';
import firewallFundamentals from '../../sections/blogs/firewall-fundamentals.js';
import idsFundamentals from '../../sections/blogs/ids-fundamentals.js';
import vulnerabilityScannerOverview from '../../sections/blogs/vulnerability-scanner-overview.js';
import cyberchefTheBasics from '../../sections/blogs/cyberchef-the-basics.js';
import capaTheBasics from '../../sections/blogs/capa-the-basics.js';
import remnuxGettingStarted from '../../sections/blogs/remnux-getting-started.js';
import flarevmArsenalOfTools from '../../sections/blogs/flarevm-arsenal-of-tools.js';
import fileInclusion from '../../sections/blogs/file-inclusion.js';
import raceConditions from '../../sections/blogs/race-conditions.js';
import sqlInjection from '../../sections/blogs/sql-injection.js';
import nmapLiveHostDiscovery from '../../sections/blogs/nmap-live-host-discovery.js';
import aiMlSecurityThreats from '../../sections/blogs/ai-ml-security-threats.js';
import aiModelsAndData from '../../sections/blogs/ai-models-and-data.js';

/* TryHackMe Challenges */
import theGameChallenge from '../../sections/blogs/the-game-challenge.js';
import pickleRickChallenge from '../../sections/blogs/pickle-rick-challenge.js';
import hammerChallenge from '../../sections/blogs/hammer-challenge.js';

/* HackTheBox Challenges */
import meow from '../../sections/blogs/meow.js';

/* Tools */
import portScannerTool from '../../sections/blogs/port-scanner-tool.js';
import todoApp from '../../sections/blogs/todo-app.js';
import turnoverDesignProcess from '../../sections/blogs/turnover-design-process.js';
import redesignEbayDesignProcess from '../../sections/blogs/redesign-ebay-design-process.js';

/* Games */
import windowWashingGameMDM from '../../sections/blogs/window-washing-game-mdm.js';
import mythicalHuntMDM from '../../sections/blogs/mythical-hunt-mdm.js';
import lmc4720InteractiveNarrativeProject from '../../sections/blogs/lmc-4720-interactive-narrative-project.js';
import kartTheTechFilledRacingGame from '../../sections/blogs/kart-the-tech-filled-racing-game.js';

/* Design */
import biophiliaDesignProcess from '../../sections/blogs/biophilia-design-process.js';

export const blogPosts = [
    /* LeetCode */
    shuffleTheArray,
    concatenationOfArray,
    maxConsecutiveOnes,
    setMismatch,
    howManyNumbersAreSmallerThanTheCurrentNumber,
    findAllNumbersDisappearedInAnArray,
    buildAnArrayWithStackOperations,

    /* TryHackMe */
    cryptographyBasics,
    offensiveSecurityIntro,
    monikerLinkCVE202421413,
    metasploitIntroduction,
    metasploitExploitation,
    metasploitMeterpreter,
    webApplicationBasics,
    javaScriptEssentials,
    sqlFundamentals,
    burpSuiteTheBasics,
    hydra,
    gobusterTheBasics,
    shellsOverview,
    sqlmapTheBasics,
    socFundamentals,
    digitalForensicsFundamentals,
    incidentResponseFundamentals,
    logsFundamentals,
    introductionToSIEM,
    firewallFundamentals,
    idsFundamentals,
    vulnerabilityScannerOverview,
    cyberchefTheBasics,
    capaTheBasics,
    remnuxGettingStarted,
    flarevmArsenalOfTools,
    fileInclusion,
    raceConditions,
    sqlInjection,
    nmapLiveHostDiscovery,
    aiMlSecurityThreats,
    aiModelsAndData,
    
    /* TryHackMe Challenges */
    theGameChallenge,
    pickleRickChallenge,
    hammerChallenge,

    /* HackTheBox Challenges */
    meow,

    /* Tools */
    portScannerTool,
    todoApp,

    /* Games */
    windowWashingGameMDM,
    //mythicalHuntMDM,
    //lmc4720InteractiveNarrativeProject,
    kartTheTechFilledRacingGame,

    /* Design */
    turnoverDesignProcess,
    redesignEbayDesignProcess,
    biophiliaDesignProcess,
    
];
