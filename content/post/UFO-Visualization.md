+++
date = "2017-05-03T17:15:58-05:00"
title = "3D UFO Data Visualization"

+++
<h1>3D UFO Data Visualization</h1>
<h2>Introduction</h2>
<p>
I recently created a 3D data visualization of UFO sightings from the years 1995-1996.  I utilized the Three.js library to make the in-browser visualization.  

<a href="https://LukeWoodSMU.github.io/AREA-51">You can find a live demo of the visualization here.</a>  

In this article, I will detail my development process for this visualization. Here is a screenshot of the final product:
<img style="width:100%" src="/UFO/UFO-vis.png"></img>
</p>
<h2>Development</h2>
<h3>Data Parsing</h3>
To start off, I needed to clean up the data a bit.  Initially, the data was incredibly messy.  I needed to sort the spottings by year and standardize the data format.  After I had done this, I had the date spotted, and the location in a natural language format.  To solve this problem, I performed a bit of data cleaning and used geopy's Nominatim to find the latitude and longitude of the town sighted in.  The Geolocation finding is showcased below in the gist below.

<h6> Town/City Name to Long/Lat </h6>

<script src="https://gist.github.com/LukeWoodSMU/7f5b1f5e125b2dc6e211af6691f8a1ad.js"></script>

After this was complete, I had the date of the sighting, latitude, and longitude.  I now had all of the data in a format that was easy to visualize.

<h3>3D Data Visualization</h3>
The first part of this data visualization was standard to all Three.js development: initialize your scene, add lighting, and add camera controls.  I will not be going into detail on how I did this as there are plenty of tutorials online.

There were many different interacting components in the creation of this project which required a huge volume of javascript to get working.  You can look into some of the inner workings of the visualization in the <a href="https://github.com/LukeWoodSMU/AREA-51">github repo</a>.  In the interest of keeping this blog post short, I will only discuss the data visualization itself as opposed to the whole scene.

When visualizing the data, I faced the challenge of deciding whether to show all sightings through the year up until the current date or just the sightings from a specific day.  I decided to marry the two to some extent by having the red dots signifying sightings fade out in terms of opacity slowly  This allowed users to easily pick out recent sightings as well as see the overall trend of the sightings.

<h2>The Trend</h2>
When I first created the visualization, I had no idea what to expect.  I had no idea what the data would look like, but was very pleasantly surprised with the results.  There were two noticeably insights to take away from the visualization in terms of understanding the overall trends of the data.

1.  The New Mexico Band
2.  High Time Density

Basically, what I believe the data shows is that there was a huge copycat effect.
The density of sightings skyrockets in specific areas as soon as one sighting is widely publicized.  We see lots of geographically similar sightings, specifically in the New Mexico area.  This leads to huge clusters along with large areas with no sightings at all.

<h2>Insights Gained</h2>
Throughout this project, I had a few huge valuable takeaways.  I will absolutely take these lessons into account when I develop 3D data visualizations in the future.
<ul>
<li>3D Data Visualizations Create a Memorable Experience</li>
<li>Don't Underestimate the Computational Cost of 3D Graphics</li>
<li>Don't Create a Visualization for a Specific Insight</li>
</ul>

Overall, the visualization was a success and an excellent learning experience.  I would recommend anyone interested in data visualization to try building a 3D visualization from the ground up.  <a href="https://lukewoodsmu.github.io/AREA-51">The live demo can be located here</a>.
