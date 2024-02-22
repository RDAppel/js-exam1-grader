/* EXAMPLE FILE
    Name: Ashton Treleven (500206565)\n
    Assignment: Exam 1 - Practical\n
    Date Submitted: Tuesday, February 20, 2024 12:35:07 AM CST\n
    Current Grade: Needs Grading\n
    Submission Field:\n
    There is no student submission text data for this assignment.\n
    Comments:\n
    There are no student comments for this assignment.\n
    Files:\n
    \tOriginal filename: Practical.zip\n
    \tFilename: Exam 1 - Practical_500206565_attempt_2024-02-20-00-35-07_Practical.zip
*/

const parseText = text => {
    const lines = text.split('\n').map(line => line.trim())
    const [ name, id ] = lines[0].replace('Name: ', '').replace(')', '').split(' (')
    const assignment = lines[1].replace('Assignment: ', '')
    const dateSubmitted = lines[2].replace('Date Submitted: ', '')
    const currentGrade = lines[3].replace('Current Grade: ', '')
    const submissionInfo = lines.slice(4, lines.length - 1)
        .map(line => line.trim() === '' ? '|*|' : line.trim()).join(' ')
        .split('|*|').filter(line => line !== '')
    const submissionField = submissionInfo[0].replace('Submission Field:', '').trim()
    const comments = submissionInfo[1].replace('Comments:', '').trim()

    const hasSubmissionField = submissionField !== 'There is no student submission text data for this assignment.'
    const hasComments = comments !== 'There are no student comments for this assignment.'
    
    const result = { name, id, assignment, dateSubmitted, currentGrade }
    if (hasSubmissionField) result.submissionField = submissionField
    if (hasComments) result.comments = comments
    return result
}

module.exports = parseText
