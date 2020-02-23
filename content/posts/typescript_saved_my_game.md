---
title: "Typescript Saved My Game's Performance"
date: "2020-02-23"
draft: false
type: post
---
## Background
For quite awhile [bulletz.io](https://bulletz.io) was written in vanilla javascript.
The only libraries I used were RxJs and Phoenix Websockets.
Performance was top notch for quite awhile due to the lack of framework, highly customized rendering code, and a specialized engine.
I regularly got complements on the performance and smoothness of rendering

## October 2019
Several comments came in via email, forums, and text message from friends commenting on the poor rendering performance of my game [bulletz.io](https://bulletz.io).
The only changes I had made (from my perspective) were trivial and had nothing to do with rendering.
I'd pretty much completely halted development at this point.

## What happened?
My laptop broke last October.  Due to this I got a spankin new Macbook.
I re-installed all of my dependencies.  Due to some bad development practices on my part (hobby project give me a break) I bumped the version of RxJs.

Why was this problematic?
well...

> # RxJs ChangeLog
> ## 6.0.0-alpha.1 (2018-01-12)
> ### BREAKING CHANGES
> ...
>
> ***schedulers: Scheduler instances have changed names to be suffixed with Scheduler, (e.g. asap -> asapScheduler)***
>
> ...


The [animationFrameScheduler](https://rxjs.dev/api/index/const/animationFrameScheduler) was moved and I didn't notice.
This was how I was controlling my rendering  time.
I was basically rendering all the time eating users' CPU cycles.

## Late 2019
For fun I refactored [bulletz.io](https://bulletz.io) to be written in Typescript.

To my surprise, typescript threw an exception indicating that `rxjs` exported no field named `animationFrameScheduler` from the location I waws importing it.

At this point - I wasn't even using typescript features yet.  I had *ONLY* switched to the Typescript compiler and had set it up to check all of my javascript files.

I found countless other type errors littered throughout my garbage code base during my port to poorly written typescript.

## Conclusion
I switched to using the real [animationFrameScheduler](https://rxjs.dev/api/index/const/animationFrameScheduler) and my games performance went back to how it used to be.

Typescript saved the game's performance.
