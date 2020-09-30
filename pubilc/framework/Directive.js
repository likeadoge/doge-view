export class Directive{
    static list = []
    use()
}


Directive.use('case',{
    onFragmentRender:({
        inputs,value,data
    },{
        submit,next
    })=>{
        if(!!value){
            submit(data)
            next(false)
        }else{
            submit(false)
            next(true)
        }
    }
})

Directive.use('loop',{
    onElementRender:()=>{
        
    }
})