export default {
    id: 'todo-app',
    title: 'To-Do App',
    category: 'Tools',
    difficulty: 'Easy',
    tags: ['Python', 'Tkinter', 'MySQL'],
    date: '2026-02-10T12:00:00',
    excerpt: 'Write up and Design Process of To-Do App',
    content: `
This is a write up and design process of the To-Do App. Since the app is still in development, this write up is subject to change.

⸻⸻⸻⸻⸻

The todo app is a simple app that allows the users to add, remove and edit their tasks. Everyone can make a todo app and there are a lot of tutorials out there on how to create one. So why did I choose to create a todo app?

The answer is that I want to learn along the way of creating the app and I want to see how far can I push the limit of a todo app.

My initial vision was to create a simple todo app that integrated with a local AI agent such as DeepSeek from Ollama. The idea is that the AI aagent can help with reminding the user about their tasks and helping the user to add, remove and edit multiple tasks at once through a single natural language prompt.

The idea behind the mechanics of how to help the AI agent to add, remove and edit multiple tasks at once is that there should be a way for the AI agent to interact with the app itself, in other words, there should be functions within the app that allows the AI agent to add, remove and edit the tasks.

So, I created those functions. Beside the functions that work with the AI agent, I also created functions for the user so that in case they don't want to use the AI agent, they can still use the app normally.

Since I want to create something fun for the user and trying to incentivize the user to finish the tasks that they have set out for themselves. I have created a level system in which the user will level up by completing the tasks.

For the database part of the app, since the app is fully running locally, I use a text file (.txt) to store all the tasks. Each tasks are separate by "|" and the app will use string manipulation to read and write to the text file.

As the app grows and the more functionalities are added, I decided to break the app into smaller files each according to their functionality and the purpose of the file.

In addition, I also added a feature in which the user can share their tasks with other users. In order for this to work, I have to make the app connect to the internet, however, since I don't want to defeat the core idea of the app running locally, I decided to use MySQL Sharing in which the app will broadcast its data through a specific ip address and port. Then other users/apps/computers can pick up the data. I understand that this can cause security issue, however, the app is a todo app in which the data that are being broadcast is only the tasks that had refactor into as a SQL database, so the security issue is not very important.

As the app grows, I saw that there should be an option to allow the user to change their AI agent model since some people will prefer one model over the others. Therefore, I added an option to let the user to add, remove and change their AI agent model through the app.

Until this time, everytime I add a new feature, fix a bug or update the app, the user will have to redownload the app from the GitHub which is very time consuming and tedious. Therefore, I added an auto update feature and functionality to allow the app pulling the lastest version of the app from GitHub and update itself. There was a lot bugs and complications in the beginning, but after a few versions and revisions, it had worked as intended.

After using the app myself for a while, I saw that I had not use the AI agent feature a lot since I like to add everything myself manually. Therefore, I decided to have a way for the users to close or collapse the AI agent panel so that it does not get in the way and expand the todo list panel.

After finishing up with all the above features, I started to fix bugs that arise and improve some features such as the app does not require the user to have both Ollama and MySQL running in order for the app to be usable.

As time goes on and I continue to use the app myself, I figured out that it would be great if I am able to have a daily todo tasks list so that I can keep myself everyday productive and busy. It also help me to figure out my day if needed. So, my next feature for the app is a daily todo tasks list panel in which the user able to add, remove and edit their daily todo tasks with a time schedule.

After making sure everything is working correctly, I found out that the app took a really long time during boot up which can cause confusion and frustration. Thus, I decided to add in a start up loading screen so that the user know that the app is running and not freeze.

After using the todo tasks list for a while, I figure out that it is pretty hard for me to look at a list and instantly figure out what I have to do everyday so I decided to add in a calendar view in which it functioned the same way as the list does but more visual elements to it.

After seeing the successful in the todo tasks list calendar view, I decided it would also be a great idea to add in the daily todo tasks since there are not a lot of difference between them. Therefore, I decided to design the daily todo tasks calendar view as a weekly calendar instead of a monthly one like in todo tasks calendar view. This help minize down the timeframe for each of the tasks and the users won't get overwhelm by all the tasks they had added and the current tasks that are pending.

After looking at a lot of app that use AI agents, I saw that a lot of them allow the users to enter their own API keys from OpenAI, Claude, etc. in order to use to natively within the app. I think that this would also be a good idea since not everyone willing to download a local AI model since a lot of computer does not have the computing power that is needed for the model. Therefore, I decided to add in a way for the users to enter their own API keys from different AI services providers.

In addition to the AI agent feature update, I also update the app to be able to find duplicate tasks since I had ran into a lot of problems with keeping track with how many tasks I have add and sometimes I added a duplicate task without realizing it due to the immeses amount of tasks I had added, thus I decided to add in a feature that let the app find the duplicate tasks and allow the user to either keep both or delete one of the duplicates.

After using the daily todo list feature for a while, I found out that there are a lot of times where I need to have a start time and and end time for a tasks, in which I should have known earlier in the development. In the old version, the only time that the users able to give to the tasks in the due time which is helpful but not as helpful since a lot of tasks required to have a start time and end time in a daily or weekly schedule to work flawlessly. Thus, I decided to add in a start time and end time for the tasks in the daily todo list.

I then test all the features again to make sure everything work smoothly and I found no majors errors. However, I did notice that the functionality that allow the users to add multiple tasks really buggy and sometimes it will miss interpret the users inputs. The "Add multiple tasks" allows the users to add multiple tasks by writing in natural English and the app will use a parser to interpret and from there add in the tasks. This feature is inferior compare to the AI agent, however, this feature does work regardless whether or not the computer has wifi or not (which is needed if the user has an API keys for online AI services) and it also work regardless whether the computer have enough computing power to run a local AI model. Therefore this feature does have its own use cases. So, I decided improve the parser to make it more accurate and reliable such that the users can use more natural English language to add in their tasks instead of having to rely on certain phrases or words to allow the parser to work.

During this time, I got a job at Phala, which works on blockchain technology and decentralized systems so I decided to add in a feature that allows the users to export their tasks to the CVM (Confidential Virtual Machine) so that the users can securely store their tasks on the system. Phala Cloud CVM allows the app to be security decentralized while open up sharing across the internet instead of strictly through LAN. There can be also a web aspect in deploy through Phala CVM which allow users who doesn't want to download the app to view a company or organization's tasks.
`
}