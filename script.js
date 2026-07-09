/* =========================
   Monmon’s Birthday Adventure
   Vanilla JS, Nintendo-style scene transitions
   ========================= */

(function () {
  const audio = {
    start: document.getElementById("audio-start"),
    meow: document.getElementById("audio-meow"),
    sparkle: document.getElementById("audio-sparkle"),
    heart: document.getElementById("audio-heart"),
    memory: document.getElementById("audio-memory"),
    boss: document.getElementById("audio-boss"),
    ending: document.getElementById("audio-ending"),
    gift: document.getElementById("audio-gift"),
  };

  let audioUnlocked = false;

  function playSound(name) {
    const sound = audio[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function playMusic(name, loop = true) {
    const music = audio[name];
    if (!music) return;
    music.currentTime = 0;
    music.loop = loop;
    music.play().catch(() => {});
  }

  function stopMusic(name) {
    const music = audio[name];
    if (!music) return;
    music.pause();
    music.currentTime = 0;
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    Object.values(audio).forEach(a => {
      if (!a) return;
      a.load();
    });

    setTimeout(() => {
      playSound("start");
    }, 150);
  }

  const scenes = {
    start: document.getElementById("scene-start"),
    loading: document.getElementById("scene-loading"),
    sleep: document.getElementById("scene-sleep"),
    wake: document.getElementById("scene-wake"),
    mission: document.getElementById("scene-mission"),
    room: document.getElementById("scene-room"),
    memory: document.getElementById("scene-memory"),
    wanted: document.getElementById("scene-wanted"),
    boss: document.getElementById("scene-boss"),
    gift: document.getElementById("scene-gift"),
    letter: document.getElementById("scene-letter"),
    ending: document.getElementById("scene-ending"),
  };

  const dialogueSleep = document.getElementById("dialogue-sleep");
  const dialogueWake = document.getElementById("dialogue-wake");
  const dialogueRoom = document.getElementById("dialogue-room");
  const dialogueBoss = document.getElementById("dialogue-boss");

  const momongSleep = document.getElementById("momong-sleep");
  const momongWake = document.getElementById("momong-wake");
  const interactiveObjects = document.querySelectorAll(".interactive-object");
  const interactiveCat = document.querySelector(".interactive-cat");
  const bossCat = document.querySelector(".boss-cat");
  const giftBox = document.getElementById("gift-box");

  const memoryContainer = document.querySelector(".memory-container");
  const letterText = document.querySelector(".letter-text");

  const musicBtn = document.getElementById("music-btn");
  const replayBtn = document.getElementById("replay-btn");
  const sparklesContainer = document.getElementById("sparkles-container");
  const heartsContainer = document.getElementById("hearts-container");
  const confettiContainer = document.getElementById("confetti-container");

  let currentScene = "start";
  let loadingProgress = 0;
  let musicPlaying = false;
  let memoryUnlocked = 0;
  let dialogueBusy = false;
  let typingTimer = null;
  let activeTimeouts = [];
  let activeIntervals = [];

  const memories = [
    { img: "assets/photos/1.jpg", caption: "A tiny ring... but one of my biggest memories." },
    { img: "assets/photos/2.jpg", caption: "Even ordinary school days became special because of you." },
    { img: "assets/photos/3.jpg", caption: "I'll always be proud of us." },
    { img: "assets/photos/4.jpg", caption: "You always manage to amaze me." },
    { img: "assets/photos/5.jpg", caption: "My favorite view has always been you." },
  ];

  const roomDialogueMap = {
    cake: ["A sweet birthday cake...", "It’s waiting for Monmon’s birthday!"],
    gift: ["A mysterious present...", "Maybe it’s for Monmon?"],
    flowers: ["Soft, pastel flowers...", "They smell like monmon."],
    books: ["Little stories stacked neatly...", "Each page is a moment we shared."],
    window: ["The sun is shining outside...", "Just like your smile."],
    frame: ["A framed photo...", "Of us, on a day I’ll never forget."],
    heart: ["A glowing heart...", "It feels warm, like us."],
    momong: ["Momong looks a little guilty...", "He’s waiting for you to forgive him."],
  };

  const wakeDialogueSequence = [
    "...",
    "Mrrrp...",
    "Wait...",
    "I accidentally stole Monmon's birthday.",
    "Oh no...",
  ];

  const bossDialogueSequence = [
    "I only wanted to celebrate too...",
    "I didn’t mean to make you sad...",
    "Can you forgive me?",
  ];

  const finalLetterText = `
Hello be ko, Happy Birthday!!! ❤️
Love you always, always, always.
I really appreciate sobra lahat ng binibigay mo sakin, 
kaya ang OA ko rin ibalik. 
THIS IS THE CRAZIEST NA GIFT KO SAYO HAHAHAHA. so far!
Let's just enjoy our bata days, 
and keep in mind na GO WITH THE FLOW. 
Wag ka papasira sa mga yan!
Dito lang naman ako para laging kang suportahan
sa kahit anong suporta na kailangan mo. 
Love you, baby.
Super saya ko sa gift mo bi! At hanggang ngayon 
mas mataas pa rin tingin ko 
sa ginawa mo kaysa dito sa ginawa ko WBHAHSBAHBH. 
But still, this was made from pure love!
Can't wait to be your legal husband nyahahaha ❤️
21 ka na. Hende ka na 20 ha!
At sabog aq ngayun at tapusin ko nalang ito.
Time check: 4:00 AM WBHABSAHSHBA.
Hoping rin na matupad natin lagi yung gala 
na walang ibang iniisip.
Gusto ko ng buhay na masaya at tahimik, 
at ikaw lang din gusto ko kasama.
Naku naman, herap maging sweet sa words.
Pero alam mo naman yun.
Ikaw ang favorite person ko sa buong mundo.
Happy 21st Birthday, be. ❤️
— loml mo <3
`;

  function clearTimers() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
    activeIntervals.forEach(i => clearInterval(i));
    activeIntervals = [];
  }

  function showScene(sceneName) {
    const scene = scenes[sceneName];
    if (!scene) return;
    Object.values(scenes).forEach(s => s && s.classList.remove("active"));
    scene.classList.add("active");
    currentScene = sceneName;
  }

  function schedule(fn, delay) {
    const id = setTimeout(fn, delay);
    activeTimeouts.push(id);
    return id;
  }

  function startInterval(fn, delay) {
    const id = setInterval(fn, delay);
    activeIntervals.push(id);
    return id;
  }

  function createPetals(container, count = 12) {
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "%";
      petal.style.animationDelay = Math.random() * 5 + "s";
      container.appendChild(petal);
    }
  }

  function typeText(element, text, speed = 30, callback) {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }

    element.textContent = "";
    let i = 0;

    typingTimer = setInterval(() => {
      if (i >= text.length) {
        clearInterval(typingTimer);
        typingTimer = null;
        if (callback) callback();
        return;
      }
      element.textContent += text.charAt(i);
      i++;
    }, speed);
  }

  function showSimpleDialogue(lines) {
    if (dialogueBusy) return;
    if (!dialogueRoom) return;

    dialogueBusy = true;
    dialogueRoom.classList.remove("hidden");

    const textEl = dialogueRoom.querySelector(".dialogue-text");
    if (!textEl) {
      dialogueBusy = false;
      return;
    }

    let i = 0;

    const nextLine = () => {
      if (i >= lines.length) {
        schedule(() => {
          dialogueRoom.classList.add("hidden");
          dialogueBusy = false;
        }, 1500);
        return;
      }

      typeText(textEl, lines[i], 25, () => {
        i++;
        schedule(nextLine, 1200);
      });
    };

    nextLine();
  }

  function allItemsCollected() {
    return (
      collected.cake &&
      collected.gift &&
      collected.flowers &&
      collected.books &&
      collected.window &&
      collected.frame
    );
  }

  function initStartScene() {
    const startScene = scenes.start;
    if (!startScene) return;

    const petalsContainer = startScene.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 16);

    startScene.onclick = () => {
      unlockAudio();
      playSound("start");
      schedule(() => {
        showScene("loading");
        initLoading();
      }, 1200);
    };
  }

  function initLoading() {
    const loadingScene = scenes.loading;
    if (!loadingScene) return;

    loadingScene.onclick = unlockAudio;

    const petalsContainer = loadingScene.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 18);

    const progress = document.querySelector(".loading-progress");
    loadingProgress = 0;

    const interval = startInterval(() => {
      loadingProgress += 1;
      if (progress) progress.style.width = loadingProgress + "%";
      if (loadingProgress >= 100) {
        clearInterval(interval);
        activeIntervals = activeIntervals.filter(i => i !== interval);
        schedule(() => {
          showScene("sleep");
          initSleepScene();
        }, 600);
      }
    }, 30);
  }

  function initSleepScene() {
    const sleepScene = scenes.sleep;
    const petalsContainer = sleepScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 14);

    if (dialogueSleep) dialogueSleep.classList.remove("hidden");

    if (momongSleep) {
      momongSleep.onclick = () => {
        playSound("meow");
        if (dialogueSleep) dialogueSleep.classList.add("hidden");
        schedule(() => {
          showScene("wake");
          initWakeScene();
        }, 2000);
      };
    }
  }

  function mummerWakeDialogue(sequence, index) {
    if (!dialogueWake) return;
    if (index >= sequence.length) return;

    dialogueWake.classList.remove("hidden");
    const textEl = dialogueWake.querySelector(".dialogue-text");
    if (!textEl) return;

    typeText(textEl, sequence[index], 30, () => {
      schedule(() => {
        mummerWakeDialogue(sequence, index + 1);
      }, 700);
    });
  }

  function initWakeScene() {
    const wakeScene = scenes.wake;
    const petalsContainer = wakeScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 14);

    mummerWakeDialogue(wakeDialogueSequence, 0);

    if (momongWake) {
      momongWake.onclick = () => {
        if (momongWake.classList.contains("touched")) return;
        momongWake.classList.add("touched");
        schedule(() => {
          showScene("mission");
          initMissionScene();
        }, 350);
      };
    }
  }

  function initMissionScene() {
    const missionScene = scenes.mission;
    const petalsContainer = missionScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 16);

    schedule(() => {
      showScene("room");
      initRoomScene();
    }, 5000);
  }

  const collected = {
    cake: false,
    gift: false,
    flowers: false,
    books: false,
    window: false,
    frame: false,
    heart: false,
  };

  function initRoomScene() {
    const roomScene = scenes.room;
    const petalsContainer = roomScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 16);

    if (dialogueRoom) dialogueRoom.classList.add("hidden");

    interactiveObjects.forEach(obj => {
      obj.onclick = () => {
        const type = obj.dataset.object;

       if (type === "heart") {
  if (memoryUnlocked < memories.length) {
    unlockMemory();
    return;
  }

  if (collected.heart) return;

  collected.heart = true;
  obj.classList.add("found");

  showSimpleDialogue([
    "Everything has been restored...",
    "The heart shines brightly!"
  ]);

  schedule(() => {
    showScene("wanted");
    initWantedScene();
  }, 7500);

  return;
}

        if (collected[type]) return;

        collected[type] = true;
        obj.classList.add("found");
        showSimpleDialogue(roomDialogueMap[type]);
      };
    });

    if (interactiveCat) {
      interactiveCat.onclick = () => {
        interactiveCat.classList.add("touched");
        schedule(() => interactiveCat.classList.remove("touched"), 300);
        showSimpleDialogue(roomDialogueMap["momong"]);
      };
    }
  }

  function unlockMemory() {
  playSound("sparkle");
  playMusic("memory", false);

  const memoryScene = scenes.memory;
  const memoryPetals = memoryScene?.querySelector(".petals-container");
  if (memoryPetals) createPetals(memoryPetals, 10);

  showScene("memory");

  const mem = memories[memoryUnlocked];
  if (!mem) {
    showScene("room");
    return;
  }

  const card = document.createElement("div");
  card.className = "memory-card";
  card.style.left = 10 + memoryUnlocked * 18 + "%";
  card.style.top = 10 + memoryUnlocked * 8 + "%";

  const img = document.createElement("img");
  img.src = mem.img;
  img.alt = "Memory";

  const caption = document.createElement("div");
  caption.className = "memory-caption";
  caption.textContent = mem.caption;

  card.appendChild(img);
  card.appendChild(caption);

  if (memoryContainer) memoryContainer.appendChild(card);

  memoryUnlocked++;

  schedule(() => {
    showScene("room");
  }, 3500);
}

  function initWantedScene() {
  const wantedScene = scenes.wanted;
  const petalsContainer = wantedScene?.querySelector(".petals-container");
  if (petalsContainer) createPetals(petalsContainer, 12);

  schedule(() => {
    showScene("boss");
    initBossScene();
  }, 7500);
}

  function bossDialogue(sequence, index) {
    if (!dialogueBoss) return;
    if (index >= sequence.length) return;

    dialogueBoss.classList.remove("hidden");
    const textEl = dialogueBoss.querySelector(".dialogue-text");
    if (!textEl) return;

    typeText(textEl, sequence[index], 30, () => {
      schedule(() => {
        bossDialogue(sequence, index + 1);
      }, 1000);
    });
  }

  function initBossScene() {
    const bossScene = scenes.boss;
    const petalsContainer = bossScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 12);

    bossDialogue(bossDialogueSequence, 0);

    if (bossCat) {
      bossCat.onclick = () => {
        if (bossCat.classList.contains("touched")) return;
        bossCat.classList.add("touched");
        schedule(() => {
          showScene("gift");
          initGiftScene();
        }, 400);
      };
    }

    playMusic("boss", false);
    schedule(() => {
      stopMusic("boss");
    }, 5000);
  }

  function initGiftScene() {
    const giftScene = scenes.gift;
    const petalsContainer = giftScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 16);

    if (giftBox) {
      giftBox.onclick = () => {
        playSound("gift");
        playSound("heart");
        if (giftBox.classList.contains("open")) return;
        giftBox.classList.add("open");
        createHearts();
        schedule(() => {
          showScene("letter");
          initLetterScene();
        }, 900);
      };
    }
  }

  function initLetterScene() {
    playMusic("ending");

    const letterScene = scenes.letter;
    const petalsContainer = letterScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 12);

    createSparkles();

    if (letterText) {
      typeText(letterText, finalLetterText, 50, () => {
        const btn = document.createElement("button");
        btn.textContent = "Continue";
        btn.className = "ending-btn";
        btn.onclick = () => {
          showScene("ending");
          initEndingScene();
        };

        const letterContent = document.querySelector(".letter-content");
        if (letterContent) {
          letterContent.appendChild(btn);
        }
      });
    }
  }

  function initEndingScene() {
    const endingScene = scenes.ending;
    const petalsContainer = endingScene?.querySelector(".petals-container");
    if (petalsContainer) createPetals(petalsContainer, 20);

    createConfetti();
    createHearts();

    if (musicBtn) {
      musicBtn.onclick = () => {
        musicPlaying = !musicPlaying;
        if (musicPlaying) {
          playMusic("ending");
          musicBtn.textContent = "♪ Music On";
        } else {
          stopMusic("ending");
          musicBtn.textContent = "♪ Music Off";
        }
      };
    }

    if (replayBtn) {
      replayBtn.onclick = () => {
        resetGame();
      };
    }
  }

  function createSparkles() {
    if (!sparklesContainer) return;
    sparklesContainer.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("div");
      s.className = "sparkle";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      sparklesContainer.appendChild(s);
    }
  }

  function starsReset() {
    if (sparklesContainer) sparklesContainer.innerHTML = "";
  }

  function createHearts() {
    if (!heartsContainer) return;
    heartsContainer.innerHTML = "";
    for (let i = 0; i < 16; i++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = "❤️";
      h.style.left = Math.random() * 100 + "%";
      h.style.top = "80%";
      h.style.animationDelay = Math.random() * 2 + "s";
      heartsContainer.appendChild(h);
    }
  }

  function heartsReset() {
    if (heartsContainer) heartsContainer.innerHTML = "";
  }

  function createConfetti() {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.top = "-10%";
      c.style.animationDelay = Math.random() * 2 + "s";
      c.style.background =
        i % 3 === 0
          ? "var(--primary)"
          : i % 3 === 1
            ? "var(--primary-dark)"
            : "#fff";
      confettiContainer.appendChild(c);
    }
  }

  function confettiReset() {
    if (confettiContainer) confettiContainer.innerHTML = "";
  }

  function resetGame() {
    clearTimers();
    currentScene = "start";
    loadingProgress = 0;
    memoryUnlocked = 0;
    dialogueBusy = false;
    musicPlaying = false;
    Object.keys(collected).forEach(key => (collected[key] = false));

    Object.values(scenes).forEach(s => {
      if (!s) return;
      s.classList.remove("active");
      const petals = s.querySelector(".petals-container");
      if (petals) petals.innerHTML = "";
    });

    if (dialogueSleep) dialogueSleep.classList.add("hidden");
    if (dialogueWake) dialogueWake.classList.add("hidden");
    if (dialogueRoom) dialogueRoom.classList.add("hidden");
    if (dialogueBoss) dialogueBoss.classList.add("hidden");

    if (momongSleep) momongSleep.classList.remove("touched");
    if (momongWake) momongWake.classList.remove("touched");
    if (interactiveCat) interactiveCat.classList.remove("touched");
    if (bossCat) bossCat.classList.remove("touched");
    if (giftBox) giftBox.classList.remove("open");

    if (memoryContainer) memoryContainer.innerHTML = "";
    if (letterText) letterText.textContent = "";

    starsReset();
    heartsReset();
    confettiReset();

    showScene("start");
    initStartScene();
  }

  initStartScene();
})();