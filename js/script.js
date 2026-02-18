$(document).ready(function(){
	
	// Run the init method on document ready:
	chat.init();
	
});
function testchange(){
			var working = false;
			var text = $('#text_answer').val();
			
			if(text.length == 0){
				return false;
			}
			
			if(working) return false;
			working = true;
			
			// Using our tzPOST wrapper function
			// (defined in the bottom):
			lastID = chat.data.receive;
			
			$.tzPOST('testChat',{chatText: text, lastid:chat.data.receive},function(r){
				working = false;
				
				if(r.error){
					chat.displayError(r.error);
				}
				else{
					$(".jspPane").html("");
					
				}
			});
			
			return false;
}
function change(lastID){
	//alert();
	chat.data.receive = lastID;
	$("#chatUsers > a").removeClass("select");
	$("#m_"+lastID).addClass("select");
	//php/ajax.php?action='+action,data,callback,'json'
	$.ajax({
		// tipo de llamado
		type: 'GET',
		// url del llamado a ajax
		url: 'php/ajax.php',
		// obtener siempre los datos mas actualizados
		cache: false,
		// tipo de datos de regreso
		dataType: "json",
		// datos del llamado
		data: {
			action : 'getChatpero',
			lastID: lastID    
		},
		// funcion en caso de exito
		success: function (data, textStatus, jqXHR) 
		{
			console.log(""+data.chats.length);
			$(".jspPane").html("");
			if(data.status == 0){
				$(".jspPane").html('<form onsubmit="return testchange();" action="">'+
				'<p style="color: black;">El usuario '+data.name+' ya cerro el chat, se pudo resolver su duda? Deje sus comentarios en la siguiente caja de texto.</p>'+
				'<textarea id="text_answer" rows="4" cols="50"></textarea>'+
				'<input type="submit" class="blueButton" value="Enviar">'+
				'</form>');
				
			}
			else{
				for(var i=0;i<data.chats.length;i++){
				chat.addChatLine(data.chats[i]);
				}
			}
			
			/*$("#loading").html("");
			if(data.msg !== undefined)
			{
				$.notify({			
					title: 'Error',
					icon: "images/danger.png",
					message: 'Error '+ data.msg,
				},{
					icon_type: 'image',
					type: 'lotus',
					delay: 5000
				});
				
				
			}*/
		   
			
		},
		// funcion en caso de error
		error: function (xhr, status, error) {
				console.log(""+error);
				/*$.notify({			
					title: 'Error',
					icon: "images/danger.png",
					message: error,
				},{
					icon_type: 'image',
					type: 'lotus',
					delay: 5000
				});*/
				
				
		}
	});            
	
	
	
}

var chat = {
	
	// data holds variables for use in the class:
	
	data : {
		lastID 		: 0,
		noActivity	: 0
	},
	
	// Init binds event listeners and sets up timers:
	
	init : function(){
		
		// Using the defaultText jQuery plugin, included at the bottom:
		$('#name').defaultText('Nickname');
		$('#email').defaultText('Email (Gravatars are Enabled)');
		
		// Converting the #chatLineHolder div into a jScrollPane,
		// and saving the plugin's API in chat.data:
		
		chat.data.jspAPI = $('#chatLineHolder').jScrollPane({
			verticalDragMinHeight: 12,
			verticalDragMaxHeight: 12
		}).data('jsp');
		
		// We use the working variable to prevent
		// multiple form submissions:
		
		var working = false;
		
		// Logging a person in the chat:
		
		$('#loginForm').submit(function(){
			
			if(working) return false;
			working = true;
			
			// Using our tzPOST wrapper function
			// (defined in the bottom):
			
			$.tzPOST('login',$(this).serialize(),function(r){
				working = false;
				
				if(r.error){
					chat.displayError(r.error);
				}
				else{ 
					chat.login(r.name,r.gravatar,r.val);
					
					
				}
			});
			
			return false;
		});
		// test chat
		
		
		// Submitting a new chat entry:
		
		$('#submitForm').submit(function(){
			
			var text = $('#chatText').val();
			
			if(text.length == 0){
				return false;
			}
			
			if(working) return false;
			working = true;
			
			// Assigning a temporary ID to the chat:
			var tempID = 't'+Math.round(Math.random()*1000000),
				params = {
					id			: tempID,
					author		: chat.data.name,
					gravatar	: chat.data.gravatar,
					receive		: chat.data.receive,
					text		: text.replace(/</g,'&lt;').replace(/>/g,'&gt;')
				};

			// Using our addChatLine method to add the chat
			// to the screen immediately, without waiting for
			// the AJAX request to complete:
			
			//chat.addChatLine($.extend({},params));
			
			// Using our tzPOST wrapper method to send the chat
			// via a POST AJAX request:
			
			$.tzPOST('submitChat',{chatText: text, id_receive: chat.data.receive},function(r){
				working = false;
				
				$('#chatText').val('');
				$('div.chat-'+tempID).remove();
				chat.data.lastID = r.insertID;
				params['id'] = r.insertID;
				chat.addChatLine($.extend({},params));
			});
			
			return false;
		});
		
		// Logging the user out:
		
		$('a.logoutButton').live('click',function(){
			
			$('#chatTopBar > span').fadeOut(function(){
				$(this).remove();
			});
			
			$('#submitForm').fadeOut(function(){
				$('#loginForm').css("display","show");
				//$('#name').value("");
				//$('#email').value("");
			});
			$('#chatUsers').html('');
			$('.jspPane').html("");
			$.tzPOST('logout');
			
			return false;
		});
		
		// Checking whether the user is already logged (browser refresh)
		
		$.tzGET('checkLogged',function(r){
			if(r.logged){
				chat.login(r.loggedAs.name,r.loggedAs.gravatar);
			}
		});
		
		// Self executing timeout functions
		
		(function getChatsTimeoutFunction(){
			chat.getChats(getChatsTimeoutFunction);
		})();
		
		(function getUsersTimeoutFunction(){
			chat.getUsers(getUsersTimeoutFunction);
		})();
		
	},
	
	// The login method hides displays the
	// user's login data and shows the submit form
	
	login : function(name,gravatar,type){
		
		chat.data.name = name;
		chat.data.gravatar = gravatar;
		chat.data.type = type;
		$('#chatTopBar').html(chat.render('loginTopBar',chat.data));
		
		$('#loginForm').fadeOut(function(){
			$('#submitForm').fadeIn();
			$('#chatText').focus();
		});
		
	},
	
	// The render method generates the HTML markup 
	// that is needed by the other methods:
	
	render : function(template,params){
		
		var arr = [];
		switch(template){
			case 'loginTopBar':
				arr = [
				'<span>',
				'<span class="name">',params.name,
				'</span><a href="" class="logoutButton rounded">Logout</a></span>'];
			break;
			
			case 'chatLine':
				var classes = "";
				if(chat.data.name == params.author)
					classes = "receive";
				else 
					classes = "send";
				arr = [
					'<div class="chat chat-',params.id,' rounded ',classes,'"><span class="gravatar"><img src="',params.gravatar,
					'" width="23" height="23" onload="this.style.visibility=\'visible\'" />','</span><span class="author">',params.author,
					':</span><span class="text">',params.text,'</span><span class="time">',params.time,'</span></div>'];
			break;
			
			case 'user':
				activo = "";
				
				arr = [
					'<a onclick="change(',params.id,')" id="m_',params.id,'"><div class="user" title="',params.name,'"><img src="',
					params.gravatar,'" width="30" height="30" onload="this.style.visibility=\'visible\'" /><span>',activo,'</span></div></a>'
				];
			break;
		}
		
		// A single array join is faster than
		// multiple concatenations
		
		return arr.join('');
		
	},
	
	// The addChatLine method ads a chat entry to the page
	
	addChatLine : function(params){
		
		// All times are displayed in the user's timezone
		
		var d = new Date();
		if(params.time) {
			
			// PHP returns the time in UTC (GMT). We use it to feed the date
			// object and later output it in the user's timezone. JavaScript
			// internally converts it for us.
			
			d.setUTCHours(params.time.hours,params.time.minutes);
		}
		
		params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+
					  (d.getMinutes() < 10 ? '0':'') + d.getMinutes();
		
		var markup = chat.render('chatLine',params),
			exists = $('#chatLineHolder .chat-'+params.id);

		if(exists.length){
			exists.remove();
		}
		
		if(!chat.data.lastID){
			// If this is the first chat, remove the
			// paragraph saying there aren't any:
			
			$('#chatLineHolder p').remove();
		}
		
		// If this isn't a temporary chat:
		if(params.id.toString().charAt(0) != 't'){
			var previous = $('#chatLineHolder .chat-'+(+params.id - 1));
			if(previous.length){
				previous.after(markup);
			}
			else chat.data.jspAPI.getContentPane().append(markup);
		}
		else chat.data.jspAPI.getContentPane().append(markup);
		
		// As we added new content, we need to
		// reinitialise the jScrollPane plugin:
		
		chat.data.jspAPI.reinitialise();
		chat.data.jspAPI.scrollToBottom(true);
		
	},
	
	// This method requests the latest chats
	// (since lastID), and adds them to the page.
	
	getChats : function(callback){
		$.tzGET('getChats',{lastID: chat.data.receive},function(r){
			
			
			if(r.status == 1 && r.chats.length != 0){
				leng = r.chats.length-1;
				if(r.chats[leng].id != chat.data.lastID){
					
					chat.addChatLine(r.chats[leng]);
					
					if(r.chats.length){
						chat.data.noActivity = 0;
						chat.data.lastID = r.chats[leng].id;
					}
					else{
						// If no chats were received, increment
						// the noActivity counter.
						
						chat.data.noActivity++;
					}
					
					if(!chat.data.lastID){
						chat.data.jspAPI.getContentPane().html('<p class="noChats">No chats yet</p>');
					}
				}
				
								
			}
			
			
			// Setting a timeout for the next request,
			// depending on the chat activity:
			
			var nextRequest = 1000;
			
			// 2 seconds
			if(chat.data.noActivity > 3){
				nextRequest = 2000;
			}
			
			if(chat.data.noActivity > 10){
				nextRequest = 5000;
			}
			
			// 3 minutos
			if(chat.data.noActivity > 20){
				nextRequest = 10000;
			}
		
			setTimeout(callback,nextRequest);
		});
	},
	
	// Requesting a list with all the users.
	
	getUsers : function(callback){
		$.tzGET('getUsers',function(r){
			
			var users = [];
			
			for(var i=0; i< r.users.length;i++){
				if(r.users[i]){
					users.push(chat.render('user',r.users[i]));
				}
			}
			
			var message = '';
			
			if(r.total<1){
				message = 'No hay usuarios en línea';
			}
			else {
				message = r.total+' '+(r.total == 1 ? 'person':'personas')+' en línea';
			}
			
			users.push('<p class="count">'+message+'</p>');
			
			$('#chatUsers').html(users.join(''));
			
			setTimeout(callback,15000);
		});
	},
	
	// This method displays an error message on the top of the page:
	
	displayError : function(msg){
		var elem = $('<div>',{
			id		: 'chatErrorMessage',
			html	: msg
		});
		
		elem.click(function(){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
		
		setTimeout(function(){
			elem.click();
		},5000);
		
		elem.hide().appendTo('body').slideDown();
	}
};

// Custom GET & POST wrappers:

$.tzPOST = function(action,data,callback){
	$.post('php/ajax.php?action='+action,data,callback,'json');
}

$.tzGET = function(action,data,callback){
	$.get('php/ajax.php?action='+action,data,callback,'json');
}
$.tzGETo = function(action,data){
	$.get('php/ajax.php?action='+action,data,'json');
}
// A custom jQuery method for placeholder text:

$.fn.defaultText = function(value){
	
	var element = this.eq(0);
	element.data('defaultText',value);
	
	element.focus(function(){
		if(element.val() == value){
			element.val('').removeClass('defaultText');
		}
	}).blur(function(){
		if(element.val() == '' || element.val() == value){
			element.addClass('defaultText').val(value);
		}
	});
	
	return element.blur();
}