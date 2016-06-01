
class OverlayHandler {
	private overlay: HTMLDivElement;
	private media: Array<HTMLAnchorElement>;
	private current: number;
	private loadicon: HTMLImageElement;
	constructor() {
		const allowed = ["gif", "jpg", "png", "webm"];
		const media: NodeListOf<HTMLAnchorElement> =
			<NodeListOf<HTMLAnchorElement>>document.querySelectorAll(
				'.file_thread a[target="_blank"], .file_reply a[target="_blank"]'
			);
		this.media = new Array<HTMLAnchorElement>(media.length);
		let o = 0;
		for (let i = 0; i < media.length; i++) {
			const href = media[i].href;
			if (!href) {
				continue;
			}
			const d = href.lastIndexOf(".");
			if (d < 0) {
				continue;
			}
			const ext = href.slice(d + 1).toLowerCase();
			if (allowed.indexOf(ext) < 0) {
				continue;
			}
			media[o].onclick = this.onMediumClick;
			this.media[o] = media[i];
			o++;
		}
		this.media.slice(0, o);
		window.onresize = this.onResize;
		window.onkeyup = this.onKeyup;
		this.loadicon = document.createElement("img");
		this.loadicon.src = "data:image/gif;base64,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";
	}
	private loadMedium = () => {
		const medium = this.overlay.querySelector("img, video");
		if (medium) {
			this.overlay.removeChild(medium);
		}
		this.overlay.appendChild(this.loadicon);
		const href = this.media[this.current].href;
		if (href.indexOf(".webm") > 0) {
			const video = <HTMLVideoElement>document.createElement("video");
			video.width = video.height = 0;
			video.controls = true;
			video.loop = true;
			const source = <HTMLSourceElement>document.createElement("source");
			source.type = "video/webm";
			source.src = href;
			video.appendChild(source);
			this.overlay.appendChild(video);
			video.load();
			video.muted = true;
			video.onloadeddata = () => {
				if (!this.overlay) {
					return;
				}
				this.overlay.removeChild(this.loadicon);
				this.resizeVideo(video);
				video.play();
			};
		} else {
			const img = <HTMLImageElement>document.createElement("img");
			img.style.width = img.style.height = "0";
			this.overlay.appendChild(img);
			img.onload = () => {
				if (!this.overlay) {
					return;
				}
				this.overlay.removeChild(this.loadicon);
				this.resizeImage(img);
			};
			img.src = href;
		}
		this.updateArrows();
	}
	private updateArrows = () => {
		const makeArea = (): HTMLDivElement => {
			const area = <HTMLDivElement>document.createElement("div");
			area.style.minWidth = "15%";
			area.style.position = "absolute";
			area.style.height = "100%";
			area.style.zIndex = "2";
			area.style.display = "flex";
			area.style.alignItems = "center";
			const arrow = <HTMLDivElement>document.createElement("div");
			arrow.style.borderStyle = "solid";
			arrow.style.opacity = "0";
			area.onmouseover = (e: MouseEvent) => {
				arrow.style.opacity = "0.6";
			};
			area.onmouseleave = (e: MouseEvent) => {
				arrow.style.opacity = "0";
			};
			area.appendChild(arrow);
			return area;
		};
		{
			const oldarea = this.overlay.querySelector(".arrow_left");
			if (this.current > 0) {
				if (!oldarea) {
					const area = makeArea();
					area.className = "arrow_left";
					area.style.left = "0";
					area.onclick = this.onLeftArrowClick;
					const arrow = <HTMLDivElement>area.firstChild;
					arrow.style.borderColor =
						"transparent #007bff transparent transparent";
					arrow.style.borderWidth = "50px 100px 50px 0";
					arrow.style.paddingLeft = "10px";
					this.overlay.appendChild(area);
				}
			}
			else {
				if (oldarea) {
					this.overlay.removeChild(oldarea);
				}
			}
		}
		{
			const oldarea = this.overlay.querySelector(".arrow_right");
			if (this.current < (this.media.length - 1)) {
				if (!oldarea) {
					const area = makeArea();
					area.className = "arrow_right";
					area.style.right = "0";
					area.onclick = this.onRightArrowClick;
					const arrow = <HTMLDivElement>area.firstChild;
					arrow.style.borderColor =
						"transparent transparent transparent #007bff";
					arrow.style.borderWidth = "50px 0 50px 100px";
					arrow.style.paddingRight = "10px";
					this.overlay.appendChild(area);
				}
			}
			else {
				if (oldarea) {
					this.overlay.removeChild(oldarea);
				}
			}
		}
	};
	private isLoading = (): boolean => {
		return this.loadicon.parentNode != null;
	}
	private onKeyup = (e: KeyboardEvent) => {
		const left = 37;
		const right = 39;
		if (this.current == null ||
			(e.keyCode != left && e.keyCode != right) ||
			this.isLoading()) {
			return;
		}
		let ni: number;
		if (e.keyCode == right) {
			ni = this.current + 1;
			if (ni >= this.media.length) {
				return;
			}
		} else {
			ni = this.current - 1;
			if (ni < 0) {
				return;
			}
		}
		this.current = ni;
		this.loadMedium();
	}
	private onLeftArrowClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (!this.overlay || this.isLoading()) {
			return;
		}
		const ni = this.current - 1;
		if (ni < 0) {
			return;
		}
		this.current = ni;
		this.loadMedium();
	}
	private onRightArrowClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (!this.overlay || this.isLoading()) {
			return;
		}
		const ni = this.current + 1;
		if (ni >= this.media.length) {
			return;
		}
		this.current = ni;
		this.loadMedium();
	}
	private onExitClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (!this.overlay) {
			return;
		}
		const br = document.body.getBoundingClientRect();
		let post = this.media[this.current].parentElement;
		while (post && post.className != "postreply") {
			post = post.parentElement;
		}
		if (post) {
			const er = post.getBoundingClientRect();
			const py = er.top - br.top;
			window.scrollTo(0, py);
		}
		document.body.removeChild(this.overlay);
		this.current = -1;
		this.overlay = null;
	}
	private onMediumClick = (e: MouseEvent) => {
		e.preventDefault();
		if (this.overlay) {
			return;
		}
		const target = <HTMLDivElement>e.target;
		const a = <HTMLAnchorElement>target.parentElement;
		const index = this.media.indexOf(a);
		if (index < 0) {
			return;
		}
		this.current = index;
		this.overlay = document.createElement("div");
		this.overlay.style.height = "100%";
		this.overlay.style.width = "100%";
		this.overlay.style.position = "fixed";
		this.overlay.style.zIndex = "1";
		this.overlay.style.left = "0";
		this.overlay.style.top = "0";
		this.overlay.style.backgroundColor = "rgb(0,0,0)";
		this.overlay.style.backgroundColor = "rgba(0,0,0, 0.9)";
		this.overlay.style.overflowX = "hidden";
		this.overlay.style.display = "flex";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.alignItems = "center";
		this.overlay.onclick = this.onExitClick;
		document.body.appendChild(this.overlay);
		this.loadMedium();
	}
	private resizeImage = (img: HTMLImageElement) => {
		// INFO: YES, this is how to get the size of viewport-scrollbars
		document.body.style.overflow = "hidden";
		const cw = window.innerWidth;
		const ch = window.innerHeight;
		document.body.style.overflow = "";
		const iw = img.naturalWidth;
		const ih = img.naturalHeight;
		if (iw <= cw && ih <= ch) {
			img.style.width = img.style.height = "auto";
			return;
		}
		const nofitw = iw > cw;
		if (nofitw && ih > ch) {
			if (iw > ih) {
				img.style.width = "auto";
				img.style.height = ch + "px";
			}
			else {
				img.style.width = cw + "px";
				img.style.height = "auto";
			}
		}
		else {
			if (nofitw) {
				img.style.width = cw + "px";
				img.style.height = "auto";
			}
			else {
				img.style.width = "auto";
				img.style.height = ch + "px";
			}
		}
	};
	private resizeVideo = (video: HTMLVideoElement) => {
		// INFO: YES, this is how to get the size of viewport-scrollbars
		document.body.style.overflow = "hidden";
		const cw = window.innerWidth;
		const ch = window.innerHeight;
		document.body.style.overflow = "";
		const vw = video.videoWidth;
		const vh = video.videoHeight;
		if (vw <= cw && vh <= ch) {
			return;
		}
		const nofitw = vw > cw;
		if (nofitw && vh > ch) {
			if (vw > vh) {
				video.height = ch;
			}
			else {
				video.width = cw;
			}
		}
		else {
			if (nofitw) {
				video.width = cw;
			}
			else {
				video.height = ch;
			}
		}
	};
	private onResize = (e: UIEvent) => {
		if (!this.overlay) {
			return;
		}
		const href = this.media[this.current].href;
		if (href.indexOf(".webm") > 0) {
			const video = <HTMLVideoElement>this.overlay.querySelector("video");
			this.resizeVideo(video);
		}
		else {
			const img = <HTMLImageElement>this.overlay.querySelector("img");
			this.resizeImage(img);
		}
	}
}

class ReferenceHandler {
	private overlay: HTMLDivElement;
	private reId: RegExp;
	constructor() {
		this.reId = new RegExp("#(\\d+)$");
		const refs = <NodeListOf<HTMLAnchorElement>>
			document.querySelectorAll('blockquote a');
		const op = <HTMLDivElement>document.querySelector(".thread_body");
		for (let i = 0; i < refs.length; i++) {
			refs[i].onmouseenter = this.onRefMouseEnter;
			refs[i].onmouseleave = this.onRefMouseLeave;
		}
	}
	private onRefMouseEnter = (e: MouseEvent) => {
		if (this.overlay) {
			return;
		}
		const ref = <HTMLAnchorElement>e.target;
		const m = this.reId.exec(ref.href);
		if (!m) {
			return;
		}
		const offset = 10;
		const id = m[1];
		{
			const reply = <HTMLTableCellElement>
				document.querySelector("#post-" + id);
			if (reply) {
				const br = document.body.getBoundingClientRect();
				const eref = ref.getBoundingClientRect();
				const ey = eref.top - br.top;
				const ex = eref.left - br.left + eref.width;
				const half = document.body.scrollTop + window.innerHeight / 2;
				let y: number;
				if (ey > half) {
					const erep = reply.getBoundingClientRect();
					y = ey - erep.height;
				} else {
					y = ey;
				}
				// TODO: if in view only highlight like the cool kids do
				this.overlay = <HTMLDivElement>document.createElement("div");
				this.overlay.style.background = "#aaaacc";
				this.overlay.style.border = "1px rgb(89,89,89) solid"
				this.overlay.style.boxShadow =
					"2px 2px 0px 0px rgb(128,128,128)";
				this.overlay.style.position = "absolute";
				this.overlay.appendChild(reply.cloneNode(true));
				this.overlay.style.top = y + "px";
				this.overlay.style.left = (ex + offset) + "px";
				document.body.appendChild(this.overlay);
				return;
			}
		}
		{
			const thread = <HTMLDivElement>
				document.querySelector("#thread_" + id);
			if (thread) {
				const br = document.body.getBoundingClientRect();
				const eref = ref.getBoundingClientRect();
				const ey = eref.top - br.top;
				const ex = eref.left - br.left + eref.width;
				// TODO: if in view only highlight like the cool kids do
				this.overlay = <HTMLDivElement>document.createElement("div");
				const phs = thread.querySelectorAll(".postheader");
				if (phs.length == 0) {
					return;
				}
				this.overlay.appendChild(phs[0].cloneNode(true));
				const files = thread.querySelectorAll(".file_thread");
				for (let i = 0; i < files.length; i++) {
					this.overlay.appendChild(files[i].cloneNode(true));
				}
				this.overlay.appendChild(
					thread.querySelector(".postbody").cloneNode(true));
				this.overlay.style.background = "#aaaacc";
				this.overlay.style.border = "1px rgb(89,89,89) solid"
				this.overlay.style.boxShadow =
					"2px 2px 0px 0px rgb(128,128,128)";
				this.overlay.style.position = "absolute";
				this.overlay.style.top = ey + "px";
				this.overlay.style.left = (ex + offset) + "px";
				document.body.appendChild(this.overlay);
				const half = document.body.scrollTop + window.innerHeight / 2;
				if (ey > half) {
					const or = this.overlay.getBoundingClientRect();
					this.overlay.style.top = (ey - or.height) + "px";
				}
			}
		}
	}
	private onRefMouseLeave = (e: MouseEvent) => {
		if (!this.overlay) {
			return;
		}
		document.body.removeChild(this.overlay);
		this.overlay = null;
	}
}

new OverlayHandler();

if (location.href.indexOf("thread-") > 0) {
	new ReferenceHandler();
}
