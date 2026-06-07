export default {
    id: 'build-an-array-with-stack-operations',
    title: 'Build an Array With Stack Operations',
    category: 'LeetCode',
    difficulty: 'Medium',
    tags: ['Stack'],
    date: '2026-06-06T12:00:00',
    excerpt: 'Write up of Build an Array With Stack Operations problem on LeetCode.',
    content: `
## Problem

You are given an integer array \`target\` and an integer \`n\`.

- \`"Push"\`: pushes an integer to the top of the stack.
- \`"Pop"\`: removes the integer on the top of the stack.

You also have a stream of the integers in the range \`[1, n]\`.

Use the two stack operations to make the numbers in the stack (from the bottom to the top) equal to \`target\`. You should follow the following rules:

- If the stream of the integers is not empty, pick the next integer from the stream and push it to the top of the stack.
- If the stack is not empty, pop the integer at the top of the stack.
- If, at any moment, the elements in the stack (from the bottom to the top) are equal to \`target\`, do not read new integers from the stream and do not do more operations on the stack.

Return the stack operations needed to build \`target\` following the mentioned rules. If there are multiple valid answers, return **any of them**.

**Example 1:**

**Input:** target = [1,3], n = 3
**Output:** ["Push","Push","Pop","Push"]
**Explanation:** Initially the stack s is empty. The last element is the top of the stack.
Read 1 from the stream and push it to the stack. s = [1].
Read 2 from the stream and push it to the stack. s = [1,2].
Pop the integer on the top of the stack. s = [1].
Read 3 from the stream and push it to the stack. s = [1,3].

**Example 2:**

**Input:** target = [1,2,3], n = 3
**Output:** ["Push","Push","Push"]
**Explanation:** Initially the stack s is empty. The last element is the top of the stack.
Read 1 from the stream and push it to the stack. s = [1].
Read 2 from the stream and push it to the stack. s = [1,2].
Read 3 from the stream and push it to the stack. s = [1,2,3].

**Example 3:**

**Input:** target = [1,2], n = 4
**Output:** ["Push","Push"]
**Explanation:** Initially the stack s is empty. The last element is the top of the stack.
Read 1 from the stream and push it to the stack. s = [1].
Read 2 from the stream and push it to the stack. s = [1,2].
Since the stack (from the bottom to the top) is equal to target, we stop the stack operations.
The answers that read integer 3 from the stream are not accepted.

**Constraints:**

- 1 <= target.length <= 100
- 1 <= n <= 100
- 1 <= target[i] <= n
- \`target\` is strictly increasing.

## Approach
From the examples, it seems like I have to push all the numbers from \`1\` to \`n\` and pop the numbers that are not in the \`target\` array. Therefore, I decided to loop through \`1\` to \`n\` and use a variable \`target_index\` to keep track of the index of the \`target\` array.

I decided to append \`"Push"\` to the stack for every number.

Then, if the number is not in the \`target\` and the \`target_index\` is less than the length of the \`target\` array, I will append \`"Pop"\` to the stack. Otherwise, I will increment the \`target_index\` by 1 since the number is matching the \`target\` array at the \`target_index\`.

If the \`target_index\` equals or exceeds the length of the \`target\` array, I will stop the loop since one of the rules is that if the stack (from the bottom to the top) is equal to \`target\`, we stop the stack operations.

## Solutions
[solutions]
\`\`\`python:Python
class Solution(object):
    def buildArray(self, target, n):
        """
        :type target: List[int]
        :type n: int
        :rtype: List[str]
        """
        stack = []
        target_index = 0
        for i in range(1, n + 1):
            stack.append("Push")
            if target_index < len(target) and i == target[target_index]:
                target_index += 1
                if target_index >= len(target):
                    break
            else:
                stack.append("Pop")
        return stack
\`\`\`
\`\`\`java:Java
class Solution {
    public List<String> buildArray(int[] target, int n) {
        List<String> stack = new ArrayList<String>();
        int target_index = 0;
        for (int i = 1; i < n + 1; i++) {
            stack.add("Push");
            if (target_index < target.length && i == target[target_index]) {
                target_index++;
                if (target_index >= target.length) {
                    break;
                }
            } else {
                stack.add("Pop");
            }
        }
        return stack;
    }
}
\`\`\`
\`\`\`csharp:C#
public class Solution {
    public IList<string> BuildArray(int[] target, int n) {
        IList<string> stack = new List<string>();
        int target_index = 0;
        for (int i = 1; i < n + 1; i++) {
            stack.Add("Push");
            if (target_index < target.Length && i == target[target_index]) {
                target_index++;
                if (target_index >= target.Length) {
                    break;
                }
            } else {
                stack.Add("Pop");
            }
        }
        return stack;
    }
}
\`\`\`
[/solutions]

## Complexity Analysis
- Time complexity: O(n) since we are looping through \`1\` to \`n\`.
- Space complexity: O(n) since we have to store the stack operations in an array.
`
}