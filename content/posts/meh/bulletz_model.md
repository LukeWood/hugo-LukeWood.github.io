---
date: "2019-05-19T18:18:12-07:00"
draft: true
images:
- /img/backgrounds/crescent.jpg
tags:
- elixir
- supervisor trees
title: 'OTP Supervisor Trees by Example: bulletz.io'
toc: false
type: post
---

## Pre-reqs
Before reading this post you should be familiar with:

- [GenServers](https://hexdocs.pm/elixir/GenServer.html)
- [Supervision Trees](http://erlang.org/documentation/doc-4.9.1/doc/design_principles/sup_princ.html)

## Goals in this Article
This article discusses the supervision tree's for bulletz.io.  I hope to highlight the *why* in my decision making process of the supervisor tree's architecture.

## Intro
[Bulletz.io](https://bulletz.io) is a real time web based shooter game that I
wrote using the [phoenix framework](https://phoenixframework.org/).
The infrastructure in the game heavily relies on [OTP](http://erlang.org/doc/) to make it parallel and fault tolerant.
This blog post covers the supervision tree that allows bulletz to be highly fault tolerant.

{{< figure class="bordered-figure" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz.png" title="The final product in action" >}}

## Requirements
The goals for my supervisor tree were as follows:

- Allow for some errors without bringing down the entire games
- Dynamically allocate processes
- Deploy once, run forever (recover from fail states)

## GenServer per Entity
In bulletz each entity is it's own GenServer.  This means that every time a new player joins or a bullet fires we will need to dynamically start a new GenServer and store it's pid somewhere for other processes to

The benefits of using a GenServer per process (as opposed to a single server responsible for updating players, bullets, etc) are:

- Higher concurrency
- Better entity behavior isolation
- Increased fault tolerance (if there is a bug that one player encounters, that process can just crash without bringing down other players)

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
