var fs=require("fs");
var page1=fs.readFileSync("page1");
var https=require("https");
var http=require("http");
var crypto=require("crypto");
var bufhelper = require('bufferhelper');
var ThreadIDs=[];
var U=require('url');
var list=[];
var toUpload=[];
var QueueId=0;
var NowId=0;
var stream;
var RID=0;
var keep=false;
clearStream();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
function clearStream(){
stream=new Array(10000);
for(let i=0;i<10000;i++)
stream[i]=[];
}
function getFileID(len,filesha,callback){
	UrlGet("https://user.weiyun.com/newcgi/qdisk_get.fcg?cmd=2209&g_tk="+g_tk()+"&wx_tk=5381&data=%7B%22req_header%22%3A%7B%22cmd%22%3A2209%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskDirBatchListMsgReq_body%22%3A%7B%22pdir_key%22%3A%2271d4e932f338fdcb41c5dfa52b9ed888%22%2C%22dir_list%22%3A%5B%7B%22get_type%22%3A0%2C%22start%22%3A0%2C%22count%22%3A100%2C%22sort_field%22%3A2%2C%22reverse_order%22%3Afalse%2C%22get_abstract_url%22%3Atrue%2C%22dir_key%22%3A%2271d4e932f0a739ae12b58dcd423dce4a%22%2C%22dir_name%22%3A%22%E5%BE%AE%E4%BA%91%22%7D%5D%7D%7D%7D%7D"
			,(sstr)=>{
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
if(hlsUrl.indexOf("://")==-1)return;
let pro;
if(hlsUrl.indexOf("https://")!=-1)
pro=https; else pro=http;
var options=U.parse(url);
  options.headers={
	  "Cache-Control": "no-cache",
	  "Connection": "close",
	   "Content-Type": "application/x-www-form-urlencoded",
	  "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
	  //非浏览器Agent,斗鱼不会正常返回直播视频地址,这招有点6
	   "Referer":url,
	  "Cookie":cookie
  }
pro.get(options,(res)=>{
	//console.log(res.headers);
let buf=new bufhelper();
res.on("data",(c)=>buf.concat(c));
res.on("end",()=>end(bin?buf.toBuffer():buf.toBuffer().toString(),str));
}).on("error",(e)=>{
console.log("错误:"+e+"\n");
});

}
function changeroom(roomid){
RID=roomid;
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
	


ThreadIDs.push(setInterval(streamthread,2000));
for(let c=0;c<5;c++)
ThreadIDs.push(setInterval(uploadthread,100));

ThreadIDs.push(setTimeout(()=>ThreadIDs.push(setInterval(serverthread,3000)),16000));
	
}
var hlsUrl="";
var CK="pgv_pvi=6455331840; pgv_si=s5074096128; web_wx_rc=OCIPVZEAAV; pt2gguin=o0854185073; uin=o0854185073; skey=@9XUY4GtRx; p_uin=o0854185073; p_skey=t2sudhf-O8ot3pzryC3k2789xoIMvgmlSYQfx2gSjfU_; pgv_info=ssid=s5847756629; ts_last=www.weiyun.com/disk/index.html; pgv_pvid=3718656724; ts_uid=5389757868";
var skey=substr(CK,"skey=",";");
var streamthread=()=>{
//hlsUrl="";

https.get("https://m.douyu.com/html5/live?roomId="+RID,
	(res)=>{
		let data='';
res.on('data',(c)=>data+=c);
res.on('end',()=>{
keep=false;
hlsUrl=substr(data,"hls_url\":\"","\",\"is_pass").replace(/\\/g,"").replace("http:","https:");
if(hlsUrl.indexOf("://")==-1)return;
let prefix="https://"+substr(hlsUrl,"https://","playlist.m3u8");
	UrlGet(hlsUrl,(wb)=>{
	let arr=wb.match(/#EXTINF:([\s\S]*?)\?wsApp=HLS/g);
	
//if(arr==null || arr.length<3){keep=true;return;}

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
			let name=randomstr()+idn;
			toUpload.push({"qid":qn,"id":name,"content":tsData});
			console.log("提交上传:ID="+qn+",name="+name);
		},QueueId,"",true);

		}
		}			
	});
	if(list.length>=15)
		list.shift();
});
});
	
};
var uploadthread=()=>{
	let data=toUpload.shift();
	if((typeof data)=="undefined")return;
	let sha=sha1(data.content);
	UrlGet("https://user.weiyun.com/newcgi/qdisk_upload.fcg?cmd=2301&g_tk="+g_tk()+"&data=%7B%22req_header%22%3A%7B%22cmd%22%3A2301%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%2C%22uin%22%3A854185073%2C%22login_key%22%3A%22406a6839515234523034%22%2C%22login_keytype%22%3A1%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskFileUploadMsgReq_body%22%3A%7B%22ppdir_key%22%3A%2271d4e932f338fdcb41c5dfa52b9ed888%22%2C%22pdir_key%22%3A%2271d4e932f0a739ae12b58dcd423dce4a%22%2C%22upload_type%22%3A0%2C%22file_sha%22%3A%22"
	+sha+"%22%2C%22file_size%22%3A"+data.content.length+"%2C%22filename%22%3A%22"+data.id+"%22%2C%22file_exist_option%22%3A6%2C%22use_mutil_channel%22%3Atrue%7D%7D%7D%7D",(str)=>{
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
		let path="/ftnup/weiyun?method=createfile&uin=854185073&qua=web&filesha="+sha+"&filesize="+data.content.length+"&nettype=5&reqid="+randomstr().substr(0,8)+"&flag=0";
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
		getFileID(data.content.length,sha,(fileID)=>{
			let rq=https.request({headers:{"Content-Type": "application/x-www-form-urlencoded",'Referer': 'http://user.weiyun.com/newcgi/qdisk_download.fcg?cmd=2402&g_tk='+g_tk()+'&wx_tk=5381&_=','User-Agent':'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)','Cookie':CK},host:"user.weiyun.com",path:"/newcgi/qdisk_download.fcg?cmd=2402&g_tk="+g_tk()+"&wx_tk=5381&_=",method:"POST",port:443},(res)=>
				{
					res.on("data",(s)=>{
						downloadCookie="FTN5K="+substr(s+"","cookie_value\":\"","\"")+";"
					downloadLink=substr(s+"","download_url\":\"","\",\"encode_").replace("http://sh-btfs-v2.yun.ftn.qq.com:80","http://sh-btfs-v2-yun-ftn.weiyun.com");
					stream[data.qid]=[downloadLink,downloadCookie];
						//stream.push({link:downloadLink,qid:data.qid});
					});
res.on("error",(e)=>{toUpdate.push(data);});
					res.on("end",()=>{
if(typeof stream[data.qid]=="undefined")//上传失败
toUpdate.push(data);

})
				}
			).on("error",(e)=>{toUpdate.push(data);});
		rq.end("data=%7B%22req_header%22%3A%7B%22cmd%22%3A2402%2C%22appid%22%3A30013%2C%22version%22%3A2%2C%22major_version%22%3A2%7D%2C%22req_body%22%3A%7B%22ReqMsg_body%22%3A%7B%22weiyun.DiskFileBatchDownloadMsgReq_body%22%3A%7B%22file_list%22%3A%5B%7B%22file_id%22%3A%22"+encodeURIComponent(fileID)+"%22%2C%22filename%22%3A%22"+(data.id)+"%22%2C%22pdir_key%22%3A%2271d4e932f0a739ae12b58dcd423dce4a%22%7D%5D%7D%7D%7D%7D");
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
//if(!keep)
	NowId++;
	
}
changeroom("1819567");
var sslop={
cert:fs.readFileSync("c.crt"),
key:fs.readFileSync("k.key")
}
https.createServer(sslop,(req,res)=>{
	//console.log(req.url);
	switch(req.url){
case "/playlist.m3u8":
if(NowId>=10){
res.writeHead(200,{'Set-Cookie':stream[NowId][1]});
res.write("#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-ALLOW-CACHE:NO\n#EXT-X-TARGETDURATION:3\n#EXT-X-MEDIA-SEQUENCE:"+NowId+"\n\n");
res.write("#EXTINF:3\n"+stream[NowId][0]+"\n");
res.write("#EXTINF:3\n"+stream[NowId+1][0]+"\n");
res.write("#EXTINF:3\n"+stream[NowId+2][0]+"\n");}
res.end();
break;		
case "/":
	res.writeHead(200,{'Content-type':'text/html'});
	
	res.end(page1);
break;	
	default:
	if(req.url.indexOf("/XXXchange")==0){
let newroom=substr(req.url,"/XXXchange","end");
	changeroom(newroom);
	res.end("ChangeRoomSuccessTo:"+newroom);
	}
	else
	res.end("page not found");
	break;
	}
	
}).listen(1234);