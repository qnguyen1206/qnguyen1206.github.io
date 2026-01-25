export default { //Shuffle the Array
      id: 'leetcode-shuffle-the-array',
      title: 'Shuffle the Array',
      category: 'LeetCode',
      difficulty: 'Easy',
      tags: ['Array'],
      date: '2026-01-25T12:00:00',
      excerpt: 'Write up of Shuffle the Array problem on LeetCode.',
      content: `
## Problem
Given the array \`nums\` consisting of \`2n\` elements in the form \`[x1,x2,...,xn,y1,y2,...,yn]\`.

Return the array in the form \`[x1,y1,x2,y2,...,xn,yn]\`.

Example 1:
Input: \`nums = [2,5,1,3,4,7], n = 3\`
Output: \`[2,3,5,4,1,7] \`
Explanation: \`Since x_1=2, x_2=5, x_3=1, y_1=3, y_2=4, y_3=7 then the answer is [2,3,5,4,1,7]\`.

Example 2:
Input: \`nums = [1,2,3,4,4,3,2,1], n = 4\`
Output: \`[1,4,2,3,3,2,4,1]\`

Example 3:
Input: \`nums = [1,1,2,2], n = 2\`
Output: \`[1,2,1,2]\`
 
Constraints:
- \`1 <= n <= 500\`
- \`nums.length == 2n\`
- \`1 <= nums[i] <= 10^3\`

## Approach
The first thing that comes to my mind is that we can split the \`nums\` array at \`n\` and then using a for loop to interleave the two arrays.

**Key Insight 1:** We need to use 2 pointers to keep track of the two arrays.
**Key Insight 2:** We need to create a way to keep track of which pointer to use next.

## Solutions
[solutions]
\`\`\`python:Python without zip
class Solution:
    def shuffle(self, nums: List[int], n: int) -> List[int]:
        # split the array into 2
        arr1 = nums[0:n]
        arr2 = nums[n:len(nums)]

        # create a result array
        result = []

        # pointers
        arr1_pt = 0
        arr2_pt = 0

        # flag to check which array to use
        is_arr1 = 1

        # interleave the two arrays
        for i in range(0, len(nums)):
            if is_arr1 == 1 and arr1_pt < len(arr1):
                result.append(arr1[arr1_pt])
                arr1_pt += 1
                is_arr1 = 0
            elif is_arr1 == 0 and arr2_pt < len(arr2):
                result.append(arr2[arr2_pt])
                arr2_pt += 1
                is_arr1 = 1
        return result
\`\`\`
\`\`\`python:Python with zip
class Solution:
    def shuffle(self, nums: List[int], n: int) -> List[int]:
        # create a result array
        result = []

        # interleave the two arrays using zip
        for i,j in zip(nums[:n], nums[n:]):
            result += [i,j]
        return result
\`\`\`
\`\`\`java: Java
class Solution {
    public int[] shuffle(int[] nums, int n) {
        // split the array into 2
        int[] arr1 = new int[nums.length / 2];
        int[] arr2 = new int[nums.length / 2];

        // create a result array
        int[] result = new int[nums.length];

        // pointers
        int arr1_pt = 0;
        int arr2_pt = 0;

        // flag to check which array to use
        int is_arr1 = 1;

        // copy the array
        System.arraycopy(nums, 0, arr1, 0, n);
        System.arraycopy(nums, n, arr2, 0, nums.length - n);

        // interleave the two arrays
        for (int i = 0; i < nums.length; i++) {
            if (is_arr1 == 1 && arr1_pt < arr1.length) {
                result[i] = arr1[arr1_pt];
                arr1_pt = arr1_pt + 1;
                is_arr1 = 0;
            } else if (is_arr1 == 0 && arr2_pt < arr2.length) {
                result[i] = arr2[arr2_pt];
                arr2_pt = arr2_pt + 1;
                is_arr1 = 1;
            }
        }
        return result;
    }
}
\`\`\`
[/solutions]

## Complexity
- **Time:**O(n)
- **Space:** O(n)

## Another Approach

The approach above is correct and it will work. However, there is a better way to solve this problem.

If we take a look at the arrray, we can see that we can use \`i + n\` to get the correct position of the element in the second array without the need of use pointers and create 2 new arrays.

For example, if we have \`nums = [1,2,3,4,5,6]\` and \`n = 3\`, we can see that the first element of the first array is at \`nums[0]\` and the first element of the second array is at \`nums[3]\`. The difference between the two elements position is \`3\`, which is \`n\`.

**Key Insight:** We can use \`i + n\` to get the correct position of the element in the second array.

## Solution
[solutions]
\`\`\`python:Python with i + n
class Solution:
    def shuffle(self, nums: List[int], n: int) -> List[int]:
        # create a result array
        result = []

        # interleave the two arrays
        for i in range(n):
            result.append(nums[i])
            result.append(nums[i + n])
        return result
\`\`\`
[/solutions]

## Complexity
- **Time:** O(n)
- **Space:** O(n)
      `
}