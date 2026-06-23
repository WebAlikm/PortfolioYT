const previewVideos = document.querySelectorAll(".video-trigger video");
const categoryButtons = document.querySelectorAll(".category-tile");
const demoCards = document.querySelectorAll(".demo-card");
const videoTriggers = document.querySelectorAll(".video-trigger");
const modal = document.querySelector(".video-modal");
const modalVideo = document.querySelector(".modal-video");
const modalTitle = document.querySelector("#modal-title");
const modalCaption = document.querySelector(".modal-caption");
const modalClose = document.querySelector(".modal-close");
const voiceoverButton = document.querySelector(".voiceover-button");
const funnyVoiceover = document.querySelector(".funny-voiceover");
const form = document.querySelector(".request-form");
const surveyForm = document.querySelector(".survey-form");
const fileInput = document.querySelector('input[type="file"]');
const fileNote = document.querySelector("[data-file-note]");
const statusMessage = document.querySelector(".form-status");
const surveyStatus = document.querySelector(".survey-status");
const surveyRecipient = "alislim007km@gmail.com";

function pausePreviews(exceptVideo) {
  previewVideos.forEach((video) => {
    if (video !== exceptVideo) {
      video.pause();
    }
  });
}

function setVoiceoverState(isPlaying) {
  voiceoverButton?.classList.toggle("is-playing", isPlaying);
  voiceoverButton?.setAttribute("aria-pressed", String(isPlaying));

  if (voiceoverButton) {
    voiceoverButton.textContent = isPlaying ? "Pause voiceover" : "Funny voiceover";
  }
}

previewVideos.forEach((video) => {
  video.addEventListener("play", () => pausePreviews(video));
});

voiceoverButton?.addEventListener("click", () => {
  if (!funnyVoiceover) {
    return;
  }

  if (funnyVoiceover.paused) {
    pausePreviews();
    modalVideo?.pause();
    funnyVoiceover.currentTime = funnyVoiceover.ended ? 0 : funnyVoiceover.currentTime;
    funnyVoiceover.play().then(() => setVoiceoverState(true)).catch(() => {});
  } else {
    funnyVoiceover.pause();
    setVoiceoverState(false);
  }
});

funnyVoiceover?.addEventListener("ended", () => {
  setVoiceoverState(false);
  funnyVoiceover.currentTime = 0;
});

videoTriggers.forEach((trigger) => {
  trigger.addEventListener("mouseenter", () => {
    const video = trigger.querySelector("video");
    pausePreviews(video);
    video.play().catch(() => {});
  });

  trigger.addEventListener("mouseleave", () => {
    const video = trigger.querySelector("video");
    video.pause();
  });

  trigger.addEventListener("click", () => {
    modalVideo.src = trigger.dataset.video;
    modalVideo.poster = trigger.dataset.poster;
    modalTitle.textContent = trigger.dataset.title;
    modalCaption.textContent = trigger.dataset.caption;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modalVideo.play().catch(() => {});
  });
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    categoryButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    demoCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
}

modalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
  }
});

fileInput?.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  fileNote.textContent = file ? `${file.name} selected` : "No file selected";
});

form?.addEventListener("submit", () => {
  statusMessage.textContent = "Sending your brief...";
});

function getSurveyValue(name) {
  return surveyForm?.elements[name]?.value?.trim() || "Not provided";
}

function getCheckedLabel(name) {
  const checked = surveyForm?.querySelector(`input[name="${name}"]:checked`);
  return checked?.closest("label")?.textContent.trim() || "Not provided";
}

surveyForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (surveyForm.elements.website?.value) {
    return;
  }

  const subject = "Script to Short survey";
  const body = [
    "New Script to Short survey response",
    "",
    `Persona: ${getSurveyValue("persona")}`,
    `Main goal: ${getSurveyValue("goal")}`,
    `Biggest blocker: ${getCheckedLabel("blocker")}`,
    "",
    "Notes:",
    getSurveyValue("preference-notes"),
  ].join("\n");

  surveyStatus.textContent = `Opening an email to ${surveyRecipient}...`;
  window.location.href = `mailto:${surveyRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
