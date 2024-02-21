
(async () => {

    const path = require('path')
    // const fs = require('fs')
    // const extract = require('extract-zip')
	// const chalk = require('chalk')
    // const prompt = require('prompt-sync')()

    const { findFoldersIn, findFilesOfTypeIn } = require('./folder-search')

    const { argv } = process
    //const flags = argv.splice(2)

    const downloadsPath = path.join(process.env.USERPROFILE, 'Downloads')
    const desktopPath = path.join(process.env.USERPROFILE, 'Documents')

    console.log({ desktopPath, downloadsPath })


})()