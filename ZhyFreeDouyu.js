/*---------------Copyright Notices-------------------
每一个工程都是作者几十个甚至几百个小时的尝试和思考,
开源全取决于作者是否愿意,如果成果因此被盗用或篡改,极有
可能影响程序界的开源气氛,请务必保留版权信息,帮助作者
,并借此鼓励更好的作品能够开源学习.

版权人:郑怀宇
QQ:854185073
Phone:17605003570
----------------------------------------------------*/
var Version=1.0//"当前版本,约25KB",最新版随时可以从https://www.zhy.im/zhyproj/ZhyFreeDouyu.js下载
//==============Settings================
var qq="";//qq账号
var pswd="";//qq密码(用于连接微云API)
var Port=1111;//端口号(Linux下<1024需要Root权限.注意端口转发以开放给外网)
//=====================================
var fs=require("fs");
var https=require("https");
var http=require("http");
var crypto=require("crypto");
var bufhelper = require('bufferhelper');//请使用npm install bufferhelper安装本模块
var ThreadIDs=[];
var U=require('url');
var list=[];
var toUpload=[];
var QueueId=0;
var NowId=0;
var stream;
var RID="暂未指定";
var CK="";
var skey="";
var DataFolder="ZhyDataFolder"
var coverUrl="";
var keep=false;
var toclean=[];
var danmulist=[];
for(let x=0;x<100000;x++)danmulist.push([]);
var dir_key="";
var roomname="请指定一个房间号";
var qqrsa=require("./qqrsa.js");
//var page1=fs.readFileSync("page1");
clearStream();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
function getDirKey(dirname,callback){//FromMainDir
	UrlGet("https://www.weiyun.com/disk/index.html",(data)=>{
	
		let main_dir_key=substr(data,",\"main_dir_key\":\"","\",\"max_batch_dir_attr_modify_number");
		
		UrlGet("https://user.weiyun.com/newcgi/qdisk_get.fcg?cmd=2209&g_tk="+g_tk()+"&wx_tk=5381&data=%7B%22req_header%22%3A%7B%22cmd%22%3A2209%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskDirBatchListMsgReq_body%22%3A%7B%22dir_list%22%3A%5B%7B%22get_type%22%3A0%2C%22start%22%3A0%2C%22count%22%3A100%2C%22sort_field%22%3A2%2C%22reverse_order%22%3Afalse%2C%22get_abstract_url%22%3Atrue%2C%22dir_key%22%3A%22"+main_dir_key+"%22%2C%22dir_name%22%3A%22%22%7D%5D%7D%7D%7D%7D",(json)=>{
			
			
			
			//console.log(json);
			let obj=JSON.parse(json);
			//console.log(obj);
			if(!isObject(obj)||!isObject(obj.rsp_body.RspMsg_body['weiyun.DiskDirBatchListMsgRsp_body'])){console.log("错误:请检查微云目录下是否存在需要的"+dirname+"数据目录");process.exit();return;}
			let ListArr=obj.rsp_body.RspMsg_body['weiyun.DiskDirBatchListMsgRsp_body'].dir_list;
			for(i in ListArr){
				//console.log(ListArr[i].dir_list);
				if(ListArr[i].dir_list[0]['dir_name']==dirname){
				callback(ListArr[i].dir_list[0]['dir_key']);
				return;
				}
			}
		console.log("错误:请检查微云目录下是否存在需要的"+dirname+"数据目录");process.exit();return;
		},"",CK);
	},"",CK)
	
	
}
var CookieUpdater=()=>{
	let cooki="";
		UrlGet("http://check.ptlogin2.qq.com/check?regmaster=&pt_tea=1&uin="+qq+"&appid=715030901&js_ver=10114&js_type=1&login_sig=xiZxkDUforw0tCgxtXwxayR*GniKvthKM0WiwiNJiD4TjdQuFhhzeQok7Wy2VgEs&u1=http%3A%2F%2Fqun.qq.com%2F&r=",(dt,{},cooki)=>{
			//console.log(dt);
		let tmparr=substr(dt+"","ptui_checkVC(","');").split(",");
		let verCode=substr(tmparr[1],"'","'");
		//let salt=substr(tmparr[2],"'","'");
		let salt=""+qq+"";
		let verifysession_v1=substr(tmparr[3],"'","'");
		let encryptedpw=qqrsa.getEncryption(pswd,salt,verCode,"");

		//console.log(pswd+":"+salt+":"+verCode+":"+encryptedpw);

		UrlGet("http://ptlogin2.qq.com/login?u="+qq+"&p="+encodeURIComponent( encryptedpw)+"&verifycode="+verCode+"&aid=715030901&u1=http%3A%2F%2Fqun.qq.com%2F&h=1&ptredirect=1&ptlang=2052&daid=73&from_ui=1&dumy=&low_login_enable=0&regmaster=&fp=loginerroralert&action=5-16-1426352948143&mibao_css=&t=1&g=1&js_ver=10114&js_type=1&login_sig=xiZxkDUforw0tCgxtXwxayR*GniKvthKM0WiwiNJiD4TjdQuFhhzeQok7Wy2VgEs&pt_uistyle=17&pt_randsalt=0&pt_vcode_v1=0&pt_verifysession_v1="+verifysession_v1,(dtt,{},cooki)=>{
			if(dtt.indexOf("登录成功")==-1){console.log("登录失败,可能账号密码错误或者登录环境异常.");process.exit();}
			
			//UrlGet("http://ptlogin2.qq.com/pt4_auth?daid=1&appid=1006102&auth_token=")
			let sigurl=substr(dtt+"","ptuiCB('0','0','","','");
			
			UrlGet(sigurl,(sigdata,{},cooki)=>{
		CK=cooki;
	    skey=substr(CK,"skey=",";");
		
		
getDirKey(DataFolder,(key)=>{
	dir_key=key;
	console.log("数据目录"+DataFolder+"的Dir_Key获取成功:"+key+"\n");
	
});

		console.log("================================================================================\nCookie更新成功:"+CK+"\n================================================================================\n");
				
			},"",cooki)
	
		},"",cooki);
		
	},"","");
	
}
CookieUpdater();setInterval(CookieUpdater,3600*10*1000)//10分钟一次更新Cookie

//============DouyuDanmu Client Written In Nodejs By Zhy=========================
var net = require('net');
var cli = new net.Socket();
var server="openbarrage.douyutv.com";
var port=8601;
var RoomID=0;

if(qq==""||pswd==""){console.log("请打开JS源码文件,正确修改Settings项");process.exit();}
setInterval(()=>{if(danmulist.length>100)danmulist.shift();},8000);

function senddata(data){
	let bfhp=new bufhelper();
	let buf=new Buffer(12);
	//console.log(data+"\n");
	buf.writeInt32LE(4+2+1+1+data.length+1,0);
	buf.writeInt32LE(4+2+1+1+data.length+1,4);
	buf.writeInt16LE(689,8);
	buf.writeInt16LE(0,10);
	
	
	bfhp.concat(buf);
	bfhp.concat(new Buffer(data));
	bfhp.concat(new Buffer([0]));//0
	//console.log(bfhp.toBuffer().toString('hex'));
	cli.write(bfhp.toBuffer());
	
}

let recon=(e)=>{console.log("与弹幕服务器失去连接,正在重连");setTimeout(()=>JoinRoom(RoomID),3000)};
let datarecevier=(data)=>{let body=(data+"").substr(12);let obj=unserialize(body);switch(obj.type){case "chatmsg":danmulist[NowId].push(obj.txt);break;}};

function JoinRoom(room){
	RoomID=room;
	//===Connect to server======
cli.destroy();
cli=new net.Socket();

cli.on('data',datarecevier);
cli.on("close",recon)
cli.on("error",recon)//三秒后重连

console.log(cli.connect(port,server,()=>{})?"连接弹幕服务器成功":"连接弹幕服务器失败");

	let LoginPacket={
		type:'loginreq',
		roomid:room+""
	}
	senddata(serialize(LoginPacket));
	let JoinGroupPacket={
		type:'joingroup',
		rid:room,
		gid:-9999
	}
	senddata(serialize(JoinGroupPacket));
}
function unixtime(){return (Date.now()+"").substr(0,10);}
function serialize(json){//ZhyIdea
	let result="";
	for(key in json){
		let re="";
			if(isNaN(key))re=key+"@=";
if(json[key] instanceof Object)re+=serialize(json[key]);
	else 
	
		re+=(json[key]+"").replace(/@/g,"@A").replace(/\//g,"@S");
	re+="/";
	result+=re;
	
	}
	return result;
}
function unserialize(str){//ZhyIdea
	let result={};
	let arr=str.split("/");
	for(i in arr){
	let datas=arr[i].split("@=")
	if(datas.length==2)
		result[datas[0]]=datas[1];
	}
	return result;
}
var danmusyncthread=()=>{
	
	
	
}
var heartBeatThread=()=>{
	if(RoomID==0)return;
	let HeartBeatPacket={
		type:'keeplive',
		tick:unixtime()
	}
	senddata(serialize(HeartBeatPacket));
}
//console.log(serialize([1,2,3]));
setInterval(heartBeatThread,30000);

function clearStream(){
stream=new Array(10000);
for(let i=0;i<10000;i++)
stream[i]=[" "," "];
}
function getFileID(len,filesha,callback){
	//console.log(dir_key);
	UrlGet("http://user.weiyun.com/newcgi/qdisk_get.fcg?cmd=2208&g_tk="+g_tk()+"&data=%7B%22req_header%22%3A%7B%22cmd%22%3A2209%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskDirBatchListMsgReq_body%22%3A%7B%22pdir_key%22%3A%22"+dir_key+"%22%2C%22dir_list%22%3A%5B%7B%22get_type%22%3A0%2C%22start%22%3A0%2C%22count%22%3A100%2C%22sort_field%22%3A2%2C%22reverse_order%22%3Afalse%2C%22get_abstract_url%22%3Atrue%2C%22dir_key%22%3A%22"+dir_key+"%22%2C%22dir_name%22%3A%22"+DataFolder+"%22%7D%5D%7D%7D%7D%7D"
			,(sstr)=>{
				//console.log(len+";"+filesha+"\n");
//console.log(sstr);


				callback(substr(substr(sstr,"file_cursize\":"+len,"file_sha\":\""+filesha),"file_id\":\"","\",\"file_md5"));
			}
			,"",CK);
}
function ip2num(dot){
	let d=dot.split(".");

	if(d.length>=4)
		return parseInt(d[3])*Math.pow(2,24)+parseInt(d[2])*Math.pow(2,16)+parseInt(d[1])*Math.pow(2,8)+parseInt(d[0]);
	return -1;
}
function sha1(data){
	let s=crypto.createHash('sha1');
	s.update(data);
	return s.digest('hex');
}
function g_tk(){
	let base=5381;let len=skey.length;
	for(let i=0;i<len;i++){
		base+=(base<<5)+skey.charCodeAt(i);
	}
	return (base&2147483647)+"";
}
function randomstr(){return Math.random().toString(36).substr(2);}
function substr(str,start,end){
	var i=str.indexOf(start)+start.length;
	return str.substring(i,str.indexOf(end,i));
}
function UrlGet(url,end,str="",cookie="",bin=false){
if(url.indexOf("://")==-1)return;
let pro;
if(url.indexOf("https://")!=-1)
pro=https; else pro=http;

var options=U.parse(url);

	 options.headers={
	  "Cache-Control": "no-cache",
	  "Connection": "close",
	   "Content-Type": "application/x-www-form-urlencoded",
	  "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
	  //非浏览器Agent,斗鱼不会正常返回直播视频地址,这招有点6
	   "Referer":url,
"X-Requested-With":"XMLHttpRequest"
	 }
	 if(typeof cookie!="undefined" && cookie!="")
	 options.headers["Cookie"]=cookie;
 //console.log(options);
 
pro.get(options,(res)=>{
	//console.log(res.headers);
let buf=new bufhelper();
res.on("data",(c)=>buf.concat(c));
res.on("error",(err)=>console.log(err));
let cok="";
let tmparr={};
for(c in res.headers['set-cookie']){
	let ar=res.headers['set-cookie'][c].split(";");
	for(x in ar){
		let s=ar[x].split('=');
		if(typeof s[0]!="undefined"&& typeof s[1]!="undefined")
		if((s[0]+"").trim()!="" && (s[1]+"").trim()!="" )
tmparr[(s[0].trim())]=(s[1].trim());
	}
}
let ar=cookie.split(";");
for(x in ar)
{	let s=ar[x].split('=');
if(typeof s[0]!="undefined" && typeof s[1]!="undefined" )
if((s[0]+"").trim()!="" && (s[1]+"").trim()!="" )
tmparr[(s[0].trim())]=(s[1].trim());
}

for(c in tmparr)
	cok+=c+"="+tmparr[c]+";"

res.on("end",()=>end(bin?buf.toBuffer():buf.toBuffer().toString(),str,cok));
}).on("error",(e)=>{
console.log("错误:"+e+"\n");
});

}
function changeroom(roomid){
//if(RID>0)return false;
if(roomid=="undefined" || typeof roomid =="undefined" || roomid.length==0)return false;
roomname="加载房间信息中...";
console.log("已变更房间至:"+roomid+"\n");
RID=roomid;
JoinRoom(RID);
	for(let i in ThreadIDs){
		clearInterval(ThreadIDs[i]);
		clearTimeout(ThreadIDs[i]);
	}
/*		NowId=0;
	QueueId=0;

	list=[];
	toUpload=[];*/
	ThreadIDs=[];
	clearStream();
	


ThreadIDs.push(setInterval(streamthread,1800));
//for(let c=0;c<0;c++)

ThreadIDs.push(setInterval(uploadthread,100));


ThreadIDs.push(setTimeout(()=>{ThreadIDs.push(setInterval(serverthread,3000));ThreadIDs.push(setInterval(cleanthread,3000));},36000));
	
}
//UrlGet("http://www.baidu.com/",()=>{});

var hlsUrl="";
//var CK="XXXXXXXXXXXXXXXXXXX";
//==========↑已被自动更新Cookie取代!!↑==============

if(RID=="暂未指定")console.log("暂未提交房间号,待命中...\n");
var cleanthread=()=>
{
	
for(x in toclean)	{
	if((NowId-toclean[x].timeout)>20){
		console.log("清理垃圾:"+toclean[x].filename+",来自"+toclean[x].timeout+"秒\n");
		

	let rq_=(http.request({
			host:'user.weiyun.com',
			path:'/newcgi/qdisk_delete.fcg?cmd=2509&g_tk='+g_tk()+'&wx_tk=5381&callback=X_POST',
			port:80,
			method:"POST",
			headers:{
				'Cookie':CK,
				'User-Agent':'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
				'Referer':"https://user.weiyun.com/cdr_proxy.html",
				'X-Requested-With':"XMLHttpRequest",
				'Content-Type':"application/x-www-form-urlencoded"
			}
			
		},(res)=>{
		res.on("data",(d)=>{//console.log(d+"");
		let r=(http.request({
			host:'user.weiyun.com',
			path:'/newcgi/qdisk_recycle.fcg?cmd=2703&g_tk='+g_tk()+'&wx_tk=5381&callback=X_POST',
			port:80,
			method:"POST",
			headers:{
				'Cookie':CK,
				'User-Agent':'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
				'X-Requested-With':"XMLHttpRequest",
				'Content-Type':"application/x-www-form-urlencoded"
			}
			
		},(res)=>{/*res.on("data",(d)=>console.log(d+""))*/})
		
		);
		r.end("data=%7B%22req_header%22%3A%7B%22cmd%22%3A2703%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskRecycleClearMsgReq_body%22%3A%7B%7D%7D%7D%7D")
		
		
		
		r.on("error",(e)=>{});

		
		});
		
		
		
	}));
	rq_.end("data=%7B%22req_header%22%3A%7B%22cmd%22%3A2509%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskDirFileBatchDeleteExMsgReq_body%22%3A%7B%22file_list%22%3A%5B%7B%22ppdir_key%22%3A%22"+""+"%22%2C%22pdir_key%22%3A%22"+dir_key+"%22%2C%22file_id%22%3A%22"+toclean[x].fileid+"%22%2C%22filename%22%3A%22"+toclean[x].filename+"%22%7D%5D%7D%7D%7D%7D");
	rq_.on("error",(e)=>{});

		toclean.splice(x,1);
		
	}
	
}
	
	
}
function Unn(source){
	return unescape(source.replace(/\\/g,'%'));	
};
function getRoomInfo(func){
	
https.get("https://m.douyu.com/html5/live?roomId="+RID,
	(res)=>{
		let data='';
res.on('data',(c)=>data+=c);
res.on('end',()=>{
func(JSON.parse(data));
	
	});
});
}
function isObject(obj){
	return (obj && typeof obj!="undefined" && obj!="undefined" && obj!="");
}
var streamthread=()=>{
//hlsUrl="";
getRoomInfo((obj)=>{
if(!isObject(obj))roomname="房间信息读取错误"
	if(obj.data==null){roomname="该房间不存在"
	return;}
		//console.log(obj);
		coverUrl=obj.data.room_src;
		roomname=obj.data.room_name+"&nbsp;&nbsp;&nbsp;在线人数:"+obj.data.online;

keep=false;
//hlsUrl=substr(data,"hls_url\":\"","\",\"is_pass").replace(/\\/g,"").replace("http:","https:");
hlsUrl=obj.data.hls_url;
if(hlsUrl.indexOf("://")==-1){keep=true;return;}
let prefix="https://"+substr(hlsUrl,"https://","playlist.m3u8");
	UrlGet(hlsUrl,(wb)=>{
	let arr=wb.match(/#EXTINF:([\s\S]*?)\?wsApp=HLS/g);
	
if(arr==null || arr.length<3){keep=true;return;}

//console.log(arr);

		for(let ii in arr){
			let exist=false;
		for(let xx in list)
		if(list[xx]==arr[ii]){exist=true;break;}
		if(!exist){
			list.push(arr[ii]);
			let idn=substr(arr[ii],"\n","?wsApp=HLS");
		let tsUrl=prefix+idn;
QueueId++;

		UrlGet(tsUrl,(tsData,qn)=>{
			let name=randomstr().substr(0,7)+'.mp4';
			toUpload.push({"qid":qn,"id":name,"content":tsData});
			console.log("提交上传:ID="+qn+",name="+name);
		},QueueId,"",true);

		}
		}			
	});
	
});

	if(list.length>=15)
		list.shift();


	
};
var uploadthread=()=>{
	let data=toUpload.shift();
	if((typeof data)=="undefined")return;
	let sha=sha1(data.content);
	UrlGet("http://user.weiyun.com/newcgi/qdisk_upload.fcg?cmd=2301&g_tk="+g_tk()+"&data=%7B%22req_header%22%3A%7B%22cmd%22%3A2301%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%2C%22uin%22%3A"+qq+"%2C%22login_key%22%3A%22406a6839515234523034%22%2C%22login_keytype%22%3A1%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskFileUploadMsgReq_body%22%3A%7B%22ppdir_key%22%3A%22"+""+"%22%2C%22pdir_key%22%3A%22"+dir_key+"%22%2C%22upload_type%22%3A0%2C%22file_sha%22%3A%22"
	+sha+"%22%2C%22file_size%22%3A"+data.content.length+"%2C%22filename%22%3A%22"+data.id+"%22%2C%22file_exist_option%22%3A6%2C%22use_mutil_channel%22%3Atrue%7D%7D%7D%7D",(str)=>{
//console.log(str);

		let inside_upload_ip=substr(str,"inside_upload_ip\":\"","\",\"lib_id");
		let check_key=substr(str,"check_key\":\"","\",\"file_ctime");
		let buf=new bufhelper();
		//console.log(check_key);
		let pk="";
		pk+="------WebKitFormBoundaryBWmkjUTOhBur2xqR\r\n";
		pk+="Content-Disposition: form-data; name=\"json\"\r\n";
		pk+="\r\n";
		pk+="{\"uploadkey\":\""+check_key+"\",\"ftntoken\":\""+ip2num(inside_upload_ip)+"\",\"channelcount\":1,\"blocks\":[{\"sha\":\""+sha+"\",\"offset\":0,\"size\":"+data.content.length+"}],\"addchannel\":0}";
		pk+="\r\n------WebKitFormBoundaryBWmkjUTOhBur2xqR\r\n";
		pk+="Content-Disposition: form-data; name=\"data\"; filename=\""+data.id+"\"\r\n";
		pk+="Content-Type: text/plain\r\n";
		pk+="\r\n";
			buf.concat(new Buffer(pk));
		buf.concat(data.content);
		buf.concat(new Buffer("\r\n------WebKitFormBoundaryBWmkjUTOhBur2xqR--\r\n"));
		let bin=buf.toBuffer();
		let path="/ftnup/weiyun?method=createfile&uin="+qq+"&qua=web&filesha="+sha+"&filesize="+data.content.length+"&nettype=5&reqid="+randomstr().substr(0,8)+"&flag=0";
		let opt={
			host:'upload.weiyun.com',
			port:80,
			path:path,
			method:"POST",
			headers:{
				'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryBWmkjUTOhBur2xqR',
				'Content-Length':bin.length,
				'Cookie':CK,
				'User-Agent':'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
				'Referer':'http://upload.weiyun.com'+path
			}
		}

		let req=http.request(opt,(res)=>{

		res.on("data",(st)=>{
//console.log(st+"");



		getFileID(data.content.length,sha,(fileID)=>{
//console.log(data.content.length+";"+sha+";"+fileID+"\n");

			let rq=http.request({headers:{"Content-Type": "application/x-www-form-urlencoded",'Referer': 'http://user.weiyun.com/newcgi/qdisk_download.fcg?cmd=2402&g_tk='+g_tk()+'&wx_tk=5381&_=','User-Agent':'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)','Cookie':CK},host:"user.weiyun.com",path:"/newcgi/qdisk_download.fcg?cmd=2402&g_tk="+g_tk()+"&wx_tk=5381&_=",method:"POST",port:80},(res)=>
				{
					let ddd;
res.on("end",()=>{			//downloadCookie="FTN5K="+substr(ddd+"","cookie_value\":\"","\"")+";"
downloadCookie="FTN5K=6d02977e;"
				//	downloadLink="https://sh-btfs-v2-yun-ftn.weiyun.com"+substr(ddd+"","http://sh-btfs-v2.yun.ftn.qq.com:80","?fname=");
   downloadLink="http://sh-btfs-v2-yun-ftn.weiyun.com"+substr(ddd+"","http://sh-btfs-v2.yun.ftn.qq.com:80","?fname=");


		if((ddd+"").indexOf("sh-btfs-v2.yun.ftn.qq.com")<=0)
toUpload.push(data);
else
				{
	stream[data.qid]=[downloadLink,downloadCookie];
					let garbage={
						fileid:fileID,
						filename:data.id,
						timeout:NowId
					}
	toclean.push(garbage);}
	})
					res.on("data",(s)=>{
						ddd+=s;
			
	
					});
res.on("error",(e)=>{toUpload.push(data);});
					res.on("end",()=>{
if(typeof stream[data.qid]=="undefined" || stream[data.qid]=="")//上传失败
toUpload.push(data);

})
				}
			).on("error",(e)=>{toUpload.push(data);});
		rq.end("data=%7B%22req_header%22%3A%7B%22cmd%22%3A2402%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskFileBatchDownloadMsgReq_body%22%3A%7B%22file_list%22%3A%5B%7B%22file_id%22%3A%22"+encodeURIComponent(fileID)+"%22%2C%22filename%22%3A%22"+(data.id)+"%22%2C%22pdir_key%22%3A%22"+dir_key+"%22%7D%5D%7D%7D%7D%7D");
		}
		
		
		

		);
			//console.log(st+"");
		});	
		});

		req.write(bin);
		req.end();
		req.on('error',(e)=>{console.log("错误:"+e+"\n")});
	},data.qid,CK);
}
var serverthread=()=>{
	
	//console.log(stream);
if(!keep)
	NowId++;
	
}
changeroom(process.argv[2]+"");
/*
var sslop={
cert:fs.readFileSync("c.crt"),
key:fs.readFileSync("k.key")
}*/

//您也可以添加证书启用https的服务器,不过几乎没有差别.
//https.createserver(sslop,(req,res)=>{
var serverobj=http.createServer((req,res)=>{
	//console.log(req.url);
res.on("error",(e)=>console.log('错误:'+e));

	switch(req.url){
		case "/cover":
		res.end(coverUrl);
		break;
		case "/danmulist":
		let result="";
let Nid=NowId;/*
for(i in danmulist[(Nid-14)+""])
                result+="【"+danmulist[(Nid-14)+""][i]+"】&nbsp;&nbsp;&nbsp;";
for(i in danmulist[(Nid-13)+""])
		result+="【"+danmulist[(Nid-13)+""][i]+"】&nbsp;&nbsp;&nbsp;";*/
	result=Nid+"\n"
for(i in danmulist[(Nid-27)+""])
                result+=danmulist[(Nid-27)+""][i]+"\n";

	res.end(result);
		
		break;
case "/playlist.m3u8":
if(NowId>=0){

let content="";


content+="#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-ALLOW-CACHE:YES\n#EXT-X-TARGETDURATION:3\n#EXT-X-MEDIA-SEQUENCE:"+NowId+"\n\n";
content+="#EXTINF:3\n"+stream[NowId][0]+"\n";
content+="#EXTINF:3\n"+stream[NowId+1][0]+"\n";
content+="#EXTINF:3\n"+stream[NowId+2][0]+"\n";
res.writeHead(200,{'Content-Length':content.length,'Content-Type':'application/vnd.apple.mpegurl','Set-Cookie':stream[NowId][1]});

res.write(content);


}
res.end();
break;		
case "/":
	res.writeHead(200,{'Set-Cookie':"FTN5K=6d02977e;",'Content-type':'text/html'});
	
	res.end((page1+"").replace("{RoomNumber}",RID+"").replace("{RoomName}",roomname));
break;	
	default:
	if(req.url.indexOf("/XXXchange")==0){
let newroom=substr(req.url,"/XXXchange","end");
	changeroom(newroom);
	res.end("alert(\"已成功改变房间号至:"+newroom+",\\n请等待10至20秒后台自动缓存直播数据后即可观看直播间.\");window.location.reload();");
//res.end('暂时不开放更改房间的控制权给他人');	

}
	else
	res.end("page not found");
	break;
	}
	
});
serverobj.listen(Port);
serverobj.on("error",(err)=>console.log(err));
var page1='<!DOCTYPE html><html><head><title>Zhy斗鱼免流</title><meta http-equiv="content-type"content="text/html; charset=UTF-8"/><meta name="viewport"content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/><script src="https://www.zhy.im/CommentCoreLibrary.min.js"></script><link href="https://www.zhy.im/style.min.css"rel="stylesheet"/><script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.js"></script><script>function n(a){return document.getElementById(a)}function getRandomColor(){return parseInt(16777215*Math.random())}function play(){""==$("#vd").attr("src"),$("#vd").attr("src","playlist.m3u8"),$("#player").show(),n("vd").play()}function stop(){$("#vd").attr("src",""),$("#player").hide()}function showCover(){$.get("/cover",function(a){""!=a&&(n("body").style.backgroundImage="url("+a+")")})}function fullScreen(){var a=n("player");a.requestFullscreen?a.requestFullscreen():a.mozRequestFullScreen?a.mozRequestFullScreen():a.msRequestFullscreen?a.msRequestFullscreen():a.oRequestFullscreen?a.oRequestFullscreen():a.webkitRequestFullScreen()}var start,fullscreen=!1,LastDMID=-1,refreshdanmu=function(){$.get("/danmulist",function(a){var c,b=a.split("\\n");for(i in b)if(0==i){if(LastDMID==b[i])break;LastDMID=b[i]}else c={text:b[i],color:16777215,mode:1,size:16,dur:16e3},cm.send(c)})};setInterval(refreshdanmu,1500),start=function(){var fullscreenchange=function(){fullscreen=!fullscreen,fullscreen?screen.orientation.lock("natural"):(stop(),screen.orientation.unlock())};document.addEventListener("fullscreenchange",fullscreenchange),document.addEventListener("mozfullscreenchange",fullscreenchange),document.addEventListener("webkitfullscreenchange",fullscreenchange),document.addEventListener("msfullscreenchange",fullscreenchange),$("#change").click(function(){var newroom=$("#con").val();return""!=newroom&&($("#con").val(""),$.get("/XXXchange"+newroom+"endedXXX",function(data){eval(data)})),!1}),showCover()};</script></head><body id="body"style="margin:0;  background-image: url();background-repeat: no-repeat;background-size: 100%; background-x:0; background-y:0;"onload="start()"><div id="border"style=" "><!--<button onclick="fullScreen();">fullScreen</button>style="display:none;"--><div style="background-color:white;border:1px solid gray;position: absolute; top: 0; left: 0; bottom: 0; right: 0;  font-size:12px;margin:auto;height:180px;width:350px;"><div style="font-size:24px;font-weight:bold;">当前房间号:{RoomNumber}</div><div><hr/><div style="width:350px;height:200px;"><div style="font-weight:bold;color:gray;text-align:center;">{RoomName}</div><div style="margin:0 auto;width:280px;height:21px;"><button style="font-size:12px;color:blue;width:100%;margin-top:10px;"onclick="play();fullScreen();">进入直播间</button></div><div></div><div style="font-size:7px;margin:20px;">已测试完全支持的浏览器:安卓Chrome、Opera。半支持浏览器(无弹幕)：MIUI浏览器、QQ浏览器。不支持浏览器：PC上所有浏览器、安卓火狐浏览器。使用大王卡观看本页面直播无需任何流量。</div></div></div></div><div style="  line-height:35px;border-top:1px solid #585858;z-index:999;height:40px;position:absolute;bottom:0;left:0;right:0;background-color:#A0A0A0;"><form style="text-align:center;"><input type="number"style="width:auto;"id="con"></input><input style="font-size:12px;color:green;"type="submit"value="更换直播间"id="change"></input><label id="tip"style="display:none"></label></form></div><div class="m20 abp"id="player"width="960px"height="460px"style="background-color:0;"><video id="vd"width="960px"src="playlist.m3u8"height="460px"style="margin-top:5px;"autoplay></video><div id="commentCanvas"class="container"style="margin-top:5px;height:90%;"></div></div></div><script>window.addEventListener("load",function(){n("vd").width=screen.height;n("vd").height=screen.width;n("player").width=screen.height;n("player").height=screen.width;n("commentCanvas").width=screen.height;n("commentCanvas").height=screen.width;cm=new CommentManager(n(\'commentCanvas\'));cm.init();cm.clear();cm.start();stop();$("#player").css("-webkit-transform","rotate(90deg)")});</script></body></html>';
