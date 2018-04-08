$(function(){
	var pergunta = "<div class='user-request'>";
	var resposta = "<div class='server-response'>";

	var accessToken = "b60b79ada6ce478ba55028a19c0eda8e";
		var baseUrl = "https://api.api.ai/v1/";
		$(document).ready(function() {
			$("#query").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					var a = $("#query").val();
					$("#result").html($("#result").html()+pergunta+a+"</div>");
					send();
				}
			});
			$("#mic").click(function(event) {
				switchRecognition();
			});
		});

		$("#query").blur(function(){
			setInput(this.val());

		});

		var recognition;
		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				//console.log(event["results"][0][0]["transcript"]);
				var text = event["results"][0][0]["transcript"];
				//alert(text)
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "pt-BR";
			recognition.start();
		}

		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}
		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}
		function setInput(text) {
			$("#query").val(text);
			$("#result").html($("#result").html()+pergunta+text+"</div>");
			send();
		}
		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
		}
		function send() {
			var text = $("#query").val();
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
				success: function(data) {
					setResponse(JSON.stringify(data));
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Loading...");
		}
		function setResponse(val) {
			var saida = JSON.parse(val);
			//console.log(saida);
			var falar = saida["result"]["fulfillment"]["messages"][0]["speech"];
			var metadata = saida["result"]["metadata"]["intentName"];
			$("#query").val("");
			//alert(metadata);
			if(metadata == "Num_cartao_sus"){
				var frases = [];
				frases.push("12/04/2018 no hospital Lourenço Jorge as 13 horas. Deseja mais alguma informação?");
				frases.push("22/05/2018 no hospital Souza Aguiar as 8 horas. Deseja mais alguma informação?");
				frases.push("01/06/2018 no hospital Salgado Filho as 10 horas. Deseja mais alguma informação?");
				frases.push("05/01/2018 no hospital Lourenço Jorge as 15 horas. Deseja mais alguma informação?");
				frases.push("10/10/2018 no hospital Souza Aguiar as 12 horas. Deseja mais alguma informação?");
				frases.push("25/11/2018 no hospital Salgado Filho as 9 horas. Deseja mais alguma informação?");
				frases.push("30/09/2018 no hospital Lourenço Jorge as 11 horas. Deseja mais alguma informação?");
				frases.push("14/02/2019 no hospital Souza Aguiar as 8 horas. Deseja mais alguma informação?");
				frases.push("19/01/2019 no hospital Salgado Filho as 14 horas. Deseja mais alguma informação?");

				var indice = Math.random() * (frases.length - 1) + 1;

				falar = falar + frases[parseInt(indice)];
				$("#result").html($("#result").html()+resposta+falar+"</div>");
				responsiveVoice.speak(falar, "Brazilian Portuguese Female", {rate: 1});
			}else{
				$("#result").html($("#result").html()+resposta+falar+"</div>");
				responsiveVoice.speak(falar, "Brazilian Portuguese Female", {rate: 1});
			}

		}
});
