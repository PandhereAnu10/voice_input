import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ChangeDetectorRef } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Component({
  selector: "app-voice-input",
  templateUrl: "./voice-input.component.html",
  styleUrls: ["./voice-input.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule, BrowserModule],
})
export class VoiceInputComponent implements OnInit, OnDestroy {
  message: string = "";
  isListening: boolean = false;
  errorMessage: string = "";
  recognition: any;
  waveBars: number[] = []; // Array to store wave heights dynamically
  maxBars: number = 100; // Maximum bars to display at once

  ngOnInit() {
    this.initializeSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  initializeSpeechRecognition() {
    try {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");
        this.message = transcript;
        this.addWaveBar(); // Add a new wave bar when speech is recognized
      };

      this.recognition.onerror = (event: any) => {
        this.errorMessage = `Error: ${event.error}`;
        this.stopVoiceInput();
      };
    } catch (error) {
      this.errorMessage = "Speech recognition is not supported in this browser.";
    }
  }

  toggleVoiceInput() {
    if (this.isListening) {
      this.stopVoiceInput();
    } else {
      this.startVoiceInput();
    }
  }

  startVoiceInput() {
    if (!this.recognition) {
      this.errorMessage = "Speech recognition is not supported.";
      return;
    }

    this.isListening = true;
    this.errorMessage = "";
    this.waveBars = []; // Reset wave bars on new start
    console.log("Listening started, isListening:", this.isListening);
    this.recognition.start();
  }

  stopVoiceInput() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}

  addWaveBar() {
    const newHeight = Math.floor(Math.random() * 30) + 10; // Random height for the new bar
    this.waveBars.push(newHeight); // Add the new bar to the array
    console.log("WaveBars updated:", this.waveBars);

    // Limited the number of bars to maxBars
    if (this.waveBars.length > this.maxBars) {
      this.waveBars.shift(); // Remove the oldest bar when maxBars is exceeded
    }

    // Manually trigger change detection (usually angular have it)
    this.cdr.detectChanges();
  }

  startWaveSimulation() {
    this.isListening = true;
    setInterval(() => {
      if (this.isListening) {
        this.addWaveBar();
      }
    }, 500); // Update every 500ms
  }
  

  onSubmit() {
    if (this.message.trim()) {
      console.log("Message sent:", this.message);
      this.message = "";
      this.waveBars = []; // Clear the wave bars on submission
    }
  }
}



// import { Component, OnDestroy, OnInit } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { FormsModule } from "@angular/forms";
// import { BrowserModule } from "@angular/platform-browser";

// declare var webkitSpeechRecognition: any;

// @Component({
//   selector: "app-voice-input",
//   templateUrl: "./voice-input.component.html",
//   styleUrls: ["./voice-input.component.css"],
//   standalone: true,
//   imports: [CommonModule, FormsModule, BrowserModule]
// })
// export class VoiceInputComponent implements OnInit, OnDestroy {
//   message: string = "";
//   isListening: boolean = false;
//   errorMessage: string = "";
//   recognition: any;
//   waveBars: number[] = Array(8).fill(20);
//   waveInterval: any;

//   ngOnInit() {
//     this.initializeSpeechRecognition();
//   }

//   ngOnDestroy() {
//     this.stopWaveAnimation();
//     if (this.recognition) {
//       this.recognition.stop();
//     }
//   }

//   initializeSpeechRecognition() {
//     try {
//       this.recognition = new webkitSpeechRecognition();
//       this.recognition.continuous = true;
//       this.recognition.interimResults = true;

//       this.recognition.onresult = (event: any) => {
//         const transcript = Array.from(event.results)
//           .map((result: any) => result[0])
//           .map((result) => result.transcript)
//           .join("");
//         this.message = transcript;
//       };

//       this.recognition.onerror = (event: any) => {
//         this.errorMessage = `Error: ${event.error}`;
//         this.stopVoiceInput();
//       };
//     } catch (error) {
//       this.errorMessage = "Speech recognition is not supported in this browser.";
//     }
//   }

//   toggleVoiceInput() {
//     if (this.isListening) {
//       this.stopVoiceInput();
//     } else {
//       this.startVoiceInput();
//     }
//   }

//   startVoiceInput() {
//     if (!this.recognition) {
//       this.errorMessage = "Speech recognition is not supported.";
//       return;
//     }

//     this.isListening = true;
//     this.errorMessage = "";
//     this.recognition.start();
//     this.startWaveAnimation();
//   }

//   stopVoiceInput() {
//     this.isListening = false;
//     if (this.recognition) {
//       this.recognition.stop();
//     }
//     this.stopWaveAnimation();
//   }

//   startWaveAnimation() {
//     this.waveInterval = setInterval(() => {
//       this.waveBars = this.waveBars.map(() => 
//         Math.floor(Math.random() * 30) + 10
//       );
//     }, 100);
//   }

//   stopWaveAnimation() {
//     if (this.waveInterval) {
//       clearInterval(this.waveInterval);
//     }
//     this.waveBars = Array(8).fill(20);
//   }

//   onSubmit() {
//     if (this.message.trim()) {
//       console.log("Message sent:", this.message);
//       this.message = "";
//     }
//   }
// }
