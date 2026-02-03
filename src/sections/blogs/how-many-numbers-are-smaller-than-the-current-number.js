export default {
    id: 'leetcode-how-many-numbers-are-smaller-than-the-current-number',
    title: 'How Many Numbers Are Smaller Than the Current Number',
    category: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array'],
    date: '2026-01-27T12:00:00',
    excerpt: 'Write up of How Many Numbers Are Smaller Than the Current Number problem on LeetCode.',
    content: `
## Problem
Given the array \`nums\`, for each \`nums[i]\` find out how many numbers in the array are smaller than it. That is, for each \`nums[i]\` you have to count the number of valid \`j's\` such that \`j != i\` and \`nums[j] < nums[i]\`.

Return the answer in an array.

 

Example 1:
Input: \`nums = [8,1,2,2,3]\`
Output: \`[4,0,1,1,3]\`
Explanation: 
\`For nums[0]=8 there exist four smaller numbers than it (1, 2, 2 and 3).\` 
\`For nums[1]=1 does not exist any smaller number than it.\`
\`For nums[2]=2 there exist one smaller number than it (1).\`
\`For nums[3]=2 there exist one smaller number than it (1).\`
\`For nums[4]=3 there exist three smaller numbers than it (1, 2 and 2).\`

Example 2:
Input: \`nums = [6,5,4,8]\`
Output: \`[2,1,0,3]\`

Example 3:
Input: \`nums = [7,7,7,7]\`
Output: \`[0,0,0,0]\`
 

Constraints:
- \`2 <= nums.length <= 500\`
- \`0 <= nums[i] <= 100\`

## Approach
The first approach that comes to mind is to use brute force where we can use 2 for loops to compare each element with the other elements in the array.

## Solution
[solutions]
\`\`\`python:Python
class Solution(object):
    def smallerNumbersThanCurrent(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """

        result = []

        for i in range(0, len(nums)):
            count = 0
            for j in range(0, len(nums)):
                if nums[i] != nums[j] and nums[j] < nums[i]:
                    count += 1
            result.append(count)
        
        return result
\`\`\`
\`\`\`java: Java
class Solution {
    public int[] smallerNumbersThanCurrent(int[] nums) {
        int[] result = new int[nums.length];

        for (int i = 0; i < nums.length; i++) {
            int count = 0;
            for (int j = 0; j < nums.length; j++) {
                if (nums[i] != nums[j] && nums[j] < nums[i]) {
                    count++;
                }
            }
            result[i] = count;
        }
        return result;
    }
}
\`\`\`
\`\`\`csharp: C#
public class Solution {
    public int[] SmallerNumbersThanCurrent(int[] nums) {
        int[] result = new int[nums.Length];

        for (int i = 0; i < nums.Length; i++) {
            int count = 0;
            for (int j = 0; j < nums.Length; j++) {
                if (nums[i] != nums[j] && nums[j] < nums[i]) {
                    count++;
                }
            }
            result[i] = count;
        }
        return result;
    }
}
\`\`\`
\`\`\`javascript: JavaScript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var smallerNumbersThanCurrent = function(nums) {
    result = [];
    
    for (i = 0; i < nums.length; i++) {
        count = 0;
        for (j = 0; j < nums.length; j++) {
            if (nums[i] != nums[j] && nums[j] < nums[i]) {
                count++;
            }
        }
        result.push(count);
    }

    return result;
};
\`\`\`
\`\`\`php: PHP
class Solution {

    /**
     * @param Integer[] $nums
     * @return Integer[]
     */
    function smallerNumbersThanCurrent($nums) {
        $result = [];

        for ($i = 0; $i < count($nums); $i++) {
            $count = 0;
            for ($j = 0; $j < count($nums); $j++) {
                if ($nums[$i] != $nums[$j] && $nums[$j] < $nums[$i]) {
                    $count++;
                }
            }
            $result[$i] = $count;
        }

        return $result;
    }
}
\`\`\`
[/solutions]

## Complexity
- **Time:** O(n^2) where n is the length of the array.
- **Space:** O(n) where n is the length of the array.

## Another Approach
The brute force approach is simple but the time complexity is not good. We can improve the time complexity by using a counting sort approach.
The reason why is approach works is because the constraints tell us that the numbers in the array is between 0 and 100. Therefore, we can reduce the time complexity down to O(Kn) where K is the max value number.

## Solution
[solutions]
\`\`\`java: Java
class Solution {
    public int[] smallerNumbersThanCurrent(int[] nums) {
        int[] bucket = new int[102];
        for(int i=0; i<nums.length; i++)
            bucket[nums[i]+1]++;
			
        for(int i=0; i<101; i++) 
            bucket[i+1] += bucket[i];
			
        for(int i=0; i<nums.length; i++)
            nums[i] = bucket[nums[i]];
			
        return nums;
    }
}
\`\`\`
\`\`\`python: Python
class Solution(object):
    def smallerNumbersThanCurrent(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        # Create an array of size 102
        bucket = [0] * 102
        
        for i in range(0, len(nums)):
            bucket[nums[i] + 1] += 1
        
        for i in range(0, 101):
            bucket[i + 1] += bucket[i]

        for i in range(0, len(nums)):
            nums[i] = bucket[nums[i]]

        return nums
\`\`\`
[/solutions]

## Complexity
- **Time:** O(Kn) where n is the length of the array and K is the max value number which is 100 in this case.
- **Space:** O(1)
`
}