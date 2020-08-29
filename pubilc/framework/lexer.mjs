class LexerNode {
    content
    data
    constructor(content = "", data = {}) {
        this.content = content
        this.data = data
    }
}

export class LexerOverNode extends LexerNode {
    static match = /(<\!--over-->)/
}
export class LexerEndNode extends LexerNode {
    static match = /(<\!--end-->)/
}
export class LexerTextNode extends LexerNode {
    static match = /([\d|\D]*)/
}

export class LexerIfNode extends LexerNode {
    static match = /(<\!--if\([\w|\W]+?\)-->)/
    constructor(content) {
        const code = content.match(/<\!--if\(([\w|\W]+?)\)-->/)[1]
        super(content, { code })
    }
}

export class LexerElseNode extends LexerNode {
    static match = /(<\!--else(?:\([\w|\W]+?\))?-->)/
    constructor(content) {
        const code = content.match(/<\!--else(?:\(([\w|\W]+?)\))?-->/)[1] || 'true'
        super(content, { code })
    }
}

export class LexerCodeNode extends LexerNode {
    static match = /(\{\{[\w|\W]+?\}\})/
    constructor(content) {
        const code = content.match(/\{\{([\w|\W]+?)\}\}/)[1]
        super(content, { code })
    }
}

export class LexerLoopNode extends LexerNode {
    static match = /(<\!--loop(?:<\w+(?:,\w+)?>)?\([\w|\W]+?\)-->)/
    constructor(content) {
        const input = content.match(/<\!--loop(?:<(\w+(?:,\w+))?>)?\([\w|\W]+?\)-->/)[1]
        const code = content.match(/<\!--loop(?:<\w+(?:,\w+)?>)?\(([\w|\W]+?)\)-->/)[1]

        super(content, {
            input: input && input.trim()
                ? input.split(',').map(v => v.trim())
                : [],
            code
        })
    }
}

export function lexer(template) {
    return [
        LexerLoopNode,
        LexerIfNode,
        LexerElseNode,
        LexerEndNode,
        LexerOverNode,
        LexerCodeNode,
        LexerTextNode
    ].reduce((res, LexerClass) => res.flatMap(node =>
        typeof node !== 'string'
            ? [node]
            : node.split(LexerClass.match)
                .filter(v => !!v)
                .map(content => LexerClass.match.test(content)
                    ? new LexerClass(content)
                    : content)
    ), [template])
}

