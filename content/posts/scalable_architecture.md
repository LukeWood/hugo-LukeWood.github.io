---
title: "Architecting a Scalable Multiplayer Web Game"
date: 2019-07-17T20:04:15-07:00
draft: true
toc: false
images:
tags:
  - untagged
---

In a few months I am hoping to do a soft launch of my real-time web based multiplayer 2d shooter: (bulletz.io)[https://bulletz.io]
For quite awhile bulletz.io has been limited heavily by the scalability issues.
This is due to the highly computationally expensive nature of game servers.
Bulletz.io does not use a message relay server, but instead computes game state on the server side.
All of the computation in the game occurs server side and the clients serve as messengers to the player by reflecting the state.
Bulletz is implemented in this way to prevent cheaters from sending arbitrary messages.

{{< figure class="bordered-figure dark-gray-background" width="512px" alt="old architecture of bulletz" src="/img/posts/productionization/bulletz_old_structure.png" title="Old Architecture of Bulletz" >}}

Until this rearchitecture bulletz was implemented as a single standalone server.  
This server served static assets, ran game logic, and managed websocket connections.
This was an easy method to getting the MVP up and running but led to highly coupled server setup.

Conceivably this setup could simply be thrown behind a horizontal load balancer using a custom scaling metric and survive a surge in players.
I did not go this route because this is a hobby project and I did not want to spend an insane amount of money on running my hobby project.

It was finally time to design a production ready system.
The requirements for the system were as follows:
- low extraneous resource usage
- horizontally scalable on the game server front
- allow different configurations per server (for diverse game experience)
- build for the future

# Designing the new Architecture
The first action item I took on in redesigning the system was examining the difficulty in decoupling the game server from the web server.
Previously a single phoenix server managed both the web socket connections and the serving of static assets.

This leads us to this:
TODO image of game server

This is a step in the right direction but is not yet horizontally Scalable

# Adding a Dynamic Server Lister
## options
## Firebase

# Deployment System

# Summary

Here is the overall new
{{< figure class="bordered-figure dark-gray-background" width="512px" alt="new bulletz architecture" src="/img/posts/productionization/new_structure.png" title="New Bulletz Architecture" >}}

Migrating to this new architecture required four separate parts.  

# Future Posts

I will cover the implementation of each of the four parts in a following blog post in the following order.
These are:
- migrating the web client to support multiple servers, servers with different config
- creating a standalone websocket server and game server
- exploring static content serving options
- building a custom a deployment system
