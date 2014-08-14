# CSS Stats

CSS Stats utilize [Stylestats](https://github.com/t32k/stylestats) and [CSSCSS](https://github.com/zmoazeni/csscss) to parse a css file and gives you stats on it.

## Installing

```
npm install -g css-stats
```

## Requirement

CSS Stats require Ruby (`v1.9.x` and up) installed. OSX should have Ruby preinstalled. For Windows you can use [RubyInstaller](http://rubyinstaller.org/). This is a Windows-based installer, the easiest way to get Ruby on Windows. To check if Ruby is installed on your machine use `ruby -v`. 

## Getting Started

For Windows start command prompt with Ruby and run the following command:

```
gem install csscss && css-stats setup
```

For OSX run the following command:

```
css-stats setup
```

## Usage

```
Usage: css-stats [--stylestats|--csscss] [css]

Commands:

setup
   install the necessary css parser engines

view [--json] [--port]
   visual view for css stats


Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -s, --stylestats [css]  parse css for overall stats
    -c, --csscss [css]      parse css for rulesets that have duplicated declarations
    -o, --output [path]     output path for parse css stats
    -j, --json [json]       stylestats or csscss json
    -p, --port [number]     port number for webpage
```