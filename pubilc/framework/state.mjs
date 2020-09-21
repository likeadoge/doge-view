export class Attr{
    static re = `\\[\\s*\\w+\\s*\\](?:\\s*=\\s*"[\\w|\\W]*?")?`
    
    #content
    constructor(content){
        this.#content = content
    }
}


export class Event{
    static re = `\\{\\s*\\w+\\s*\\}(?:\\s*=\\s*"[\\w|\\W]*?")?`

    #content
    constructor(content){
        this.#content = content
    }
}



export class Directive{
    // static re = `\\w+(?:<\\w+(?:,\\w+)*>)?(?:\\([\\w|\\W]+?\\))?`
    static re = `\\w+(?:<\\w+(?:,\\w+)*>)?(?:\\s*=\\s*"[\\w|\\W]*?")?`

    #content
    constructor(content){
        this.#content = content
    }
}