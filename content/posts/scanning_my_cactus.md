---
title: Turning My Cactus into a Video Game
date: "2020-03-16"
draft: false
type: post
---

{{< progressive-image class="bordered-figure" style="width: 50%" src="img/posts/cactus/cactar.png" alt="Cactar">}}

Today I wanted to mess around with 3D model scanning.
I decided to turn my Cactus into a game prototype.

{{< progressive-image class="bordered-figure" style="width: 50%" src="img/posts/cactus/cactus.JPG" alt="My beautiful cactus" title="My beautiful cactus." >}}

# Setup
To get started I needed to take a 3d scan of my cactus.
Recently an app called [display.land](https://display.land/) was launched.
The app lets you scan objects with your phone's camera and turn them into 3d models.

I downloaded the app and launched it on my iPhone.

# Scanning my Cactus
The app was pretty easy to use!
After three attempts I got a scan I was happy with.
I downloaded the scan from the [display.land](https://display.land/) web client and loaded it up in [blender](https://www.blender.org/) to give it some touchups.

After about 20 minutes of working in blender I had this result:

{{< progressive-image class="bordered-figure" style="width: 50%" src="img/posts/cactus/blender.png" alt="Blender edited scan" title="Blender trimmed scan of my cactus" >}}

I think this looks pretty awesome!

# Making it a Game
Now that I had the model I wanted to do something fun with it.
I decided to load the model up in unity and use it as a "level" for a "game".
Really there's no point to the game but other than to test out the scanned model.

I added some Unity physics components to a character, wrote some scripts to move the player, and added collision to the mesh created from the 3d scan.

You can try the demo below!!!

{{<game src="/demos/cactus-brawl-prototype" instructions="Move with WASD, Jump with space">}}

# Conclusions
Scanning real life objects with the new [display.land](https://display.land/) app is an awesome way to make levels for games.
I had a blast making this prototype this evening and think the stage looks better than what I could've made in a comparable amount of time.
I'm looking forwards to making a real game with what I learned today.
