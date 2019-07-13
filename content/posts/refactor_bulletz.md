---
title: "Decouple Your Javascript Using Event Driven Programming Tiny-Pubsub"
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
Both programming languages are ___vastly___ different.

Originally the frontend was written using a generic OOP model.
This led to a great deal of technical debt, complicated UI interactions, and overall confusing code.
I rewrote the frontend over the course of a single evening to use an event driven model to more closely match the backends logic.

{{< figure class="bordered-figure" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz.png" title="A screenshot of bulletz.io" >}}

Over time a [god object](https://en.wikipedia.org/wiki/God_object) emerged which led my frontend client to have all sorts of anti patterns littered everywhere.
This article will describe how my mega class emerged and how I ended up solving that problem.

# The Original Model
The original state management model for the bullets took an object oriented model.
A central "StateManager" class managed the entirety of the game's state by delegating each entity it's own Sub-Manager.

These managers attempted to guess the current state of entities based on the last update on the entity that they received from the server.
This allows the game to run using very low amounts of bandwidth while still showing the real time state of each entity.

{{< figure class="bordered-figure dark-gray-background" width="512px" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz_old_frontend.png" title="State Manager Delegation System" >}}

This led to a ton of problems over time - primarily on the front of readability and maintainability.
The state of the various entities became inter-twined over time and it became difficult to hunt down bugs due to this.

The largest anti-pattern the old model used was having a [god object](https://en.wikipedia.org/wiki/God_object), the top level State Manager.

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

# Solving This With Tiny Pubsub
Shameless plug for the self authored javascript library I wrote to solve this: [tiny-pubsub](https://github.com/LukeWood/tiny-pubsub).
It's nothing special - it just maintains a relationship between events and functions that should be called in response to said events.
Instead of explicitly calling functions, functions instead respond to data emitted elsewhere.

But what it does do is encourage a [decoupled codebase](https://gameprogrammingpatterns.com/decoupling-patterns.html) through the event driven programming paradigm..

Here is a self contained example:
```javascript
import {subscribe, publish, unsubscribe} from 'tiny-pubsub'
import {CHATROOM_JOIN} from './event_definitions'
let logJoin = (name) => console.log(`${name} has joined the room!`);
subscribe(CHATROOM_JOIN, logJoin)
publish(CHATROOM_JOIN, "Luke")
// > Luke has joined the room!
unsubscribe(CHATROOM_JOIN, logJoin)
publish(CHATROOM_JOIN, "Luke")
// nothing will print

// alternatively you can use strings as event identifiers
subscribe("chatroom-join", logJoin)
publish("chatroom-join", "Luke")
// > Luke has joined the room!
```

# Refactoring The Old Model
The refactored model is significantly more distributed in terms of code organization.
In the new model each entity has a series of callbacks described in a single file that specify the entirety of that entities state management.
These events are fired from other self contained modules that are solely responsible for firing these events.

For example, the file `tick.js` looks something like this...
```javascript
import {TICK} from '../events'
import {game_time} from '../util/game_time'
import {get_world} from '../entities/world'
import {render} form '../graphics/render'

function game_loop() {
  publish(TICK, game_time(), get_world());
  render();
  requestAnimationFrame(game_loop)
}
document.addEventListener("load", game_loop);
```
Each file is responsible for only one type of event.
Some events are triggered by other events and mutate the data a bit for use by other modules.

For example, here is the new version of `score.js` looks like...
```javascript
import {subscribe} from 'tiny-pubsub'
import {PLAYER, POLL, PLAYER_DEATH} from '../events'
import {get_players} from '../entities/players'
const player_count = document.getElementById("score-div");
const update_player_count =  ({players: players}) => player_count.innerText = `${get_players().length}/20`;

subscribe(PLAYER, update_player_count);
subscribe(PLAYER_DEATH, update_player_count);
subscribe(POLL, update_player_count);
```

This creates really simple to follow self contained modules.
Here is the example for bullet state management:
```javascript
import {subscribe} from "tiny-pubsub"
import {BULLET, POLL, REMOVE_BULLET, TICK} from '../events'
import {update_bullet} from './update_bullet'
import {array_to_map_on_key} from '../util/array_to_map_on_key'

let bullets = {};

subscribe(BULLET, bullet => {
  bullets[bullet.id] = bullet;
})

subscribe(TICK, (current_time, world) => {
  bullets = bullets
    .map(bullet => update_bullet(bullet, current_time, world))
    .filter(bullet => bullet != null);
})

subscribe(POLL, ({ bullets: bullets_poll }) => bullets =array_to_map_on_key(bullets_poll, "id"))

subscribe(REMOVE_BULLET, (id) => delete bullets[id])

function get_bullets() {
  return Object.keys(bullets).map((uuid) => bullets[uuid])
}

export {get_bullets}
```

Everything remains self contained.
Overall the frontend code for bulletz.io is significantly simpler and easier to follow.
Several UI bugs were fixed during the refactor due to the UI update logic becoming easier to follow.

# Event Driven Programming Leads to More Strongly Decoupled Code
Rewriting [bulletz.io](https://bulletz.io) to use an event driven model resulted in strongly decoupled logic.
The UI updates as well as state updates are written as responses to data emitted elsewhere.
I'd recommend giving it a shot if you are writing a web page any time soon without a framework!

The library I wrote for the problem is called tiny-pubsub and the github link can be found [here](https://github.com/LukeWood/tiny-pubsub).

Thanks for reading my first blog post!
