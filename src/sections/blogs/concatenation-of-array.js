export default { //Concatenation of Array
    id: 'leetcode-concatenation-of-array',
    title: 'Concatenation of Array',
    category: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array'],
    date: '2026-01-25T12:00:00',
    excerpt: 'Write up of Concatenation of Array problem on LeetCode.',
    content: `
## Problem
Given an integer array nums of length \`n\`, you want to create an array \`ans\` of length \`2n\` where \`ans[i] == nums[i]\` and \`ans[i + n] == nums[i]\` for \`0 <= i < n\` **(0-indexed)**.

Specifically, ans is the concatenation of two nums arrays.

Return the array ans.

Example 1:
Input: \`nums = [1,2,1]\`
Output: \`[1,2,1,1,2,1]\`
Explanation: \`The array ans is formed as follows:
- ans = [nums[0],nums[1],nums[2],nums[0],nums[1],nums[2]]
- ans = [1,2,1,1,2,1]\`

Example 2:
Input: \`nums = [1,3,2,1]\`
Output: \`[1,3,2,1,1,3,2,1]\`
Explanation: \`The array ans is formed as follows:
- ans = [nums[0],nums[1],nums[2],nums[3],nums[0],nums[1],nums[2],nums[3]]
- ans = [1,3,2,1,1,3,2,1]\`
 

Constraints:
- \`n == nums.length\`
- \`1 <= n <= 1000\`
- \`1 <= nums[i] <= 1000\`

## Approach
This is a very straight forward problem and different languages will have different ways of solving this problem.

## Solution
[solutions]
\`\`\`python:Python
class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        return nums + nums
\`\`\`
\`\`\`java:Java
class Solution {
    public int[] getConcatenation(int[] nums) {
        int[] result = new int[nums.length * 2];
        System.arraycopy(nums, 0, result, 0, nums.length);
        System.arraycopy(nums, 0, result, nums.length, nums.length);
        return result;
    }
}
\`\`\`
\`\`\`javascript:JavaScript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var getConcatenation = function(nums) {
    return nums.concat(nums);
};
\`\`\`
\`\`\`csharp: C# without Concat
public class Solution {
    public int[] GetConcatenation(int[] nums) {
        return [..nums, ..nums];
    }
}
\`\`\`
\`\`\`php:PHP
class Solution {

    /**
     * @param Integer[] $nums
     * @return Integer[]
     */
    function getConcatenation($nums) {
        return [...$nums, ...$nums];
    }
}
\`\`\`
[/solutions]

## Complexity
- **Time:** O(n) where n is the length of the array.
- **Space:** O(n) where n is the physical memory used by the array.
`
}