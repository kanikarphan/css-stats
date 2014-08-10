# Stats

Stats utilize [Stylestats](https://github.com/t32k/stylestats) and [CSSCSS](https://github.com/zmoazeni/csscss) to parse a css file and gives you stats on it.

## Getting Started

Stats needs the following installed: Grunt CLI `~0.4.0` and Ruby (`v1.9.x` and up).

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to Grunt CLI.

To check Ruby is installed on your machine use `ruby -v`. 
[RubyInstaller](http://rubyinstaller.org/) is a Windows-based installer, the easiest way to get Ruby on Windows.

Usage
```
Usage: stats [--stylestats|--csscss] [css]

Commands:

setup [type]
   run setup command to install parser

Options:

-h, --help              output usage information
-V, --version           output the version number
-s, --stylestats [css]  parse css for overall stats
-c, --csscss [css]      parse css for rulesets that have duplicated declarations
-t, --type [parser]     parser to install [stylestats|csscss]
```