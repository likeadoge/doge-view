import Token,{Head,SubHead,Tail,Text,Html} from './framework/Token.mjs'

Token.scan(document.getElementById('tpl').innerHTML).flatMap(v =>
    [
        [SubHead,'#FFC0CB'],
        [Head,'#FFA500'],
        [Tail,'#FFE211'],
        [Text,'#66ccff'],
        [Html,'#39C5BB'],
    ].map(([Cls,color])=>{
        if(v.__proto__.constructor === Cls){
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


