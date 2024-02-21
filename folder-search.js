
const fs = require('fs')



const findFoldersIn = folder => {
    return fs.readdirSync(folder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(folder, dirent.name))
}

const findFilesOfTypeIn = type => (folder, recursive = false) => {
    if (!fs.existsSync(folder)) return

    if (!recursive) return fs.readdirSync(folder).filter(f => f.endsWith(type))
}