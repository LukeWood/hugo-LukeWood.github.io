---
title: "From OOP -> Events: Refactoring bulletz.io's Frontend Structure"
date: 2019-07-11T20:13:20-07:00
draft: false
tags:
- bulletz.io
- frontend
images:
  - /img/backgrounds/crescent.jpg
---
I am the sole author of the web game [bulletz.io](https://bulletz.io).
Recently I refactored the frontend's codebase to more closely match that of the backend.
The backend is written using the functional programming language [Elixir](https://elixir-lang.org) while the frontend is written in Vanilla Javascript.
Both programming languages are __vastly__ different.

Originally the frontend was written using a generic OOP model.
This led to a great deal of technical debt, complicated UI interactions, and overall confusing code.
I rewrote the frontend over the course of a single evening to use an event driven model to more closely match the backends logic.

{{< figure class="bordered-figure" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz.png" title="A screenshot of bulletz.io" >}}

Throughout the course of this article I will describe the state management system for only the bullets and compare the old version to the new version.

# The Original Model
The original state management model for the bullets took an object oriented model.
A central "StateManager" class managed the entirety of the game's state by delegating each entity it's own Sub-Manager.

These managers attempted to guess the current state of entities based on the last update on the entity that they received from the server.
This allows the game to run using very low amounts of bandwidth while still showing the real time state of each entity.

{{< figure class="bordered-figure dark-gray-background" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz_old_frontend.png" title="State Manager Delegation System" >}}

# The New Model
The refactored model is significantly more distributed in terms of code organization.
In the new model each entity has a series of callbacks described in a single file

<script src="https://gist.github.com/LukeWood/71644f39b6fe49a5d03e98ea56d90df1.js"></script>

# Results
Rewriting the frontend resulted in significantly simplified
