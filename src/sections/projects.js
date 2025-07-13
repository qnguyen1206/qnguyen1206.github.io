export function initProjects() {
  const projects = document.getElementById('projects');
  
  // Project data
  const projectsData = [
    {
      id: 'kart-tech-racing',
      title: 'Kart: A Tech Filled Racing Game',
      category: 'Game Development',
      image: 'images/KartIcon.png',
      description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
      tags: ['Godot', 'Steamworks', 'GitLab'],
      status: 'alpha',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Multiplayer</li>
          <li>Simulated real world physics</li>
          <li>Work on Steam</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          I was able to create a multiplayer system that is able to work through Steamworks' APIs using GodotSteam.
          The multiplayer system is a P2P system that is using Steamworks' APIs and Steam's backend server.
          It is easier to create the system because the hard part had been done behind the scene by GodotSteam's team.
          Our multiplayer player is a very basic one which only includes sending position, rotation, car choice, and key press.
        </p>
        <p>
          I designed one kart, the Cannon Kart, that was able to move in an opposite direction of the where the kart.
          However, due to unable to balance the kart, I decided to put the kart on hold.
        </p>
        <p>
          I also designed the UI for the game. The UI is currently very basic due to the lack of experience on my side.
        </p>
        <p>
          We are planning to release the game on Steam as beta in the near future.
        </p>
      `
    },
    {
      id: 'infinity-mythical-hunt',
      title: 'Infinity: Mythical Hunt',
      category: 'Game Development',
      image: 'images/InQnityIcon.png',
      description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
      tags: ['Godot', 'Steamworks', 'GitLab'],
      status: 'in development',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Singleplayer or Multiplayer</li>
          <li>Weapons System</li>
          <li>Basic Finite State Machine AI</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          I was using the same system as Kart: A Tech Filled Racing Game.
          Since I knew how to create the multiplayer in Kart: A Tech Filled Racing Game, I was able to recreate the same system myself using the same setup.
          It was not as easy as the system in Kart: A Tech Filled Racing Game.
          Beside sending position, rotation, weapon choice, and key press, this multiplayer system also sending signals to allow synchronizations of players skills usages and the state machine of the AIs/NPCs.
        </p>
        <p>
          Since this is a solo project, I am in charge of every part in this game from backend to front end, from mechanics to UI to sounds.
          It was a very challenging project for me due to the amount of work I have to do.
          However, it was also a very fun project since I was able to create a multiplayer game from scratch.
        </p>
        <p>
          In the near future, I am planning to create more NPCs, each with their own behavior, and if possible, I will try to integrate neural networks into the NPCs/AIs so that the game will be more emersive.
        </p>
        <p>
          I am currently working on the game and I am not planning to release it anytime soon.
        </p>
      `
    },
    {
      id: 'todo-app',
      title: 'TO DO App',
      category: 'App Development',
      image: 'images/clipboard.png',
      description: 'A simple gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
      tags: ['Python', 'DeepSeek'],
      status: 'release',
      externalLink: 'https://github.com/Kairu1206/todoapp',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Basic functionality for managing tasks including add, remove, edit, and finish task</li>
          <li>AI integration</li>
          <li>Gamified experience</li>
          <li>Start on boot</li>
          <li>LAN connection and share tasks through MySQL database</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a simple to do app that I have done for personal use.
          I learned how to integrate AI into the app using APIs and/or local AIs.
          At the same time, I also made this app with the help of ChatGPT, DeepSeek, Claude, and Augment.
        </p>
        <p>
          I learned that AIs still have its limitations especially based on how much context they have.
          For example, with Augment, even with a less powerful AI model than ChatGPT or DeepSeek, it is able to do low level tasks such as building a storing system for the app or building the UI for the app.
          However, due to less training and less powerful model, it still have its flaws especially when I want it to do some high level tasks such as asking to integrate a local AI into the app or how I want the UI to look a certain way.
          With ChatGPT and other LLMs, it is easier for them to do high level tasks, however, if they do not have enough context and keywords, they will start to assume things and will give out the wrong results.
        </p>
      `
    },
    {
      id: 'gamify-saving-app',
      title: 'Gamify Saving App',
      category: 'App Development',
      image: 'images/inqnity_banking_image.png',
      description: 'A gamified saving app to make saving easier and more fun.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'Firebase'],
      status: 'on hold',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Third parties API integration including Teller.io and Plaid</li>
          <li>Gamified experience</li>
          <li>Responsive design</li>
          <li>Marketplace</li>
          <li>Trade system</li>
          <li>Shop system</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          The initial thought when I started this project is to create a saving app for the people who want to save money but do not want to do it in a gamify way.
          However, as the project progress, I realized that I can not fully complete it due to the cost of production and the profit it return is not worth it.
          In addition, I also realized that I do not have the expertise to secure the database and the APIs in order to prevent any potential attacks in which the laws requires me to have.
          Therefore, I decided to change the scope of the app to a personal app for me to use.
        </p>
        <p>
          I am able to connect to third parties such as Plaid, Teller.io, Stripe and Firebase.
          In addition, I was able to display the data I aggregate using those third parties in order to show the user their spending.
          I was also able to create a projections of the user savings for 5 - 20 years into the futures.
          Furthermore, I also created a basic marketplace, trade system and blog post system for the user to interact with each others since I learned that some people are able to save more money due to peer pressure or social inhibition..
        </p>
        <p>
          Beside learning about finance and user pyschology, I was also able to learn about the limitations of AIs.
          This project is able to be at its state today is due to the help of AIs such as Cursor, ChatGPT, DeepSeek, and Claude.
          I learned that as the codebase evovle, it is harder for the AIs to keep up. At the same time, APIs are not AIs expertise since they can not most of the code for connecting to third parties and I have to do it myself.
          However, beside the backend, the AIs are able to create a very interactive and eye-catching frontend.
          At the same time, they are able to help me to create the UI and the app functionalities.
        </p>
        <p>
          I am currently still working on the app, however, due to security and legal issues, I am not planning to release it to the public anytime soon.
        </p>
      `
    },
    {
      id: 'rock-open-game',
      title: 'Rock Open Game',
      category: 'Game Development',
      image: 'images/webrockgameicon.png',
      description: 'A personal project to bring a high school project to a web game.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'Firebase'],
      status: 'release',
      externalLink: 'https://rockopengameweb.web.app/',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Firebase database connection</li>
          <li>Web-based platform</li>
          <li>Responsive design</li>
          <li>Shop system including daily deals</li>
          <li>Trade system</li>
          <li>Mini-games</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This project is a fully deploy version of one of my high school text-based game project.
          Since I want to change the game from a text-based to having UI, I decided to go with web-based game.
          It was a very fun project to work on and I learned a lot about web development and game development such as mini-games creations, daily shop and payment system.
          However, due to the lack of time and the complexity of the project especially with database security which I do not have expertise on, I am not able to fully complete the project.
          I am planning to continue working on the project in the near future in order to fully deploy it.
        </p>
      `
    },
    {
      id: 'wander-sync-app',
      title: 'WanderSync App',
      category: 'App Development',
      image: 'images/AndroidStudioIcon.png',
      description: 'A course project using Java and Firebase to learn about Agile and Sprint methodology.',
      tags: ['Java', 'Firebase', 'Android Studio', 'GitHub'],
      status: 'complete',
      externalLink: 'https://github.com/Kairu1206/CS2340D_Team26',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Firebase database connection</li>
          <li>Agile development practices</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a course project that is used to teach us about Agile and Sprint methodology.
          The app is a simple booking app that allow the users to share the booking time for hotels and places to go together.
          In addition, the app also allow the users to chat with each other and share the experiences.
          However, the main purpose of the app is to teach us about Agile and Sprint methodology while allow us to use some real life applications such as SonarQube and Android Studio.
        </p>
      `
    },
    {
      id: 'tower-offense-game',
      title: 'Tower Offense Game',
      category: 'Game Development',
      image: 'images/Castle.png',
      description: 'A course project using Unity and C# to create a 2D tower offense game.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://kairu1206.itch.io/tower-offense-game',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>2D tower offense mechanics</li>
          <li>Strategic gameplay</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a course project that I had done with a different game genre than what I used to do.
          There are nothing much about this project since it is a very simple project.
          However, I learned how to create a tower defense game and how to implement the game mechanics.
          I also learned how to implement a spawn system and learn how to interpolate the sprite in order to make the animations look better.
        </p>
      `
    },
    {
      id: 'stella-in-space',
      title: 'Stella In Space',
      category: 'Game Development',
      image: 'images/stellaInSpaceIcon.png',
      description: 'A course project using Unity and C# to create a 2D platformer game.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://kairu1206.itch.io/stella-in-space',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>2D platformer mechanics</li>
          <li>Engaging level design</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a course project that I had done with the theme of future technology.
          Since this is a two week project, my team have not been able to fully implement the full game.
          However, we were able to create the basic mechanics of the game and the basic levels.
        </p>
        <p>
          I was tasked with programming the character basic movements, obstacles and particles effects.
          Contradicted to other Unity projects, this time, I used namespace, a different way to organize the codebase.
          In my opinion, namespace can help reduce the confusions when working with a large codebase and naming conventions.
          However, this also pose a problems of calling the functions and variables since you have to specify the namespace first.
          Overall, I think namespace is a good way to organize the codebase, however, it might not be the best way for small project.
        </p>
      `
    },
    {
      id: 'what-yours-is-mime',
      title: 'What Yours is Mime',
      category: 'Game Development',
      image: 'images/WYiMIcon.png',
      description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://jhaboon.itch.io/wyim',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Bullet-hell mechanics</li>
          <li>Unique jester character</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is my second game development project that I have done.
          This project is also a part of GSU PantherDev.
          I learned more about Unity and C#, especially how to create more advanced game mechanics such as finite state machines AI and bullet physics.
          I also learned how to Unity SCM, a Unity version control system, to manage the project and collaborate with my team members.
        </p>
      `
    },
    {
      id: 'gastropoda',
      title: 'Gastropoda',
      category: 'Game Development',
      image: 'images/GastropodaIcon.png',
      description: 'A 2D platformer game where players escape from a mutant snail that broke out from the lab.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://jhaboon.itch.io/gastropoda-v115',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>2D platformer mechanics</li>
          <li>Engaging escape gameplay</li>
        </ul>

        <h3>Summary</h3>
        <p>
          This is my first game development project that I have done.
          This project is a part of GSU PantherDev.
          I learned how to use Unity, C#, and GitHub for the first time.
          I also learned how to work with a team for the first time.
          I was tasked with creating basic game mechanics such as doors, traps, weapons, and characters movements.
          At the same time, I also learned how collision works and how objects interact with each others.
        </p>
      `
    },
    {
      id: 'customer-service-app',
      title: 'Customer Service App',
      category: 'App Development',
      image: 'images/ndaAppIcon.png',
      description: 'A customer service app providing connection between customers, employees, and company services.',
      tags: ['C#', 'PHP', 'MySQL', 'PHPMyAdmin'],
      status: 'complete',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Customer support integration</li>
          <li>Employee management</li>
          <li>Company service integration</li>
          <li>MySQL database</li>
          <li>PHPMyAdmin database management</li>
          <li>Real time update</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This project is a private project that I have done for my internship at a small nail salon.
          The purpose of this app is to provide a way for customers to contact and book appointment for the nail salon.
          At the same time, the nail technicians and the managers should be able to know who got booked and when the customers will come and the services they want.
          The app also allow the customers to sign in before hand in order to let the nail technicians and the managers know that they are coming, if not the app will send a SMS message or an email to remind them.
          The app is also able to provide real time data update for all devices and for all parties evolved while maintain a strict access level for each role such as customers, nail technicians, managers, owners and developers.
        </p>
        <p>
          I used Unity, C# and PHP to create the app.
          For the backend and database, I used PHP, MySQL and PHPMyAdmin to manage the database.
          For the frontend, I used Unity's UI system to create the frontend.
          I connect the frontend and backend together using HTTPs requests and responses.
          For SMS messages and emails, I used third parties and their APIs to connect and send the messages and emails.
        </p>
        <p>
          Some parts of the app is under NDA so this is all I can disclosed what I have done.
        </p>
      `
    },
    {
      id: 'chatbot-project',
      title: 'ChatBot Project',
      category: 'Web Development',
      image: 'images/ChatGPTIcon.png',
      description: 'A course project using ChatGPT APIs to create a chatbot with personality.',
      tags: ['HTML', 'CSS', 'JavaScript', 'ChatGPT'],
      status: 'complete',
      externalLink: 'https://github.com/Kairu1206/chatbot',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Chatbot with personality</li>
        </ul>
        
        <<h3>Summary</h3>
        <p>
          This is a course project that teach us how to use ChatGPT APIs to create our own chatbot to put on to a website.
          It was a very simple project, however, given the current capabilities of AIs, this project gave us an insight and opportunity to look into how to use AIs as a tools.
        </p>
      `
    },
    {
      id: 'aframe-project',
      title: 'Aframe Project',
      category: 'Web Development',
      image: 'images/AframeIcon.png',
      description: 'A course project using Aframe to display 3D objects on a website.',
      tags: ['HTML', 'CSS', 'Aframe'],
      status: 'complete',
      externalLink: 'https://github.com/Kairu1206/aframe-remix',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>3D object rendering</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a course project that I had done in order to learn about Aframe and how to display 3D objects in a website.
          Even thought this is a simple project, the applications are very effective and can be used in many situations to boost interactive and impressions.
        </p>
      `
    },
    {
      id: 'gba-game-project',
      title: 'GBA Game Project',
      category: 'Game Development',
      image: 'images/GameBoyIcon.png',
      description: 'A course project creating a simple game for GameBoy Advance.',
      tags: ['C'],
      status: 'complete',
      externalLink: 'https://github.com/Kairu1206/CS2110',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>GameBoy Advance compatibility</li>
          <li>Simple gameplay mechanics</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a course project that I had done in order to showcase what I had learned in the courses about DMA.
          This project was created using C and the GameBoy Emulator.
        </p>
        <p>
          I decided to create a simple game for this project because I think it is fun and easier for me as a Game Developer and Designer.
          The game is a simple survivor game like Vampire Survivors in which the player have to survive until the time ends while the enemy will keep spawning and chasing the player.
          The game mechanics was pretty easy to implement since it is a very simple game.
          The only hard mechanic is how to let the enemy detect and chase the player.
          This mechanic was able to achieve through simple vector mathematics since the enemy knows where the player is.
        </p>
      `
    },
    {
      id: 'pwnagotchi-implementation',
      title: 'Pwnagotchi Implementation',
      category: 'Cybersecurity Research',
      image: 'images/pwnagotchiIcon.png',
      description: 'A custom implementation of Pwnagotchi for WiFi security research and analysis.',
      tags: ['Python', 'Raspberry Pi'],
      status: 'on hold',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Raspberry Pi</li>
          <li>Pwnagotchi</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is a very small project that I have done in order to learn about Raspberry Pi and Pwnagotchi.
          Pwnagotchi is a tool that is able to pawn wifi packets and decrypt it, which mean this is illegal to do without correct permissions.
          However, since I only use and test this tools on my own network and wifi, I am able to see the tool in action.
          Through this project, I learned about how Pwnagotchi works, how to use it, and how to prevent it.
        </p>
      `
    },
    {
      id: 'rf-security-analysis-tool',
      title: 'Radio Frequency Emulator',
      category: 'Cybersecurity Research',
      image: 'images/flipperzeroIcon.png',
      description: 'A research project exploring radio frequency security and emulator using Flipper Zero.',
      tags: ['Python', 'Flipper Zero'],
      status: 'on hold',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Flipper Zero</li>
          <li>Emulating radio frequency</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This is one of the projects that I am having interested in when I first learn about cybersecurity and the capabilities of Flipper Zero.
          There is nothing much about this project beside I was reading the radio frequency from my car keyfob and emulate it in order to open my car using the Flipper Zero.
          However, through this project, I learned about how radio frequency works and what are its limitaions, how attackers can attack and exploit it, and how to prevent or protect myself from these attacks.
        </p>
      `
    },
    {
      id: 'web-security-vulnerabilities',
      title: 'Common Web Security Vulnerabilities',
      category: 'Cybersecurity Research',
      image: 'images/webIcon.png',
      description: 'A study of common web security vulnerabilities and prevention techniques.',
      tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      status: 'on hold',
      fullDescription: `
        <h3>Key Features</h3>
        <ul>
          <li>Web security analysis</li>
          <li>Prevention techniques</li>
        </ul>
        
        <h3>Summary</h3>
        <p>
          This project is rooted from all the study and research I have done on web security either by myself or with GT GreyHat Hacking Club.
          The purpose of this project is a note book for me to refer to when I am working on other web apps or websites projects.
        </p>
      `
    }
  ];
  
  // Add a mapping of technologies to their icon information
  const techIcons = {
    'Java': { src: 'icons/java_icon.png', width: 50, height: 50 },
    'Godot': { src: 'icons/godot_icon.png', width: 45, height: 45 },
    'Unity': { src: 'icons/unity_icon.png', width: 45, height: 45 },
    'Steamworks': { src: 'icons/steamworks_icon.png', width: 45, height: 45 },
    'GitLab': { src: 'icons/gitlab_icon.png', width: 45, height: 45 },
    'Python': { src: 'icons/python_icon.png', width: 45, height: 45 },
    'DeepSeek': { src: 'icons/deepseek_icon.png', width: 61, height: 45 },
    'HTML': { src: 'icons/html_icon.png', width: 45, height: 45 },
    'CSS': { src: 'icons/css_icon.png', width: 45, height: 45 },
    'JavaScript': { src: 'icons/javascript_icon.png', width: 45, height: 45 },
    'Firebase': { src: 'icons/firebase_icon.png', width: 25, height: 35 },
    'React': { src: 'icons/react_icon.png', width: 51, height: 45 },
    'NodeJS': { src: 'icons/nodejs_icon.png', width: 39, height: 45 },
    'Android Studio': { src: 'icons/android_studio_icon.png', width: 45, height: 45 },
    'GitHub': { src: 'icons/github_icon.png', width: 45, height: 45 },
    'C#': { src: 'icons/csharp_icon.png', width: 40, height: 45 },
    'PHP': { src: 'icons/php_icon.png', width: 88, height: 45 },
    'MySQL': { src: 'icons/mysql_icon.png', width: 45, height: 45 },
    'PHPMyAdmin': { src: 'icons/phpmyadmin_icon.png', width: 65, height: 45 },
    'Aframe': { src: 'icons/aframe_icon.png', width: 51, height: 45 },
    'C': { src: 'icons/c_icon.png', width: 39, height: 45 },
    'Raspberry Pi': { src: 'icons/raspberry_pi_icon.png', width: 45, height: 45 },
    'Flipper Zero': { src: 'icons/flipper_zero_icon.png', width: 45, height: 45 },
    'ChatGPT': { src: 'icons/chatgpt_icon.png', width: 45, height: 45 }
  };
  
  // Generate HTML
  projects.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">My Projects</h2>
      
      <div class="projects-filters reveal">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="Web Development">Web Development</button>
        <button class="filter-btn" data-filter="Game Development">Game Development</button>
        <button class="filter-btn" data-filter="App Development">App Development</button>
        <button class="filter-btn" data-filter="Cybersecurity Research">Cybersecurity Research</button>
      </div>
      
      <div class="projects-grid">
        ${projectsData.map((project) => `
          <div class="project-card reveal" data-category="${project.category}">
            <div class="project-image">
              <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
              <h3>
                ${project.title}
                ${project.status ? `
                  <span class="status-tag-inline" style="color:${statusTags[project.status].color}; background: none; border: 1px solid ${statusTags[project.status].color}; padding: 2px 10px; border-radius: 10px; font-weight: bold;">
                  ${statusTags[project.status].label}
                  </span>
                ` : ''}
              </h3>
              <p class="project-category">${project.category}</p>
              <p class="project-description">${project.description}</p>
              <button class="read-more-btn" data-id="${project.id}">Read More</button>
              ${project.externalLink ? `
                <a href="${project.externalLink}" target="_blank" rel="noopener noreferrer">
                  <u style="margin-left: 0.50rem;">Take a look!</u> <span style="font-size: 0.9em;">↗︎</span>
                </a>
              ` : ``}
              <div class="full-description" id="desc-${project.id}" style="display: none;">
                ${project.fullDescription}
              </div>
              <div class="project-tags">
                ${project.tags.map(tag => {
                  const icon = techIcons[tag];
                  return icon ? `
                    <img src="${icon.src}" 
                         width="${icon.width}" 
                         height="${icon.height}" 
                         title="${tag}" 
                         class="project-tag-icon">
                  ` : `<span class="project-tag">${tag}</span>`;
                }).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .projects-filters {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-10);
      }
      
      .filter-btn {
        background-color: transparent;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        padding: var(--space-2) var(--space-4);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all var(--transition-normal);
        color: white;
      }
      
      .filter-btn:hover {
        background-color: var(--color-primary-50);
        border-color: var(--color-primary-300);
      }
      
      .filter-btn.active {
        background-color: var(--color-primary-500);
        border-color: var(--color-primary-500);
      }
      
      .projects-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }
      
      .project-card {
        width: 100%;
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      
      @media (max-width: 480px) {
        .project-card {
          flex-direction: column;
        }
        
        .project-image {
          width: 100%;
          height: 200px;
        }
      }
      
      .project-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
      }
      
      .project-image {
        position: relative;
        overflow: hidden;
        width: 30%;
        min-width: 150px;
        height: 150px;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .project-image img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        transition: transform var(--transition-normal);
      }
      
      .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--transition-normal);
      }
      
      .project-card:hover .project-image img {
        transform: scale(1.05);
      }
      
      .project-card:hover .project-overlay {
        opacity: 1;
      }
      
      .view-project {
        padding: var(--space-2) var(--space-4);
        background-color: var(--color-primary-500);
        color: white;
        border-radius: var(--radius-md);
        font-weight: var(--font-weight-medium);
        transition: background-color var(--transition-normal), transform var(--transition-normal);
      }
      
      .view-project:hover {
        background-color: var(--color-primary-600);
        transform: scale(1.05);
      }
      
      .project-info {
        padding: var(--space-3) var(--space-4);
        flex: 1;
      }
      
      .project-info h3 {
        margin-bottom: var(--space-2);
      }
      
      .project-category {
        color: var(--color-primary-500);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        margin-bottom: var(--space-3);
      }
      
      .project-description {
        margin-bottom: var(--space-4);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        max-height: 3em;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      
      .project-tag {
        background-color: var(--color-primary-500);
        color: white;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
      }
      
      @media (max-width: 768px) {
        .projects-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
      
      @media (max-width: 480px) {
        .projects-grid {
          grid-template-columns: 1fr;
        }
      }
      .read-more-btn {
        background-color: var(--color-primary-500);
        color: white;
        border: none;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        cursor: pointer;
        margin-bottom: var(--space-4);
        transition: background-color var(--transition-normal);
      }

      .read-more-btn:hover {
        background-color: var(--color-primary-600);
      }

      .full-description {
        margin-bottom: var(--space-4);
        font-size: var(--font-size-sm);
        color: white;
        overflow: hidden;
      }
      .full-description h3 {
        margin-top: var(--space-4);
        margin-bottom: var(--space-2);
        color: var(--color-primary-500);
      }

      .full-description ul {
        margin-bottom: var(--space-4);
        list-style-type: disc;
        padding-left: var(--space-4);
      }

      .full-description li {
        margin-bottom: var(--space-1);
      }
      
      .status-tag-inline {
        display: inline-block;
        margin-left: 0.75em;
        font-size: 0.75em; /* Smaller than the title */
        vertical-align: middle;
        font-weight: bold;
        background: none;
        box-shadow: none;
        border: none;
        padding: 0;
      }
    </style>
  `;
  
  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects
      const filter = button.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Toggle full description
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = button.getAttribute('data-id');
      const descElement = document.getElementById(`desc-${projectId}`);
      
      if (descElement.style.display === 'none') {
        descElement.style.display = 'block';
        button.textContent = 'Show Less';
      } else {
        descElement.style.display = 'none';
        button.textContent = 'Read More';
      }
    });
  });
}

const statusTags = {
  'alpha': { color: '#e53935', label: 'Alpha' },               // Red
  'beta': { color: '#ffd600', label: 'Beta' },                 // Yellow
  'release': { color: '#43a047', label: 'Release' },           // Green
  'in development': { color: '#8e24aa', label: 'In Dev' },     // Purple
  'on hold': { color: '#999999', label: 'On Hold' },           // Black
  'complete': { color: '#2196f3', label: 'Complete' }          // Blue
};


















