---
title: "OTP for Game Development"
date: 2019-05-09T17:08:39-06:00
images:
  - /img/crescent.jpg
tags:
  - bulletz
  - elixir
---

## Background

[Bulletz.io](https://bulletz.io) is a browser game I wrote entirely in
[Elixir](https://github.com/elixir-lang/elixir) using the
[phoenix framework](https://phoenixframework.org/).  [Bulletz.io](https://bulletz.io)
is written to be highly fault tolerant and concurrent.  This was important to me
as I wanted to be able to run the game on a cheap server and leave it there long
term without having to touch it.

This post will detail how I leveraged [OTP](http://erlang.org/doc/system_architecture_intro/sys_arch_intro.html)
to make [bulletz.io](https://bulletz.io)
[fault tolerant](https://en.wikipedia.org/wiki/Fault_tolerance) and
[highly parallel](https://culttt.com/2016/07/27/understanding-concurrency-parallelism-elixir/).

## Introduction to OTP

### GenServers
### Supervisor Trees

## OTP in bulletz.io
### GenServer usage
### The bulletz.io Supervisor Tree
