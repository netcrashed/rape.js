//github.com/netcrashed/rape.js
class Rape{
constructor(part,conf){
this._='20210308';
this.config=conf;
this.format=null;
this.length=null;
this.rotate=null;
this.zygote=part;
console.log('//github.com/netcrashed/rape.js?'+this._);
};
lebe(part,exec){
if(!exec){return part;};
let tmp='';
while(part.length>2){tmp+=part.slice(-2);part=part.slice(0,-2);};
return tmp+part;
};
chew(part){
switch(typeof(part)){
case 'object':
if(!part.byteLength){return false;};
part=[...new Uint8Array(part)].map(b=>b.toString(16).padStart(2,'0')).join('');
break;
case 'string':
if(!part){return false;};
let raw=atob(part);part='';for(let i=0;i<raw.length;i++){let val=raw.charCodeAt(i).toString(16);part+=(val.length===2?val:'0'+val);};
break;
default:return false;break;
};
if(!part){return false;}
else if(part.slice(0,12)=='474946383961'||part.slice(0,12)=='474946383761'){this.format='gif';}
else if(part.slice(0,6)=='ffd8ff'){this.format='jpg';}
else if(part.slice(0,16)=='89504e470d0a1a0a'){this.format='png';}
else if(part.slice(0,4)=='424d'){this.format='bmp';}
else if(part.slice(0,8)=='00000100'||part.slice(0,8)=='00000200'){this.format='ico';}
else if(part.slice(0,8)=='52494646'&&part.slice(16,24)=='57454250'){this.format='webp';}
else{return false;};
if(this.format=='jpg'&&!CSS.supports('image-orientation','from-image')){
let apppos=part.indexOf('ffe1');
if(apppos>=0 && part.slice(apppos+8,apppos+16)=='45786966'){
let little=(part.slice(apppos+20,apppos+24)=='4949');
let offset=parseInt(this.lebe(part.slice(apppos+28,apppos+36),little),16)*2+apppos+20;
for(let i=0;i<parseInt(this.lebe(part.slice(offset,offset+4),little),16);i++){
if(['0112','1201'].indexOf(part.slice(offset+(i*24)+4,offset+(i*24)+8))>=0){
this.rotate=parseInt(this.lebe(part.slice(offset+(i*24)+20,offset+(i*24)+24),little),16);
break;
};
};
};
};
return true;
};
init(){
return new Promise((done,fail)=>{
if(typeof(this.zygote)=='object'){
let reader=new FileReader();
reader.readAsArrayBuffer(this.zygote.slice(0,CSS.supports('image-orientation','from-image')?12:65760));
reader.onload=()=>{this.length=this.zygote.size;this.chew(reader.result)?done(true):fail(false);};
reader.onerror=()=>{fail(false);};
}
else if(typeof(this.zygote)=='string' && this.zygote.slice(0,4)=='blob'){
let loader=new XMLHttpRequest;
loader.responseType='arraybuffer';
loader.onload=()=>{this.length=loader.response.byteLength;this.chew(loader.response.slice(0,CSS.supports('image-orientation','from-image')?12:65760))?done(true):fail(false);};
loader.onerror=()=>{fail(false);};
loader.open('GET',this.zygote);
loader.send(null);
}
else if(typeof(this.zygote)=='string' && this.zygote.slice(0,4)=='data'){
let header=this.zygote.indexOf(',');
if(header<0){fail(false);};
let tailer=this.zygote.indexOf('=');
this.length=Math.round((((tailer<0)?this.zygote.length:tailer)-header-1)*0.75);
this.chew(this.zygote.slice(header+1,header+(CSS.supports('image-orientation','from-image')?17:87681)))?done(true):fail(false);
}
else{fail(false);};
});
};
async info(){
if(!await this.init()){return false;};
return this;
};
async conv(){
if(!await this.init()){return false;};
return new Promise((done,fail)=>{
let img=new Image();
img.src=(typeof(this.zygote)=='object')?URL.createObjectURL(this.zygote):this.zygote;
img.onload=()=>{
let cfg=this.config[this.format]||{};
if(typeof(this.zygote)=='object'){URL.revokeObjectURL(img.src);};
let width=img.width,height=img.height,ratio=width/height,topple=false;
if(this.rotate==6||this.rotate==8){width=img.height;height=img.width;ratio=width/height;topple=true;};
if(cfg.width&&width>cfg.width&&cfg.height&&height>cfg.height){
if(cfg.height>cfg.width/ratio){width=cfg.width;height=width/ratio;}
else{height=cfg.height;width=height*ratio;};
}
else if(cfg.width&&width>cfg.width){width=cfg.width;height=Math.round(width/ratio);}
else if(cfg.height&&height>cfg.height){height=cfg.height;width=Math.round(height*ratio);};
let cvs=document.createElement('canvas');
cvs.width=width;
cvs.height=height;
let ctx=cvs.getContext('2d');
switch(this.rotate){
case 3:ctx.translate(width,height);ctx.rotate(Math.PI);break;
case 6:ctx.translate(width,0);ctx.rotate(Math.PI/2);break;
case 8:ctx.translate(0,height);ctx.rotate(Math.PI/-2);break;
};
ctx.fillStyle=cfg.fill||'transparent';
ctx.fillRect(0,0,width,height);
ctx.drawImage(img,0,0,img.width,img.height,0,0,topple?height:width,topple?width:height);
switch(cfg.output){
case 'Blob':cvs.toBlob((blob)=>{this.zygote=blob;done(this);},cfg.format||'image/webp',cfg.quality||0.9);break;
case 'DataURL':this.zygote=cvs.toDataURL(cfg.format||'image/webp',cfg.quality||0.9);done(this);break;
default:done(this);break;
};
};
img.onerror=()=>{fail(false);};
});
};
};