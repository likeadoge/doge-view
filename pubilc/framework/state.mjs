export class Attr {
    static re = `\\[\\s*\\w+\\s*\\](?:\\s*=\\s*"[\\w|\\W]*?")?`

    #content
    field = ""
    value = null

    constructor(content) {
        this.#content = content
        const [c, field, value] = content.match(`\\[\\s*(\\w+)\\s*\\](?:\\s*=\\s*"([\\w|\\W]*?)")?`)
        this.field = field
        this.value = (value || value === '') ? value : 'true'
        // console.log('Attr', this)
    }
}


export class Event {
    static re = `\\{\\s*\\w+\\s*\\}(?:\\s*=\\s*"[\\w|\\W]*?")?`
    field = ""
    value = null
    #content
    constructor(content) {
        this.#content = content
        const [c, field, value] = content.match(`\\{\\s*(\\w+)\\s*\\}(?:\\s*=\\s*"([\\w|\\W]*?)")?`)
        this.field = field
        this.value = (value || value === '') ? value : 'true'
        // console.log('Attr', this)
    }
}



export class Directive {
    // static re = `\\w+(?:<\\w+(?:,\\w+)*>)?(?:\\([\\w|\\W]+?\\))?`
    static re = `\\w+(?:<\\w+(?:,\\w+)*>)?(?:\\s*=\\s*"[\\w|\\W]*?")?`

    field = ""
    input = []
    value = null
    #content
    constructor(content) {
        this.#content = content
        // console.log(this.#content.match(`(\\w+)(?:<(\\w+(?:,\\w+)*)>)?(?:\\s*=\\s*"([\\w|\\W]*?)")?`))
        const [c, field, input, value] = content.match(`(\\w+)(?:<(\\w+(?:,\\w+)*)>)?(?:\\s*=\\s*"([\\w|\\W]*?)")?`)
        this.field = field
        this.input = input?input.split(',').map(v=>v.trim()):[]
        this.value = (value || value === '') ? value : 'true'
        // console.log('Directive', this)
    }
}

export class FragDirective {

    static re = `@\\w+(?:<\\w+(?:,\\w+)*>)?(?:\\s*=\\s*"[\\w|\\W]*?")?`

    field = ""
    input = []
    value = null
    #content
    constructor(content) {
        const [c, field, input, value] = content.match(`@(\\w+)(?:<(\\w+(?:,\\w+)*)>)?(?:\\s*=\\s*"([\\w|\\W]*?)")?`)
        this.field = field
        this.input = input?input.split(',').map(v=>v.trim()):[]
        this.value = (value || value === '') ? value : 'true'
        // console.log('FragDirective', this)
    }
}