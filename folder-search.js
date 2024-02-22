
const fs = require('fs')
const path = require('path')

const findFoldersIn = folder => {
    return fs.readdirSync(folder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(folder, dirent.name))
}

const findFilesOfTypeIn = type => (folder, recursive = false) => {
    if (!fs.existsSync(folder)) return

    const types = type.split('|')
    const getFiles = () => fs.readdirSync(folder).filter(f => {
        return types.some(t => f.endsWith(t))
    })

    if (!recursive) return getFiles()

    return findFoldersIn(folder).reduce((files, folder) => {
        return files.concat(findFilesOfTypeIn(type)(folder, true))
    }, getFiles())
}

module.exports = { findFoldersIn, findFilesOfTypeIn }