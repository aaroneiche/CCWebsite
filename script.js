let canvas;
let ctx;
let currentMode = 0;

let lastButtonPress = 0;
let lastButtonRelease = 0;


let totalDays = (date) => {
  m = date.getMonth();
  let days = 0;
  switch(m) {
    case  11:   //December
      return 25 - date.getDate();
      break;
    case 10:    //November
      return (30 - date.getDate()) + 25;
      break;
    case 9:    //October
      let t = (31 - date.getDate()) + 55;
      return (t > 63) ? 63: t ;
      break;
  }
}


let ar = [0,1,0,1,0,1,0,1,0,0,0,0,1,1];

document.addEventListener('DOMContentLoaded', e=>{
  canvas = document.querySelector('canvas');
  ctx = document.querySelector('canvas').getContext('2d');
  console.log("setup");
  bg();
  setInterval(()=>{
    let d = new Date();
      
      if(d.getSeconds() % 12 == 0) {
        currentMode = !currentMode;
      } 

      let dm = 0;
      let hs = 0;

      if(currentMode == 0) {
        dm = (59 - d.getMinutes()).toString(2).padStart(6,0);
        hs = (59 - d.getSeconds()).toString(2).padStart(6,0);
      } else{
        
        dm = totalDays(d).toString(2).padStart(6,0);
        hs = (23 - d.getHours()).toString(2).padStart(6,0);
        
      }

      let ind = (currentMode == 1) ? ([1,0]): ([0,1]);
      ar = [...ind,...dm,...hs];

      ctx.shadowBlur = 0;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(img, 0, 0,ctx.canvas.width, ctx.canvas.height);
      drawLights(ar);
      drawButtons();
      
  },1000);

  
  canvas.addEventListener("mousedown", press)
  
  canvas.addEventListener("mouseup", release);
});

//Button Press handlers 
let press = e => {
  //Get the position of the canvas
  let sx = document.querySelector("canvas").getBoundingClientRect().x;
  let sy = document.querySelector("canvas").getBoundingClientRect().y;

  if(e.clientX > sx + p(0.22) && e.clientX < sx + p(0.35)) {
    console.log("clicking button 1!");
    lastButtonPress = new Date().getTime()

  }else if(e.clientX > sx + p(0.64) && e.clientX < sx + p(0.78)) {
    console.log("clicking button 2!");
  }
}

let release = () => {
  // console.log("releasing!");
  lastButtonRelease = new Date().getTime();  
  let time = (lastButtonRelease - lastButtonPress)/1000;
  if(time >= 3) {
    //Toggle setting mode
    console.log("switch modes!");
  } 
}



//Percentage calculator
let p = i => {
  
  return document.querySelector('canvas').width*i;
}


let bg = () => {
  img = new Image();
  img.src = "CCsmall.png";

  img.onload = ()=>{
    ctx.drawImage(img, 0, 0,ctx.canvas.width, ctx.canvas.height); // destination rectangle
    // drawLights(ar);
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

