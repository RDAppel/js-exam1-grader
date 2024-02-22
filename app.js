
(async () => {

    const path = require('path')
    const prompt = require('prompt-sync')()
    const extract = require('extract-zip')
    const { exec } = require('child_process')
    const open = require('open')

    const flags = require('./parse-flags')()
    const parseStudentText = require('./parse-submission-text')
    const { findFoldersIn, findFilesOfTypeIn } = require('./folder-search')

    const findZipFilesIn = findFilesOfTypeIn('.zip')
    const findTextFilesIn = findFilesOfTypeIn('.txt')
    const findHtmlFilesIn = findFilesOfTypeIn('.html|.htm')

    const errorMessages = {
        "invalid-path": () => `The source folder "${sourcePath}" couldn't be found.`,
        "gradefile-not-found": () => `No gradefiles found in the specified directory.`,
        "extraction-failed": data => `The extraction of the gradefile failed: ${data?.message || 'Unknown error'}`
    }

    const showError = (errorId, data) => {
        console.log(errorMessages[errorId](data))
    }

    const downloadsPath = path.join(process.env.USERPROFILE, 'Downloads')

    const sourcePath = flags['source'] || downloadsPath
    if (!sourcePath) return showError('invalid-path')

    const destinationPath = flags['dest'] || flags['destination'] || sourcePath

    const gradebookFiles = findZipFilesIn(sourcePath)
        .filter(filename => filename.startsWith('gradebook_'))
    
    if (!gradebookFiles || !gradebookFiles.length) return showError('gradefile-not-found')

    const getIndex = () => {
        console.log('Multiple gradebook files found:')
        gradebookFiles.forEach((filename, index) => {
            console.log(`${index + 1}. ${filename}`)
        })

        while (true) {
            const input = prompt('Enter the index of the file you want to use: ')
            const index = parseInt(input) - 1
            if (index >= 0 && index < gradebookFiles.length) return index
        }
    }

    const index = gradebookFiles.length > 1 ? getIndex() : 0
    const gradebookFile = gradebookFiles[index]
    console.log('Selected file:', gradebookFile)

    
    const safeExtract = async (sourcePath, destinationPath, onError) => {
        const dir = destinationPath
        try {
            await extract(sourcePath, { dir })
            return true
        }
        catch (error) { onError(error) }
        return false
    }

    const source = path.join(sourcePath, gradebookFile)
    const destination = path.join(destinationPath, gradebookFile.replace('.zip', ''))
    
    const onError = error => showError('extraction-failed', error)
    const successful = await safeExtract(source, destination, onError)
    if (!successful) return

    const submittedZipFiles = findZipFilesIn(destination)
    
    const promises = submittedZipFiles.map(filename => safeExtract(
        path.join(destination, filename),
        path.join(destination, filename.replace('.zip', '')),
        onError
    ))

    await Promise.all(promises)

    const extractedFolders = findFoldersIn(destination)
    extractedFolders.forEach(folder => {
        const htmlFiles = findHtmlFilesIn(folder).map(filename => {
            return path.join(folder, filename)
        })
        if (htmlFiles.length) {
            //exec(`start "${htmlFiles[0]}"`)
            open(htmlFiles[0])
        }
        //exec(`start "" "${folder}"`)
    })
    
    return

    const textFiles = findTextFilesIn(destination)
    
    const getFileContent = async filepath => {
        return await require('fs').promises.readFile(filepath, 'utf8')
    }

    const fileContents = await Promise.all(textFiles.map(filename => {
        return getFileContent(path.join(destination, filename))
    }))
    
    const studentData = fileContents.map(parseStudentText)
    console.log(studentData)
})()