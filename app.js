
(async () => {

    const path = require('path')
    const prompt = require('prompt-sync')()

    const { findFoldersIn, findFilesOfTypeIn } = require('./folder-search')

    const findZipFilesIn = findFilesOfTypeIn('.zip')

    const errorMessages = {
        "invalid-path": () => `The source folder "${sourcePath}" couldn't be found.`,
        "gradefile-not-found": () => `No gradefiles found in the specified directory.`
    }

    const showError = errorId => {
        console.log(errorMessages[errorId]())
    }

    const { argv } = process
    //const flags = argv.splice(2)

    const downloadsPath = path.join(process.env.USERPROFILE, 'Downloads')
    //const desktopPath = path.join(process.env.USERPROFILE, 'Documents')

    const sourcePath = downloadsPath // || getSearchPathFromFlags() // todo: use searchpath first
    if (!sourcePath) return showError('invalid-path')

    const gradebookFiles = findZipFilesIn(sourcePath)
        .filter(filename => filename.startsWith('gradebook_'))
    
    if (!gradebookFiles || !gradebookFiles.length) return showError('gradefile-not-found')

})()