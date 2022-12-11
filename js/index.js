const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0
}

const handleMode = (event) => {
  const { mode } = event.target.dataset;
  if(!mode) return;

  switchMode(mode);
  stopTimer();
}

const sounds = new Audio('audio/button-sound.mp3')
const modeButtons = document.getElementById('js_mode-buttons');
modeButtons.addEventListener('click', handleMode);

const switchMode = (mode) => {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0
  }

  document.querySelectorAll('button[data-mode]')
    .forEach(button => button.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`)
    .classList.add('active');
  document.body.style.color = `var(--${mode === 'pomodoro' ? 'white' : 'dark'})`;
  document.body.style.backgroundImage = `var(--${mode})`;
  document.getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total);

  updateTimer()
}

const updateTimer = () => {
  const { remainingTime } = timer;
  const remainingMins = `${remainingTime.minutes}`.padStart(2, '0');
  const remainingSecs = `${remainingTime.seconds}`.padStart(2, '0');

  let minutes = document.getElementById('js-minutes');
  let seconds = document.getElementById('js-seconds');

  minutes.textContent = remainingMins;
  seconds.textContent = remainingSecs;

  const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
  document.title = `${remainingMins}:${remainingSecs} - ${text}`

  const progress = document.getElementById('js-progress');
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total
}

let interval;
const startTimer = () => {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  if(timer.mode === 'pomodoro') timer.sessions++;

  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  interval = setInterval(() => {
    timer.remainingTime = getRemainingTime(endTime);
    updateTimer()

    total = timer.remainingTime.total;

    if(total <= 0){
      clearInterval(interval);

      switch(timer.mode){
        case 'pomodoro':
          if(timer.sessions % timer.longBreakInterval === 0){
            switchMode("longBreak");
          }else{
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode('pomodoro')
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play()

      if(Notification.permission === 'granted'){
        const text = (timer.mode === 'pomodoro') ? 
          'Get back to work!' : 'Take a break!';
        
          new Notification(text)
      }

      startTimer()
    }
  }, 1000);
}

const stopTimer = () => {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.textContent = 'start';
  mainButton.classList.remove('active');
}

const getRemainingTime = (endTime) => {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds
  }
}

const mainButton = document.getElementById('main-button');
mainButton.addEventListener('click', () => {
  sounds.play();

  const { action } = mainButton.dataset;
  if(action === 'js-action'){
    startTimer()
  }else{
    stopTimer()
  }
})

const initApp = () => {
  switchMode("pomodoro");
}

document.addEventListener('DOMContentLoaded', initApp)