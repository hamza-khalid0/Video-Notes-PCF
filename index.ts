import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class VideoNotesControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private context: ComponentFramework.Context<IInputs>;
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private videoElement: HTMLVideoElement;
    private startButton: HTMLButtonElement;
    private stopButton: HTMLButtonElement;
    private saveButton: HTMLButtonElement;
    private statusDiv: HTMLDivElement;
    private currentStream: MediaStream | null = null;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this.context = context;
        this.container = container;

        // Status
        this.statusDiv = document.createElement("div");
        this.statusDiv.style.marginBottom = "8px";
        this.container.appendChild(this.statusDiv);

        // Video preview
        this.videoElement = document.createElement("video");
        this.videoElement.controls = true;
        this.videoElement.style.width = "100%";
        this.videoElement.style.maxHeight = "240px";
        this.container.appendChild(this.videoElement);

        // Start button
        this.startButton = document.createElement("button");
        this.startButton.textContent = "Start Recording";
        this.startButton.onclick = this.startRecording.bind(this);
        this.container.appendChild(this.startButton);

        // Stop button
        this.stopButton = document.createElement("button");
        this.stopButton.textContent = "Stop Recording";
        this.stopButton.disabled = true;
        this.stopButton.onclick = this.stopRecording.bind(this);
        this.container.appendChild(this.stopButton);

        // Save button
        this.saveButton = document.createElement("button");
        this.saveButton.textContent = "Save Recording";
        this.saveButton.disabled = true;
        this.saveButton.onclick = this.saveRecording.bind(this);
        this.container.appendChild(this.saveButton);
    }

    private async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.currentStream = stream;
            this.videoElement.srcObject = stream;
            this.videoElement.play();
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: "video/webm" });
                this.videoElement.srcObject = null;
                this.videoElement.src = URL.createObjectURL(blob);
                this.videoElement.play();
                this.saveButton.disabled = false;
                // Stop all tracks
                if (this.currentStream) {
                    this.currentStream.getTracks().forEach(track => track.stop());
                    this.currentStream = null;
                }
            };
            this.mediaRecorder.start();
            this.statusDiv.textContent = "Recording...";
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
            this.saveButton.disabled = true;
        } catch (err) {
            this.statusDiv.textContent = "Error: " + err;
        }
    }

    private stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            this.mediaRecorder.stop();
            this.statusDiv.textContent = "Recording stopped.";
            this.startButton.disabled = false;
            this.stopButton.disabled = true;
        }
    }

    private async saveRecording() {
        if (this.recordedChunks.length === 0) return;
        const blob = new Blob(this.recordedChunks, { type: "video/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const base64String = this.arrayBufferToBase64(arrayBuffer);

        // Type-safe access for entityId and entityType
        let entityId: string | undefined;
        let entityType: string | undefined;

        // Try to get from context.page if available
        interface PageContext { entityId?: string; entityTypeName?: string; }
        const ctx = this.context as unknown as { page?: PageContext };
        if (ctx.page && ctx.page.entityId && ctx.page.entityTypeName) {
            entityId = ctx.page.entityId;
            entityType = ctx.page.entityTypeName;
        } else {
            // Fallback to parameters.value
            interface ValueContext { _entityId?: string; _entityTypeName?: string; }
            const val = this.context.parameters.value as unknown as ValueContext;
            entityId = val._entityId;
            entityType = val._entityTypeName;
        }

        if (!entityId || !entityType) {
            this.statusDiv.textContent = "Cannot determine record or entity type.";
            return;
        }

        const annotation: Record<string, unknown> = {
            [`objectid_${entityType}@odata.bind`]: `/${entityType}s(${entityId})`,
            "subject": "Video Note",
            "filename": `video_note_${Date.now()}.webm`,
            "mimetype": "video/webm",
            "documentbody": base64String
        };
        try {
            await this.context.webAPI.createRecord("annotation", annotation);
            this.statusDiv.textContent = "Recording saved to Notes!";
            this.saveButton.disabled = true;
        } catch (e) {
            this.statusDiv.textContent = "Failed to save: " + e;
        }
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Optionally, load and show existing notes here
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // No cleanup necessary
    }
}
