class VoiceRecorder extends HTMLButtonElement {
  constructor() {
    super();
  }

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.chunks = [];

      this.mediaRecorder.onstop = (evt) => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        const audioEvent = new CustomEvent('recording-finished', {
          detail: { blob },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(audioEvent);

        this.chunks = [];
      };

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      let isRecording = false;

      const startRecording = (evt) => {
        // Only allow primary (not context menu/right click) and single touch
        if (!isRecording && !this.disabled) {
          //evt.preventDefault();
          console.log("recording...");
          this.chunks = [];
          this.mediaRecorder.start();
          isRecording = true;
        }
      };

      const stopRecording = (evt) => {
        if (isRecording && this.mediaRecorder.state === 'recording') {
          evt.preventDefault();
          setTimeout(() => {
            this.mediaRecorder.stop();
            isRecording = false;
          }, 250);
        }
      };

      this.addEventListener('mousedown', startRecording);
      window.addEventListener('mouseup', stopRecording);

      this.addEventListener('touchstart', (evt) => {
        if (evt.touches.length === 1) {
          startRecording(evt);
        }
      }, { passive: false });

      window.addEventListener('touchend', (evt) => {
        stopRecording(evt);
      }, { passive: false });

      this.oncontextmenu = () => false;

    } catch (e) {
      console.error("Could not initialize media devices:", e);
      this.disabled = true
    }
  }

  connectedCallback() {
    this.init();
  }
}

customElements.define('voice-recorder', VoiceRecorder, { extends: 'button' });
