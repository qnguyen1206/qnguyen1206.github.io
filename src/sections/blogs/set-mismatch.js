export default {
    id: 'leetcode-set-mismatch',
    title: 'Set Mismatch',
    category: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Set'],
    date: '2026-01-26T12:00:00',
    excerpt: 'Write up of Set Mismatch problem on LeetCode.',
    content: `
## Problem
You have a set of integers \`s\`, which originally contains all the numbers from \`1\` to \`n\`. Unfortunately, due to some error, one of the numbers in \`s\` got duplicated to another number in the set, which results in repetition of one number and loss of another number.

You are given an integer array \`nums\` representing the data status of this set after the error.

Find the number that occurs twice and the number that is missing and return them in the form of an array.

 
Example 1:
Input: \`nums = [1,2,2,4]\`
Output: \`[2,3]\`

Example 2:
Input: \`nums = [1,1]\`
Output: \`[1,2]\`
 

Constraints:
- \`2 <= nums.length <= 10\`<sup>\`4\`</sup>
- \`1 <= nums[i] <= 10\`<sup>\`4\`</sup>

## Approach
The first approach to this problem is to use brute force approach where we will go through the whole array to identify the duplicate number and the missing number.

## Solution
[solutions]
\`\`\`python:Python
class Solution(object):
    def findErrorNums(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        # var to store the result
        duplicate_num = 0
        missing_num = 0

        # iterate through the arr
        for i in range(1, len(nums) + 1):
            # check how many counts does each number has
            count = nums.count(i)

            # check for duplicates
            if count == 2:
                duplicate_num = i

            # check for missing
            elif count == 0:
                missing_num = i

        return [duplicate_num, missing_num]
\`\`\`
\`\`\`java: Java
class Solution {
    public int[] findErrorNums(int[] nums) {
        // var to store the result
        int duplicate_num = 0;
        int missing_num = 0;

        // iterate through the arr
        for (int i = 1; i < nums.length + 1; i++) {
            
            int occurence = 0;

            // occurences counting
            for (int j = 0; j < nums.length; j++) {
                if (nums[j] == i) {
                    occurence++;
                }
            }

            // check for duplicates
            if (occurence == 2) {
                duplicate_num = i;
            } else if (occurence == 0) { // check for missing
                missing_num = i;
            }
        }

        return new int[] {duplicate_num, missing_num};
    }
}
\`\`\`
\`\`\`csharp: C#
public class Solution {
    public int[] FindErrorNums(int[] nums) {
        // var to store the result 
        int duplicate_num = 0;
        int missing_num = 0;

        // iterate through the arr
        for (int i = 1; i <= nums.Length; i++)
        {

            // count occurrence
            int occurrence = 0;

            foreach (int num in nums)
            {
                if (num == i) 
                {
                    occurrence++;
                }
            }

            // check for duplicate num
            if (occurrence == 2)
            {
                duplicate_num = i;
            }

            //check for missing num
            else if (occurrence == 0)
            {
                missing_num = i;
            }
        }

        return [duplicate_num, missing_num];
    }
}
\`\`\`
\`\`\`javascript: JavaScript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findErrorNums = function(nums) {
    // var to store the result
    let duplicate_num = 0;
    let missing_num = 0;

    // iterate through the arr
    for (let i = 1; i < nums.length + 1; i++) {
        
        // occurrence
        let occurrence = nums.filter(num => num === i).length;

        // check for duplicate num
        if (occurrence == 2) {
            duplicate_num = i;
        } else if (occurrence == 0) { // check for missing num
            missing_num = i;
        }
    }

    return [duplicate_num, missing_num];
};
\`\`\`
\`\`\`php: PHP
class Solution {

    /**
     * @param Integer[] $nums
     * @return Integer[]
     */
    function findErrorNums($nums) {
        // var to store the result
        $duplicate_num = 0;
        $missing_num = 0;

        // iterate through the array
        for ($i = 1; $i < count($nums) + 1; $i++) {

            // occurrence
            $occurrence = 0;

            foreach ($nums as $num) {
                if ($num === $i) {
                    $occurrence++;
                }
            }

            // check for duplicate num
            if ($occurrence === 2) {
                $duplicate_num = $i;
            } else if ($occurrence === 0) { // check for missing num
                $missing_num = $i;
            }
        }

        return [$duplicate_num, $missing_num];
    }
}
\`\`\`
[/solutions]

## Complexity
This brute force approach takes O(n^2) because we have to run through the array once and during the iteration, we have to run through the array again to check for any duplicates of the current number.

- **Time:** O(n^2) where n is the length of the array.
- **Space:** O(1)

## Another Approach
However, we can improve the time complexity of the solution by using a set and since the set is unordered, we can check for duplicate and missing number using the sum of the set. We can do it by using these steps:

1. Calculate the expected sum of the set, where there is no duplicate and no missing number.
2. Calculate the sum of the given set and the sum of the unique set, where all elements are taken from the given set and all elements are unique.
3. Calculate the difference between the expected sum and the sum of the unique set. This will give us the value of the missing number.
4. Calculate the difference between the sum of the given set and the sum of the unique set. This will give us the value of the duplicate number.
5. Return the duplicate number and the missing number.

## Solution
[solutions]
\`\`\`python:Python
class Solution(object):
    def findErrorNums(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        n = len(nums)
        
        # Calculating the expected sum using Gauss's method:
        # 1 + 2 + 3 + .. + n = n(n+1) / 2
        expected_sum = n * (n + 1) // 2

        # Calculating the sum of the given set
        given_set_sum = 0

        for i in nums:
            given_set_sum += i

        # Calculating the sum of the unique set
        s = set()
        unique_set_sum = 0

        for i in nums:
            s.add(i)

        for i in s:
            unique_set_sum += i
        
        duplicate_num = given_set_sum - unique_set_sum
        missing_num = expected_sum - unique_set_sum

        return [duplicate_num, missing_num]
\`\`\`
\`\`\`java: Java
class Solution {
    public int[] findErrorNums(int[] nums) {
        int n = nums.length;

        // Calculating the expected sum using Gauss's method:
        // 1 + 2 + 3 + .. + n = n(n+1) / 2
        int expected_sum = n * (n + 1) / 2;

        // Calculating the sum of the given set
        int given_set_sum = 0;

        for (int i : nums) {
            given_set_sum += i;
        }

        // Calculating the sum of the unique set
        Set<Integer> s = new HashSet<Integer>();
        int unique_set_sum = 0;

        for (int i : nums) {
            s.add(i);
        }

        for (int i : s) {
            unique_set_sum += i;
        }

        int duplicate_num = given_set_sum - unique_set_sum;
        int missing_num = expected_sum - unique_set_sum;

        return new int[] {duplicate_num, missing_num};
    }
}
\`\`\`
\`\`\`csharp: C#
public class Solution {
    public int[] FindErrorNums(int[] nums) {
        int n = nums.Length;

        // Calculating the expected sum using Gauss's method
        // 1 + 2 + 3 + .. + n = n(n+1) / 2
        int expected_sum = n * (n + 1) / 2;

        // Calculating the sum of the given set
        int given_set_sum = 0;

        foreach (int i in nums) 
        {
            given_set_sum += i;
        }

        //Calculating the sum of the unique set
        HashSet<int> s = new HashSet<int>();
        int unique_set_sum = 0;

        foreach (int i in nums)
        {
            s.Add(i);
        }

        foreach (int i in s)
        {
            unique_set_sum += i;
        }

        int duplicate_num = given_set_sum - unique_set_sum;
        int missing_num = expected_sum - unique_set_sum;

        return [duplicate_num, missing_num];
    }
}
\`\`\`
\`\`\`javascript: JavaScript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findErrorNums = function(nums) {
    let n = nums.length;

    // Calculating the expected sum using Gauss's method
    // 1 + 2 + 3 + .. + n = n(n+1) / 2
    let expected_sum = Math.floor(n * (n + 1) / 2);

    // Calculating the sum of the given set
    let given_set_sum = 0;

    for (let i of nums) {
        given_set_sum += i;
    }

    //Calculating the sum of the unique set
    let s = new Set();
    let unique_set_sum = 0;

    for (let i of nums) {
        s.add(i);
    }

    for (let i of s) {
        unique_set_sum += i;
    }

    let duplicate_num = given_set_sum - unique_set_sum;
    let missing_num = expected_sum - unique_set_sum;

    return [duplicate_num, missing_num];
};
\`\`\`
\`\`\`php: PHP
class Solution {

    /**
     * @param Integer[] $nums
     * @return Integer[]
     */
    function findErrorNums($nums) {
        $n = count($nums);

        // Calculating the expected sum using Gauss's method
        // 1 + 2 + 3 + .. + n = n(n+1) / 2
        $expected_sum = intdiv($n * ($n + 1), 2);

        // Calculating the sum of the given set
        $given_set_sum = 0;

        foreach ($nums as $i) {
            $given_set_sum += $i;
        }

        // Calculating the sum of the unique set
        // Since there is no built-in set in PHP, we will use associated array
        // which is similar to dictionary where it has key-value pairs.
        $s = [];
        $unique_set_sum = 0;

        foreach ($nums as $i) {
            $s[$i] = $i;
        }

        foreach ($s as $i) {
            $unique_set_sum += $i;
        }

        $duplicate_num = $given_set_sum - $unique_set_sum;
        $missing_num = $expected_sum - $unique_set_sum;

        return [$duplicate_num, $missing_num];
    }
}
\`\`\`
[/solutions]

## Complexity
With this approach, we sacrificed the space complexity to improve the time complexity.

- **Time:** O(n) where n is the length of the array.
- **Space:** O(n) where n the size of the set.
`
}