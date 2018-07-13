#!/usr/bin/env node
const opn = require('opn')
const Configstore = require('configstore')
const inquirer = require('inquirer')
const chalk = require('chalk')
const pkg = require('./package.json')
const [, , ...args] = process.argv

const conf = new Configstore(pkg.name, {
	isConfirmed: 'No',
})

if (conf.get('isConfirmed') == 'No') {
	AddProject()
} else {
	CheckArguments()
}

/**
 * Adds a project to store in settings and activates it
 *
 */
function AddProject() {
	console.log(chalk.white.bold('\nSettings will ask for links below.'))
	console.log('')
	console.log(
		chalk.white.bold('Project Commits Example: ') +
			'https://github.com/User/RepoName/commit/',
	)
	console.log(
		chalk.white.bold('Project Issues Example: ') +
			'https://github.com/User/RepoName/issues/',
	)
	console.log(
		chalk.white.bold('Project Issues Example: ') +
			'https://github.com/User/RepoName/pull/',
	)
	console.log('')
	inquirer
		.prompt([
			{
				message: 'Project Name:',
				type: 'input',
				name: 'projectName',
				validate: validateString,
			},
			{
				message: 'Project Commits:',
				type: 'input',
				name: 'commitLink',
				validate: validateLink,
			},
			{
				message: 'Project Issues:',
				type: 'input',
				name: 'issueLink',
				validate: validateLink,
			},
			{
				message: 'Project Pull-Requests:',
				type: 'input',
				name: 'pullRequestLink',
				validate: validateLink,
			},
			{
				message: 'Are your choices correct?',
				type: 'list',
				name: 'isConfirmed',
				choices: ['Yes', 'No'],
			},
		])
		.then(answers => {
			if (answers.isConfirmed == 'No') {
				AddProject()
			} else {
				conf.set('isConfirmed', true)
				conf.set('lastProject', answers.projectName)

				conf.set(
					'projects.' + answers.projectName + '.commitLink',
					answers.commitLink,
				)
				conf.set(
					'projects.' + answers.projectName + '.issueLink',
					answers.issueLink,
				)
				conf.set(
					'projects.' + answers.projectName + '.pullRequestLink',
					answers.pullRequestLink,
				)

				console.log('')
				console.log(
					'You have created project ' + chalk.green(answers.projectName),
				)
				console.log('')
			}
		})
}

/**
 * Shows all projects stored in settings and activates selected
 *
 */
function GetProjects() {
	let projects = fetchProjects()

	inquirer
		.prompt([
			{
				message: 'Choose your project',
				type: 'list',
				name: 'projectName',
				choices: projects,
			},
		])
		.then(answers => {
			if (answers.projectName == 'Exit') {
				console.log("You didn't select a project")
				console.log('')
			} else {
				conf.set('lastProject', answers.projectName)
				console.log('You have selected ' + chalk.green(answers.projectName))
				console.log('')
			}
		})
}

/**
 * Shows all projects stored in settings and deletes selected
 *
 */
function DeleteProject() {
	let projects = fetchProjects()

	inquirer
		.prompt([
			{
				message: 'Choose a project to delete',
				type: 'list',
				name: 'projectName',
				choices: projects,
			},
		])
		.then(answers => {
			if (answers.projectName == 'Exit') {
				console.log("You didn't delete any project")
				console.log('')
			} else {
				conf.delete('projects.' + answers.projectName)
				console.log(
					'You have deleted ' +
						chalk.red(answers.projectName) +
						' from settings',
				)
				console.log('')
			}
		})
}

/**
 * Prints commands into terminal
 *
 */
function ShowHelp() {
	console.log('')
	console.log(chalk.white.bold('Git Observer Help'))
	console.log('')
	console.log('Commands:')
	console.log('   -a --add                Add a new project to observer')
	console.log('   -g --get                Get all projects on observer')
	console.log('   -d --delete             Delete a project from observer')
	console.log('')
	console.log('   -i --issue [Number]     Check issue on browser')
	console.log('   -c --commit [Hash]      Check commit on browser')
	console.log('   -p --pull [Number]      Check pull request on browser')
	console.log('')
	console.log('   -h --help               Display this help')
	console.log('')
}

/**
 * Checks all arguments given from terminal
 *
 */
function CheckArguments() {
	let type = process.argv[2]
	let command = process.argv[3]
	let project = conf.get('lastProject')

	if (type == '-i' || type == '--issue') {
		let issueLink = conf.get('projects.' + project + '.issueLink')
		openLink(issueLink, 'Issue', command)
	} else if (type == '-c' || type == '--commit') {
		let commitLink = conf.get('projects.' + project + '.commitLink')
		openLink(commitLink, 'Commit', command)
	} else if (type == '-p' || type == '--pull') {
		let prLink = conf.get('projects.' + project + '.pullRequestLink')
		openLink(prLink, 'Pull-Request', command)
	} else if (type == '-a' || type == '--add') {
		AddProject()
	} else if (type == '-g' || type == '--get') {
		GetProjects()
	} else if (type == '-d' || type == '--delete') {
		DeleteProject()
	} else {
		ShowHelp()
	}
}

/**
 * If link is stored in settings, launch on browser. Else display error
 *
 */
function openLink(link, linkType, command) {
	if (link === '') {
		console.log(linkType + ' not found in project ' + conf.get('lastProject'))
	} else {
		console.log(
			'Opening ' +
				linkType +
				': ' +
				command +
				' of project ' +
				conf.get('lastProject'),
		)
		opn(link + command)
	}
}

/**
 * Fetch all projects stored in Git-Observer settings
 *
 */
function fetchProjects() {
	let projects = []

	Object.keys(conf.get('projects')).forEach(element => {
		projects.push(element)
	})

	projects.push('Exit')

	return projects
}

/**
 * Validates string
 *
 * @param  {String} str String to validate
 */
function validateString(str) {
	return str !== ''
}

/**
 * Validates link
 *
 * @param  {String} str String to validate
 */
function validateLink(str) {
	regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/

	if (str === '') return true
	else if (regexp.test(str)) return true
	else return false
}
