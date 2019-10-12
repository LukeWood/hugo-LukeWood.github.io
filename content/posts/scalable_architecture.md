---
title: "Architecting a Scalable Multiplayer Web Game"
date: 2019-07-17T20:04:15-07:00
draft: true
toc: false
images:
tags:
  - untagged
---

In a few months I am having a soft launch of my real-time web based multiplayer 2d shooter: (bulletz.io)[https://bulletz.io]
In the old architecture there was no way to horizontally scale the game.
If the game became popular quickly there would have been no way to scale up.

{{< figure class="bordered-figure dark-gray-background" width="512px" alt="old architecture of bulletz" src="/img/posts/productionization/bulletz_old_structure.png" title="Old Architecture of Bulletz" >}}

Until this rearchitecture bulletz was implemented as a single standalone server.
This server served static assets, ran game logic, and managed websocket connections.
The bottleneck in this setup was compute power to compute game states.

# Why I Didn't Use Kubernetes

Due to my experience with kubernetes I considered using a [horizontal load balancer](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) with a (custom scaling metric)[https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics].
This would have made scaling easy.
The [horizontal load balancer](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) could spin up new servers based on number of active players.

I did not go this route because after some performance testing I realized that in such a CPU heavy case this would be extremely expensive.

# TODO table of usage

hi |   |  |  | hi
-----|---|--|--|
h  | a |  |  |

Instead I decided to run using bare metal servers.

This was also an opportunity to pave the ground for new features and decouple the existing system.

It was finally time to design a production ready system.
The requirements for the system were as follows:
- low extraneous resource usage
- horizontally scalable on the game server front
- allow different configurations per server (for diverse game experience)
- build for the future
**Note: I could have still used Kubernetes to solve some of the problems but instead opted for a custom solution**

# Designing the new Architecture
The first action item I took on in redesigning the system was examining the difficulty in decoupling the game server from the web server.
Previously a single phoenix server managed both the web socket connections and the serving of static assets.

This leads us to this:
TODO image of game server

This is a step in the right direction but is not yet horizontally Scalable

# Adding a Dynamic Server Lister
## Golang App Engine App
## Firebase
I interned at Firebase a few years back but never really have used Firebase in any of my own projects.
The more I thought about it the more of a good idea this was.
I ended up just using the Firestore javascript sdk and resolve a /server list as an rxjs observable and bam, problem solves.

# Creating a standalone client
## Alternatives
## Hugo

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
