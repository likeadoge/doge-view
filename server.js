// 引入koa
const koa = require('koa');
const path = require('path')
const static = require('koa-static');
// 读取端口参数
const port = process.argv.find(v => v === '-p' || v === '--port') ?
    Number(process.argv[process.argv.findIndex(v => v === '-p' || v === '--port') + 1]) :
    3000 // 默认端口

if (!port || port < 1024 || port > 65535) {
    throw new Error(`invalid portnumber`)
}

const app = new koa();

// 配置静态web服务的中间件
app.use(static(path.resolve(process.cwd(), './')));
// 监听端口
app.listen(port, function() {
    console.log(`启动成功!`);
    console.log(`http://localhost:${port}`);
})