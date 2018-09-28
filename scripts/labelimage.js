		$("#content").hide();
		var firstPos=true;
		var pos1=[0,0];
		var pos2=[0,0];
		var xmin;
		var xmax;
		var ymin;
		var ymax;
		var labels=[];
		var canvas=document.getElementById('my-canvas');
		var ctx=canvas.getContext("2d");
		var img=$('#image-view');
		var n=9;
		var activatedLabel={};
		var radios=document.getElementsByName('label-name');
		var data="";
		var files=[];
		var imageIndex=0;
		var labelsObjects=[];
		img.width(img.width()/n);
		ctx.canvas.height=img.height();
		ctx.canvas.width=img.width();
		$('#my-canvas').hide();
		$('#image-view').hide();
		$('#left-menu').hide();
		var initMousePosX;
		var initMousePosY;
		var endMousePosX;
		var endMousePosY;
		var drag=false;
		var w;
		var h;
		var showMenu=false;
		var sasKey="?sv=2017-11-09&ss=b&srt=sco&sp=rwdlac&se=2018-09-28T09:29:29Z&st=2018-09-28T01:29:29Z&spr=https&sig=65O1PUyi77SQr3Yp4dVOdPIWjPcmwDVm3W7pOvRrBmM%3D";
		var blobUri = 'https://machinelearningxml.blob.core.windows.net/';
		var res;
			$(document).on('click','.lista',function(){
				imageIndex=this.value;
				goToImage();
				
	});
	$(document).ready(function(){
		ctxUpdate();
		updateFiles();
		




	});

	function updateFiles(){
		$('#list-xml').html("");
			var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, sasKey);
	blobService.listBlobsSegmented('xmlfiles', null, function (error, results) {
    if (error) {
        // List blobs error
    } else {
    	res=results;
        for (var i = 0, blob; blob = results.entries[i]; i++) {
        	console.log(results.entries[i]);
            $('#list-xml').append("<li class='list-group-item'><a href='"+"https://machinelearningxml.blob.core.windows.net/xmlfiles/"+results.entries[i].name+"''>"+results.entries[i].name+"</a></li>");
        }
    }
});

	}


	function downloadAll(){
		for (var i = res.entries.length - 1; i >= 0; i--) {
			console.log(res.entries[i].name);
			$('#my_iframes').append("<iframe src='"+'https://machinelearningxml.blob.core.windows.net/xmlfiles/'+res.entries[i].name+"'></iframe>");
			//document.getElementById('my_iframe').src="https://machinelearningxml.blob.core.windows.net/xmlfiles/"+res.entries[i].name;
		}
	}

	function drawLabels(){
		for (var i=0; i<labelsObjects.length; i++){
			ctx.fillStyle = labelsObjects[i]['color'];
			ctx.fillRect(labelsObjects[i].pos1[0],labelsObjects[i].pos1[1],labelsObjects[i].labelx,labelsObjects[i].labely);
			ctx.stroke();
		}
	}

	function getCurrentMousePos(){
		
	}

	function setImages(input){
		$('#my-canvas').show();
		$('#image-view').show();
		$('#left-menu').show();
		$('#choose-files').hide();
		files=input.files;
		imageIndex=0;
		$('#image-view').remove();
		$('#my-canvas').remove();
		$("#image-div").append("<img id='image-view' src='dataset/dataR/"+files[imageIndex].name+"' >");
		$('#image-div').append("<canvas id='my-canvas' ></canvas>")
		setTimeout(function(){
		canvas=document.getElementById('my-canvas');
		ctx=canvas.getContext("2d");
		img=$('#image-view');	
		img.width(img.width()/n);
		ctx.canvas.height=img.height();
		ctx.canvas.width=img.width();
		img=$('#image-view');
		ctx=canvas.getContext("2d");
		ctxUpdate();
		updateFotosList();

		},1000);
		$("#content").show();

		//$('#image-view').attr('src','dataset/dataR/'+files[imageIndex].name);
		

	}

	function updateFotosList(){
		$('#fotos-list').html("");
		for(var i=0;i<files.length;i++){
			if (i==imageIndex){
			$('#fotos-list').append("<li class='list-group-item active lista' value='"+i+"'><p id='test'>"+files[i].name+"</p></li>");	
			}
			else{
				$('#fotos-list').append("<li class='list-group-item lista lista'  value='"+i+"'>"+files[i].name+"</li>");
			}
		}	
	}


	function goToImage(){
		$('#image-view').attr('src','dataset/dataR/'+files[imageIndex].name);
		clearView();
		updateFotosList();

	}



	function nextImage(){
		imageIndex++;
		$('#image-view').attr('src','dataset/dataR/'+files[imageIndex].name);
		clearView();
		updateFotosList();
	}

	function clearView(){
		pos1=[0,0];
		pos2=[0,0];
		xmin=0;
		xmax=0;
		ymin=0;
		ymax=0;
		data="";
		labelsObjects=[];
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}

	



	function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
	}

	function DisplayImage(input){
		if (input.files && input.files[0]){
			
			var read = new FileReader();
			read.onload = function(e){
			$('#image-view').attr('src', e.target.result).width(100).height(100);
			};
			read.readAsDataURL(input.files[0]);
		}

	}
	function addLabel(){
		var labelValue = $("#label-text").val();
		var setColor="rgba("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+", 0.7)";
		labels.push({text:labelValue, color:setColor});
		$("#label-text").val("");
		$("#label-view").append("<div style='padding: 4px'><input type='radio' aria-label='Radio button for following text input' name='label-name' value="+labelValue+" myColor='"+setColor+"' checked='' onchange='updateLabelVaue()'>"+labelValue+"</input></div> <br>");
		updateLabelVaue();

	}

	function updateLabelVaue(){
		for (var i=0; i<radios.length; i++){
			if (radios[i].checked){
				activatedLabel['name']=radios[i].value;	
				activatedLabel['color']=radios[i].attributes.myColor.value;
			}
		}		
	}

function download() {
	var fullPath = document.getElementById("image-view").src;
	var originalName = document.getElementById("image-view").src;
	var fileN;
	originalName = fullPath.replace(/^.*[\\\/]/, '');
	fileN=fullPath.replace(/^.*[\\\/]/, '');
	fileN=fileN.slice(0,-3);
	fileN+='xml';
	data += '<annotation> \n';
	data+= '<filename>'+originalName+'</filename> \n';
	for(var i=0; i<labelsObjects.length;i++){
		data+='<object> \n';
		data+='<name>'+labelsObjects[i].label_name+'</name> \n';
		data+='<bndbox> \n';
		data+='<xmin>'+labelsObjects[i].xmin+'</xmin> \n';
		data+='<xmax>'+labelsObjects[i].xmax+'</xmax> \n';
		data+='<ymin>'+labelsObjects[i].ymin+'</ymin> \n';
		data+='<ymax>'+labelsObjects[i].ymax+'</ymax> \n';
		data+='</bndbox> \n';
		data+='</object> \n';

	}
	data+='</annotation> \n';
/*
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', fileN);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  */
  uploadXml(data,fileN);
  updateFiles();
  nextImage();
}

function ctxUpdate(){
					$('#my-canvas').on('mousedown',function (e){
			initMousePosX=getMousePos(canvas,e).x;
			initMousePosY=getMousePos(canvas,e).y;
			pos1=[getMousePos(canvas,e).x,getMousePos(canvas,e).y];
			console.log(pos1);
			$("#first-coor").text("x1: " + pos1[0] +" y2:"+ pos1[1]);
			drag = true;
		});
		$('#my-canvas').on('mouseup',function(e){
			drag = false;
			ctx.clearRect(0,0,canvas.width,canvas.height);

			pos2=[getMousePos(canvas,e).x,getMousePos(canvas,e).y];
				console.log(pos2);
				labelx=pos2[0]-pos1[0];
				labely=pos2[1]-pos1[1];
				firstPos=true;
				$("#second-coor").text("x1: " + pos2[0] +" y2:"+ pos2[1]);
				
				xmin=Math.min(pos1[0],pos2[0])*n;
				xmax=Math.max(pos1[0],pos2[0])*n;
				ymin=Math.min(pos1[1],pos2[1])*n;
				ymax=Math.max(pos1[1],pos2[1])*n;
				labelsObjects.push({label_name:activatedLabel['name'],pos1:pos1,pos2:pos2,labelx:labelx,labely:labely,xmin:xmin,xmax:xmax,ymin:ymin,ymax:ymax, color:activatedLabel['color']});
			drawLabels();
		});
		$('#my-canvas').on('mousemove',function (e){
			if (drag){
				console.log('test123');
			endMousePosX=getMousePos(canvas,e).x;
			endMousePosY=getMousePos(canvas,e).y;
			w=endMousePosX-initMousePosX;
			h=endMousePosY-initMousePosY;
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.setLineDash([6]);
			ctx.strokeStyle="#FF0000";
  			ctx.strokeRect(initMousePosX, initMousePosY, w, h);
			}
		});
		}

function uploadXml(data,filename){
	
	var blobUri = 'https://machinelearningxml.blob.core.windows.net/';
	var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, sasKey);
	blobService.createBlockBlobFromText('xmlfiles', filename, data,  function(error, result, response){
         if (error) {
             alert('Upload filed, open browser console for more detailed info.');
             console.log(error);
         } else {
             alert('Upload successfully!');
         }
     });
}

