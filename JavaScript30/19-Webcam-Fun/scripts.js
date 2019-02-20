//these were here at the start
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//new code is here
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      //console.log(localMediaStream);

      //this is what the tutorial asked for but it seems chrome no longer supports
      //video.src = window.URL.createObjectURL(localMediaStream);
      //this is what I found on stack overflow and seems to work
      video.srcObject = localMediaStream;
      video.play();
    })
    //this is new - catch an error like not allowing access to the webcam
    .catch(err => {
      console.error('Oh No!!!', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //take pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    //make changes to pixels
    //pixels = redEffect(pixels);
    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i + 100] = pixels.data[i + 1]; //green
    pixels.data[i - 150] = pixels.data[i + 2]; //blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  [...document.querySelectorAll('.rgb input')].forEach(input => {
    levels[input.name] = input.value;
  });
  //console.log(levels)

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      //take it out
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

function takePhoto() {
  //play sound
  snap.currentTime = 0;
  snap.play();

  //get the picture
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.textContent = 'Download Image';
  strip.insertBefore(link, strip.firstChild);
  link.innerHTML = `<img src="${data}" alt="Handsome Person" />`;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
