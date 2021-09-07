const PROCESS = document.getElementById("process")
const INPUT = document.getElementById("input")
const OUTPUT_TEXT = document.getElementById("output-text")

function process() {
    var input = INPUT.value
    var split = input.split("\n")

    // Iterate over each line in the input.
    // Budget Rules:
    //   Comments are ignored.
    //   The first symbol in a line is the start symbol. The -> symbol designates the function, and the right-hand side specifies output.
    //      Input can be randomized by splitting results between | characters.
    //
    // Example:
    //      start -> option a
    //      option -> b | c
    //    Result => a b OR a c
    var rules = new Map()
    split.forEach(line => {
        if (line.includes('->')) {
            var splitLine = line.split('->')
            var input = splitLine[0].trim()
            var result = splitLine[1].trim().replaceAll("<", "").replaceAll(">", "")
            var replacements = result.split("|")
            rules.set(input, replacements)
        }
    })

    // Locate the start ('start') branch and process the tree.
    if (rules.has('start')) {
        var start = rules.get('start')[0]
        var result = processRecursively(rules, start)
        OUTPUT_TEXT.innerText = result
        console.log(result)
    } else {
        console.log("No starting rule was found!")
    }
}

function processRecursively(rules, current) {
    var previous = ""
    var processed = ""

    do {
        previous = processed
        processed = processOnce(rules, current)
        current = processed
    } while (previous !== current)

    return current
}

function processOnce(rules, current) {

    // Normally we could check if the word IS a rule, but in some cases, all rules have to be checked (example: {a}{b} where rules are {a} and {b}-- {a}{b} is a single element)
    // because of this, we have to check every rule:
    rules.forEach((replacements, rule) => {
        if (current.includes(rule)) {
            var replacement = replacements[Math.floor(Math.random() * replacements.length)]

            // If the replacement is the self-replacement rule ("    [!]     "), replace it with another rule.
            if(replacement.includes("[!]")) {
                // TODO: this might replace itself with the same rule
                var newReplacement = ""
                do {
                    newReplacement = replacements[Math.floor(Math.random() * replacements.length)]
                } while(newReplacement.includes("[!]"))
                
                replacement = replacement.replace("[!]", newReplacement)
            }

            current = current.replace(rule, replacement)
            return
        }
    });

    return current
}

// When the process button is clicked, handle the input box & print to the output...
PROCESS.addEventListener('click', event => {
    process()
});