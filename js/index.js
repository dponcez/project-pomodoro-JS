function initApp(){
  const TIMER = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0
  }

  const MODE_BUTTONS = document.getElementById('js_mode-buttons');
  MODE_BUTTONS.addEventListener('click', handleMode);

  function handleMode(event){
    const { mode } = event.target.dataset;

    if(!mode) return;

    switchMode(mode)
    stopTimer()
  }

  function switchMode(mode){
    TIMER.mode = mode;
    TIMER.remainingTime = {
      total: TIMER[mode] * 60,
      minutes: TIMER[mode],
      seconds: 0
    }

    document.querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    
    document.querySelector(`[data-mode='${mode}']`)
      .classList.add('active');
    
    document.body.style.backgroundColor = `var(--${mode})`;
    document.body.style.color = `var(--${mode === 'pomodoro' ? 'white' : 'dark'})`;
    document.getElementById('js-progress')
      .setAttribute('max', TIMER.remainingTime.total);
    
    updateTimer()
  }

  function updateTimer(){
    const { REMAINING_TIME } = TIMER;
    const REMAINING_MINS = `${REMAINING_TIME.minutes}`.padStart(2, '0');
    const REMAINING_SECS = `${REMAINING_TIME.seconds}`.padStart(2, '0');

    const MINUTES = document.getElementById('js-minutes');
    const SECONDS = document.getElementById('js-seconds');

    MINUTES.textContent = REMAINING_MINS;
    SECONDS.textContent = REMAINING_SECS;

    const TEXT = (TIMER.mode === 'pomodoro') ? 'Get back to work!' : 'Take a break';
    document.title = `${MINUTES}:${SECONDS} - ${TEXT}`;

    const PROGRESS = document.getElementById('js-progress');
    PROGRESS.value = TIMER[TIMER.mode] * 60 - TIMER.remainingTime.total;
  }

  let interval;
  function startTimer(){
    let { total } = TIMER.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if(TIMER.mode === 'pomodoro') TIMER.sessions++;

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(() => {
      TIMER.remainingTime = getRemainingTime(endTime);
      updateTimer();

      total = TIMER.remainingTime.total;

      if(total <= 0){
        clearInterval(interval);

        switch(TIMER.mode){
          case 'pomodoro':
            if(TIMER.sessions % TIMER.longBreakInterval === 0){
              switchMode('longBreak')
            }else{
              switchMode('shortBreak')
            }
            break;
          default:
            switchMode('pomodoro')
        }

        if(Notification.permission === 'granted'){
          const text = TIMER.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
          new Notification(text)
        }

        stopTimer()
      }
    }, 1000)
  }

  function stopTimer(){
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active')
  }

  function getRemainingTime(endTime){
    const CURRENT_TIME = Date.parse(new Date());
    const DIFFERENCE = endTime - CURRENT_TIME;

    const TOTAL = Number.parseInt(DIFFERENCE / 1000, 10);
    const MINUTES = Number.parseInt((TOTAL / 60) % 60, 10);
    const SECONDS = Number.parseInt(TOTAL % 60, 10);

    return {
      TOTAL,
      MINUTES,
      SECONDS
    }
  }

  const mainButton = document.getElementById('main-button');
  mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;

    if(action === 'js-action'){
      startTimer()
    }else{
      stopTimer()
    }
  })
}

document.addEventListener('DOMContentLoaded', initApp)