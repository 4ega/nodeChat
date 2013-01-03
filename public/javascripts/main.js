(function (window) {

window.BCE = {
	Model: {},
	View: {},
	Collection: {},
	Helpers: {}
};

// Popup window Model
BCE.Model.Popup = Backbone.Model.extend({
	defaults: {
		'username': '',
		'password': '',
		'newUser': false,
		'forgot': false,
		'wasRegistred': false
	}
});

// Popup window View
BCE.View.Popup = Backbone.View.extend({
	template: _.template($('#popupTemplate').html()),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

BCE.View.ChatMembers = Backbone.View.extend({
	tagName: 'ul',
	render: function() {
		//filter
		this.collection.each(function(chatMember){
			var chatMemberView = new ChatMemberView({model: chatMember});
			this.$el.append(chatMemberView.el)
		}, this);
		return this;
	}
});

//Helper
BCE.Helpers.parseLocalStorage = function() {
	return localStorage.getItem('userName');
}

BCE.Router = Backbone.Router.extend({
	routes:{
		'': 'index',
		'wrong': 'wrong',
		'chat': 'chat'
	},
	index: function() {
		BCE.socket = io.connect('http://localhost');
		var popup,
			parsingLS = BCE.Helpers.parseLocalStorage();
		if (parsingLS) {
			popup = new BCE.Model.Popup({
			'username': parsingLS,
			'wasRegistred': true
			});
		} else {
			popup = new BCE.Model.Popup({});
		}
		var popupView = new BCE.View.Popup({ model: popup});
		$(document.body).append(popupView.render().$el.html());
		$('#login').click(function(e){
			e.preventDefault();
			//popupView.set().render();
			var data = {
				'username': $('#userNameInput').attr('value'),
				'password': $('#passwordInput').attr('value')
			}
			BCE.socket.emit('login', data);
		});
		//$('.wrapper').fadeOut(700);
	},
	login: function() {
		var socket = BCE.socket;
		$('.popupWrapper').fadeOut(700);
		$('.wrapper').fadeIn(1000);
		var log = document.getElementById('log'),
			submit = document.getElementById('submit'),
			inputName = document.getElementById('input-name'),
			input = document.getElementById('input'),
			dudesArr = [],
			userName = localStorage.getItem('userName');



		if(userName) {
			inputName.value = userName;
		}

		inputName.addEventListener('blur', function () {
			localStorage.setItem('userName', inputName.value)
		});

	socket.emit('join');
	socket.emit('username', localStorage.getItem('userName'));

	socket.on('news', function (data) {
		console.log(socket.socket.sessionid);
		var html = log.innerHTML;
		html = '<p><span class="name">' + data.name + ' : </span>' + data.message + '</p>' + html;
		log.innerHTML = html;
	});

	socket.on('dudes', function (data) {
			var counter = document.getElementById('counter');
			counter.innerHTML = data.counter + ' dude\'s are here!';
	});

	socket.on('dudesName', function (data) {
			var aside = document.getElementsByTagName('aside')[0],
				html = '';
				for (var i = 0; i < data.length; i+=1) {
					html += '<p>' + data[i] + '</p>';
				}
				document.getElementById('dudesWrapper').innerHTML = html;
			});

	submit.addEventListener('click', sendMessage, false);
	document.addEventListener('keyup', function(event){
		if (event.keyCode === 13) {
			sendMessage();
		}
	}, false);

	function encodeToSafeHTML(html) {
		var arr = html.split('<');
		return arr.join('&lt;');
	}


	function sendMessage() {
		var resData = input.value,
			resName = inputName.value;
		if (resData && resName) {
			socket.emit('myevent', {name: escape(resName), message: encodeToSafeHTML(resData)});
			input.value='';
		} else {
			alert('Введите имя и сообщение!');
		}
	};
	}
});
//render popup on load
new BCE.Router;
Backbone.history.start();
})(this);
