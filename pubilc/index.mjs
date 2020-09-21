import Token, { TokenHeadNode, TokenSubHeadNode, TokenTailNode, TokenTextNode, TokenHtmlNode } from './framework/Token.mjs'
import {Parser} from './framework/Parser.mjs'
import {Ast} from './framework/Ast.mjs'

Token.scan(document.getElementById('tpl').innerHTML).flatMap(v =>
    [
        [TokenSubHeadNode, '#FFC0CB'],
        [TokenHeadNode, '#FFA500'],
        [TokenTailNode, '#FFE211'],
        [TokenTextNode, '#66ccff'],
        [TokenHtmlNode, '#39C5BB'],
    ].map(([Cls, color]) => {
        if (v.__proto__.constructor === Cls) {
            const span = document.createElement('span')
            span.innerText = v.content.split(' ').join('-')
            span.style.background = color
            return span
        } else {
            return null
        }
    })
).filter(v => !!v).forEach(span => {
    document.getElementById('app').appendChild(span)
})


console.log(Parser.gen(
    document.getElementById('tpl').innerHTML
))

console.log(Ast.gen(
    document.getElementById('tpl').innerHTML
))
