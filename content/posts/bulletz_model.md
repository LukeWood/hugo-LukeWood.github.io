---
title: "\"Elixirifying\" Game Architecture"
date: 2019-05-19T18:18:12-07:00
toc: false
images:
  - /img/backgrounds/crescent.jpg
tags:
  - elixir
  - systems design
  - io games
---

## Pre-reqs
Before reading this post you should be familiar with:

- [GenServers](https://hexdocs.pm/elixir/GenServer.html)
- [Supervision Trees](http://erlang.org/documentation/doc-4.9.1/doc/design_principles/sup_princ.html)
- [The phoenix framework](https://phoenixframework.org/)

## Goals in this Article
This article only discusses the back end architecture for bulletz.io.  There is a ton of optimization done on the front and in the communication between server and client but to keep this article short I am saving that for another article.

## Intro
[Bulletz.io](https://bulletz.iocd ) is a real time web based shooter game that I
wrote using the [phoenix framework](https://phoenixframework.org/).  The infrastructure in the game heavily relies on [OTP](http://erlang.org/doc/) to make it parallel and fault tolerant.
This blog post covers the architecture of bulletz.io and showcases how to build a fault tolerant application with OTP.

{{< figure class="bordered-figure" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz.png" title="The final product in action" >}}

## Requirements
The infrastructure had the following requirements:

- [bulletz](https://bulletz.io) is a 2d top down shooter
- Support 4 entity types: players, bullets, food, and powerups
- Efficient - this is a project I run for fun so I don't want to be spending a lot on it
- No time maintaining the game after deploying it (fault tolerance)
- Scalable in case many players join at once (high level of concurrency)

## General Architecture
This section discusses some high level design choices I made.

### GenServer Per Entity
GenServer is the base unit of isolation/concurrency in bulletz.
Despite the overhead that comes with them (when compared to using raw processes) I decided that their out of the box interop with Supervisors was worth the overhead.

As a one person team the benefits of GenServer heavily outweigh the cons.  I believe that abstracting all of my entity behavior behind GenServers and only handling interactions between my entities through message passing allowed me to avoid many bugs and make my game significantly more fault tolerant.

### Process Linking and Supervision
The world is the root of each game.

As such, if the world crashes the entire game crashes.

The world is not to any processes under it, but all processes under the world are linked back to them.
If there is a crash in the world the players and bullets will have no way to get the pid of the other entities in their worlds.

The world is kept extremely simple for this reason.
It only serves back the pids of entities that are registered as members of that world.
Each entity stores a pid referencing the world that they are assigned to.

The linkage from the world down to the other processes is seen below.
{{< figure class="bordered-figure" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletzsupervisortree.png" title="The supervisor tree for the game entities" >}}

## Entities and Responsibilities
### The Ticker
The ticker

### Players
The player represents each person's character in bulletz.
#### Receiving Commands
The player entities receive commands from various other entities.  These include the web client players, powerups, and food.  These
<script src="https://gist.github.com/LukeWood/89b4357e985c1b9ebef405d53f558fb0.js"></script>

#### Spawning Bullets
#### Linking for the Player

### Bullets
#### Linking for Bullets

### Food
#### Too Expensive
#### Bucketization
