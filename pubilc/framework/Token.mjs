import {
    Attr, Event, Directive
} from './state.mjs'


export default class Token {
    static scan(template) {
        return [
            SubHead,
            Head,
            Tail,
            Text,
            Html,
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
        content.split(new RegExp(`((?:${Attr.re})|(?:${Event.re})|(?:${Directive.re}))`))
            .forEach(str => {
                if (new RegExp(Attr.re).test(str)) attrs.push(new Attr(str))
                else if (new RegExp(Event.re).test(str)) events.push(new Event(str))
                else if (new RegExp(Directive.re).test(str)) directives.push(new Directive(str))
            });

        console.log({
            attrs, events, directives
        })
        super(content, {
            attrs, events, directives
        })
    }
}

export class Head extends HeadCommon {
    static match = new RegExp(`(<\\!---\\s*(?:${[Attr.re, Event.re, Directive.re].map(v => `(?:${v}\\s*)`).join("|")})*--->)`)
}
export class SubHead extends HeadCommon {
    static match = new RegExp(`(<\\!--#\\s*(?:${[Attr.re, Event.re, Directive.re].map(v => `(?:${v}\\s*)`).join("|")})*--->)`)
}

export class Tail extends Token {
    static match = /(<\!---\/--->)/
}

export class Html extends Token {
    static match = /([\d|\D]*)/
}

export class Text extends Token {
    static match = /(\{\{[\w|\W]+?\}\})/
    constructor(content) {
        const code = content.match(/\{\{([\w|\W]+?)\}\}/)[1]
        super(content, { code })
    }
}




