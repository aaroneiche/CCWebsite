let canvas;
let ctx;

/* Mode:
0 - Countdown minutes and seconds
1 - Countdown days and hours
2 - Setting minutes
3 - Setting Hour
4 - Setting Day
5 - Setting Month
*/
let currentMode = 0;

let lastButtonPress = 0;
let lastButtonRelease = 0;

let currentTime = null;
let running;

let pause = () => {
  running = false;
  document.querySelector("#playpause").innerHTML = `▶️`
}
let play = () => {
  running = true;
  document.querySelector("#playpause").innerHTML = `⏸️`
}

let totalDays = (date) => {
  m = date.get('month');
  let days = 0;
  
  switch(m) {
    case  11:   //December
      return 24 - date.get('date');
      break;
    case 10:    //November
      return (30 - date.get('date')) + 24;
      break;
    case 9:    //October
      let t = (31 - date.get('date')) + 54;
      return (t > 63) ? 63: t ;
      break;
    default: 
      return 63;
      break;
  }
}

let ar = [0,1,0,1,0,1,0,1,0,0,0,0,1,1];

let setFormVals = (dateTime) => {
  document.querySelector("#date").value = dateTime.format('YYYY-MM-DD');
  document.querySelector("#time").value = dateTime.format('HH:mm:ss');
}

//Application loaded, do the setup.
document.addEventListener('DOMContentLoaded', e=>{
  
  //Sets the current date/time when the app starts.
  currentTime = dayjs();
  setFormVals(currentTime);

  canvas = document.querySelector('canvas');
  ctx = document.querySelector('canvas').getContext('2d');
  console.log("setup");
  bg();

  document.querySelector("#date")
    .addEventListener('change', dateChange);
  
  document.querySelector("#time")
    .addEventListener('change', timeChange);
  
  //Setup a timer to update the display every second.
  setInterval(updateCountdown, 1000);

  //Setup 
  canvas.addEventListener("mousedown", press)
  canvas.addEventListener("mouseup", release);

  //Start the counting
  play();
  document.querySelector("#playpause").addEventListener('click',e=>{
    if(running) {
      pause();
    }else{
      play();
    }
    event.preventDefault();
  })

});

let updateCountdown = () => {
  if(running){
    //Add a second every second.
    currentTime = currentTime.add(1,'s');
    // console.log(currentTime);
    
    //Update the values in the form.
    setFormVals(currentTime);
    
    if(currentTime.get('seconds') % 12 == 0) {
      currentMode = !currentMode;
    }
  }

  let dm = 0;
  let hs = 0;

  if(currentMode == 0) {
    dm = (60 - currentTime.get('minutes')).toString(2).padStart(6,0);
    hs = (60 - currentTime.get('seconds')).toString(2).padStart(6,0);
  } else{
    dm = totalDays(currentTime).toString(2).padStart(6,0);
    hs = (23 - currentTime.get('hours')).toString(2).padStart(6,0);
  }

  let ind = (currentMode == 1) ? ([1,0]): ([0,1]);
  ar = [...ind,...dm,...hs];

  //draw the updated ornament.
  drawOrnament(ar,img);
}



function drawOrnament(lights, board) {
  //Clear the existing canvas settings
  ctx.shadowBlur = 0;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(board, 0, 0,ctx.canvas.width, ctx.canvas.height);
  drawLights(lights);
  drawButtons();
}


let dateChange = e => {
  let date = e.target.value.split("-");
  pause();

  currentTime = currentTime.set('year',Number(date[0]));
  currentTime = currentTime.set('month',Number(date[1]) - 1);
  currentTime = currentTime.set('date',Number(date[2]));
  updateCountdown();
}

let timeChange = e => {
  let time = e.target.value.split(":");
  pause();
  
  currentTime = currentTime.set('hour',time[0]);
  currentTime = currentTime.set('minute',time[1]);
  currentTime = currentTime.set('second',(time[2] == undefined) ? 0 : time[2]);
  
  updateCountdown();
}


//Button Press handlers 
let press = e => {
  //Get the position of the canvas
  let sx = document.querySelector("canvas").getBoundingClientRect().x;
  let sy = document.querySelector("canvas").getBoundingClientRect().y;

  if(e.clientX > sx + p(0.22) && e.clientX < sx + p(0.35)) {
    console.log("clicking button 1!");
    lastButtonPress = new Date().getTime();
  }else if(e.clientX > sx + p(0.64) && e.clientX < sx + p(0.78)) {
    console.log("clicking button 2!");
  }
}

let release = e => {
  // console.log("releasing!");
  lastButtonRelease = new Date().getTime();

  let sx = document.querySelector("canvas").getBoundingClientRect().x;
  let sy = document.querySelector("canvas").getBoundingClientRect().y;

  
  if(e.clientX > sx + p(0.22) && e.clientX < sx + p(0.35)) {
    
    //Left button
    let time = (lastButtonRelease - lastButtonPress)/1000;
    console.log(time);
    if(time >= 3) {
      //Toggle setting mode
      console.log("switch modes!");
      if(currentMode > 1) {
        //Switch back to countdown mode
        currentMode = 0;
      }else {
        //Switch to setting Minutes.
        currentMode = 2;
        pause();
        

      }

    } else {
      //advance mode
      if(currentMode > 1) {
        //advance through 5 and wrap around
        currentMode = (++currentMode > 5) ? 2 : currentMode ;
      }else{
        // toggle between 0 and 1
        currentMode = (currentMode == 0) ? 1 : 0;
      }


      
    }

  }else if(e.clientX > sx + p(0.64) && e.clientX < sx + p(0.78)) {
    //Right Button

    switch(currentMode) {
      case 2:
        let m = currentTime.get('minutes');
        currentTime.set('minutes',((m++ > 59)?0:m++));
        console.log(m);
      break;
      
    }

  }
  console.log(currentMode);
  updateCountdown();
}

//Percentage calculator
let p = i => {
  return document.querySelector('canvas').width*i;
}


let bg = () => {
  img = new Image();
  // img.src = "CCsmall.png";
  img.src = "board.png";

  img.onload = ()=>{
    ctx.drawImage(img, 0, 0,ctx.canvas.width, ctx.canvas.height); // destination rectangle
  };
}

let drawButtons = () => {
  ctx.fillStyle = "gray";
  ctx.shadowBlur = 0;
  //left button
  //old -> ctx.fillRect(110,360,65,65);
  //Uses percentage calculations instead of pixels
  ctx.fillRect(p(0.22),p(0.72),p(0.13),p(0.13));
  
  //right button
  ctx.fillRect(p(0.648),p(0.72),p(0.13),p(0.13));

  ctx.fillStyle = "lightgrey";
  ctx.beginPath();
  ctx.arc(p(0.286), p(0.784), p(0.03), 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p(0.712), p(0.784), p(0.03), 0, 2 * Math.PI);
  ctx.fill();
}

let drawLights = leds => {
/* 
  leds, similar to the actual electronics 
  is a bit string 14 bits long. 
*/

//Lookup table defining the basic data: 
  let lookup = [
    [p(0.194),p(0.2),p(0.04),p(0.03),'r'],
    [p(0.766),p(0.2),p(0.04),p(0.03),'g'],
    [p(0.128),p(0.38),p(0.03),p(0.04),'g'],
    [p(0.27),p(0.38),p(0.03),p(0.04),'g'],
    [p(0.414),p(0.38),p(0.03),p(0.04),'g'],
    [p(0.556),p(0.38),p(0.03),p(0.04),'g'],
    [p(0.698),p(0.38),p(0.03),p(0.04),'g'],
    [p(0.84),p(0.38),p(0.03),p(0.04),'g'],
    [p(0.128),p(0.58),p(0.03),p(0.04),'r'],
    [p(0.27),p(0.58),p(0.03),p(0.04),'r'],
    [p(0.414),p(0.58),p(0.03),p(0.04),'r'],
    [p(0.556),p(0.58),p(0.03),p(0.04),'r'],
    [p(0.698),p(0.58),p(0.03),p(0.04),'r'],
    [p(0.84),p(0.58),p(0.03),p(0.04),'r']
  ]
  
  leds.forEach((e,i) => {
    
    switch(lookup[i][4]) {
      case 'r' :
        if (e == 0) {
          ctx.fillStyle = "#770000";
          ctx.shadowBlur = 0;
        }else{
          ctx.fillStyle = "#FF0000";
          ctx.shadowColor = "#FF0000"
          ctx.shadowBlur = 15;
        }
      break;
      case 'g' :
        if (e == 0) {
          ctx.fillStyle = "#007700";
          ctx.shadowBlur = 0;
        }else{
          ctx.fillStyle = "#00FF00";
          ctx.shadowColor = "#00FF00"
          ctx.shadowBlur = 15;
        }
      break;
    }

    //draw the rectangle on or off        
    ctx.fillRect(lookup[i][0], lookup[i][1], lookup[i][2], lookup[i][3]);
  });
}

/* 
22%, 72%, 13%, 13%

*/

