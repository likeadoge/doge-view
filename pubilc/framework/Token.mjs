import {
    Attr, Event, Directive, FragDirective
} from './state.mjs'


export default class Token {
    static scan(template) {
        return [
            TokenSubHeadNode,
            TokenHeadNode,
            TokenTailNode,
            TokenTextNode,
            TokenHtmlNode,
        ].reduce((res, TokenClass) => res.flatMap(node =>
            typeof node !== 'string'
                ? [node]
                : node.split(TokenClass.match)
                    .filter(v => !!v)
                    .map(content => TokenClass.match.test(content)
                        ? new TokenClass(content)
                        : content)
        ), [template])
    }

    content = ''
    data = {}
    constructor(content = '', data = {}) {
        this.content = content
        this.data = data
    }
}

class HeadCommon extends Token {

    constructor(content) {
        const attrs = []
        const events = []
        const directives = []
        content.split(new RegExp(`((?:${Attr.re})|(?:${Event.re})|(?:${Directive.re})|(?:${FragDirective.re}))`))
            .map(v => v.trim())
            .forEach(str => {
                if (new RegExp(`^${Attr.re}$`).test(str)) attrs.push(new Attr(str))
                else if (new RegExp(`^${Event.re}$`).test(str)) events.push(new Event(str))
                else if (new RegExp(`^${Directive.re}$`).test(str)) directives.push(new Directive(str))
                else if (new RegExp(`^${FragDirective.re}$`).test(str)) directives.push(new FragDirective(str))
            });
        super(content, {
            attrs, events, directives
        })
    }
}

export class TokenHeadNode extends HeadCommon {
    static match = new RegExp(`(<\\!---\\s*(?:${[Attr.re, Event.re, Directive.re, FragDirective.re].map(v => `(?:${v}\\s*)`).join("|")})*--->)`)
}
export class TokenSubHeadNode extends HeadCommon {
    static match = new RegExp(`(<\\!--#\\s*(?:${[Attr.re, Event.re, Directive.re, FragDirective.re].map(v => `(?:${v}\\s*)`).join("|")})*--->)`)
}

export class TokenTailNode extends Token {
    static match = /(<\!---\/--->)/
}

export class TokenHtmlNode extends Token {
    static match = /([\d|\D]*)/
}

export class TokenTextNode extends Token {
    static match = /(\{\{[\w|\W]+?\}\})/
    constructor(content) {
        const code = content.match(/\{\{([\w|\W]+?)\}\}/)[1]
        super(content, { code })
    }
}




