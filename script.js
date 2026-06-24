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
const emailRecipient = "alislim007km@gmail.com";

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

function getFormValue(activeForm, name) {
  return activeForm?.elements[name]?.value?.trim() || "Not provided";
}

function getCheckedLabel(activeForm, name) {
  if (!activeForm) {
    return "Not provided";
  }

  const checked = activeForm.querySelector(`input[name="${name}"]:checked`);
  return checked?.closest("label")?.textContent.trim() || "Not provided";
}

function openEmail(subject, body, statusElement) {
  if (statusElement) {
    statusElement.textContent = `Opening an email to ${emailRecipient}...`;
  }

  window.location.href = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (form.elements.company?.value) {
    return;
  }

  const selectedFile = form.elements.voiceover?.files?.[0];
  const body = [
    "New Script to Short brief",
    "",
    `Name: ${getFormValue(form, "name")}`,
    `Email: ${getFormValue(form, "email")}`,
    `Channel or reference link: ${getFormValue(form, "channel")}`,
    `Desired length: ${getFormValue(form, "length")}`,
    `Budget range: ${getFormValue(form, "budget")}`,
    `Deadline: ${getFormValue(form, "deadline")}`,
    `Style reference: ${getFormValue(form, "style-reference")}`,
    "",
    "Script:",
    getFormValue(form, "script"),
    "",
    "Voiceover file:",
    selectedFile ? `${selectedFile.name} (please attach this file to the email)` : "No file selected",
    "",
    "Notes:",
    getFormValue(form, "notes"),
  ].join("\n");

  openEmail("Script to Short brief", body, statusMessage);
});

surveyForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (surveyForm.elements.website?.value) {
    return;
  }

  const subject = "Script to Short survey";
  const body = [
    "New Script to Short survey response",
    "",
    `Persona: ${getFormValue(surveyForm, "persona")}`,
    `Main goal: ${getFormValue(surveyForm, "goal")}`,
    `Biggest blocker: ${getCheckedLabel(surveyForm, "blocker")}`,
    "",
    "Notes:",
    getFormValue(surveyForm, "preference-notes"),
  ].join("\n");

  openEmail(subject, body, surveyStatus);
});
