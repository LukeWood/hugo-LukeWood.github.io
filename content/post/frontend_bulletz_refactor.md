---
title: Decouple Your Javascript Using Event Driven Programming
date: "2019-07-11T20:13:20-07:00"
draft: false
type: post
---

I am the sole author of the web game [bulletz.io](https://bulletz.io).
Recently I refactored the frontend's codebase to more closely match that of the backend.
The backend is written using the functional programming language [Elixir](https://elixir-lang.org) while the frontend is written in Vanilla Javascript.
The programming languages are ___vastly___ different and are based on entirely [different paradigms](https://cs.lmu.edu/~ray/notes/paradigms).

Originally the frontend was written using a generic [Object Oriented model](https://www.webopedia.com/TERM/O/object_oriented_programming_OOP.html).
This led to a great deal of technical debt, complicated UI interactions, and overall confusing code.

I rewrote the frontend over the course of a single evening to use an event driven model and the results were fantastic.  The library used for the refactor was [tiny-pubsub](https://github.com/LukeWood/tiny-pubsub).

{{< figure class="bordered-figure" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz.png" title="A screenshot of bulletz.io" >}}

Over time a [god object](https://en.wikipedia.org/wiki/God_object) emerged which led my frontend client to have anti patterns littered everywhere.
This article will describe how my mega class emerged and how I ended up solving that problem by using [tiny-pubsub](https://github.com/LukeWood/tiny-pubsub).

# The Original Model
The original state management model for the bullets took an object oriented model.
A central ___StateManager___ class managed the entirety of the game's state by delegating each entity it's own Sub-Manager.

These managers attempt to guess the current state of entities based on the last update the server pushed out through websockets.
This allows the game to run using very low amounts of bandwidth while still displaying the real time state of each entity.

{{< figure class="bordered-figure dark-gray-background" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz_old_frontend.png" title="State Manager Delegation System" >}}

This led to a ton of problems over time - primarily on the fronts of readability and maintainability.
The state of the various entities became intertwined over time and it became difficult to hunt down state related bugs.


The largest anti-pattern the old model used was having a [god object](https://en.wikipedia.org/wiki/God_object), the top level State Manager.

This state manager ended up being responsible for all sorts of things and was passed as a parameter to tons of UI functions.

Here is the file that handled displaying the count of active players in the old system:

{{< highlight javascript "linenos=table" >}}
// player_counter.js
const player_count = document.getElementById("score-div");
function update_player_counter(state_handler) {
  const score = state_handler.player_registry.get_players().length;
  player_count.innerText = `${players}/20`;
}
export {update_player_counter}
{{< / highlight >}}

The function `update_player_counter` had to be called elsewhere every time a new player spawned or died.
Throughout the code base there were three incentations of this function.  Two in `player_registry.js`.

{{< highlight javascript "linenos=table,hl_lines= 11 16" >}}
// player_registry.js

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
{{< / highlight >}}

and another in the state handler

{{< highlight javascript "linenos=table,hl_lines=8" >}}
// state_handler.js
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
{{< / highlight >}}

As an isolated incident this was not terribly painful, but when the function calls across all UI interactions accumulated the resulting code was difficult to understand and maintain.
The resulting code tightly coupled UI interactions and state management.
Other classes end up being responsible for triggering UI updates.

__The resulting code is heavily coupled.  It intertwines UI interactions with state management.__

The `state handler` ended up being responsible for triggering UI updates and was an argument to nearly everything.
Almost every method, ui interaction, etc needed to store a copy of a state handler.
This mean't every time I registered an event listener I would need a state handler handily stored nearby.
By the time I had a complete frontend the name `state_handler` showed up in well over `70%` of files.

# Decoupling the Code With Tiny Pubsub
This is a shameless plug for the self authored javascript library I wrote to solve this: [tiny-pubsub](https://github.com/LukeWood/tiny-pubsub).
It's nothing special - it just maintains a relationship between events and functions that should be called in response to said events.
Instead of explicitly calling functions, functions instead respond to data emitted elsewhere.

But what it does do is encourage a [decoupled codebase](https://gameprogrammingpatterns.com/decoupling-patterns.html) through the event driven programming paradigm.

Here is a self contained example:
{{< highlight javascript "linenos=table" >}}
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
{{< / highlight >}}

# The Refactored Model
The refactored model is significantly more distributed in terms of code organization.
In the new model each entity is described by series of callbacks defined in a single file.
The callbacks respond to published events and update the state of the entities.
These events are published from other self contained modules that are solely responsible for firing these events.

For example, the file `tick.js` looks something like this...
{{< highlight javascript "linenos=table" >}}
import {TICK} from '../events'
import {game_time} from '../util/game_time'

function game_loop() {
  publish(TICK, game_time());
  requestAnimationFrame(game_loop)
}

document.addEventListener("load", game_loop);
{{< / highlight >}}

Each event file is responsible for only one type of event.
Some events are triggered by other events and mutate the data a bit for use by other modules.

The UI interactions are also handled in self contained modules.
Here is the new version of `score.js`...
{{< highlight javascript "linenos=table" >}}
import {subscribe} from 'tiny-pubsub'
import {PLAYER, POLL, PLAYER_DEATH} from '../events'
import {get_players} from '../entities/players'
const player_count = document.getElementById("score-div");
const update_player_count =  ({players: players}) => player_count.innerText = `${get_players().length}/20`;

subscribe(PLAYER, update_player_count);
subscribe(PLAYER_DEATH, update_player_count);
subscribe(POLL, update_player_count);
{{< / highlight >}}

The state management is implemented through small self contained modules.
Here is the example for bullet state management:

{{< highlight javascript "linenos=table" >}}
import {subscribe} from "tiny-pubsub"
import {BULLET, POLL, REMOVE_BULLET, TICK} from '../events'
import {update_bullet} from './update_bullet'
import {array_to_map_on_key} from '../util/array_to_map_on_key'

// state
let bullets = {};

// subscription
subscribe(BULLET, bullet => bullets[bullet.id] = bullet)
subscribe(TICK, (current_time, world) => {
  bullets = bullets
    .map(bullet => update_bullet(bullet, current_time, world))
    .filter(bullet => bullet != null);
})
subscribe(POLL, ({ bullets: bullets_poll }) => {
  bullets = array_to_map_on_key(bullets_poll, "id")
})
subscribe(REMOVE_BULLET, (id) => delete bullets[id])

// exported functions
function get_bullets() {
  return Object.keys(bullets).map((uuid) => bullets[uuid])
}

export {get_bullets}
{{< / highlight >}}

Everything remains self contained and simple.
Here is an organizational diagram displaying the event based frontend architecture.

{{< figure class="bordered-figure dark-gray-background" alt="screenshot of bulletz.io being played" src="/img/posts/bulletz/bulletz_new_frontend.png" title="The refactored bulletz frontend state management system" >}}
# Result of Using Event Driven Programming
Rewriting [bulletz.io](https://bulletz.io) to use an event driven model resulted in strongly decoupled logic.
The frontend code for bulletz.io is significantly simpler and easier to follow.
As a side effect the several UI bugs were fixed.
The UI updates as well as state updates are written as self contained modules that respond to data emitted elsewhere.

I'd recommend giving event driven programming a shot if you are writing a web page any time soon without a framework!
The library I wrote for the problem is called tiny-pubsub and the Github link can be found [here](https://github.com/LukeWood/tiny-pubsub).

[Also be sure give bulletz.io a try!](https://bulletz.io)

---
