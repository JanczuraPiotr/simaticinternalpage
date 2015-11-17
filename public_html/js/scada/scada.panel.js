'use strict';

var scada = scada || {};

scada.Panel = function(){
	var def = this;
	def.aktualizacja = false;
	def.elementInEdit = null;
	def.publ = {};
	def.priv = {};
	def.D = { // Blok danych.
		zmiennaByte : 0,
		zmiennaInt  : 0,
		zmiennaDInt : 0,
		zmiennaReal : 0
	};
	def.I = {
		0 : { // port wejściowy o numerze 0
			0 : 0, // bit 0 portu
			1 : 0, // bit 1 portu
			2 : 0, // ...
			3 : 0,
			4 : 0,
			5 : 0,
			6 : 0,
			7 : 0
		}
	};
	def.Q = {
		0 : { // port wyjściowy o numerzez 0
			0 : 0, // bit 0 portu
			1 : 0, // bit 1 portu
			2 : 0, // ....
			3 : 0,
			4 : 0,
			5 : 0
		}
	};

	def.priv.newD = function(D){
		if(D.zmiennaByte !== def.D.zmiennaByte && def.elementInEdit !== scada.cf.dom.panel.variables.byte.me.el){
			def.D.zmiennaByte = D.zmiennaByte;
			$('#d-byte-input').val(D.zmiennaByte);
		}
		if(D.zmiennaInt !== def.D.zmiennaInt && def.elementInEdit !== scada.cf.dom.panel.variables.int.me.el){
			def.D.zmiennaInt = D.zmiennaInt;
			$('#d-int-input').val(D.zmiennaInt);
		}
		if(D.zmiennaDInt !== def.D.zmiennaDInt && def.elementInEdit !== scada.cf.dom.panel.variables.real.me.el){
			def.D.zmiennaDInt = D.zmiennaDInt;
			$('#d-dint-input').val(D.zmiennaDInt);
		}
		if(D.zmiennaReal !== def.D.zmiennaReal && def.elementInEdit !== scada.cf.dom.panel.variables.real.me.el){
			def.D.zmiennaReal = D.zmiennaReal;
			$('#d-real-input').val(D.zmiennaReal);
		}
	};
	def.priv.newI = function(I){
		var port;
		var bit;
		for (port in I){
			for( bit in I[port]){
				if(def.I[port][bit] !== I[port][bit]){
					def.I[port][bit] = I[port][bit];
					if( I[port][bit] == 1){
						$('#i-'+port+'-'+bit).prop('checked',true);
					}else{
						$('#i-'+port+'-'+bit).prop('checked',false);
					}
				}
			}
		}
	};
	def.priv.newQ = function(Q){
		var port;
		var bit;
		for (port in Q){
			for( bit in Q[port]){
				if(def.Q[port][bit] !== Q[port][bit]){
					def.Q[port][bit] = Q[port][bit];
					if( Q[port][bit] == 1){
						$('#q-'+port+'-'+bit).prop('checked',true);
					}else{
						$('#q-'+port+'-'+bit).prop('checked',false);
					}
				}
			}
		}
	};
	def.priv.thread = function(){
		$.ajax({
			url: scada.cf.url.raport,
			dataType : 'text',
			async: false,
			success : function (response, status, xhr){
				var r = JSON.parse(response);
				def.priv.newD(r.D);
				def.priv.newI(r.I);
				def.priv.newQ(r.Q);
			}
		});
	};
	def.priv.onButtonD = function(selector, eventTypem, handler){
		var varName = $(this).parent().parent().find('input').data('name');
		var varVal = $(this).parent().parent().find('input').val();
		var data = {};

		if( ! document.cookie ){
			// Modyfikować zmienne może tylko zalogowany urzytkownik. Wracamy na stronę logowania.
			window.location = cf.url.main;
		}

		data[varName] = varVal;

		$.ajax({
			url : scada.cf.url.update,
			dataType : 'text',
			async : false,
			type : 'post',
			data : data,
			success : function(response,status,xhr){
				var r = JSON.parse(response);
				def.priv.newD(r.D);
			},
			error : function(jqXHR, status, error){
				// @todo obsłóż
				console.error('scada.D.set.error');
			}
		});

	};
	def.priv.onClickQ = function(selector, eventType,handler){
		var onOff;
		var varName = $(this).attr('name');
		var data = {};

		if( ! document.cookie ){
			// Modyfikować zmienne może tylko zalogowany urzytkownik. Wracamy na stronę logowania.
			window.location = cf.url.main;
		}

		if( $(this).prop('checked') ){
			onOff = 1;
		}else{
			onOff = 0;
		}
		data[varName] = onOff;

		$.ajax({
			url : scada.cf.url.update,
			dataType:'text',
			async : false,
			data : data,
			success : function(response,status,xhr){
				var r = JSON.parse(response);
				def.priv.newQ(r.Q);
			},
			error : function(jqXHR, status, error){
				// @todo obsłóż
				console.error('scada.Qset.error');
			}
		});
	}
	def.priv.inputStartEdit = function(event){
		def.elementInEdit = event.target.id;
	}
	def.priv.inputStopEdit = function(event){
		def.elementInEdit = null;
	}

	def.priv.init = function (){
		$(scada.cf.dom.panel.outputs.me.id).delegate('.output','click',def.priv.onClickQ);
		$(scada.cf.dom.panel.variables.me.id).delegate('button','click',def.priv.onButtonD);
		$(scada.cf.dom.panel.variables.me.id).delegate('input[type=text]','keypress',def.priv.inputStartEdit);
		$(scada.cf.dom.panel.variables.me.id).delegate('input[type=text]','blur',def.priv.inputStopEdit);
		def.run = setInterval(def.priv.thread,scada.cf.dom.panel.me.refreshInterval_ms,def);
	};

	def.priv.init();
	return def.publ;
};