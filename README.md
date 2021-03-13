**rape.js**  
开源前端图片处理脚本
***
**图片读取：Blob/ObjectUrl/DataURL**  
渐进式读取字节，类型转换省内存  
**格式判断：PNG/JPG/BMP/ICO/GIF/WEBP**  
文件头精准检测，并非读取扩展名  
**方向修正：JPG**  
扫描并自动旋转，兼容浏览器修正  
**动画检测：PNG/GIF/WEBP**  
扫描是否为动图，单独设置不压缩  
**水印添加：DataURL**  
可限制最小宽高，坐标支持百分比  
**压缩输出：PNG/JPG/WEBP**  
可限制最大宽高，设置质量与格式  
***
**【扫描】**  
```
// 创建Rape对象
// file: 图片文件
new Rape(file).init()
.then((res)=>{
// 成功输出控制台
console.log(res);
})
.catch((err)=>{
// 失败输出控制台
console.log('err:'+err);
});
```
***
**【转换】**  
```
// 定义设置对象
let conf={
_chop:{url:'tits.png',width:400,height:200,x:0.5,y:-80},
// _chop:(undefined)||null||false 不添加水印
// url: 水印图片 同域名URL或Base64编码的DataURL
// url:(undefined)||null||false 不添加水印
// width: 原图达到此宽度才添加水印
// width:(undefined)||null||false 0
// height: 原图达到此高度才添加水印
// height:(undefined)||null||false 0
// x: 顶点横坐标 负数为从右到左 0-1小数为中轴百分比
// x:(undefined)||null||false 0
// y: 顶点纵坐标 负数为从下到上 0-1小数为中轴百分比
// y:(undefined)||null||false 0
_dataurl:true,
// _dataurl:true 输出Base64编码的DataURL
// _dataurl:(undefined)||null||false 输出Blob对象
_png:{width:500,height:500,fill:null,format:'image/png',quality:0.8,render:{}},
_jpg:{width:500,height:500,fill:'#FFF',format:'image/jpeg',quality:0.8},
_webp:{width:500,height:500,fill:null,format:'image/webp',quality:0.8},
// _*: 输出格式模板 对象键名任意
// width: 转换后最大宽度
// width:(undefined)||null||false 不限制
// height: 转换后最大高度
// height:(undefined)||null||false 不限制
// fill: 背景填充色
// fill:(undefined)||null||false 透明
// format:image/png||image/jpeg||image/webp 输出格式选项 
// format:(undefined)||null||false image/png
// quality:<0.01-1> 压缩比例 输出格式image/png无视该项
// quality:(undefined)||null||false 0.9
// render:{} CanvasRenderingContext2D 渲染属性
// render:(undefined)||null||false 使用浏览器默认
png:{normal:'_webp',nowebp:'_png',animate:false},
jpg:{normal:'_webp',nowebp:'_jpg'},
bmp:{normal:'_webp',nowebp:'_jpg'},
ico:null,
gif:{normal:'_webp',nowebp:'_jpg'},
webp:{normal:'_webp',nowebp:'_png',animate:false},
// png|jpg|bmp|ico|gif|webp: 指定格式设置
// normal: 常规输出使用哪个模板
// normal:(undefined)||null||false 使用脚本默认
// nowebp: 浏览器不支持webp输出时使用哪个模板
// nowebp:(undefined) 继承normal模板
// nowebp:null||false 不压缩直接输出
// animate: 图片检测到动画时使用哪个模板
// animate:(undefined) 继承normal模板
// animate:null||false 不压缩直接输出
};
// 创建Rape对象
// file: 图片文件
// conf: 转换设置
new Rape(file,conf).conv()
.then((res)=>{
// 成功输出控制台
console.log(res);
})
.catch((err)=>{
// 失败输出控制台
console.log('err:'+err);
});
```
***
**【演示】**  
<https://netcrashed.github.io/rape.js>
