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

Over time a "mega class" emerged which led my frontend client to have all sorts of anti patterns littered everywhere.
This article will describe how my mega class emerged and how I ended up solving that problem.

# The Original Model
The original state management model for the bullets took an object oriented model.
A central "StateManager" class managed the entirety of the game's state by delegating each entity it's own Sub-Manager.

These managers attempted to guess the current state of entities based on the last update on the entity that they received from the server.
This allows the game to run using very low amounts of bandwidth while still showing the real time state of each entity.

{{< figure class="bordered-figure dark-gray-background" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz_old_frontend.png" title="State Manager Delegation System" >}}

This led to a ton of problems over time - primarily on the front of readability and maintainability.
The state of the various entities became intertwined over time and it became difficult to hunt down bugs due to this.

The largest anti-pattern the old model used was having a "mega class", the top level State Manager.

This state manager ended up being responsible for all sorts of things and was passed as a parameter to tons of UI functions.

Here is the file that handles displaying the number players:
`player_counter.js`
```javascript
const player_count = document.getElementById("score-div");
function update_player_counter(state_handler) {
  const score = state_handler.player_registry.get_players().length;
  player_count.innerText = `${players}/20`;
}
export {update_player_counter}
```

Then the function `update_player_counter` has to be called elsewhere every time a new player spawns or dies...
Throughout the code base there are three occurrences of this function being called.
`player_registry.js`
```javascript
import {update_player_counter} from '../../ui/update_player_counter'
class PlayerRegistry {
  constructor(state_handler) {
    this.state_handler = state_handler
  }
  ...
  add_player(player) {
    ...
    update_player_counter(this.state_handler)
  }
  ...
  remove_player(player) {
    ...
    update_player_counter(this.state_handler)
  }
}
```
`state_handler.js`
```javascript
import {update_player_counter} from '../../ui/update_player_counter'
class StateHandler {
  ...
  listen_for_polls() {
    update_socket.on("poll", (game_state) => {
      ...
      update_player_counter(this);
    })
  }
  ...
}
```
This is not that big of a deal for this one specific case, but it resulted in the state handling code being littered with code updating UI.
Other classes end up being responsible for triggering UI updates.

The state_handler ended up being responsible for triggering UI updates, and was an argument to literally everything.
Almost every method, ui interaction, etc needed to store a copy of a state handler.
This mean't every time I registered an event listener I would need a state handler handily stored nearby.
By the time I had a complete frontend the name `state_handler` showed up in well over `70%` of files.

# Introducing the Event Driven Model

# Tiny Pubsub
Shameless plug for the self authored javascript library I wrote to solve this.

# The New Model
The refactored model is significantly more distributed in terms of code organization.
My \#1 priority was to avoid having a mega class.
In the new model each entity has a series of callbacks described in a single file that specify the entirety of that entities state management.
These events are fired from other self contained modules that are solely responsible for firing these events.

For example, the file `tick.js` looks something like this...
```javascript
import {TICK} from '../events'
import {game_time} from '../util/game_time'
import {render} form '../graphics/render'

function game_loop() {
  publish(TICK, game_time());
  render();
  requestAnimationFrame(game_loop)
}
document.addEventListener("load", game_loop);
```
Each file is responsible for only one type of event.
Some events are triggered by other events and mutate the data a bit for use by other modules.

For example, here is the new version of `score.js`
```javascript
import {TICK} from '../events'
import {}
```

<script src="https://gist.github.com/LukeWood/71644f39b6fe49a5d03e98ea56d90df1.js"></script>

# Why I Believe My New Library is a Solution to the Problem At Hand
Rewriting the frontend resulted in significantly simplified state management logic.
