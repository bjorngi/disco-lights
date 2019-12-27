function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const updateFrequencyDisplay = (frequency) => {
  const frequencyElm = document.getElementById('frequency')
  frequencyElm.innerHTML = frequency
}

const updateLoudnessDisplay = (loudness) => {
  const frequencyElm = document.getElementById('loudness')
  frequencyElm.innerHTML = loudness
}

const changeColor = () => {
  document.body.style.backgroundColor = getRandomColor()
}

const callback = (stream) => {
  var ctx = new AudioContext();
  var mic = ctx.createMediaStreamSource(stream);
  var analyser = ctx.createAnalyser();

  mic.connect(analyser);
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var loadnessData = new Uint8Array(analyser.fftSize);

  const play = () => {
    analyser.getByteTimeDomainData(loadnessData);


    var average = 0;
    var max = 0;
    for (i = 0; i < loadnessData.length; i++) {
      a = Math.abs(loadnessData[i] - 128);
      average += a;
      max = Math.max(max, a);
    }

    console.log(average)


    analyser.getByteFrequencyData(frequencyData);
    // get fullest bin
    var idx = 0;
    for (var j = 0; j < analyser.frequencyBinCount; j++) {
      if (frequencyData[j] > frequencyData[idx]) {
        idx = j;
      }
    }

    var frequency = idx * ctx.sampleRate / analyser.fftSize;

    if(frequency < 1000 && average > 20000) {
      changeColor()
    }

    updateLoudnessDisplay(average)
    updateFrequencyDisplay(frequency)
    requestAnimationFrame(play)
  }
  play();
}

navigator.getUserMedia({video: false, audio: true}, callback, console.log);
