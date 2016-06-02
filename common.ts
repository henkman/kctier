
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
