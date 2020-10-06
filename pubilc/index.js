import {
    lexer,
    LexerLoopNode,
    LexerIfNode,
    LexerElseNode,
    LexerEndNode,
    LexerOverNode,
    LexerCodeNode,
    LexerTextNode
} from './framework/Lexer.js'
import { parser } from './framework/parser.js'
import { toAst } from './framework/ast.js'


lexer(document.getElementById('tpl').innerHTML).flatMap(v =>
    [
        [LexerLoopNode,'#FFA500'],
        [LexerOverNode,'#FFE211'],
        [LexerIfNode,'#FFC0CB'],
        [LexerElseNode,'#D80000'],
        [LexerEndNode,'#66ccff'],
        [LexerCodeNode,'#39C5BB'],
        [LexerTextNode,"#cccccc"]
    ].map(([Cls,color])=>{
        if(v instanceof Cls){
            const span = document.createElement('span')
            span.innerText = v.content.split(' ').join('-')
            span.style.background = color
            return span
        }else {
            return null
        }
    })
).filter(v=>!!v).forEach(span => {
    document.getElementById('app').appendChild(span)
})

console.log(parser(document.getElementById('tpl').innerHTML))

const ast = toAst(parser(document.getElementById('tpl').innerHTML),{
    times:null,
    list:null,
})
console.log(ast )

document.getElementById('ast').innerHTML = ast.toHtml({
    times: 3,
        list: [{
            type: 'text',
            text: 'test'
        }, {
            type: 'input',
            value: 'test'
        }, {

        }]
})
