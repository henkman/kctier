/// <reference path="common.ts"/>

class OptionsHandler {
	constructor() {
		document.addEventListener('DOMContentLoaded', this.restore);
		document.getElementById('save')
			.addEventListener('click', this.save);
		document.getElementById('restore')
			.addEventListener('click', this.restore);
	}
	private save = () => {
		chrome.storage.local.set(<Options>{
			MediaOverlay: {
				Enabled: (<HTMLInputElement>
					document.getElementById('mediaoverlay_Enabled')
				).checked,
				WebmMuted: (<HTMLInputElement>
					document.getElementById('mediaoverlay_WebmMuted')
				).checked,
				WebmVolume: (<HTMLInputElement>
					document.getElementById('mediaoverlay_WebmVolume')
				).valueAsNumber,
				WebmLoop: (<HTMLInputElement>
					document.getElementById('mediaoverlay_WebmLoop')
				).checked,
				ScrollToAfterExit: (<HTMLInputElement>
					document.getElementById('mediaoverlay_ScrollToAfterExit')
				).checked,
				AllowedExtensions: (<HTMLInputElement>
					document.getElementById('mediaoverlay_AllowedExtensions')
				).value.toLowerCase().split(",").map((x: string) => {
					return x.trim();
				}),
			},
			References: {
				Enabled: (<HTMLInputElement>
					document.getElementById('references_Enabled')
				).checked,
				ReferenceLinksEnabled: (<HTMLInputElement>
					document.getElementById('references_ReferenceLinksEnabled')
				).checked,
				HoverOverlayEnabled: (<HTMLInputElement>
					document.getElementById('references_HoverOverlayEnabled')
				).checked,
			},
			Button: {
				Enabled: (<HTMLInputElement>
					document.getElementById('button_Enabled')
				).checked,
				Board: (<HTMLSelectElement>
					document.getElementById('button_Board')
				).value,
			}
		}, () => {
			const status = <HTMLDivElement>document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(() => {
				status.textContent = '';
			}, 750);
		});
	}
	private restore = () => {
		chrome.storage.local.get(defaultOptions, (opts: Options) => {
			(<HTMLInputElement>
				document.getElementById('mediaoverlay_Enabled')
			).checked = opts.MediaOverlay.Enabled;
			(<HTMLInputElement>
				document.getElementById('mediaoverlay_WebmMuted')
			).checked = opts.MediaOverlay.WebmMuted;
			(<HTMLInputElement>
				document.getElementById('mediaoverlay_WebmVolume')
			).valueAsNumber = opts.MediaOverlay.WebmVolume;
			(<HTMLInputElement>
				document.getElementById('mediaoverlay_WebmLoop')
			).checked = opts.MediaOverlay.WebmLoop;
			(<HTMLInputElement>
				document.getElementById('mediaoverlay_ScrollToAfterExit')
			).checked = opts.MediaOverlay.ScrollToAfterExit;
			(<HTMLInputElement>
				document.getElementById('mediaoverlay_AllowedExtensions')
			).value = opts.MediaOverlay.AllowedExtensions.join(", ");

			(<HTMLInputElement>
				document.getElementById('references_Enabled')
			).checked = opts.References.Enabled;
			(<HTMLInputElement>
				document.getElementById('references_ReferenceLinksEnabled')
			).checked = opts.References.ReferenceLinksEnabled;
			(<HTMLInputElement>
				document.getElementById('references_HoverOverlayEnabled')
			).checked = opts.References.HoverOverlayEnabled;

			(<HTMLInputElement>
				document.getElementById('button_Enabled')
			).checked = opts.Button.Enabled;
			(<HTMLSelectElement>
					document.getElementById('button_Board')
			).value = opts.Button.Board;
		});
	}
}
new OptionsHandler();
