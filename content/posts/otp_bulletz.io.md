---
title: "OTP by Example: GenServers in Game Development"
date: 2019-05-09T17:08:39-06:00
images:
  - /img/crescent.jpg
tags:
  - elixir
---

## Background

The [Open Telecom Platform (OTP)](https://github.com/erlang/otp) is a powerful
set of libraries essential to the success of [erlang](https://www.erlang.org/)  
in the building of massively scalable soft real-time systems with requirements
on high availability.  One of the greatest benefits of using
[Elixir](https://elixir-lang.org/) to develop software is it's seamless interop
with erlang libraries (including those in OTP).

[bulletz.io](https://bulletz.io) is a browser game built with
[Elixir](https://elixir-lang.org/) and the
[phoenix framework](https://phoenixframework.org/).

This post will showcase the usage of OTP in bulletz.io as an example of how to
design
[fault tolerant](https://en.wikipedia.org/wiki/Fault_tolerance) and
[highly parallel](https://culttt.com/2016/07/27/understanding-concurrency-parallelism-elixir/)
applications.

## Introduction to OTP
OTP contains too much functionality to cover in a single blog post.  This blog
post will only cover GenServer, Supervisors, and a sample use of them.
### GenServers
The smallest unit of concurrency on the
[BEAM](http://erlang.org/faq/implementations.html) (erlang vm where both erlang
and elixir run) is the
[process](http://erlang.org/doc/reference_manual/processes.html).  Processes run
independent from one another with the exceptions of
[process linking](http://erlang.org/doc/reference_manual/processes.html#links), [process termination](http://erlang.org/doc/reference_manual/processes.html#process-termination) and [message passing](http://erlang.org/doc/reference_manual/processes.html#message-sending).  These exceptions can be a
great source of development difficulty so OTP offers some nice abstractions on
top of processes to simplify concurrent development in elixir.

[GenServer](https://hexdocs.pm/elixir/GenServer.html) is the most adaptable and
generalizable process wrapper included in OTP.  GenServers consist of two thing: callbacks and state.

The primary ways that we use GenServers is through calls and casts.
The difference is simple: a call is a synchronous call whereas a cast is async.  Calls can therefore return a value while casts cannot.

To implement a GenServer you simply define init/1, handle_call/3, and the handle_cast/2.



[message passing.](http://erlang.org/doc/reference_manual/processes.html#message-sending)


###### Part 2: Supervisor trees coming soon

### Supervisor Trees

## OTP in bulletz.io
### GenServer usage
### The bulletz.io Supervisor Tree
