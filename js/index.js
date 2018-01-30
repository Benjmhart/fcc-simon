/* 

***TO DO***



*/


//SETUP

var gamestate = [];
var gamerunning = false;
var onOff = true;
var tempo = 4000;
var isStrict = false;
var playerTurn = false;
//variables used to check player choices
var playerChoices=[];
var choiceCounter=0;
var winval=20;
var buttons={
  'ul':
  {   
    'col1': 'blue',
    'col2': 'cyan',
    'sound': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
 },
  'ur': 
  {
    'col1': 'green',
    'col2': 'chartreuse',
    'sound': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
},
  'll':{
    'col1': 'red',
    'col2': 'firebrick',
    'sound': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
  },
  'lr': {
    'col1': 'gold',
    'col2': 'yellow',
    'sound': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  }
};

function gameover(){
  gamestate=[];
  playerTurn=false;
  playerChoices=[];
  choiceCounter=0;
  tempo=2500
}

//On/off switch functionlity
function switchListener(callback){
  //turning off
  if(onOff===true){
    gameover();
    $('#ul').css('background-color', buttons.ul.col1)
    $('#ur').css('background-color', buttons.ur.col1)
    $('#ll').css('background-color', buttons.ll.col1)
    $('#lr').css('background-color', buttons.lr.col1)
    $('#countertext').css('color', 'black');
    $('#countertext').innerHTML=
    isStrict=false;
    $('#strictindicate').css('background-color', 'black');
    gamerunning=false;
    if(gamestate.length<10){
      $('#countertext')[0].innerHTML='0'+gamestate.length; 
    } 
    else{
      $('#countertext')[0].innerHTML=gamestate.length;
    }
    //gameover();
    //game reset and clear all timeouts/intervals
  }
  //turning on
  console.log('currently: '+onOff );
  if(onOff===false){
    console.log('turning on');
    isStrict=false;
    $('#countertext').css('color', 'red');
  }
  callback();
}
function switchCallback(){
  console.log('callback is firing');
  if(onOff===true){onOff=false;console.log(onOff);} else if(onOff===false){onOff=true;console.log(onOff);}
}
//event listener for on/off switch
$('.switch').mouseup(function(){switchListener(switchCallback);});
//listener for the start button 
$('#startbutton').mouseup(function(){
  if(onOff===true&&gamerunning===false){
    gamerunning=true;
    console.log('time for the cpu turn to start');
    // functionality to reset game in progress.
    cpuTurn(cpuRecite('the start button'));
  }
});
//listener on the strict button
$('#strictbutton').mouseup(function (){
  if(isStrict===true){
    isStrict=false;
    $('#strictindicate').css('background-color', 'black');
    console.log('you turned strict mode off');
  }
  else if(isStrict===false){
    isStrict=true;
    $('#strictindicate').css('background-color', 'blue');
    console.log('you turned strict mode on');  
  }
});

// *** PLAYER TURN & button press functions ***
$('.circleButton').mousedown(function(event){
  event.stopPropagation();
  if(onOff===true){
    var thisbut=event.currentTarget.id;
    //console.log('you have chosen: '+thisbut);
    buttons[thisbut].sound.play();
    
      $('#'+thisbut).css('background-color', buttons[thisbut].col2);
      setTimeout(function(){
      //  console.log(this);
       $('#'+thisbut).css('background-color', buttons[thisbut].col1);
      }, tempo/2);
    //play 
    
    if(playerTurn===true){
      playerChoices.push(this.id);
      //if wrong
      if(playerChoices[choiceCounter]!==gamestate[choiceCounter]){
        console.log('choice #: '+choiceCounter);
        console.log(gamestate);
        console.log('the right choice was:'+ gamestate[choiceCounter]);
        console.log('you picked: '+playerChoices[choiceCounter]);
        console.log('you flubbed it!!');
        $('#ul').css('background-color', buttons.ul.col2);
        $('#ur').css('background-color', buttons.ur.col2);
        $('#ll').css('background-color', buttons.ll.col2);
        $('#lr').css('background-color', buttons.lr.col2);
        $('#countertext')[0].innerHTML='--';
        buttons.ul.sound.play();
        buttons.ll.sound.play();
        buttons.ur.sound.play();
        buttons.lr.sound.play();
        if(isStrict===true){
          setTimeout(function(){
          $('#countertext')[0].innerHTML='01';
          $('#ul').css('background-color', buttons.ul.col1);
          $('#ur').css('background-color', buttons.ur.col1);
          $('#ll').css('background-color', buttons.ll.col1);
          $('#lr').css('background-color', buttons.lr.col1);
          }, 150);
          //game over
          gameover();
          choiceCounter=0;
          cpuTurn();
        }
        else{
          setTimeout(function(){
            if(gamestate.length<10){
              $('#countertext')[0].innerHTML='0'+gamestate.length; 
            } 
            else{
              $('#countertext')[0].innerHTML=gamestate.length;
            }
          $('#ul').css('background-color', buttons.ul.col1);
          $('#ur').css('background-color', buttons.ur.col1);
          $('#ll').css('background-color', buttons.ll.col1);
          $('#lr').css('background-color', buttons.lr.col1);
          }, 150);
          choiceCounter=0;
          console.log('resetting cpu recite');
          setTimeout(function(){
            playerTurn=false                            
          cpuRecite('a non-strict game over');}, tempo);
          
        }
      } else {
        console.log('success!');
        choiceCounter++;
        console.log('now match choice #'+choiceCounter)
        if (choiceCounter==gamestate.length){
          cpuTurn();
          choiceCounter=0;
        }
      }
      
    }
  }
});



// ***CPU AI functionality**&
function cpuTurn(){
  var cpuChoices=['ul', 'ur', 'll', 'lr'];
  var nextChoice=cpuChoices[Math.floor(Math.random()*cpuChoices.length)];
  
  gamestate.push(nextChoice);
  if (gamestate.length===winval){
    console.log('you win!')
    gameover();
    $('#ul').css('background-color', buttons.ul.col2)
    $('#ur').css('background-color', buttons.ur.col2)
    $('#ll').css('background-color', buttons.ll.col2)
    $('#lr').css('background-color', buttons.lr.col2)
    $('#countertext').css('color', 'black');
    buttons.ul.sound.play();
    setTimeout(function(){
          $('#countertext').css('color', 'red');
          $('#countertext').innerHTML=gamestate.length;
          $('#ul').css('background-color', buttons.ul.col1);
          $('#ur').css('background-color', buttons.ur.col1);
          $('#ll').css('background-color', buttons.ll.col1);
          $('#lr').css('background-color', buttons.lr.col1);
          cpuTurn();
          }, 150);
    
  }
  else{
    if (gamestate.length===5||gamestate.length===9||gamestate.length===13){
      tempo=0.5*tempo;}
    if(gamestate.length<10){
      $('#countertext')[0].innerHTML='0'+gamestate.length; 
    } 
    else{
      $('#countertext')[0].innerHTML=gamestate.length;
    }
    console.log('the next choice is: '+nextChoice+' the choices so far are: '+gamestate);
    cpuRecite('the end of cputurn();');
  }
}

  function cpuRecite(runfrom){
  console.log('cpuRecite is bring run '+runfrom)
  //iterate gamestate array, each time playing a sound and changing colors
  var currentCount=0;
  var reciteTime=setInterval(function(){
    if(currentCount===gamestate.length-1){
        playerTurn=true;
    }
    if(currentCount===gamestate.length){
      if(onOff===true){
        
        clearInterval(reciteTime);
        playerChoices=[];
        console.log('choiceCounter would be reset by cpurecite, but you are wearing the clever pants');
        
      }
    }
    else{
      if (onOff===true&& gamestate.length>0){
        console.log(buttons[gamestate[currentCount]]);
        $('#'+gamestate[currentCount]).css('background-color', buttons[gamestate[currentCount]].col2);
        //console.log('logging button object from the DOM...');
        //console.log($('#'+gamestate[currentCount]));
        //console.log('changing color of: '+ [gamestate[currentCount]]+ ' to: '+buttons[gamestate[currentCount]].col2);
        buttons[gamestate[currentCount]].sound.play();
        setTimeout(function(){
          $('#'+gamestate[currentCount]).css('background-color', buttons[gamestate[currentCount]].col1);
          //console.log('changing color of: '+ [gamestate[currentCount]]+ ' to: '+buttons[gamestate[currentCount]].col1);
          currentCount++;
        }, (tempo/2));
      }
    }
  },tempo);
}