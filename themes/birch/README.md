# Birch
Birch is the hugo theme I used to generate my personal site,  https://LukeWood.dev.

Birch is lightweight, slick, and modern.  Out of the box birch scores 100/100 in all (web.dev)[https://web.dev/] audit categories (performance, accessibility, best practicies, and SEO).
Your users will rejoice as the page loads and becomes interactive within an instant.

Birch ships with a default list page to renders any generic list of content as well as a specialized projects page.
The projects page gracefully allows you to link users to relevant resources to show off your portfolio.

Birch ships by default with both a day and night mode.

Finally, Birch ships as a Progressive Web App.
This means users can download your personal site as an app on their desktop or phone.
*Coming Soon, offline site browsing*

# Setup
Setting up the theme is easy!

```
git submodule add -f https://github.com/lukewood/wood themes/birch
(cd themes/birch && npm install)
```

Next pick an icon and set a reference to it in theme.toml.
The icon must be stored in `assets/` as birch performs some processing on it.

- populate `content/projects/`
- populate `content/posts/`
- populate `content/about.md`

## config.toml
Check out the exampleSite's `config.toml` and model yours after it.

[params]
  [[params.social]]
    name = "github"
    url = "https://github.com/LukeWood"
[menu.main]
  name = "About"
  url = "/about"
  weight = 0

[menu.header]
  name = "About"
  url = "/about"
  weight = 0

# Usage

## Progressive Images
Progressive images load as low resolution and proceed to load as higher resolution as the site loads.

TODO Example gif:

# Customization
You can override any of the css variables by defining your own root element custom attributes.

Here are the colors that ship with birch by default
```css
:root {
  --background_color: #121212;
  --primary_color: #82b1ff;
  --primary_color_light: #b6e3ff;
  --primary_color_dark: #4d82cb;
  --secondary_color: #ffff8d;
  --secondary_color_light: #ffffbf;
  --secondary_color_dark: #cacc5d;
  --text_color: #FFFFFF;
  --text_color_dark: #BBBBBB;
  --transition_duration: .3s;
  --menu_background: #313131;
  --card_color: #242424;
  --card_color_hover: #2c2c2c;
  --figure_background: #89909f;
}

:root[data-theme='light'] {
  // NOTE:  dark and lights are inversed in light mode to keep the feel of
  // getting closer to the background color
  --background_color: #FFFFFF;
  --primary_color: #0d47a1;
  --primary_color_light: #002171;
  --primary_color_dark: #5472d3;
  --secondary_color: #2e7d32;
  --secondary_color_light: #005005;
  --secondary_color_dark: #60ad5e;
  --text_color: black;
  --text_color_dark: #888888;
  --transition_duration: .3s;
  --menu_background: #0d47a1;
  --primary_menu_link_color: #FFFFFF;
  --primary_menu_link_color_hover: #CCCCCC;
  --card_color: #FFFFFF;
  --card_color_hover: #EEEEEE;
  --figure_background: #FFFFFF;
}
```

# Respects Due
The social media icons and svg template are taken from the [hermit hugo theme](https://github.com/Track3/hermit).  Huge shout out to Track3 for publishing those icons as open source.

Thanks to the hugo team for making this all possible.  hugo is an amazing static site generator.
