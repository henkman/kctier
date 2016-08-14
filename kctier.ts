/// <reference path="common.ts"/>

chrome.storage.local.get(defaultOptions, function (opts: Options) {
	if (opts.ClickableLinks.Enabled) {
		class ClickableLinks {
			constructor(opts: ClickableLinksOptions) {
				const re = new RegExp(opts.Regex, "g");
				const ps = <NodeListOf<HTMLParagraphElement>>
					document.querySelectorAll(".thread p");
				for (let i = 0; i < ps.length; i++) {
					const p = ps[i];
					const t = p.innerHTML;
					let mod = false;
					let r = t;
					let o = 0;
					let m = re.exec(t);
					while (m) {
						mod = true;
						const s = r.substring(0, o + m.index);
						const e = r.substring(o + m.index + m[0].length);
						let a: string;
						if (opts.SameWindow) {
							a = "<a href=\"" + m[0] + "\">" + m[0] + "</a>";
						} else {
							a = "<a target=\"_blank\" href=\"" + m[0] + "\">"
								+ m[0] + "</a>";
						}
						r = s + a + e;
						o += a.length - m[0].length;
						m = re.exec(t);
					}
					if (mod) {
						p.innerHTML = r;
					}
				}
			}
		}
		window.addEventListener("load", () => {
			new ClickableLinks(opts.ClickableLinks);
		});
	}

	if (opts.References.Enabled) {
		class ReferencesHandler {
			private opts: ReferencesOptions;
			private overlay: HTMLDivElement;
			private reId: RegExp;
			constructor(opts: ReferencesOptions) {
				this.opts = opts;
				this.reId = new RegExp("#(\\d+)$");
				const refs = <NodeListOf<HTMLAnchorElement>>
					document.querySelectorAll('blockquote a');
				for (let i = 0; i < refs.length; i++) {
					const m = this.reId.exec(refs[i].href);
					if (!m) {
						continue;
					}
					if (this.opts.HoverOverlayEnabled) {
						refs[i].onmouseenter = this.onRefMouseEnter;
						refs[i].onmouseleave = this.onRefMouseLeave;
					}
					if (this.opts.ReferenceLinksEnabled) {
						const ref_id = m[1];
						let post_id: string;
						{
							let post = refs[i].parentElement;
							while (post && post.className != "postreply") {
								post = post.parentElement;
							}
							if (!post) {
								continue;
							}
							const ql = <HTMLAnchorElement>
								post.querySelector(".quotelink");
							if (!ql) {
								continue;
							}
							const m = this.reId.exec(ql.href);
							if (!m) {
								continue;
							}
							post_id = m[1];
						}
						{
							const reply = <HTMLTableCellElement>
								document.querySelector("#post-" + ref_id);
							if (reply) {
								const header = <HTMLDivElement>
									reply.querySelector(".postheader");
								if (!header) {
									continue;
								}
								const post_ref = "#" + post_id;
								if (header.querySelector(
									'[href="' + post_ref + '"]') != null) {
									continue;
								}
								const a = <HTMLAnchorElement>
									document.createElement("a");
								a.style.paddingRight = "4px";
								a.href = post_ref;
								a.setAttribute("onclick",
									"highlightPost('" + post_id + "')");
								a.text = ">>" + post_id;
								if (this.opts.HoverOverlayEnabled) {
									a.onmouseenter = this.onRefMouseEnter;
									a.onmouseleave = this.onRefMouseLeave;
								}
								header.appendChild(a);
								continue;
							}
						}
						{
							const thread = <HTMLDivElement>
								document.querySelector("#thread_" + ref_id);
							if (thread) {
								const header = <HTMLDivElement>
									thread.querySelector(".postheader");
								if (!header) {
									continue;
								}
								const post_ref = "#" + post_id;
								if (header.querySelector(
									'[href="' + post_ref + '"]') != null) {
									continue;
								}
								const a = <HTMLAnchorElement>
									document.createElement("a");
								a.style.paddingRight = "4px";
								a.href = post_ref;
								a.setAttribute("onclick",
									"highlightPost('" + post_id + "')");
								a.text = ">>" + post_id;
								if (this.opts.HoverOverlayEnabled) {
									a.onmouseenter = this.onRefMouseEnter;
									a.onmouseleave = this.onRefMouseLeave;
								}
								header.appendChild(a);
							}
						}
					}
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
						const erep = reply.getBoundingClientRect();
						const ey = eref.top - br.top;
						const hy = document.body.scrollTop + window.innerHeight / 2;
						let y: number;
						if (ey > hy) {
							y = ey - erep.height;
						} else {
							y = ey + eref.height * 2;
						}
						const x = Math.min(
							window.innerWidth - (erep.left + erep.width),
							eref.left);
						// TODO: if in view only highlight like the cool kids do
						this.overlay = <HTMLDivElement>
							document.createElement("div");
						this.overlay.style.background = "#aaaacc";
						this.overlay.style.border = "1px rgb(89,89,89) solid"
						this.overlay.style.boxShadow =
							"2px 2px 0px 0px rgb(128,128,128)";
						this.overlay.style.position = "absolute";
						this.overlay.appendChild(reply.cloneNode(true));
						this.overlay.style.top = y + "px";
						this.overlay.style.left = x + "px";
						this.overlay.style.width = erep.width + "px";
						this.overlay.style.height = erep.height + "px";
						document.body.appendChild(this.overlay);
						return;
					}
				}
				{
					const thread = <HTMLDivElement>
						document.querySelector("#thread_" + id);
					if (thread) {
						// TODO: if in view only highlight like the cool kids do
						this.overlay = <HTMLDivElement>
							document.createElement("div");
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
						const left = 16;
						this.overlay.style.left = left + "px";
						this.overlay.style.maxWidth = (window.innerWidth - left)
							+ "px";
						document.body.appendChild(this.overlay);
						const br = document.body.getBoundingClientRect();
						const erep = this.overlay.getBoundingClientRect();
						const eref = ref.getBoundingClientRect();
						const ey = eref.top - br.top;
						const hy = document.body.scrollTop + window.innerHeight / 2;
						let y: number;
						if (ey > hy) {
							y = ey - erep.height;
						} else {
							y = ey + eref.height * 2;
						}
						const x = Math.min(
							Math.max(
								window.innerWidth - (left + erep.width),
								0
							),
							eref.left);
						this.overlay.style.top = y + "px";
						this.overlay.style.left = x + "px";
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
		// INFO: for now only *in* threads
		//       doing it on the whole board requires loading other threads via ajax
		if (location.href.indexOf("thread-") > 0) {
			window.addEventListener("load", () => {
				new ReferencesHandler(opts.References);
			});
		}
	}

	if (opts.MediaOverlay.Enabled) {
		class MediaOverlayHandler {
			private opts: MediaOverlayOptions;
			private overlay: HTMLDivElement;
			private media: Array<HTMLAnchorElement>;
			private current: number;
			private loadicon: HTMLImageElement;
			constructor(opts: MediaOverlayOptions) {
				this.opts = opts;
				const links: NodeListOf<HTMLAnchorElement> =
					<NodeListOf<HTMLAnchorElement>>
					document.querySelectorAll(
						'.file_thread a[target="_blank"], .file_reply a[target="_blank"]'
					);
				const media = new Array<HTMLAnchorElement>(links.length);
				let o = 0;
				for (let i = 0; i < links.length; i++) {
					const href = links[i].href;
					if (!href) {
						continue;
					}
					const d = href.lastIndexOf(".");
					if (d < 0) {
						continue;
					}
					const ext = href.slice(d + 1).toLowerCase();
					if (this.opts.AllowedExtensions.indexOf(ext) < 0) {
						continue;
					}
					links[i].onclick = this.onMediumClick;
					media[o] = links[i];
					o++;
				}
				this.media = media.slice(0, o);
				window.onresize = this.onResize;
				window.onkeyup = this.onKeyup;
			}
			private getLoadIcon = (): HTMLImageElement => {
				if (!this.loadicon) {
					this.loadicon = document.createElement("img");
					this.loadicon.src = "data:image/gif;base64,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";
				}
				return this.loadicon;
			}
			private loadMedium = () => {
				const medium = this.overlay.querySelector("img, video");
				if (medium) {
					this.overlay.removeChild(medium);
				}
				this.overlay.appendChild(this.getLoadIcon());
				const href = this.media[this.current].href;
				if (href.indexOf(".webm") > 0) {
					const vid = <HTMLVideoElement>
						document.createElement("video");
					vid.style.zIndex = "10";
					vid.style.width = vid.style.height = "0";
					vid.controls = true;
					vid.loop = this.opts.WebmLoop;
					const source = <HTMLSourceElement>
						document.createElement("source");
					source.type = "video/webm";
					source.src = href;
					vid.appendChild(source);
					this.overlay.appendChild(vid);
					vid.load();
					vid.muted = this.opts.WebmMuted;
					vid.volume = this.opts.WebmVolume;
					vid.onloadeddata = () => {
						if (!this.overlay) {
							return;
						}
						this.overlay.removeChild(this.loadicon);
						this.resizeElement(vid,
							vid.videoWidth,
							vid.videoHeight);
						vid.play();
					};
				} else {
					const img = <HTMLImageElement>document.createElement("img");
					img.style.zIndex = "5";
					img.style.width = img.style.height = "0";
					this.overlay.appendChild(img);
					img.onload = () => {
						if (!this.overlay) {
							return;
						}
						this.overlay.removeChild(this.loadicon);
						this.resizeElement(img,
							img.naturalWidth,
							img.naturalHeight);
					};
					img.src = href;
				}
				this.updateArrows();
			}
			private overlayMouseMove = (e: MouseEvent) => {
				if (!this.overlay) {
					return;
				}
				// TODO: replace this magic
				const sb = 20;
				const p = 0.15;
				const rp = e.x / (window.innerWidth - sb);
				const opi = "0.6";
				if (rp <= p) {
					const arrow = <HTMLDivElement>
						this.overlay.querySelector(".arrow_left");
					if (arrow) {
						arrow.style.opacity = opi;
					}
				} else if (rp >= (1 - p)) {
					const arrow = <HTMLDivElement>
						this.overlay.querySelector(".arrow_right");
					if (arrow) {
						arrow.style.opacity = opi;
					}
				} else {
					const arrows = this.overlay.querySelectorAll(
						".arrow_left, .arrow_right");
					for (let i = 0; i < arrows.length; i++) {
						(<HTMLDivElement>arrows[i]).style.opacity = "0";
					}
				}
			}
			private updateArrows = () => {
				{
					const oldarrow = this.overlay.querySelector(".arrow_left");
					if (this.current > 0) {
						if (!oldarrow) {
							const arrow = <HTMLDivElement>
								document.createElement("div");
							arrow.style.position = "absolute";
							arrow.style.zIndex = "15";
							arrow.style.left = "10px";
							arrow.className = "arrow_left";
							arrow.style.opacity = "0";
							arrow.onclick = this.onLeftArrowClick;
							arrow.style.borderStyle = "solid";
							arrow.style.borderColor =
								"transparent #007bff transparent transparent";
							arrow.style.borderWidth = "50px 100px 50px 0";
							this.overlay.appendChild(arrow);
						}
					}
					else {
						if (oldarrow) {
							this.overlay.removeChild(oldarrow);
						}
					}
				}
				{
					const oldarrow = this.overlay.querySelector(".arrow_right");
					if (this.current < (this.media.length - 1)) {
						if (!oldarrow) {
							const arrow = <HTMLDivElement>
								document.createElement("div");
							arrow.style.position = "absolute";
							arrow.style.zIndex = "15";
							arrow.style.right = "10px";
							arrow.className = "arrow_right";
							arrow.style.opacity = "0";
							arrow.onclick = this.onRightArrowClick;
							arrow.style.borderStyle = "solid";
							arrow.style.borderColor =
								"transparent transparent transparent #007bff";
							arrow.style.borderWidth = "50px 0 50px 100px";
							this.overlay.appendChild(arrow);
						}
					}
					else {
						if (oldarrow) {
							this.overlay.removeChild(oldarrow);
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
				if (!this.overlay) {
					return;
				}
				e.stopPropagation();
				if (this.opts.ScrollToAfterExit) {
					let post = this.media[this.current].parentElement;
					while (post && post.className != "postreply"
						&& post.className != "thread") {
						post = post.parentElement;
					}
					if (post) {
						const br = document.body.getBoundingClientRect();
						const er = post.getBoundingClientRect();
						const py = er.top - br.top;
						window.scrollTo(0, py);
					}
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
				this.overlay.style.zIndex = "5";
				this.overlay.style.left = "0";
				this.overlay.style.top = "0";
				this.overlay.style.backgroundColor = "rgb(0,0,0)";
				this.overlay.style.backgroundColor = "rgba(0,0,0, 0.9)";
				this.overlay.style.overflowX = "hidden";
				this.overlay.style.display = "flex";
				this.overlay.style.justifyContent = "center";
				this.overlay.style.alignItems = "center";
				this.overlay.onclick = this.onExitClick;
				this.overlay.onmousemove = this.overlayMouseMove;
				document.body.appendChild(this.overlay);
				this.loadMedium();
			}
			private resizeElement = (el: HTMLElement, w: number, h: number) => {
				// TODO: replace this magic
				const sb = 20;
				const cw = window.innerWidth - sb;
				const ch = window.innerHeight;
				if (w <= cw && h <= ch) {
					el.style.width = el.style.height = "auto";
					return;
				}
				const nofitw = w > cw;
				if (nofitw && h > ch) {
					if (w > h) {
						el.style.width = cw + "px";
						el.style.height = "auto";
					}
					else {
						el.style.width = "auto";
						el.style.height = ch + "px";
					}
				}
				else {
					if (nofitw) {
						el.style.width = cw + "px";
						el.style.height = "auto";
					}
					else {
						el.style.width = "auto";
						el.style.height = ch + "px";
					}
				}
			};
			private onResize = (e: UIEvent) => {
				if (!this.overlay) {
					return;
				}
				const href = this.media[this.current].href;
				if (href.indexOf(".webm") > 0) {
					const vid = <HTMLVideoElement>
						this.overlay.querySelector("video");
					this.resizeElement(vid, vid.videoWidth, vid.videoHeight);
				}
				else {
					const img = <HTMLImageElement>
						this.overlay.querySelector("img");
					this.resizeElement(img, img.naturalWidth, img.naturalHeight);
				}
			}
		}
		window.addEventListener("load", () => {
			new MediaOverlayHandler(opts.MediaOverlay);
		});
	}
});
