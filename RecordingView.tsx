import React from 'react'
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

interface RecordingViewProps {
    onTranscriptChange: (transcript: string) => void;
}

export default function RecordingView({ onTranscriptChange }: RecordingViewProps) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>("");

    const recognitionRef = useRef<any>(null);

    const startRecording = () => {
        setIsRecording(true);

        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
            let newTranscript = '';
        
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    newTranscript += result[0].transcript;
                } else {
                    newTranscript += result[0].transcript;
                }
            }
        
            setTranscript(newTranscript.trim());
            onTranscriptChange(newTranscript.trim()); // Pass transcript to parent
        };        

        recognitionRef.current.start();
    };

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            // Update recording state
            setIsRecording(false);
            setRecordingComplete(true); // Mark recording as complete
    
            // Use a short timeout to ensure recognition has time to finalize
            setTimeout(() => {
                // Pass the latest transcript to the parent
                onTranscriptChange(transcript);
            }, 500); // Adjust the timeout duration if needed
        }
    };
       

    const handleToggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    return (
        <div>
            <button onClick={handleToggleRecording} className="absolute right-0 top-10 rounded-full bg-blue-500 text-white p-3 hover:bg-blue-600">
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
        </div>
    );
}
