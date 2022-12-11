# Pomodoro Timer Clone
<img src='./assets/image/desktop-pomodoro.png' alt='Pomodoro Timer Clone' width='100%' height='400px'/>

I saw this project on **Tiff in Tech** YouTube channel, so I decide to replicate this project on my own. You can find this [Code a Pomodoro JavaScript App](https://www.youtube.com/watch?v=8VRNSIc4VeQ&t=188s) on her channel or go to github repository and clone the Freshman's project [Freshman tech - Pomodoro App](https://github.com/Freshman-tech/pomodoro-starter-files.git), but if you want to learn by reading, go to his website [How to build a Pomodoro Timer](https://freshman.tech/pomodoro-timer/) and follow the steps.

First, I used figma to create the scratch and see how it look likes.

Pomodoro Timer it's a technique which uses a timer and allows us to take a break when the time is over, this project has a medium level of difficulty and teach us how to manipulate the **DOM**, (Document Object Model) in different ways.

The text below was extracted from [How to build a Pomodoro Timer](https://freshman.tech/pomodoro-timer/) website:

- *Pomodoro is a time management technique developed in the 1980s which uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.*

## Piece of code

1. We need to create an object called *timer* or you could name it whatever you want.

```js
  const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakIntervals: 4,
    sessions: 0
  }
```
2. Create a *handleMode()* function

```js
  const modeButton = document.getElementById('js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);

  function handleMode(event){
    const { mode } = event.target.dataset;
    if( !mode ) return

    switchMode(mode)
  }
```

3. Create and call the *switchMode()* function

```js
  function switchMode(mode){
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0
    }
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
```

4. Update the timer function

```js
  function updateTimer(){
    const remainingTime = timer;
    const remainingMins = `${remainingTime.minutes}`.padStart(2, '0');
    const remainingSecs = `${remainingTime.seconds}`.padStart(2, '0');
  }
```

Follow the steps on the Freshman's page to complete the project of follow to Tiff in Tech on her YouTube Channel.