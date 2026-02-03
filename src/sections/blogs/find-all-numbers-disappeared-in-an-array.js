export default {
    id: 'find-all-numbers-disappeared-in-an-array',
    title: 'Find All Numbers Disappeared in an Array',
    category: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array'],
    date: '2026-02-02T12:00:00',
    excerpt: 'Write up of Find All Numbers Disappeared in an Array problem on LeetCode.',
    content: `
## Problem
Given an array \`nums\` of \`n\` integers where \`nums[i]\` is in the range \`[1, n]\`, return an array of all the integers in the range \`[1, n]\` that do not appear in \`nums\`.

Example 1:
Input: \`nums = [4,3,2,7,8,2,3,1]\`
Output: \`[5,6]\`

Example 2:
Input: \`nums = [1,1]\`
Output: \`[2]\`
 

Constraints:
\`n == nums.length\`
\`1 <= n <= 105\`
\`1 <= nums[i] <= n\`
 

Follow up: Could you do it without extra space and in \`O(n)\` runtime? You may assume the returned list does not count as extra space.

## Approach
The first approach that comes to my mind is that I can use a \`set\` to store all the unique numbers for \`nums\`. Then I can create another array to store the correct numbers from \`1\` to \`n\`. Then I can compare the two arrays and return the missing numbers.

## Solution
\`\`\`python: Python
result = []
        
        s = set()
        for i in nums:
            s.add(i)

        correct_arr = []
        for i in range(0, len(nums)):
            correct_arr.append(i + 1)

        for i in range(0, len(correct_arr)):
            if correct_arr[i] not in s:
                result.append(correct_arr[i])

        return result
\`\`\`
\`\`\`java: Java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();

        HashSet<Integer> s = new HashSet<>();
        for (int i : nums) {
            s.add(i);
        }

        List<Integer> correct_arr = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            correct_arr.add(i + 1);
        }

        for (int i = 0; i < correct_arr.size(); i++) {
            if (!s.contains(correct_arr.get(i))) {
                result.add(correct_arr.get(i));
            }
        }

        return result;
    }
}
\`\`\`
\`\`\`csharp: C#
public class Solution {
    public IList<int> FindDisappearedNumbers(int[] nums) {
        IList<int> result = new List<int>();

        HashSet<int> s = new HashSet<int>();
        foreach (int i in nums)
        {
            s.Add(i);
        }

        IList<int> correct_arr = new List<int>();
        for (int i = 0; i < nums.Length; i++)
        {
            correct_arr.Add(i + 1);
        }

        for (int i = 0; i < correct_arr.Count; i++)
        {
            if (!s.Contains(correct_arr[i]))
            {
                result.Add(correct_arr[i]);
            }
        }

        return result;
    }
}
\`\`\`

## Complexity
With the use of HashSet, we are able to reduce the time complexity to O(n) but we use extra space of O(n) for the set.
**Time:** O(n) where n is the length of the array.
**Space:** O(n) where n is the length of the array.

`
}