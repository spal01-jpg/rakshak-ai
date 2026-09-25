/**
 * Rakshak AI - Interactive AI Welfare Companion ("Mitra / Rakshak Sahayak")
 * Empathetic, culturally attuned, playful conversation with Web Speech audio output.
 * Fully air-gapped from ACRs and focused on soldier mental resilience and wellness.
 */

class WelfareChatbot {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.messagesContainer = document.getElementById('chatMessagesArea');
    this.inputField = document.getElementById('chatInputField');
    this.sendBtn = document.getElementById('chatSendBtn');
    this.quickTray = document.getElementById('chatQuickRepliesTray');
    this.history = [];
    this.voiceEnabled = false;
    
    this.bindEvents();
    this.initWelcomeMessage();
  }

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSend());
    }
    if (this.inputField) {
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSend();
      });
    }

    const voiceBtn = document.getElementById('btnToggleChatVoice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        this.voiceEnabled = !this.voiceEnabled;
        voiceBtn.style.color = this.voiceEnabled ? '#10b981' : '#94a3b8';
        voiceBtn.title = this.voiceEnabled ? 'Voice Output: ON' : 'Voice Output: OFF';
        if (window.rakshakApp) {
          window.rakshakApp.showToast(`Voice companion audio: ${this.voiceEnabled ? 'ENABLED' : 'MUTED'}`);
        }
      });
    }
  }

  initWelcomeMessage() {
    const welcome = {
      sender: 'bot',
      text: "**Jai Hind, Veer!** 🪖\n\nMain hoon **Mitra**, aapka 24x7 Digital Welfare Sahayak. Yahan aap dil khol kar baat kar sakte hain — chahe duty ki thakaan ho, ghar ki chinta, neend na aane ki pareshani, ya bas thoda sa hasna-muskurana chahte hon!\n\n*Aapka har lafz 100% confidential aur non-punitive hai.* Boliye, aaj kaisa mehsoos kar rahe hain?",
      quickReplies: [
        "Ek mazedaar Fauji joke sunao! 😄",
        "Ghar ki bohot yaad aa rahi hai",
        "Duty ke baad neend nahi aati",
        "Start Tactical Box Breathing 🧘",
        "View my Welfare Twin 📊"
      ]
    };
    this.renderMessage(welcome);
  }

  async handleSend(textOverride = null) {
    const text = (textOverride || (this.inputField ? this.inputField.value : '')).trim();
    if (!text) return;

    if (this.inputField) this.inputField.value = '';

    this.renderMessage({ sender: 'user', text: text });

    // Handle wellness & resilience navigation triggers
    const lower = text.toLowerCase();
    if (lower.includes("breathing") || lower.includes("saans") || lower.includes("box breathing") || lower.includes("resilience")) {
      setTimeout(() => {
        if (window.rakshakApp) {
          window.rakshakApp.navigateToView('resilience');
          window.rakshakApp.showToast("Navigated to Tactical Resilience Center: 4-4-4-4 Box Breathing");
        }
      }, 700);
    } else if (lower.includes("welfare twin") || lower.includes("digital twin") || lower.includes("score")) {
      setTimeout(() => {
        if (window.rakshakApp) {
          window.rakshakApp.navigateToView('twin');
          window.rakshakApp.showToast("Navigated to Digital Welfare Twin Analytics");
        }
      }, 700);
    }

    const typingElem = this.showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: this.history.slice(-6)
        })
      });

      const data = await response.json();
      typingElem.remove();

      this.renderMessage({
        sender: 'bot',
        text: data.reply,
        isCrisis: data.isCrisis,
        quickReplies: data.suggestedQuickReplies || []
      });

      if (this.voiceEnabled && window.speechSynthesis) {
        this.speakText(data.reply);
      }

      if (data.isCrisis && window.rakshakApp) {
        window.rakshakApp.openHelplineModal();
      }

    } catch (err) {
      typingElem.remove();
      this.renderMessage({
        sender: 'bot',
        text: "Veer, main har pal aapke saath hoon. Gehri saans lein aur relax karein. Aap hamare 24x7 helpline 14416 par bhi baat kar sakte hain.",
        quickReplies: ["Ek joke sunao", "Start Tactical Box Breathing", "24x7 Emergency Helpline"]
      });
    }
  }

  speakText(text) {
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`]/g, '').replace(/📞.*$/gs, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch(e) {}
  }

  showTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'chat-bubble bot';
    div.innerHTML = '<span style="font-style:italic; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i> Mitra soch raha hai...</span>';
    this.messagesContainer.appendChild(div);
    this.scrollToBottom();
    return div;
  }

  renderMessage({ sender, text, isCrisis, quickReplies }) {
    this.history.push({ sender, text });

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender} ${isCrisis ? 'crisis' : ''}`;
    
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    bubble.innerHTML = formattedText;
    this.messagesContainer.appendChild(bubble);

    if (this.quickTray) {
      this.quickTray.innerHTML = '';
      if (quickReplies && quickReplies.length > 0) {
        quickReplies.forEach(chip => {
          const btn = document.createElement('button');
          btn.className = 'chat-quick-chip';
          btn.innerText = chip;
          btn.onclick = () => this.handleSend(chip);
          this.quickTray.appendChild(btn);
        });
      }
    }

    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

window.WelfareChatbot = WelfareChatbot;
