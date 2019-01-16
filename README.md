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
		<img alt="Master Status" height="18" src="https://img.shields.io/travis/excalith/git-observer.svg?label=master">
	</a>
	<a href="https://travis-ci.org/excalith/git-observer">
		<img alt="Dev Status" height="18" src="https://img.shields.io/travis/excalith/git-observer/develop.svg?label=dev">
	</a>
	<a href="https://www.npmjs.com/package/git-observer">
		<img alt="NPM Installs" height="18" src="https://img.shields.io/npm/dt/git-observer.svg?label=installs">
	</a>
	<a href="https://github.com/excalith/git-observer/issues">
		<img alt="Issues" height="18" src="https://img.shields.io/github/issues/excalith/git-observer.svg">
	</a>
	<a href="https://github.com/excalith/git-observer/stargazers">
		<img alt="Stars" height="18" src="https://img.shields.io/github/stars/excalith/git-observer.svg">
	</a>
	<a href="https://github.com/excalith/git-observer/network">
		<img alt="Forks" height="18" src="https://img.shields.io/github/forks/excalith/git-observer.svg">
	</a>
</p>

<hr/>

## Features
- Saves you time while launching and finding the issues, commits or pull-requests on browser
- You can easily `add`, `edit`, `delete` and `switch` between git-observer projects
- Automatically fills required fields while creating projects if within git repository
- Supports multiple projects and multiple repositories for each project (ie: different issue repository)


## How To Install:
### Using NPM
`npm i git-observer`

### Download
- Download the [latest release](https://github.com/excalith/git-observer/releases/latest)
- Within the directory, from your terminal
  - `npm install`
  - `npm link` (might ask for permission depending on your OS)

## How To Use:
You can run the app by typing `gob` or `git-observer`. 

| _Fields_                 | _Description_                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Repository Name          | Your repository name                                                               |
| Repository Commits       | Link to your commits (ie. `https://github.com/excalith/git-observer/commit/` )     |
| Repository Issues        | Link to your issues (ie. `https://github.com/excalith/git-observer/issues/` )      |
| Repository Pull-Requests | Link to your pull-requests (ie. `https://github.com/excalith/git-observer/pull/` ) |

Whenever you create a project, app sets it as default project. You can then run commands to launch corresponding page from terminal.


## Available Commands:

| _Command_               | _Description_                             |
| ----------------------- | ----------------------------------------- |
| gob                     | Add new project on first run or show help |
| gob -a --add            | Add a new project to observer             |
| gob -s --switch         | Switch to another project on observer     |
| gob -e --edit           | Edit settings file (JSON)                 |
| gob -d --delete         | Delete a project from observer            |
| gob -i --issue [Number] | Open issue on browser                     |
| gob -c --commit [Hash]  | Open commit on browser                    |
| gob -p --pull [Number]  | Open pull request on browser              |
| gob -h --help           | Show help                                 |

## How To Contribute
Please feel free to contribute!
* [Create issues](https://github.com/excalith/git-observer/issues) for both issues and feature requests
* Create pull requests to **develop** for anything listed in issues
  * Please use prefixes such as Add, Fix, Update etc. before your commit message
  * Please be brief about your commit message

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
