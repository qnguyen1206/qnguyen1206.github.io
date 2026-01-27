export default {
    id: 'leetcode-max-consecutive-ones',
    title: 'Max Consecutive Ones',
    category: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array'],
    date: '2026-01-26T12:00:00',
    excerpt: 'Write up of Shuffle the Array problem on LeetCode.',
    content: `
## Problem
Given a binary array \`nums\`, return the maximum number of consecutive \`1\`'s in the array.

 

Example 1:
Input: \`nums = [1,1,0,1,1,1]\`
Output: \`3\`
Explanation: \`The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.\`

Example 2:
Input: \`nums = [1,0,1,1,0,1]\`
Output: 2
 

Constraints:
- \`1 <= nums.length <= 10\`<sup>\`5\`</sup>
- \`nums[i] is either 0 or 1.\`

## Approach
My first thought is that we need 2 variables to keep track of the maximum number of consecutive and the current number of consecutive.

Then I can iterate through the array and update the two variables based on 2 rules:
1. If the current element is 1, increment the current consecutive.
2. If the current element is 0, reset the current consecutive to 0.
Then I can update the maximum consecutive by comparing the current consecutive and the maximum consecutive.


## Solution
[solutions]
\`\`\`python:Python
class Solution(object):
    def findMaxConsecutiveOnes(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        # var to keep track of the max consecutive of all time
        max_consecutive = 0

        # var to keep track of the curr consecutive
        curr_consecutive = 0

        # iterate through the arr
        for i in range(0, len(nums)):
            print("i: " + str(i))
            
            if nums[i] == 1:
                curr_consecutive += 1
            else:
                curr_consecutive = 0

            print("curr: " + str(curr_consecutive))

            if curr_consecutive >= max_consecutive:
                max_consecutive = curr_consecutive

            print("max: " + str(max_consecutive))
        
        return max_consecutive
\`\`\`
\`\`\`java: Java
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        // var to keep track of max consecutive
        int max_consecutive = 0;

        // var to keep track of curr consecutive
        int curr_consecutive = 0;

        // iterate through the arr
        for(int i = 0; i < nums.length; i++) {
            if(nums[i] == 1){
                curr_consecutive = curr_consecutive + 1;
            } else {
                curr_consecutive = 0;
            }

            if(curr_consecutive >= max_consecutive) {
                max_consecutive = curr_consecutive;
            }
        }

        return max_consecutive;
    }
}
\`\`\`
\`\`\`javascript: JavaScript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function(nums) {
    
    // var to keep track of max consecutive
    let max_consecutive = 0;

    // var to keep track of curr consecutive
    let curr_consecutive = 0;

    // iterate through the arr
    for(let i = 0; i < nums.length; i++) {
        if(nums[i] == 1) {
            curr_consecutive = curr_consecutive + 1;
        } else {
            curr_consecutive = 0;
        }

        if(curr_consecutive >= max_consecutive) {
            max_consecutive = curr_consecutive;
        }
    }

    return max_consecutive;


};
\`\`\`
\`\`\`csharp: C#
public class Solution {
    public int FindMaxConsecutiveOnes(int[] nums) {
        // var to keep track of max consecutive
        int max_consecutive = 0;

        // var to keep track of curr consecutive
        int curr_consecutive = 0;

        // iterate through the arr
        for (int i = 0; i < nums.Length; i++)
        {
            if (nums[i] == 1)
            {
                curr_consecutive++;
            }
            else
            {
                curr_consecutive = 0;
            }

            if (curr_consecutive >= max_consecutive)
            {
                max_consecutive = curr_consecutive;
            }
        }

        return max_consecutive;
    }
}
\`\`\`
\`\`\`php: PHP
class Solution {

    /**
     * @param Integer[] $nums
     * @return Integer
     */
    function findMaxConsecutiveOnes($nums) {
        // var to keep track of max consecutive
        $max_consecutive = 0;

        // var to keep track of curr consecutive
        $curr_consecutive = 0;

        // iterate through the arr
        for($i = 0; $i < count($nums); $i++) {
            if ($nums[$i] == 1) {
                $curr_consecutive++;
            } else {
                $curr_consecutive = 0;
            }

            if ($curr_consecutive >= $max_consecutive) {
                $max_consecutive = $curr_consecutive;
            }
        }

        return $max_consecutive;
    }
}
\`\`\`
[/solutions]

## Another Approach
In this problem, the problem had specific telling us that the array only contains 0 and 1 hence the name binary array.

Therefore, we can use this to our advantage. We can skip a step of comparing and use the number as a condition since 1 is true and 0 is false.

## Solution
[solutions]
\`\`\`python:Python
class Solution(object):
    def findMaxConsecutiveOnes(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        max_consecutive = 0
        curr_consecutive = 0
        for i in nums:
            # skip the comparison and use the number as a condition.
            if i:
                curr_consecutive += 1
                if curr_consecutive >= max_consecutive:
                    max_consecutive = curr_consecutive
            else:
                curr_consecutive = 0
        return max_consecutive
\`\`\`
\`\`\`javascript: JavaScript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function(nums) {
    
    // var to keep track of max consecutive
    var max_consecutive = 0;

    // var to keep track of curr consecutive
    var curr_consecutive = 0;

    // iterate through the arr
    for(var i = 0; i < nums.length; i++) {
        if(nums[i]) {
            curr_consecutive = curr_consecutive + 1;
        } else {
            curr_consecutive = 0;
        }

        if(curr_consecutive >= max_consecutive) {
            max_consecutive = curr_consecutive;
        }
    }

    return max_consecutive;


};
\`\`\`
\`\`\`php: PHP
class Solution {

    /**
     * @param Integer[] $nums
     * @return Integer
     */
    function findMaxConsecutiveOnes($nums) {
        // var to keep track of max consecutive
        $max_consecutive = 0;

        // var to keep track of curr consecutive
        $curr_consecutive = 0;

        // iterate through the arr
        for($i = 0; $i < count($nums); $i++) {
            if ($nums[$i]) {
                $curr_consecutive++;
            } else {
                $curr_consecutive = 0;
            }

            if ($curr_consecutive >= $max_consecutive) {
                $max_consecutive = $curr_consecutive;
            }
        }

        return $max_consecutive;
    }
}
\`\`\`
[/solutions]
## Complexity
Both of the approaches have the same complexity. However, the second approach have a faster runtime and use less memory.
- **Time:** O(n) where n is the length of the array.
- **Space:** O(1)
`
}