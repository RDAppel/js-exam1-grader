
const parseFlags = () => {
    const args = process.argv.slice(2)

    return args.map((arg, i) => {
        const name = arg.startsWith('--') ? arg.slice(2) : null
        if (!name) return

        const nextArg = args[i + 1]
        if (!nextArg || nextArg.startsWith('--')) return { [name]: true }

        return { [name]: nextArg }
    })
    .reduce((acc, flag) => {
        if (!flag) return acc
        return { ...acc, ...flag }
    }, { })
}

module.exports = parseFlags