#!/usr/bin/env node
const opn = require('opn');

const [, , ...args] = process.argv

let type = process.argv[2];
let command = process.argv[3];

let gitRepo = "https://bitbucket.org/organization/reponame/commits/";
let issueRepo = "https://gitlab.com/organization/reponame/issues/";
let gitCheats = "www.gitcheats.com?c="

if (type == "-i" || type == "--issue") {
    opn(issueRepo + command)
}
else if (type == "-c" || type == "--commit") {
    opn(gitRepo + command)
}
else if (type == "-g" || type == "--gitcheats") {
    opn(gitCheats + command)
}
else if (type == "-h" || type == "--help") {
    ShowHelp();
}
else {
    ShowHelp();
}

function ShowHelp() {
    console.log("");
    console.log("Dev Companion");
    console.log("");
    console.log("Commands:");
    console.log("   -h --help           Display this help");
    console.log("   -i --issue          Check your issue on your issue repo");
    console.log("   -c --commit         Check your commit on your git repo");
    console.log("   -g --gitcheats      Find your command in Gitcheats");
}