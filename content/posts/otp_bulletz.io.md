---
title: "Elixir/OTP for Game Development"
date: 2019-05-09T17:08:39-06:00
images:
  - /img/crescent.jpg
tags:
  - bulletz
  - elixir
---

## Background

The [Open Telecom Platform (OTP)](https://github.com/erlang/otp) is a powerful set of libraries essential
to the success of [erlang](https://www.erlang.org/)  in the building of massively
scalable soft real-time systems with requirements on high availability.  One of
the greatest benefits of using [Elixir](https://elixir-lang.org/) to develop
software is it's seamless interop with erlang libraries (including those in OTP).

[bulletz.io](https://bulletz.io) is a browser game built with
[Elixir](https://elixir-lang.org/) and the
[phoenix framework](https://phoenixframework.org/).

This post will showcase the usage of OTP in bulletz.io as an example of how to
design
[fault tolerant](https://en.wikipedia.org/wiki/Fault_tolerance) and
[highly parallel](https://culttt.com/2016/07/27/understanding-concurrency-parallelism-elixir/)
applications.

## Introduction to OTP

### GenServers
### Supervisor Trees

## OTP in bulletz.io
### GenServer usage
### The bulletz.io Supervisor Tree
