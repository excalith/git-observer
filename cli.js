#!/usr/bin/env node
const opn = require('opn')
const Configstore = require('configstore')
const inquirer = require('inquirer')
const chalk = require('chalk')
const gitconfig = require('gitconfiglocal')
const gitUrlParse = require('git-url-parse')
const checkForUpdate = require('update-check')
const boxen = require('boxen')
const pkg = require('./package.json')
const conf = new Configstore(pkg.name, {
	currentProject: '',
	projects: {}
})


// If settings have at least 1 project entry
if (FetchProjects().length > 0)
{
	// If everything is in order
	if (ValidateString(conf.get('currentProject')))
	{
		CheckArguments()
	}
	// If we do not have current project set
	else
	{
		console.log(chalk.red.bold('\nLast project not found, please select another project\n'))
		SwitchToProject()
	}
}
// If settings doesn't have any project entry
else
{
	AddProject()
}

/**
 * Checks all arguments given from terminal
 */
function CheckArguments() {
	let type = process.argv[2]
	let command = process.argv[3]
	let project = conf.get('currentProject')

	if (type == '-i' || type == '--issue') {
		let issueLink = conf.get('projects.' + project + '.issueLink')
		OpenLink(issueLink, 'Issue', command)
	} else if (type == '-c' || type == '--commit') {
		let commitLink = conf.get('projects.' + project + '.commitLink')
		OpenLink(commitLink, 'Commit', command)
	} else if (type == '-p' || type == '--pull') {
		let prLink = conf.get('projects.' + project + '.pullRequestLink')
		OpenLink(prLink, 'Pull-Request', command)
	} else if (type == '-a' || type == '--add') {
		AddProject()
	} else if (type == '-s' || type == '--switch') {
		SwitchToProject()
	} else if (type == '-d' || type == '--delete') {
		DeleteProject()
	} else if (type == '-e' || type == '--edit') {
		OpenSettings()
	} else {
		ShowHelp()
	}
}

/**
 * Prints commands into terminal
 */
function ShowHelp() {
	console.log(chalk.bold('\nCommands:'))
	console.log('   -a --add                Add a new project to observer')
	console.log('   -s --switch             Switch to another project on observer')
	console.log('   -e --edit               Edit settings file (JSON)')
	console.log('   -d --delete             Delete a project from observer')
	console.log('')
	console.log('   -i --issue [Number]     Check issue on browser')
	console.log('   -c --commit  [Hash]     Check commit on browser')
	console.log('   -p --pull  [Number]     Check pull request on browser')
	console.log('')
	console.log('   -h --help               Display this help')

	CheckUpdates()
}


/**
 * Adds a project to store in settings and activates it
 */
function AddProject() {
	let repoInfo = {}

	// Check if folder have git config file or not
	gitconfig('./', function(err, config) {
		// If git config not found or initialized repo doesn't have remote, pass example values
		if (err || config.hasOwnProperty('remote') === false) 
		{
			repoInfo.service = 'github.com'
			repoInfo.owner = 'owner'
			repoInfo.repo = 'repo-name'
		}
		// If git config found, fill repoInfo with required info
		else
		{
			let data = gitUrlParse(config.remote.origin.url)

			repoInfo.service = data.resource
			repoInfo.owner = data.owner
			repoInfo.repo = data.name
		}

		// Generate links depending on service
		switch (repoInfo.service) {
		case 'github.com':
			repoInfo.commitLink = 'https://github.com/' + repoInfo.owner + '/' + repoInfo.repo + '/commit/',
			repoInfo.issueLink = 'https://github.com/' + repoInfo.owner + '/' + repoInfo.repo + '/issues/',
			repoInfo.prLink = 'https://github.com/' + repoInfo.owner + '/' + repoInfo.repo + '/pull/'
			break
	
		case 'gitlab.com':
			repoInfo.commitLink = 'https://gitlab.com/' + repoInfo.owner + '/' + repoInfo.repo + '/commit/'
			repoInfo.issueLink = 'https://gitlab.com/' + repoInfo.owner + '/' + repoInfo.repo + '/issues/'
			repoInfo.prLink = 'https://gitlab.com/' + repoInfo.owner + '/' + repoInfo.repo + '/merge_requests/'
			break
	
		case 'bitbucket.org':
			repoInfo.commitLink = 'https://bitbucket.org/' + repoInfo.owner + '/' + repoInfo.repo + '/commits/'
			repoInfo.issueLink = 'https://bitbucket.org/' + repoInfo.owner + '/' + repoInfo.repo + '/issues/'
			repoInfo.prLink = 'https://bitbucket.org/' + repoInfo.owner + '/' + repoInfo.repo + '/pull-requests/'
			break
		}

		let projects = FetchProjects()
		let keyExists = (projects.indexOf(repoInfo.repo) > -1)

		
		if(keyExists) {
			console.log('\n' + repoInfo.repo + chalk.red.bold(' already exists') +  (' in git-observer database\n'))

			inquirer
				.prompt([
					{
						message: 'Do you want to override?',
						type: 'list',
						name: 'projectName',
						choices: ['Yes', 'No']
					}
				])
				.then(answers => {
					if (answers.projectName == 'Yes') {
						SaveProjectEntry(repoInfo)
					}
					else
					{
						return
					}
				})
		}
		else
		{
			SaveProjectEntry(repoInfo)
		}
	})
}


/**
 * Inquires the user to create a new git-observer entry
 * @param {repoInfo} repoInfo Display repository info or dummy info
 */
function SaveProjectEntry(repoInfo)
{
	console.log(chalk.green.bold('\nCreating new git-observer entry\n'))

	inquirer
		.prompt([
			{
				message: 'Repository Name:',
				default: repoInfo.repo,
				type: 'input',
				name: 'projectName',
				validate: ValidateString
			},
			{
				message: 'Repository Commits:',
				default: repoInfo.commitLink,
				type: 'input',
				name: 'commitLink',
				validate: ValidateLink
			},
			{
				message: 'Repository Issues:',
				default: repoInfo.issueLink,
				type: 'input',
				name: 'issueLink',
				validate: ValidateLink
			},
			{
				message: 'Repository Pull-Requests:',
				default: repoInfo.prLink,
				type: 'input',
				name: 'pullRequestLink',
				validate: ValidateLink
			},
			{
				message: 'Are your choices correct?',
				type: 'list',
				name: 'isConfirmed',
				choices: ['Yes', 'No']
			}
		])
		.then(answers => {
			if (answers.isConfirmed == 'No') {
				AddProject()
			} else {
				// conf.set('isConfirmed', true)
				conf.set('currentProject', answers.projectName)

				conf.set(
					'projects.' + answers.projectName + '.commitLink',
					answers.commitLink
				)
				conf.set(
					'projects.' + answers.projectName + '.issueLink',
					answers.issueLink
				)
				conf.set(
					'projects.' + answers.projectName + '.pullRequestLink',
					answers.pullRequestLink
				)

				console.log(
					'\nYou have created project ' +
						chalk.green(answers.projectName) +
						'\n'
				)
			}
		})
}


/**
 * Shows all projects stored in settings and activates selected
 */
function SwitchToProject() {
	let projects = FetchProjects()
	projects.push(new inquirer.Separator())
	projects.push('Exit')

	inquirer
		.prompt([
			{
				message: 'Choose your project',
				type: 'list',
				name: 'projectName',
				choices: projects
			}
		])
		.then(answers => {
			if (answers.projectName == 'Exit') {
				console.log('\nYou didn\'t select a project\n')
			} else {
				conf.set('currentProject', answers.projectName)
				console.log(
					'\nYou have selected ' + chalk.green(answers.projectName) + '\n'
				)
			}
		})
}


/**
 * Open configstore settings file
 **/
function OpenSettings() {
	opn(conf.path)
}


/**
 * Shows all projects stored in settings and deletes selected
 */
function DeleteProject() {
	let projects = FetchProjects()
	projects.push(new inquirer.Separator())
	projects.push('Exit')
	inquirer
		.prompt([
			{
				message: 'Choose a project to delete',
				type: 'list',
				name: 'projectName',
				choices: projects
			}
		])
		.then(answers => {
			if (answers.projectName == 'Exit') {
				console.log('You didn\'t delete any project\n')
			} else {
				conf.delete('projects.' + answers.projectName)
				console.log(
					'You have deleted ' +
						chalk.red(answers.projectName) +
						' from settings\n'
				)
			}
		})
}


/**
 * If link is stored in settings, launch on browser. Else display error
 * @param  {String} link Link to open
 * @param  {String} linkType Issue, Commit or Pull Request
 * @param  {String} id ID of link
 */
function OpenLink(link, linkType, id) {
	if (link === '') {
		console.log(
			linkType +
				' link not set for project ' +
				chalk.magenta.bold(conf.get('currentProject'))
		)
	} else {
		if (linkType == 'Issue')
			console.log(
				'Opening ' +
					chalk.red.bold('issue #' + id) +
					' of project ' +
					chalk.magenta.bold(conf.get('currentProject'))
			)
		else if (linkType == 'Commit')
			console.log(
				'Opening ' +
					chalk.green.bold('commit #' + id) +
					' of project ' +
					chalk.magenta.bold(conf.get('currentProject'))
			)
		else
			console.log(
				'Opening ' +
					chalk.blue.bold('pull request #' + id) +
					' of project ' +
					chalk.magenta.bold(conf.get('currentProject'))
			)

		opn(link + id)
	}
}


/**
 * Fetch all projects stored in Git-Observer settings
 */
function FetchProjects() {
	let projects = []

	Object.keys(conf.get('projects')).forEach(element => {
		projects.push(element)
	})

	return projects
}


/**
 * Checks for an update and prints info
 */
async function CheckUpdates()
{
	let update = null
 
	try {
		update = await checkForUpdate(pkg)
	} catch (err) {
		console.log(chalk.red('\nFailed to check for updates:'))
		console.error(err)
	}
	
	if (update) {
		let updateText = 'Update available ' + chalk.gray(pkg.version) + ' → ' + chalk.green(update.latest)
		let commandText = 'Run ' + chalk.cyan('npm i -g ' + pkg.name) + ' to update'
		console.log(boxen(updateText + '\n' + commandText, {padding: 1, margin: 1, align: 'center'}))
	}

}


/**
 * Validates string
 * @param  {String} str String to validate
 */
function ValidateString(str) {
	return str !== ''
}


/**
 * Validates link
 * @param  {String} str Link to validate
 */
function ValidateLink(str) {
	const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/

	if (str === '') return true
	else if (regexp.test(str)) return true
	else return false
}