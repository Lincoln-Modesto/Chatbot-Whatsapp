// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const axios = require("axios");
var nodemailer = require('nodemailer');

const date = new Date();
const id = date.getTime();
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
 function Agendamento(agent){
 	const {nome, idade, telefone, dia, horario, email} = agent.parameters;
   
   if(dia == 1){
       dia = 'segunda';
   }else if (dia == 2 ){
       dia = 'terça';
   }else if (dia == 3 ){
       dia = 'quarta';
   }else if (dia == 4 ){
       dia = 'quinta';
   }else if (dia == 5 ){
       dia = 'sexta';}
   
  if(horario == 1){
       horario = '08h às 09h';
   }else if (horario == 2 ){
       horario = '09h às 10h';
   }else if (horario == 3 ){
       horario = '10h às 11h';
   }else if (horario == 4 ){
       horario = '11h às 12h';
   }else if (horario == 5 ){
       horario = '14h às 15h';
   }else if (horario == 6 ){
       horario = '15h às 16h';
   }else{ horario = '16h às 17h';}
   
   	  const data = [{
            Id: id,
            Nome: nome,
        	Idade: idade,
            Telefone: telefone,
            Dia: dia,
            Horario: horario,
        	Email: email
       }];
  axios.post('API_KEY_SHEET_DB', data);
  EnviarEmail(nome, idade, telefone, dia, horario, email, agent.session); 

  agent.add(
`Por favor, verifique se está tudo certo: 

    Nome:*${nome}*
    Idade: *${idade}*
    Telefone: *${telefone}*
    Email: *${email}
    Dia: *${dia}* 
    Horário: *${horario}*

    Se estiver tudo certo, por favor, digite *fim* para finalizarmos o seu agendamento
Caso tenha cometido algum erro de digitação, digite *repetir* para corrigir os dados.`);
}
  
function EnviarEmail(nome, idade, telefone, dia, horario, email, usuario){
     // Configurações do Email
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'EMAIL-RESPONSÁVEL_PELO_ENVIO@gmail.com',
      pass: 'KEY_GMAIL'
    }
  });
  
  var mailOptions = {
    from: 'EMAIL-RESPONSÁVEL_PELO_ENVIO@gmail.com',
    to: 'EMAIL_@gmail.com',
    subject: 'Novo agendamento!',
    text: 
(`Um novo agendamento foi realizado por ${usuario}: 
    
Nome:*${nome}*
Idade: *${idade}*
Telefone: *${telefone}*
Email: *${email}
Dia: *${dia}* 
Horário: *${horario}*
`)
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  }

  let intentMap = new Map();
  intentMap.set('Agendamento', Agendamento);
  
  agent.handleRequest(intentMap);

});