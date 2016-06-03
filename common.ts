
interface MediaOverlayOptions {
	Enabled: boolean
	WebmMuted: boolean
	WebmVolume: number
	WebmLoop: boolean
	ScrollToAfterExit: boolean
	AllowedExtensions: Array<string>
}

interface ReferencesOptions {
	Enabled: boolean
	ReferenceLinksEnabled: boolean
	HoverOverlayEnabled: boolean
}

interface Options {
	MediaOverlay: MediaOverlayOptions
	References: ReferencesOptions
}

const defaultOptions: Options = {
	MediaOverlay: {
		Enabled: true,
		WebmMuted: true,
		WebmVolume: 1.0,
		WebmLoop: true,
		ScrollToAfterExit: true,
		AllowedExtensions: ["gif", "jpg", "png", "webm"],
	},
	References: {
		Enabled: true,
		ReferenceLinksEnabled: true,
		HoverOverlayEnabled: true,
	}
};

declare namespace chrome.storage {
	const local: {
		set(items: Options, callback?: () => void): void;
		get(keys: Options, callback: (items: Options) => void): void;
	};
}
