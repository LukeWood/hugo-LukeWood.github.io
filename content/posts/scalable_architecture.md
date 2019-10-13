---
title: "Architecting a Scalable Multiplayer Web Game"
date: 2019-07-17T20:04:15-07:00
draft: true
toc: false
images:
tags:
  - untagged
---

In a few months I am having a soft launch for [bulletz.io](https://bulletz.io).
In the old architecture there was no way to horizontally scale the game up.
If the game became popular quickly there would have been no way to scale up.
Before launching I needed address the potential issue of scalability.

{{< figure class="bordered-figure dark-gray-background" width="512px" alt="old architecture of bulletz" src="/img/posts/productionization/bulletz_old_structure.png" title="Old Architecture of Bulletz" >}}

Until this rearchitecture bulletz was implemented as a single standalone server.
This server served static assets, ran game logic, and managed websocket connections.
The bottleneck in this setup was compute power to compute game states.

## Requirements
Before designing the new system let's define a set of requirements.
- low extraneous resource usage
- horizontally scalable on the game server front
- decouple code when possible to be more future proof 

## Designing the new Architecture
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
## Considering Kubernetes
Due to good previous experiences with kubernetes I considered using a [horizontal load balancer](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) with a (custom scaling metric)[https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics].
The [horizontal load balancer](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) could spin up new servers based on the number of active players.

Unfortunately after some performance testing I found that [dockerizing](https://www.docker.com/) the servers had more overhead than I expected.

\       | Bare 1 GB 1 CPU | Docker 1 GB 1 CPU | Docker 2 GB 1 CPU |
--------|-----------------|-------------------|-------------------|
Players | 40              | 15                | 25                |
$/Month | $5              | $5                | $15               |
<center>Results from performance testing</center>

[bulletz.io](https://bulletz.io) runs on the erlang VM making docker redundant.
The performance decrease was not worth the high increase in costs.
Due to this I stuck with running [BEAM](https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine)) on bare linux servers.

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
