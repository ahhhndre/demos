let countDown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  const now = Date.now();
  const then = now + seconds * 1000;
  //console.log({ now, then });

  //so we can cancel any running timer
  clearInterval(countDown);

  //so we can capture the first value
  displayTimeLeft(seconds);
  //show the end time
  displayEndTime(then);

  countDown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    //check if we should stop
    if (secondsLeft <= 0.1) {
      clearInterval(countDown);
      return;
    }
    //display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? '0' : ''
  }${remainderSeconds}`;
  timerDisplay.textContent = display;
  document.title = `Countdown: ${display}`;
  console.log({ minutes, remainderSeconds });
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:
  ${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  console.log(this.dataset);
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  this.reset();
  timer(mins * 60);
});
