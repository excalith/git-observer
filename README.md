<p align="center">
	<h1 align="center">Git Observer - <i>A Developer Companion</i></h1>
</p>
<p align = "center">
    A companion app for developers to reach out Issues, Commits and Pull-Requests on their favorite browser, without leaving their beloved terminal
</p>
<p align="center">
    <img src="screenshot.gif">
</p>

<p align="center">
	<a href="https://travis-ci.org/excalith/git-observer">
		<img alt="Build Status" height="18" src="https://img.shields.io/travis/excalith/git-observer.svg">
	</a>
	<a href="https://github.com/excalith/git-observer/issues">
		<img alt="Build Status" height="18" src="https://img.shields.io/github/issues/excalith/git-observer.svg">
	</a>
	<a href="https://github.com/excalith/git-observer/stargazers">
		<img alt="Stars" height="18" src="https://img.shields.io/github/stars/excalith/git-observer.svg">
	</a>
	<a href="https://github.com/excalith/git-observer/network">
		<img alt="Forks" height="18" src="https://img.shields.io/github/forks/excalith/git-observer.svg">
	</a>
</p>

<hr/>

## How To Install:
### Using NPM
`npm i git-observer`

### Download
- Download the [latest release](https://github.com/excalith/git-observer/releases/latest)
- Within the directory, from your terminal
  - `npm install`
  - `npm link` (might ask for permission depending on your OS)

## How To Use:
You can run the app by typing `gob` or `git-observer`. On your first run, app will ask you to create settings for your project.

| _Settings_                    | _Description_                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Project Name (string)         | Your project name                                                                   |
| Project Commits (link)        | Link to your commits (ie. `https://github.com/excalith/Git-Observer/commit/` )      |
| Project Issues (link)         | Link to your issues (ie. `https://github.com/excalith/Git-Observer/issues/` )       |
| Project Pull-Requests (link)  | Link to your pull-requests (ie. `https://github.com/excalith/Git-Observer/pull/` )  |

Whenever you create a project, app sets it as default project. You can then run commands to launch corresponding page from terminal.


## Available Commands:

| _Command_                     | _Description_                               |
| ----------------------------- | ------------------------------------------- |
| gob                           | Add new project on first run or show help   |
| gob -a --add                  | Add a new project                           |
| gob -g --get                  | Get all projects                            |
| gob -d --delete               | Delete a project from settings              |
| gob -i --issue [Number]       | Check issue on browser                      |
| gob -c --commit [Hash]        | Check commit on browser                     |
| gob -p --pull [Number]        | Check pull request on browser               |
| gob -h --help                 | Show help                                   |

## How To Contribute
Please feel free to contribute!
* [Create issues](https://github.com/excalith/git-observer/issues) for both issues and feature requests
* Create pull requests to **develop** for anything listed in issues
  * Please use prefixes such as Add, Fix, Update etc. before your commit message
  * Please be brief about your commit message

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
