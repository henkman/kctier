
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

interface ClickableLinksOptions {
	Enabled: boolean
	SameWindow: boolean 
	Regex: string
}

interface ButtonOptions {
	Enabled: boolean
	Board: string
}

interface Options {
	MediaOverlay: MediaOverlayOptions
	References: ReferencesOptions
	ClickableLinks: ClickableLinksOptions
	Button: ButtonOptions
}

const defaultOptions: Options = {
	MediaOverlay: {
		Enabled: true,
		WebmMuted: true,
		WebmVolume: 1.0,
		WebmLoop: true,
		ScrollToAfterExit: true,
		AllowedExtensions: ["gif", "jpg", "jpeg", "png", "webm"],
	},
	References: {
		Enabled: true,
		ReferenceLinksEnabled: true,
		HoverOverlayEnabled: true,
	},
	ClickableLinks: {
		Enabled: true,
		SameWindow: true,
		Regex: "https?://[^< ]+",
	},
	Button: {
		Enabled: true,
		Board: "int",
	}
};

declare namespace chrome.storage {
	const local: {
		set(items: Options, callback?: () => void): void;
		get(keys: Options, callback: (items: Options) => void): void;
	};
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/chrome/chrome.d.ts#L5838
declare namespace chrome.tabs {
	interface Tab {

	}
	interface CreateProperties {
        url?: string;
    }
	export function create(createProperties: CreateProperties, callback?: (tab: Tab) => void): void;
}

declare namespace chrome.browserAction {
	const onClicked: {
		addListener(callback?: (tab: chrome.tabs.Tab) => void): void;
	};
}
