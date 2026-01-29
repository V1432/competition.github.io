document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgAudio');
    const audioToggle = document.getElementById('audioToggle');
    const muteToggle = document.getElementById('muteToggle');
    const page = document.querySelector('.page');

    // Ensure audio loops
    audio.loop = true;

    // Helper to update UI
    function updateUI(){
        if(!audio.paused){
            audioToggle.textContent = '⏸ Pause Music';
            page.classList.add('playing');
        } else {
            audioToggle.textContent = '⏵ Play Music';
            page.classList.remove('playing');
        }
        muteToggle.textContent = audio.muted ? '🔇 Muted' : '🔈 Unmuted';
    }

    // Try autoplay — modern browsers may block autoplay without user gesture.
    function tryAutoPlay(){
        const playPromise = audio.play();
        if(playPromise !== undefined){
            playPromise.then(()=>{
                // autoplay succeeded
                updateUI();
            }).catch((err)=>{
                // autoplay blocked — show play button and allow user interaction
                console.log('Autoplay prevented:', err);
                audio.pause();
                updateUI();
            });
        }
    }

    // Controls
    audioToggle.addEventListener('click', () => {
        if(audio.paused){
            const playPromise = audio.play();
            if(playPromise !== undefined){
                playPromise.then(()=> updateUI()).catch(()=> updateUI());
            } else {
                updateUI();
            }
        } else {
            audio.pause();
            updateUI();
        }
    });

    muteToggle.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateUI();
    });

    // Also allow a "start on first tap" fallback: if autoplay blocked, first user interaction starts audio
    function unlockAudioOnInteraction(){
        if(audio.paused){
            audio.play().then(()=>{
                updateUI();
            }).catch(()=>{
                // still blocked or network issue
            });
        }
        // remove the one-time listener
        window.removeEventListener('click', unlockAudioOnInteraction);
    }

    window.addEventListener('click', unlockAudioOnInteraction, {once:true});

    // If user did not provide a local `song.mp3`, we offer a safe remote sample as fallback.
    // NOTE: If you prefer a local audio file, place `song.mp3` inside the `nlp/` folder.
    audio.addEventListener('error', () => {
        if(!audio.dataset.fallback){
            audio.dataset.fallback = '1';
            // Use a public sample as a safe fallback when local `song.mp3` is missing.
            audio.src = 'Goom Hai Kisi Ke Pyar Mein Inst.-320kbps.mp3';
            tryAutoPlay();
        }
    });

    // Initial attempts
    updateUI();
    tryAutoPlay();
});
