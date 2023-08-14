var countdowns = [];
var allowNextSlide = true;

// Function to create and initialize the Video.js player
function initVideoPlayer(videoId, videoSource) {
    const player = videojs(videoId, {
        controls: false,
        autoplay: true,
        preload: 'auto',
        width: 640,
        height: 264,
    });
    player.src(videoSource);
}
// Countdown class
class Countdown {
    constructor(element, time) {
      this.element = element;
      this.countdownNumberEl = element.querySelector('.countdown-number');
      this.time = time;
      this.countdown = time;
      this.interval = null;
      this.updateCountdown();
    }
  
    updateCountdown() {
      this.countdownNumberEl.textContent = this.countdown;
    }
    startCountdown() {
        this.interval = setInterval(() => {
            this.countdown = --this.countdown <= 0 ? 0 : this.countdown;
            this.updateCountdown();
            if (this.countdown <= 0) {
                clearInterval(this.interval);
                this.countdown = this.time;
                this.updateCountdown();

                // Move to the next slide when the countdown reaches 10
                // console.log(allowNextSlide)
                // if (allowNextSlide === true) {
                    swiper.slideNext(); 
                // }
            }
        }, 1000);
    }
  
    stopCountdown() {
      clearInterval(this.interval);
      this.countdown = this.time;
      this.updateCountdown();
    }
  }
// Function to create and append a new slide to the swiper container
function createSlide(slideData) {
    const swiperWrapper = document.getElementById('slides-container');

    const slideDiv = document.createElement('div');
    slideDiv.className = 'swiper-slide';

    const questionItemDiv = document.createElement('div');
    questionItemDiv.className = 'questionItem';

    const videoElement = document.createElement('video');
    const videoId = `video_${slideData.id}`;
    videoElement.setAttribute('id', videoId);
    videoElement.className = 'video-js';
    videoElement.setAttribute('controls', 'false');
    videoElement.setAttribute('preload', 'auto');
    videoElement.setAttribute('width', '640');
    videoElement.setAttribute('height', '264');
    videoElement.setAttribute('data-setup', '{}');

    const sourceElement = document.createElement('source');
    sourceElement.setAttribute('src', slideData.video);
    sourceElement.setAttribute('type', 'video/mp4');

    videoElement.appendChild(sourceElement);

    const videoFallbackP = document.createElement('p');
    videoFallbackP.className = 'vjs-no-js';
    videoFallbackP.innerHTML = `To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>`;

    videoElement.appendChild(videoFallbackP);

    const questionStatementDiv = document.createElement('div');
    questionStatementDiv.className = 'questionItem__statement';
    const questionStatementP = document.createElement('p');
    questionStatementP.textContent = slideData.statement;
    questionStatementDiv.appendChild(questionStatementP);

    const questionOptionsDiv = document.createElement('div');
    questionOptionsDiv.className = 'questionItem__options';

    slideData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = `questionItem__option ${index === slideData.rightOption ? 'correct' : 'incorrect'}`;
        optionDiv.textContent = option;
        questionOptionsDiv.appendChild(optionDiv);
    });

    questionItemDiv.appendChild(videoElement);
    questionItemDiv.appendChild(questionStatementDiv);
    questionItemDiv.appendChild(questionOptionsDiv);

    slideDiv.appendChild(questionItemDiv);
    swiperWrapper.appendChild(slideDiv);

    // Countdown container
    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'countdown';
    countdownContainer.dataset.time = '10'; // Set the countdown time (10 seconds)

    const countdownNumberDiv = document.createElement('div');
    countdownNumberDiv.className = 'countdown-number';

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleElement.setAttribute('r', '18');
    circleElement.setAttribute('cx', '20');
    circleElement.setAttribute('cy', '20');

    svgElement.appendChild(circleElement);
    countdownContainer.appendChild(countdownNumberDiv);
    countdownContainer.appendChild(svgElement);

    questionItemDiv.appendChild(countdownContainer); // Add the countdown inside questionItemDiv

    // Initialize Video.js player for this slide's video
    initVideoPlayer(videoId, slideData.video);

}
// Function to perform after creating all slides
function afterSlidesCreated() {
    // Questions Updates
    function updateQuestionStats() {
        const totalQuestionsSpan = document.getElementById('total-questions');
        const correctAnswersSpan = document.getElementById('correct-answers');

        // Calculate the total number of questions
        const totalQuestions = document.querySelectorAll('.isRight').length + document.querySelectorAll('.isWrong').length;;

        // Calculate the number of correct answers
        const correctAnswers = document.querySelectorAll('.isRight').length;

        // Update the spans with the calculated values
        // totalQuestionsSpan.textContent = totalQuestions;
        correctAnswersSpan.textContent = correctAnswers;
    }
    // Countdown
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach((element) => {
        const time = parseInt(element.dataset.time, 10);
        const countdown = new Countdown(element, time);
        countdowns.push(countdown);
    });
    // Check Question
    const optionElements = document.querySelectorAll('.questionItem__option');
    function handleClick(event) {
        // The event.target represents the element that was clicked
        const clickedOption = event.target;
        if (clickedOption.classList.contains('correct')) {
            this.classList.add('highlight');
            document.querySelector('.swiper-slide-active .questionItem').classList.add('isRight');
        } else {
            document.querySelector('.swiper-slide-active .questionItem').classList.add('isWrong');
        }
        updateQuestionStats();
        allowNextSlide = false;
        setTimeout(() => {
            countdowns[swiper.activeIndex-1].stopCountdown();
            swiper.slideNext();
        }, 500);
    }

    // Loop through all the elements with class "questionItem__option" and attach the click event
    optionElements.forEach(optionElement => {
        optionElement.addEventListener('click', handleClick);
    });
    // VideoJS
    document.querySelectorAll('video').forEach(function (eachVideo) {
        eachVideo.addEventListener('pause', function () {
            // Video ended
            eachVideo.closest('.questionItem').classList.add('isFinished');
            countdowns[swiper.activeIndex-1].startCountdown();
        });
    });
}
// Sample JSON data for slides
const slidesData = [
    {
        "id": 1,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": -8,
        "endPlaybackTime": 12,
        "statement": "First thing you want to do is gently ______ the bike.",
        "options": ["push", "lift"],
        "rightOption": 1
    },
    {
        "id": 2,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 5,
        "endPlaybackTime": 25,
        "statement": "Doing so, you want to make sure the alignment allows your disc to rest in the ______.",
        "options": ["brake", "chain"],
        "rightOption": 0
    },
    {
        "id": 3,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 13,
        "endPlaybackTime": 33,
        "statement": "With that being done, let's drop the ______ and we can get to work.",
        "options": ["kickstand", "handlebars"],
        "rightOption": 0
    },
    {
        "id": 4,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 25,
        "endPlaybackTime": 45,
        "statement": "Let's address the tightening of the ______.",
        "options": ["handlebars", "front wheel"],
        "rightOption": 1
    },
    {
        "id": 5,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 42,
        "endPlaybackTime": 62,
        "statement": "When you start to feel resistance at the halfway point, give your nut a ______ turn and secure to the fork.",
        "options": ["half", "quarter"],
        "rightOption": 1
    },
    {
        "id": 6,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 68,
        "endPlaybackTime": 88,
        "statement": "Now let's address our ______.",
        "options": ["saddle", "pedals"],
        "rightOption": 0
    },
    {
        "id": 7,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 133,
        "endPlaybackTime": 153,
        "statement": "Once tight, we want to move on to our ______ with our other wrench.",
        "options": ["handlebars", "saddle"],
        "rightOption": 0
    },
    {
        "id": 8,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 147,
        "endPlaybackTime": 167,
        "statement": "The largest ______ mil.",
        "options": ["five", "six"],
        "rightOption": 1
    },
    {
        "id": 9,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 205,
        "endPlaybackTime": 225,
        "statement": "Next thing you want to do is address our ______.",
        "options": ["handlebars", "pedals"],
        "rightOption": 1
    },
    {
        "id": 10,
        "video": "videos/videosubtitles.mp4",
        "startPlaybackTime": 213,
        "endPlaybackTime": 233,
        "statement": "They are different from ______ to ______ and are indicated on the end.",
        "options": ["front to back", "left to right"],
        "rightOption": 1
    }
    // Add more slide data as needed
];
// Function to create slides asynchronously
async function createSlidesAsync() {
    for (const slideData of slidesData) {
        createSlide(slideData);
    }
}
// Use async/await to ensure slides are created before executing the afterSlidesCreated function
(async () => {
    await createSlidesAsync();
    afterSlidesCreated();
    
})();
// Swiper
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'vertical',
    effect: 'cube',
    allowTouchMove: false,
    fadeEffect: {
        crossFade: true
    },
    loop: false,
    on: {
        transitionStart: function () {
            var videos = document.querySelectorAll('video');
            Array.prototype.forEach.call(videos, function (video) {
                video.pause();
            });
        },

        transitionEnd: function () {
            var activeIndex = this.activeIndex;
            var activeSlide = document.getElementsByClassName('swiper-slide')[activeIndex];
            var activeSlideVideo = activeSlide.getElementsByTagName('video')[0];
            var slideData = slidesData[activeIndex-1];

            console.log(slideData);
            // Check if startPlaybackTime and endPlaybackTime properties exist
            if ('startPlaybackTime' in slideData && 'endPlaybackTime' in slideData) {
                const startPlaybackTime = slideData.startPlaybackTime;
                const endPlaybackTime = slideData.endPlaybackTime;
                console.log(activeSlideVideo);
                // Set the video currentTime to the startPlaybackTime
                activeSlideVideo.currentTime = startPlaybackTime;
                
                // Play the video until endPlaybackTime
                activeSlideVideo.play();
                setTimeout(function () {
                    activeSlideVideo.pause();
                    
                }, (endPlaybackTime - startPlaybackTime) * 1000); // Convert to milliseconds
            } else {
                // If startPlaybackTime and endPlaybackTime properties are not provided
                // Play the video until the end
                activeSlideVideo.play();
            }
            // activeSlideVideo.play();

        }
    },
});

// Function to reload the page
// function reloadOnWidthChange() {
//     const currentWidth = document.documentElement.clientWidth;
//     if (reloadOnWidthChange.lastWidth !== currentWidth) {
//         // The width has changed, reload the page
//         location.reload();
        
//     }
//     reloadOnWidthChange.lastWidth = currentWidth;
// }

// Initialize lastWidth with the initial width
// reloadOnWidthChange.lastWidth = document.documentElement.clientWidth;

// Add event listener for the resize event
// window.addEventListener('resize', reloadOnWidthChange);