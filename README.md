# CSS Stats

CSS Stats utilize [Stylestats](https://github.com/t32k/stylestats) and [CSSCSS](https://github.com/zmoazeni/csscss) to parse a css file and gives you stats on it.

## Getting Started

CSS Stats require Ruby (`v1.9.x` and up) installed. OSX should have Ruby preinstalled. For Windows you can use [RubyInstaller](http://rubyinstaller.org/). This is a Windows-based installer, the easiest way to get Ruby on Windows. To check if Ruby is installed on your machine use `ruby -v`. 

Usage
```
Usage: css-stats [--stylestats|--csscss] [css]

Commands:

setup 
   install the necessary css parser engines

start
   generate css-stats scaffolding to parse css

Options:

-h, --help              output usage information
-V, --version           output the version number
-s, --stylestats [css]  parse css for overall stats
-c, --csscss [css]      parse css for rulesets that have duplicated declarations
```