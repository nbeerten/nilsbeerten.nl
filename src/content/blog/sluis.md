---
title: "Sluis"
date: 2024-02-17
draft: false
description: "A new desktop-optimised frontend for Piped"
language: "en"
---

[Sluis](https://sluis.nilsbeerten.nl) is my latest project. It's a new desktop-optimised frontend for Piped.
For context, Piped is a proxy that allows people to interact with content on
YouTube, without comprising their privacy. You can read more about how Piped
works on their GitHub: [TeamPiped/Piped](https://github.com/TeamPiped/Piped).

On android various apps like [LibreTube](https://github.com/libre-tube/LibreTube)
exist, which make using
Piped much easier and smoother. On the web the only option is the Piped
frontend, like on [piped.video](https://piped.video). This frontend works
fine, but I wanted to make an alternative that's easier to use while also
being desktop-optimised and keeping most of the features the
[piped.video](https://piped.video) frontend has.

[Sluis](https://sluis.nilsbeerten.nl) is the result of that. So far it offers most of the features that
[piped.video](https://piped.video) offers, with the exception of playlists.
It's built with [SvelteKit](https://kit.svelte.dev),
[shadcn-svelte](https://www.shadcn-svelte.com/),
[Tailwind CSS](https://tailwindcss.com/) and
of course the privacy-focused Piped backend for interacting with YouTube.

![Example screenshot of Sluis of Google's channel page](./sluis_example.avif)

Current features of Sluis (and piped.video) include:

-   Video player built-in Sponsorblock
-   Comments
-   Subscriptions with feed
-   Trending
-   Search
-   Watch history

With more features like playlists planned for the future, Sluis will be a
great alternative frontend to piped.video. Feel free to contribute to the
project if you have any suggestions or ideas. Contributions can be made via
[GitHub](https://github.com/nbeerten/sluis).

Check Sluis out here: [sluis.nilsbeerten.nl](https://sluis.nilsbeerten.nl)
