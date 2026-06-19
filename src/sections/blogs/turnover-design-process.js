export default {
    id: 'turnover-design-process',
    title: 'TurnOver Design Process',
    category: 'Tools',
    difficulty: 'Hard',
    tags: ['Entrepreneurship', 'UI/UX Design', 'Product Design'],
    date: '2026-03-10T12:00:00',
    excerpt: 'Design Process for TurnOver',
    content: `
## Overview
TurnOver is a web app that allows coaches and players alike to upload their game videos and clips and using computer vision to help analyze the gameplay and statistics from the videos and clips.

My roles in the team are programmer and UI/UX designer.

We have four (4) members in our team - two (2) of us focus primarily on development and design, one (1) focuses on developing ML/computer vision, and one (1) handles outreach and presentations.

This project is currently in pre-seed stage and have been worked on for 4 months.

**Tech Stack**
1. Client-side:
    **Front-end:** React, Vite
    **Dev Server:** NodeJS
    **Database:** MongoDB
2. Server-side:
    **Back-end:** ExpressJS
    **Server:** NodeJS
    **Database:** MongoDB
3. Hosting:
    **Front-end Hosting:** Vercel
    **Back-end Hosting:** Render
    **Database Hosting:** MongoDB Atlas, Azure
4. Cloud:
    Cloudinary


## ICP & Stakeholder Map
The ideal customer profile for this startup concerns high school and smaller college football programs, including coaches, analysts, and athletic departments. Demographically, these are universities with active football programs, primarily in the U.S., with potential expansion to international markets later. They are large institutions with budgets that support data and analytics staff. They are motivated by gaining a competitive advantage and developing players, value precision and real-time insights, and are eager to adopt cutting-edge technology. They also want to showcase innovation to recruits, boosters, and alumni.

The time that is spent in post-game analysis would be effectively reduced by our software solution by using computer vision to dynamically track every player on the field. This would consistently help our customers to use data to shape practice plans, recruitment decisions, and in-game adjustments. Smaller programs such as DII/III football colleges or high schools are the best initial target because they are not only looking for constant ways to improve performance without excessive costs, but to also close the resource gap between them and larger programs that might outcompete them in such areas.

But why focus on this niche? They are early adopters who are willing to pay for products that deliver tangible and measurable on-field results. It is then our hope that success stories within this ICP group will slowly establish the foundation for credibility to later snowball into other larger programs.

Sports broadcasters and media networks such as ESPN and Fox Sports want enhanced fan engagement through real-time AI-driven insights and have medium-to-high influence because they shape exposure and revenue opportunities. Suppliers and technology partners, including hardware sensor companies, cloud platforms, and AI/ML vendors, are interested in long-term contracts and integration partnerships and have medium influence due to dependencies for scaling. 

Key Stakeholders: 
    1. Athletic Departments (High school and small college football program level)
        - Interested in affordable access / solutions to data aggregation of games and advanced analytics.
        - Their influence would be highly prioritized as they are the main customer we want our solution to attend to in the broadest use case. 

    2. Coaches & Analysts
        - Real time, accurate individualized player statistics 
        - Their influence would be driven by the direction of the school, but as coaches, they would heavily influence the direction of how they want their data to be analyzed or aggregated.

    3. Technology partners & broadcasting / sponsorships
        - Interested in securing long term contracts that either directly support school’s performance and marketing opportunities
        - Their influence is not the same priority as coaches and analysts for schools, as they would be more utilized during the later-stage scalability of the solution

<img src="/blogs/design-process/turnover/icp-stakeholder-map.png">

Our startup’s mission is to democratize advanced sports analytics by making cutting-edge computer vision technology accessible to high school and small college football programs. With the advent of NIL (Name and likeness) deals bringing a lot more money to the sport outside of the NFL, and the general commercial popularity of football, there is an increasing demand for competitive advantage and more advanced analysis at every level of the game. These early adopters like coaches, analysts, and athletic departments are motivated by competitive advantage, player development, and innovation, yet lack the resources of larger programs. By reducing the time and cost of post-game analysis, our solution empowers them to make smarter practice plans, recruitment decisions, and in-game adjustments. 

**Outreach results**
Cold emails answer distributions:
<img src="/blogs/design-process/turnover/customer-discovery-ans.png">

Cold emails location distributions:
<img src="/blogs/design-process/turnover/customer-discovery-states.png">

## User Stories

1. As a player/coach I want to upload video footage of games and highlights from the home page so that I can receive automated performance analysis and insights.
2. As a player/coach I want to be able to revisit past footage analysis in a History screen so that I have the liberty to re-analyze any past clips as I see fit, whether that’s a different player’s performance or not.
3. As a coach, I want to view individualized performance data collected from uploaded footage in a focused view so that I can identify areas of improvement for each athlete.
4. As a player, I want to see my performance statistics for a given clip in an easy to understand format so that I can track my progress over time.
5. As a coach, I want to compare player data points against each other so I can make decisions about team composition and training focus.
6. As a player, I want to be able to annotate clips with comments in order to effectively note down analysis on my and my teammates’ performance and report back to my coach.
7. As a coach, I want to be able to communicate with each of my players in an integrated dedicated chat so that I can provide instant feedback without having to rely on external services.
8. As a coach, I want to be able to send clips as assignments to players to have a factual guarantee on whether my players actively watch and reflect upon the intended footage.
9. As a coach, I want to be able to create a team in order to group players for ease of access as well as allowing them to observe their teammates’ statistics and gauge theirs by comparison.
10. As a player, I want the system to correctly handle edge cases (blurry video, occlusion, different resolutions) and flag low-confidence estimates so that users are aware when manual review is recommended.

## Product Requirement Documentation (PRD)

**Product Name:** Turnover

    1. **Product Overview:**

**Product Description:**
Turnover is a sports analytics platform which utilizes raw footage from gameplay in order to produce personalized insights based on extracted data for use by athletes and coaches. It makes professional grade performance review accessible to everyday players and teams on a lower budget by automating key data extraction/analysis and insights that typically would require hours of manual review. Turnover also makes possible real-time analysis during games due to time saved.

**Problem Solved:**
Coaches and especially players often lack automated, accessible tools for collecting, analyzing and communicating performance data. Coaches can’t observe every player in depth, especially at institutions with fewer resources.


    2. **Target User & Needs**

        1. Recreational (Casual):
            - Want quick, easy to access insights into how they did
            - Prefer simplicity and automation over excessive detail
            - Need an affordable way to track progress and improve, since most cannot afford professional coaching
        2. High School/Collegiate/Semi-Pro athletes:
            - Need detailed breakdowns of their performance to identify specific skill gaps.
            - Want to know how and why their performance changes, require qualitative insights
            - Desire consistent feedback and improvement tracking.
            - Value tools that help them share highlights or analytics with coaches and recruiters.
        3. Coaches and Trainers:
            - Need to monitor multiple players efficiently and on an objective basis.
            - Want automation in the review process to save time
            - Seek tools for transparent, comprehensive and easy communication with players

    3. **Core Features**

        1. Footage upload: Being able to upload video footage of multiple file sizes (~1MB–1GB) and formats (mp4, mov).
		    User stories (1) correspond to this feature.

        2. Team communication tool: A chat feature built on a data relay table that tracks and transfers information from player to coach and vice versa.
            User stories (6), (7), (8) and (9) correspond to this feature.

        3. Performance analysis: Automatically extracting multiple specific statistics for an individual player.
		    User stories (2), (3), (4), (5) and (10) correspond to this feature.


    4. **Success Metrics**

    If our MVP is successful, a person who hasn’t used the software before should be able to navigate the views intuitively and without much issue.
    Additionally, video processing is relatively fast (doesn’t take more than the actual footage to load on a standard laptop computer).
    Moreover, the extracted data should have a relatively high accuracy as compared to manual analysis. We will be able to measure this difference by assigning ground truth labels to footage and comparing those to the predictions. Our aim is around 65% correctness, but the higher the percentage, the better.

    5. **MVP Scope Statement**

    Turnover’s MVP will allow users to upload mp4/mov clips (1MB–1GB) and show upload progress and processing status. The system will automatically detect individual players in each clip and extracts multiple per‑player performance metrics. The software will store clips in a searchable History view. Finally, it will provide a line of contact between coaches and players, by allowing the creation of teams to group players, as well as simplifying direct communication with players via an integrated chat (the data relay table records metrics and messages).
    Cross-footage identity matching, trends across different clips, and real-time in-game analytics are deferred to post‑MVP.
    Initial release success criteria include intuitive navigation, processing times roughly comparable to clip length on typical hardware, and automated extraction accuracy against validated ground truth.


## Feature Identification and Justification

    1. **Customer Insights Summary:**

The main umbrella pain point that coaches in our specific customer space commonly face is the lack of automation in the collection of important information and data either during game seasons, performance stats, and other items that require more manual work-hours. What is interesting in this insight is that it being an umbrella pain point reveals a large collection of other pain points that our customer discovery phase has revealed. Simply put, coaches want more eyes on the field. Athletes want more of the why. Our customer insights show that coaches want more technologically that can facilitate the development of their athletes, for example conditioning and performance tracking in specific skill sets. A football coach will not dedicate all of his or her time watching the QB throwing drills all day. However, knowing the long term performance improvement or lack thereof of that QB’s throws after each practice is something game changing for the coach in terms of specialized practice ideas and team selection. In a similar vein, athletes want to know the bigger picture i.e. the why and how - “How can I get better at my sport and why is doing XYZ going to do that?” Most athletes are constantly driven to be better and better at their sport, so having a technological companion that helps them improve in their desired directions is key. 

Of course, these insights have shaped our MVP direction significantly. We want to create a multi-faceted “one size fits all” software companion that aids both the coach and the player in a bottom-up structure. It all begins with the player. What the player does each practice or each game is constantly tracked by our app, inputted by the player themself. We will create a two way data relay that ensures communication between player and coach, keeping transparency and expectations consistent across practices and games. 

    2. **Core Product Concept:**

**Purpose:**
Our product is a sports analytics platform that turns raw gameplay footage into personalized, data driven as well as qualitative insights. Its purpose is to make advanced performance insights that were once reserved for professional teams accessible to everyday players, high school athletes, and collegiate programs of all levels. The platform enables athletes to upload and analyze video from practices or games, receive automated breakdowns of their individual performance, and share results with coaches. We remove much of the burden of manual review, and for large team based sports where individual players might not get the level of attention they want from coaches, personalized player level feedback is invaluable for both coaches and players.

**Primary User:**
The primary users of this platform are athletes at varying levels of competitiveness from recreational players seeking self-improvement to high school and collegiate athletes aiming to reach the next level. Secondary users include coaches, trainers, and performance analysts who rely on player metrics and video data to tailor feedback, plan training sessions, and make informed roster or strategy decisions. The platform bridges the information gap between these two groups by creating a shared, data backed view of performance. 

**Core Value Proposition:**
We put the player first by combining automated video analysis, individualized statistics, and transparent data sharing into one seamless ecosystem. Using uploaded video footage, the system identifies players, extracts key performance metrics, and tracks improvement over time. Players can see how they stack up against their past performances or teammates, while coaches gain reliable, quantified insights into each athlete’s progress. We also intend to provide analysis faster, as well as some information real time during games to help with mid game strategic changes as well as injury prevention. 

    3. **MVP Essential Features:**

        **Feature:** Being able to upload video footage of multiple file sizes (~1MB–1GB) and formats (mp4, mov).
        **Insight:** Persistence of extensive manual labor and importance of saved analysis time.
        **Why it’s essential:** It’s a core feature because without it, we cannot have any data to process on. Our entire program concept works on interpreting this key information.

        **Feature:** A data relay table that tracks and transfers information between player to coach.
        **Insight:** Coaches and players want to have some kind of information / stats tracking features that are relayed back and forth between coaches and players, keeping transparency of improvements or lack thereof. 
        **Why it’s essential:** Coaches often don’t have much insight on their players when they are off the field. Players often don’t have much insight in how they compare to the rest of the team in various metrics. With this two way communication, coaches get a better quantified idea of who is improving, which sub team is improving, and associated rankings. 

        **Feature:** Automatically extracting multiple specific statistics for an individual player. 
        **Insight:** Coaches & players both seem to want a way of extracting individualized/personal player level feedback from film rather than team-wide macro data.
        **Why it’s essential:** Since the users are able to upload a video footage, our app should be able to do something with it, otherwise, our app will just become a storage app. Therefore, the ability to automatically extract statistics out from video footage has to become a feature to make our app a viable product.

        **Feature:** Matching players identities from one video to another (cross-footage analysis).
        **Insight:** Athletes want context about why performance changes, not just how.
        **Why it’s good to have:** The users are able to upload multiple video footages onto the app and some of them can be parts of a game or a match, our app should be able to tag if a player in one footage is the same as the one in another footage, and this can help us perform a better analytics on the player as a whole instead of per footage.

        **Feature:** Comparing player statistics from one game to another (performance over time)
        **Insight:** Athletes want context about why performance changes, not just how.
        **Why it’s good to have:** Since our app is an analytics app, it should be able to track and analyze if a player is doing better or worse than usual in the video footage based on the historical performance of the player, if they upload their video footage frequently.

**Summary:**
Since feature 1 is how we are able to obtain customer footage, it is a core feature in the MVP in order for our app to be able to work properly. Since our app needs to be able to work between players and coaches (due to computer errors during early training stages), our app needs to be able to let the players and coaches connect to each other so that the coaches can help the players improve better. Therefore, all the players' statistics should be able to be viewed from the coaches’ devices. Therefore, feature 2 is a must. As explained above, feature 3 is also a must because our app needs to be able to do something else beside storing users’ uploaded video footage; in addition, our app needs to be able get the player statistics out from the footage and send it to the coaches so the coaches can have something to based on and help the players improve. Feature 4 and 5 are nice to have features since it would be great for the players to be able to upload multiple segments footages of the same game and be able to see their performance overall in that game; in addition, for players who want to improve, they likely want to have something to tell them if they are doing better in one game and worse in another and be able to track their performance overtime to see how they have improved.


## User Flow Diagram

<img src="/blogs/design-process/turnover/user-flow-diagram.jpg">


## Wireframes & Mockups

<a href="https://www.figma.com/proto/qR6MO8OJDOcKrBGsicWrt7/Untitled?node-id=12-20820&p=f&t=klqdyriqfhM4S7q3-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=12%3A20820"><img src="/blogs/design-process/turnover/wireframe-1.png"></a>
<a href="https://www.figma.com/proto/qR6MO8OJDOcKrBGsicWrt7/Untitled?node-id=12-20820&p=f&t=klqdyriqfhM4S7q3-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=12%3A20820"><img src="/blogs/design-process/turnover/wireframe-figma.png"></a>
<a href="https://www.figma.com/proto/qR6MO8OJDOcKrBGsicWrt7/Untitled?node-id=12-20820&p=f&t=klqdyriqfhM4S7q3-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=12%3A20820">Link to Wireframes</a>

## Visual Design & Branding

**Logo**
<img src="/images/Turnover-Logo.jpg">

Designs choice
    - #E34234 and #000000 is the main choice of the color palette due to its contrast, boldness and uniqueness. The red color is also associated with energy, passion, and action, which aligns well with the dynamic nature of sports. The black color adds a sense of sophistication and professionalism to the brand, making it suitable for a sports analytics platform that aims to provide high-quality insights and data-driven solutions.
    - Minimalist aesthetic
    - Modern UI / UX elements
    - Intuitive drag & drop feature

## Technical Constraints & Trade-offs

These are the constraints during MVP developement:

1. Time Constraints
    - Manual Analysis from Coaches
    - Train Model

2. Technical Constraints
    - No connected database i.e. manual linking between coaches and players
    - No training data for our model

3. User Constraints
    - Not compatible for players without coaches
    - No real users feedback (minor issue)

## Final Product

### MVP
<a href="https://cs4803-eight.vercel.app/"><img src="/blogs/design-process/turnover/mvp-1.png"></a>
<a href="https://cs4803-eight.vercel.app/">Product Website Link</a>
`
}