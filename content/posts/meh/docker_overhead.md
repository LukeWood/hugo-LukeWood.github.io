---
date: "2019-07-17T20:04:15-07:00"
draft: true
images: null
tags:
- Docker
- Performance
title: Dockerized Elixir Overhead Testing
toc: false
type: post
---

A few months back I toyed with the idea of using Docker to simplify the deployment process for servers in [bulletz.io](https://bulletz.io).
Unfortunately this led to some serious performance issues.

This made me wonder:  how much slower are dockerized applications compared to their bare metal counter parts.

# Plan
Develop a CPU heavy.

# Implementation
```elixir
Enum.map(1..1000000, &(&1*&1) |>
	Enum.reduce(fn
```



# Results
