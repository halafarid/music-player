var audio = document.getElementById('audio'),
    playPause = document.getElementById('playPause'),
    stop = document.getElementById('stop'),
    mute = document.getElementById('mute'),
    volume = document.getElementById('volume'),
    sound = document.getElementById('sound'),
    repeat = document.getElementById('repeat'),
    next = document.getElementById('next'),
    prev = document.getElementById('prev'),
    random = document.getElementById('random'),
    endTime = document.getElementById('end-time'),
    startTime = document.getElementById('start-time'),
    
    min,
    sec,
    duration,
    playingAudio,
    count = 0,

    songsList = document.getElementById('songs-list'),
    songs = document.querySelectorAll('.song'),
    songSrc = document.getElementById('songSrc'),
    currentSong = songs[0],
    index = Number(currentSong.dataset.value);
    songsSources = [
        'songs/We Don\'t Talk Anymore - Charlie Puth.mp3', 
        'songs/Perfect - Ed Sheeran.mp3', 
        'songs/Let Me Love You - DJ Snake ft. Justin Bieber.mp3', 
        'songs/Treat You Better - Shawn Mendes.mp3', 
        'songs/Rockabye  - Ft. Sean Paul & Anne - Marie.mp3',
        'songs/Shape Of You - Ed Sheeran.mp3',
        'songs/A Different Way - DJ Snake & Lauv.mp3',
        'songs/Kiss Kiss - Feat Mohombi & Big Ali.mp3',
        'songs/Bum Bum Tam Tam - MC Fioti.mp3',
        'songs/Mi Gna - Super Sako & Spitakci Hayko.mp3',
    ]

document.getElementById('sound-name').textContent = currentSong.textContent.split('-')[0];

audio.addEventListener('loadedmetadata', function() {
    var minutes = parseInt(audio.duration / 60),
        seconds = parseInt(audio.duration % 60);
        
    duration = minutes * 60  + seconds;

    if (seconds < 10) {
        seconds = '0' + seconds;
    }


    startTime.textContent = '0:00';
    endTime.textContent = minutes + ':' + seconds;

    sound.setAttribute('max', duration);
});


playPause.addEventListener('click', playPauses);

stop.addEventListener('click', function() {
    audio.removeAttribute('autoplay');
    playPause.classList.add('fa-play-circle');
    playPause.classList.remove('fa-pause-circle');
    stopAudio();
});

mute.addEventListener('click', function() {
    if (audio.muted == true) {
        audio.muted = false;
        mute.classList.add('fa-volume-up');
        mute.classList.remove('fa-volume-mute');
        volume.style.opacity = 1;
    } else {
        audio.muted = true;
        mute.classList.add('fa-volume-mute');
        mute.classList.remove('fa-volume-up');
        volume.style.opacity = 0.2;
    }
});

volume.addEventListener('input', function(e) {
    volume.style.opacity = 1;
    audio.volume = (e.target.value / 100);
    audio.muted = false;

    if (audio.volume == 0) {
        mute.classList.add('fa-volume-mute');
        mute.classList.remove('fa-volume-up');
    } else {
        mute.classList.add('fa-volume-up');
        mute.classList.remove('fa-volume-mute');
    }
});

repeat.addEventListener('click', function() {
    if (audio.hasAttribute('loop')) {
        audio.removeAttribute('loop');
        repeat.style.color = '#fff2ef';
    } else {
        audio.setAttribute('loop', 'loop');
        repeat.style.color = '#DCC1BA';
        // repeat.style.boxShadow = '1px 2px 5px #fff2ef;'
    }
});

next.addEventListener('click', nextAudio);

prev.addEventListener('click', function() {
    if(index > 0) {
        --index;
        playClickedAudio(index);
    }
});

random.addEventListener('click', function() {
    var random = Math.floor(Math.random() * songs.length);
    if (index != random) {
        index = random;
        playClickedAudio(index);
    };
});



(function() {
    for (let i = 0; i< songs.length; i++) {
        songs[i].addEventListener('click', function() {
            if (i == 0 ) {
                playClickedAudio(i);

            } else if (songsSources[i] != songSrc.getAttribute('src')) {
                playClickedAudio(i);
                songs[i].classList.add('active');
            };
            removeActive(i);
            index = i;
        });
    };
})();


function removeActive(i) {
    for (let j = 0; j < songs.length; j++) {
        if (songs[j] !== songs[i]) {
            songs[j].classList.remove('active');
        }
    }
}


function playClickedAudio(index) {
    document.getElementById('sound-name').textContent = songs[index].textContent.split('-')[0];
    songSrc.setAttribute('src', songsSources[index]);
    audio.setAttribute('autoplay', 'autoplay');
    playPause.classList.add('fa-pause-circle');
    playPause.classList.remove('fa-play-circle');
    songs[index].classList.add('active');
    removeActive(index);
    stopAudio();
    playAudio();
};

function changeTrack() {
    audio.currentTime = sound.value;
    startTime.textContent = convertTime(audio.currentTime);

    count = audio.currentTime;
    audio.play();
    playAudio();

    playPause.classList.add('fa-pause-circle');
    playPause.classList.remove('fa-play-circle');
};

function playAudio() {
    clearInterval(playingAudio);
    playingAudio = setInterval(function() {
        if (count >= duration) {
            if (audio.hasAttribute('loop')) {
                playClickedAudio(index);
            } else {
                nextAudio();
            }
        } else {    
            count++;
            sound.setAttribute('value', count);
            startTime.textContent = convertTime(count);
            console.log(count)
        };
    }, 1000);
};

function convertTime(seconds) {
    console.log(seconds);
    min = Math.floor(seconds / 60);
    sec = seconds % 60;

    sec = (sec < 10) ? "0" + sec : sec;
    return (min + ":" + sec);
}


function playPauses() {
    if (audio.paused) {
        audio.play();
        playAudio();
        playPause.classList.add('fa-pause-circle');
        playPause.classList.remove('fa-play-circle');
    } else {
        audio.pause();
        clearInterval(playingAudio);    
        playPause.classList.add('fa-play-circle');
        playPause.classList.remove('fa-pause-circle');
    }
}

function nextAudio() {
    if(index < (songs.length -1)) {
        ++index;
        playClickedAudio(index);
    }
}

function stopAudio() {
    audio.pause();
    audio.load();
    clearInterval(playingAudio);
    sound.setAttribute('value', 0);
    count = 0;
};

