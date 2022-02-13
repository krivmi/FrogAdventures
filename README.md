# Frog Adventures
Frog Adventures is a JavaScript adventurous platform game. It supports multiplayer with NodeJS backend, so you can set out on an adventure with your friends online. I would like to thank my girlfriend Lucy, who supported me throughout the project and throughout my life. This game was made for her. 

# Description
This game is based on the popular platform game Fireboy & Watergirl: Elements. It was developed during quarantine because I wanted to play Fireboy & Watergirl: Elements online with Lucy during lockdown. Unfortunately, I could not find any online version of the game, so I decided to code it myself, from scratch. The game is not perfect, it misses a lot of stuff from the original game (boxes, levers, teleports, sounds, etc.) but I plan to add them later. The game currently supports hotseat and multiplayer mode.

**This is a project that I would like to share with others as an example of network communication, OOP and game engine.**

# Testing
This game runs on my local Synology NAS server, so in order to run it, you have to either install NodeJS on your local PC or setup NodeJS on your home server. In both cases, you need to copy all game files to a new directory and install two NodeJS libraries through npm - sockets.io and express. This will create a */node_modules* directory and *package-lock.json* file. After that, the project should be ready and if you run *app.js* script, you should be able to run the game via web browser ```http://localhost:10937```. For more information, check the first reference video on how to setup a local PC server.

**Project folders and files**
- /FrogAdventures/
   - /client/
   - /node_modules/
   - app.js
   - index.html
   - package-lock.json

# Screenshot
![level_04](https://user-images.githubusercontent.com/35463969/153768350-e1fe3e78-ab21-4a39-bc5e-f411da41db19.JPG)

# References
To code this whole project I had to watch/read many sources. Here are some important ones that really helped me.
1. NodeJS server and socket communication - https://www.youtube.com/watch?v=PfSwUOBL1YQ
2. OOP design and game engine - https://www.youtube.com/watch?v=w-OKdSHRlfA

