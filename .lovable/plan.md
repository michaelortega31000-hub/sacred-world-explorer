

## Plan: Remove Text-to-Speech (Voice Output) from the Assistant Chat

The chatbot currently uses the browser's built-in `SpeechSynthesis` API, which produces a robotic-sounding voice. The plan is to completely remove the voice output feature while keeping voice input (microphone/speech recognition) intact.

### Changes

**1. `src/components/AssistantChat.tsx`**
- Remove the `useSpeechSynthesis` import and its usage (`speak`, `stopSpeaking`, `isSpeaking`, `speechSynthesisSupported`)
- Remove the `autoSpeak` state variable
- Remove the "Réponse vocale" toggle switch, the stop-speaking button, and the `Volume2`/`VolumeX` icon imports
- Remove the auto-speak logic that triggers `speak()` after receiving an AI response
- Remove the `hideAssistantText` logic that hides text when auto-speak is on — always show the text response
- Keep microphone/speech recognition (`Mic`, `MicOff`, `useSpeechRecognition`) untouched

**2. `src/hooks/useSpeechSynthesis.ts`**
- Delete this file entirely (no longer used anywhere)

### What stays
- Voice input (speech-to-text via microphone) remains fully functional
- All other assistant features (quick replies, modes, suggestions) are unchanged

