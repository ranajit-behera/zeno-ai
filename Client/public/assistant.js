(function () {



  // userData

  const script = document.currentScript;

  const userId = script?.dataset?.userId;

  const theme = "dark";

  let assistantConfig = null;

  // load CSS

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://zeno-ai-olxc.onrender.com/assistant.css";

  // Add the css link
  document.head.appendChild(link);

  // Create Pop-Up

  const popup = document.createElement("div");
  popup.className = `zeno-popup theme-${theme}`;

  popup.innerHTML = `

    <div class = "zeno-overlay"></div>

    <div class = "zeno-content">
        <div class = "zeno-top">

          <div class = 'zeno-orb-wrap'>

            <div class='zeno-orb-glow'></div>
            <div class='zeno-orb'></div>

          </div>  

          <h2 class='zeno-title'>
            Hello! I'm Zeno AI
          </h2>

          <p class='zeno-sub'>
            Your smart voice assistant.
            <br/>
            Ask anything about your website.
          </p>

          <div class='zeno-status'>
            Tap button to speak

          </div>

          <div class='zeno-wave'>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
          </div>

          <!-- User Text -->
          <div class='zeno-user-text'></div>

          <!-- AI Text -->
          <div class='zeno-ai-text'></div>

        </div>

        <div class ='zeno-bottom'>
            <button class='zeno-mic'>
                <img
                    src='https://zeno-ai-olxc.onrender.com/mic.svg'
                    alt="mic"
                    class="zeno-mic-icon"
                />
            </button>
        </div>

    </div>

    `;

  document.body.appendChild(popup);

  // Floating Button
  const button = document.createElement("button");
  button.className = `zeno-btn theme-${theme}`;

  button.innerHTML = `
      <img
        src ="https://zeno-ai-olxc.onrender.com/logo.png"
        alt="logo"
      />
    `;

  document.body.appendChild(button);


  // Toggle popup

  let open = false;

  button.onclick = () => {
    open = !open;
    popup.style.display = open ? "flex" : "none";
  }

  // Fetch function to load assistant 

  const loadAssistant = async () => {
    try {
      const res = await fetch(`https://zeno-ai-server.onrender.com/api/assistant/config/${userId}`)

      const data = await res.json();
      // console.log(data)

      if (data) {
        assistantConfig = data.user;
        applyConfig();
      }

    } catch (error) {
      console.log("Assistant load error ", error)
    }
  }

  // Function to apply Assistant Config

  const applyConfig = () => {
    if (!assistantConfig) return;

    popup.className = `zeno-popup theme-${assistantConfig.theme}`;

    button.className = `zeno-btn theme-${assistantConfig.theme}`;

    const title = popup.querySelector(".zeno-title");
    title.innerHTML = `Hello! I'm ${assistantConfig.assistantName}`;

    const subTitle = popup.querySelector(".zeno-sub");
    subTitle.innerHTML = `
      Welcome to ${assistantConfig.businessName}
      <br/>
      Ask anything about this website
    `;

  }

  loadAssistant();

  // Get Elements

  const status = popup.querySelector(".zeno-status");

  const wave = popup.querySelector(".zeno-wave");

  const userText = popup.querySelector(".zeno-user-text");

  const aiText = popup.querySelector(".zeno-ai-text");

  const mic = popup.querySelector(".zeno-mic");


  // Text to Speech Convert function
  const speak = (text) => {
    // cancel the speak
    window.speechSynthesis.cancel();

    // Show AI response
    aiText.textContent = text;

    status.textContent = "AI Speaking...";

    // Create new speech Object
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-IN";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    // Voice end
    speech.onend = () => {
      status.textContent = "Tap button to speak";
      wave.style.opacity = "0";
    }

    // Start speaking
    window.speechSynthesis.speak(speech);
  }

  // Speech Recognition Object
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    // new obj
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    mic.onclick = () => {
      wave.style.opacity = "1";

      status.textContent = "Listening...";

      userText.textContent = "";
      aiText.textContent = "";

      recognition.start();
    }

    // Recognition Result
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;

      userText.textContent = "You: " + text;

      recognition.stop();

      setTimeout(async () => {
        try {
          status.textContent = "Thinking...";

          // Fetching assistant-Response
          const res = await fetch("https://zeno-ai-server.onrender.com/api/assistant/ask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: text,
              userId,
              currentPath: window.location.pathname,
            })
          });


          const data = await res.json();
          console.log(data)

          if (data.success) {

            if (data.action === "navigate") {
              // If action is navigate
              speak(data.response);

              // Navigate to path
              setTimeout(() => {
                window.location.href = data.path;
              }, 2000);

            } else {
              // Else Speak AI Response
              speak(data.aiResponse);
            }

          } else {
            speak("Response Error please Check your plan")
          }

        } catch (error) {
          console.log("AI Server Error", error);
          // speak(error.message);
        }
      }, 600)
    }

    // Recognition Error
    recognition.onerror = () => {
      status.textContent = "Tap button to Speak";

      wave.style.opacity = "0";
    }

  } else {
    status.textContent = "Speech Recognition not supported";
  }

})();
