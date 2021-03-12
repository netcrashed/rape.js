//github.com/netcrashed/rape.js
class Rape{
constructor(file,conf){
this._='20210313';
this.canvas=file||null;
this.config=conf||{};
console.log('//github.com/netcrashed/rape.js?'+this._);
};
code(part,exec){
if(typeof(exec)=='undefined'){return [...new Uint8Array(part)].map(b=>b.toString(16).padStart(2,'0')).join('');}
else if(exec){let temp='';while(part.length>2){temp+=part.slice(-2);part=part.slice(0,-2);};return temp+part;}
else{return part;};
};
read(from,till){
return new Promise((resolve,reject)=>{
if(typeof(this.canvas)=='object'){
this.length=this.canvas.size;
if(this.length<60){return reject('read:length');};
if(!from||from<0){from=from?(this.length+from):0;};
if(!till||till<0){till=this.length+(till||0);};
if(till>this.length){till=this.length;};
this.reader=this.reader||new FileReader();
this.reader.readAsArrayBuffer(this.canvas.slice(from,till));
this.reader.onerror=()=>{return reject('read:error');};
this.reader.onload=()=>{return resolve(this.code(this.reader.result));};
}
else if(typeof(this.canvas)=='string'&&this.canvas.slice(0,4)=='blob'){
if(this.reader){
if(!from||from<0){from=from?(this.length+from):0;};
if(!till||till<0){till=this.length+(till||0);};
if(till>this.length){till=this.length;};
return resolve(this.code(this.reader.response.slice(from,till)));
}
else{
this.reader=new XMLHttpRequest;
this.reader.responseType='arraybuffer';
this.reader.onerror=()=>{return reject('read:error');};
this.reader.onload=()=>{
this.length=this.reader.response.byteLength;
if(this.length<60){return reject('read:length');};
if(!from||from<0){from=from?(this.length+from):0;};
if(!till||till<0){till=this.length+(till||0);};
if(till>this.length){till=this.length;};
return resolve(this.code(this.reader.response.slice(from,till)));
};
this.reader.open('GET',this.canvas);
this.reader.send(null);
};
}
else if(typeof(this.canvas)=='string'&&this.canvas.slice(0,4)=='data'){
let head=this.canvas.indexOf(',')+1;if(head<=0){return reject('read:error');};
this.length=(this.canvas.length-head)*0.75-(this.canvas.slice(-2).match(/=/g)||[]).length;
if(this.length<60){return reject('read:length');};
if(!from||from<0){from=from?(this.length+from):0;};
if(!till||till<0){till=this.length+(till||0);};
if(till>this.length){till=this.length;};
return resolve(this.code(Uint8Array.from(atob(this.canvas.slice(head+Math.floor(from/3)*4,head+Math.ceil(till/3)*4)),c=>c.charCodeAt(0)).buffer.slice(from%3,(till%3||3)-3||this.length)));
}
else{return reject('read:input');};
});
};
bath(){
return new Promise((resolve,reject)=>{
if(typeof(this.canvas)=='object'&&this.config._dataurl){
let reader=new FileReader();
reader.readAsDataURL(this.canvas);
reader.onerror=()=>{return reject('bath:error');};
reader.onload=()=>{this.canvas=reader.result;return resolve();};
}
else if(typeof(this.canvas)=='string'&&(this.canvas.slice(0,4)=='blob'||!this.config._dataurl)){
let reader=new XMLHttpRequest;
reader.responseType='blob';
reader.onerror=()=>{return reject('bath:error');};
reader.onload=()=>{
if(!this.config._dataurl){this.canvas=reader.response;return resolve();};
let _reader=new FileReader();
_reader.readAsDataURL(reader.response);
_reader.onerror=()=>{return reject('bath:error');};
_reader.onload=()=>{this.canvas=_reader.result;return resolve();};
};
reader.open('GET',this.canvas);
reader.send(null);
}
else{return resolve();};
});
};
async init(){
if(!this.canvas){return Promise.reject('init:canvas');};
let head=await this.read(0,41);
if(head.slice(0,16)=='89504e470d0a1a0a'){this.format='png';if(head.slice(74,82)=='6163544c'){this.animate=true;};}
else if(head.slice(0,6)=='ffd8ff'){this.format='jpg';}
else if(head.slice(0,4)=='424d'){this.format='bmp';}
else if(head.slice(0,8)=='00000100'){this.format='ico';}
else if(head.slice(0,8)=='00000200'){this.format='ico';this.detail='cur';}
else if(head.slice(0,12)=='474946383761'){this.format='gif';this.detail='gif87';}
else if(head.slice(0,12)=='474946383961'){this.format='gif';this.detail='gif89';}
else if(head.slice(0,8)=='52494646'&&head.slice(16,24)=='57454250'){this.format='webp';if(head.slice(24,32)=='56503858'&&parseInt(head.slice(40,42),16).toString(2).slice(-2,-1)==1){this.animate=true;};}
else{return Promise.reject('init:format');};
if(this.format=='jpg'){
let skip=0;switch(head.slice(4,8)){case 'ffe0':skip=parseInt(head.slice(8,12),16)+8;break;case 'ffe1':skip=6;break;};
if(skip){
let chip=((skip*2+28)>head.length)?await this.read(skip,skip+14):head.slice(skip*2,skip*2+28);
if(chip.slice(0,8)=='45786966'){
let lend=(chip.slice(12,16)=='4949');skip+=parseInt(this.code(chip.slice(20,28),lend),16)+6;
chip=((skip*2+4)>head.length)?await this.read(skip,skip+2):head.slice(skip*2,skip*2+4);
let loop=parseInt(this.code(chip,lend),16);skip+=2;
chip=await this.read(skip,skip+loop*12);
for(let i=0;i<loop;i++){if(['0112','1201'].indexOf(chip.slice(i*24,i*24+4))>=0){this.rotate=parseInt(this.code(chip.slice(i*24+16,i*24+20),lend),16);break;};};
};
};
};
if(this.format=='gif'&&this.detail=='gif89'){
let from=0,find=0;
while(from>=0&&find<2){
find+=((await this.read(from,from+102420)).match(/21f904.{8}00(2c|21)/g)||[]).length;
if(from+102420>=this.length){from=-1;}else{from+=102400;};
};
if(find>=2){this.animate=true;};
};
if(this.reader){delete this.reader;};
return Promise.resolve(this);
};
async conv(){
await this.init();
if(!this.config[this.format]){await this.bath();return Promise.resolve(this);};
let cfg=this.config[this.format].normal?this.config[this.config[this.format].normal]:{};
if(this.animate&&typeof(this.config[this.format].animate)!='undefined'){
if(this.config[this.format].animate){cfg=this.config[this.config[this.format].animate];}
else{await this.bath();return Promise.resolve(this);};
};
if(cfg.format=='image/webp'&&typeof(this.config[this.format].nowebp)!='undefined'){
let cvs=document.createElement('canvas');cvs.getContext('2d');
if(cvs.toDataURL('image/webp').indexOf('data:image/webp')!=0){
if(this.config[this.format].nowebp){cfg=this.config[this.config[this.format].nowebp];}
else{await this.bath();return Promise.resolve(this);};
};
};
return new Promise((resolve,reject)=>{
let img=new Image();
img.src=(typeof(this.canvas)=='object')?URL.createObjectURL(this.canvas):this.canvas;
img.onload=()=>{
let fix=(typeof(img.style['image-orientation'])=='undefined')?true:(['','from-image'].indexOf(img.style['image-orientation'])<0);
if(typeof(this.canvas)=='object'){URL.revokeObjectURL(img.src);};
let width=img.width,height=img.height,ratio=width/height,topple=false;
if(fix&&(this.rotate==6||this.rotate==8)){
width=img.height;height=img.width;ratio=width/height;topple=true;
};
if(cfg.width&&width>cfg.width&&cfg.height&&height>cfg.height){
if(cfg.height>cfg.width/ratio){width=cfg.width;height=width/ratio;}
else{height=cfg.height;width=height*ratio;};
}
else if(cfg.width&&width>cfg.width){width=cfg.width;height=Math.round(width/ratio);}
else if(cfg.height&&height>cfg.height){height=cfg.height;width=Math.round(height*ratio);};
this.canvas=document.createElement('canvas');
this.canvas.width=width;
this.canvas.height=height;
let ctx=this.canvas.getContext('2d');
if(fix){
switch(this.rotate){
case 3:ctx.translate(width,height);ctx.rotate(Math.PI);break;
case 6:ctx.translate(width,0);ctx.rotate(Math.PI/2);break;
case 8:ctx.translate(0,height);ctx.rotate(Math.PI/-2);break;
};
};
ctx.fillStyle=cfg.fill||'transparent';
ctx.fillRect(0,0,width,height);
if(cfg.render){for(let key in cfg.render){ctx[key]=cfg.render[key];};};
ctx.drawImage(img,0,0,img.width,img.height,0,0,topple?height:width,topple?width:height);
if(this.config._dataurl){this.canvas=this.canvas.toDataURL(cfg.format||'image/png',cfg.quality||0.9);return resolve(this);}
else{this.canvas.toBlob((blob)=>{this.canvas=blob;return resolve(this);},cfg.format||'image/png',cfg.quality||0.9);};
};
img.onerror=()=>{return reject('conv:load');};
});
};
};