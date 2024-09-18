const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const likebutton = document.getElementById('like');




const Visceral = {
    songName: 'Visceral',
    artist: 'Jose Jr',
    file: 'visceral',
    liked: false,
};
const fogeparaomonte = {
    songName: 'Foge para o monte',
    artist: 'Arautos do Rei',
    file: 'foge_para_o_monte',
    liked: false,
};
const euteamei = {
    songName: 'Eu te amei',
    artist: 'Leo Jundi',
    file: 'eu_te_amei',
    liked: false,
};

let isPlaying = false;
let isShuffeld = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [Visceral,fogeparaomonte,euteamei,];
let sortedPlaylist = [...originalPlaylist]; //spread(espalhar)
let index = 0;


function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if(isPlaying === true){
        pauseSong();
    }
    else {
        playSong();
    }
}

function likebuttonRender() {
  if (sortedPlaylist[index].liked === true) {
    likebutton.querySelector('.bi').classList.remove('bi-heart');
    likebutton.querySelector('.bi').classList.add('bi-heart-fill');
    likebutton.classList.add('button-active');
  }
  else{
    likebutton.querySelector('.bi').classList.add('bi-heart');
    likebutton.querySelector('.bi').classList.remove('bi-heart-fill');
    likebutton.classList.remove('button-active');
  }
}

function inicializeSong(){
    cover.src = `./images/${sortedPlaylist[index].file}.png`;
    song.src = `./audios/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likebuttonRender();
}

function previousSong() {
    if (index === 0){
        index = sortedPlaylist.length - 1;
    }
    else{
        index = index - 1
    }
    inicializeSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1){
        index = 0;
    }
    else{
        index = index + 1
    }
    inicializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toMMSS( song.currentTime);
}

function jumpTo(event){
   const width = progressContainer.clientWidth;
   const clickPosition = event.offsetX;
   const jumpToTime = (clickPosition/width) * song.duration;
   song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()* size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux; 
        currentIndex -= 1;
    } //laço de repetição

}

function shuffleButtonClicked(){
    if (isShuffeld == false){
        isShuffeld = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else{
        isShuffeld = false;
        sortedPlaylist = [...originalPlaylist];
        //index = originalPlaylist.findIndex(song => song.file === sortedPlaylist[index].file);
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked() {
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }

} 

function nextOrRepeat() {
    if (repeatOn === false){
        nextSong();
    }
    else {
        playSong();
    }
}
// (% 3600) //${hours.toString().padStart(2, '0')}:
function toMMSS (originalNumber){
    //let hours = Math.floor(originalNumber/3600);
    let min = Math.floor(originalNumber  / 60);
    let secs = Math.floor(originalNumber % 60);

    return `${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


function updateTotalTime (){
    //toHHMMSS(song.duration);
    totalTime.innerText = toMMSS (song.duration);
}

function likebuttonClicked (){
    if(sortedPlaylist[index].liked === false ){
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likebuttonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}



inicializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click',previousSong );
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat)
song.addEventListener('loadedmetadata', updateTotalTime)
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likebutton.addEventListener('click', likebuttonClicked);


//* <i class="bi bi-heart-fill"></i> 