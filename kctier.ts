
class OverlayHandler {
	private overlay : HTMLDivElement;
	private links : Array<string>;
	private current : string;
	private loadicon : HTMLImageElement;
	constructor() {
		const links:NodeListOf<HTMLAnchorElement> = 
			<NodeListOf<HTMLAnchorElement>> document.querySelectorAll(
			'.file_thread a[target="_blank"], .file_reply a[target="_blank"]'
		);
		this.links = new Array<string>(links.length);
		let o = 0;
		for(let i=0; i<links.length; i++) {
			const href = links[i].href;
			if(!href) {
				continue;
			}
			links[o].onclick = this.onLinkClick;
			this.links[o] = href;
			o++;
		}
		this.links.slice(0, o);
		window.onresize = this.onResize;
		window.onkeyup = this.onKeyup;
		this.loadicon = document.createElement("img");
		this.loadicon.src = "data:image/gif;base64,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";
	}
	private loadMedium = () => {
		if(this.overlay.children.length > 0) {
			this.overlay.removeChild(this.overlay.childNodes[0]);
		}
		this.overlay.appendChild(this.loadicon);
		if (this.current.indexOf(".webm") > 0) {
			const video = <HTMLVideoElement>document.createElement("video");
			video.controls = true;
			video.loop = true;
			const source = <HTMLSourceElement>document.createElement("source");
			source.type = "video/webm";
			source.src = this.current;
			video.appendChild(source);
			this.overlay.appendChild(video);
			video.load();
			video.muted = true;
			video.onloadeddata = () => {
				this.overlay.removeChild(this.loadicon);
				if (video.videoWidth <= document.body.scrollWidth &&
					video.videoHeight <= document.body.scrollHeight) {
					video.play();
					return;
				}
				if(video.videoWidth > video.videoHeight) {
					video.width = document.body.scrollWidth;
				} else {
					video.height = document.body.scrollHeight;
				}
				video.play();
			};
		} else {
			const img = <HTMLImageElement>document.createElement("img");
			this.overlay.appendChild(img);
			img.onload = () => {
				this.overlay.removeChild(this.loadicon);
				if (img.width <= window.innerWidth &&
					img.height <= window.innerHeight) {
					return;
				}
				if(img.width > img.height) {
					img.style.width = window.innerWidth+"px";
					img.style.height = "auto";
				} else {
					img.style.width = "auto";
					img.style.height = window.innerHeight+"px";
				}
			};
			img.src = this.current;
		}
	}
	private IsSwitching = ():boolean => {
		return this.loadicon.parentNode != null
	} 
	private onKeyup = (e: KeyboardEvent) => {
		const left = 37;
		const right = 39;
		if (this.current == null ||
			 (e.keyCode != left && e.keyCode != right) ||
			 this.IsSwitching()) {
			return;
		}
		e.preventDefault();
		const index = this.links.indexOf(this.current);
		let ni:number;
		if(e.keyCode == right) {
			ni = index + 1;
			if(ni >= this.links.length) {
				return;
			}
		} else {
			ni = index - 1;
			if(ni < 0) {
				return;
			}
		}
		this.current = this.links[ni];
		this.loadMedium();
	}
	private onExitClick = (e: MouseEvent) => {
		e.preventDefault();
		document.body.removeChild(this.overlay);
		this.overlay = null;
		this.current = null;
	}
	private onLinkClick = (e : MouseEvent) => {
		if(this.overlay != null) {
			return;
		}
		e.preventDefault();
		const target = <HTMLImageElement>e.target;
		const a = <HTMLAnchorElement>target.parentElement;
		this.current = a.href;
		this.overlay = <HTMLDivElement>document.createElement("div");
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
	private onResize = (e : UIEvent) => {
		if(!this.current) {
			return;
		}
		if (this.current.indexOf(".webm") > 0) {
			const video = <HTMLVideoElement>this.overlay.childNodes[0];
			if (video.videoWidth <= document.body.scrollWidth &&
				video.videoHeight <= document.body.scrollHeight) {
				return;
			}
			if(video.videoWidth > video.videoHeight) {
				video.width = document.body.scrollWidth;
			} else {
				video.height = document.body.scrollHeight;
			}
		} else {
			const img = <HTMLImageElement>this.overlay.childNodes[0];
			if (img.width <= window.innerWidth &&
				img.height <= window.innerHeight) {
				return;
			}
			if(img.width > img.height) {
				img.style.width = window.innerWidth+"px";
				img.style.height = "auto";
			} else {
				img.style.width = "auto";
				img.style.height = window.innerHeight+"px";
			}
		}
	}
}

class ReferenceHandler {
	private overlay:HTMLDivElement;
	private reId:RegExp;
	constructor() {
		this.reId = new RegExp("#(\\d+)$");
		const refs = <NodeListOf<HTMLAnchorElement>>
			document.querySelectorAll('blockquote a');
		const op = <HTMLDivElement>document.querySelector(".thread_body");
		for(let i=0; i<refs.length; i++) {
			refs[i].onmouseenter = this.onRefMouseEnter;
			refs[i].onmouseleave = this.onRefMouseLeave; 
		}
	}
	private onRefMouseEnter = (e:MouseEvent) => {
		if(this.overlay) {
			return;
		}
		const ref = <HTMLAnchorElement>e.target;
		const m = this.reId.exec(ref.href);
		if(!m) {
			return;
		}
		const offset = 10;
		const id = m[1];
		{
			const reply = <HTMLTableCellElement>
				document.querySelector("#post-"+id);
			if(reply) {
				const br = document.body.getBoundingClientRect();
				const eref = ref.getBoundingClientRect();
				const ey = eref.top-br.top;
				const ex = eref.left-br.left+eref.width;
				const half = document.body.scrollTop + window.innerHeight/2;
				let y:number;
				if(ey > half) {
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
				this.overlay.style.top = y+"px";
				this.overlay.style.left = (ex+offset)+"px";
				document.body.appendChild(this.overlay);
				return;
			}
		}
		{
			const thread = <HTMLDivElement>
				document.querySelector("#thread_" + id);
			if(thread) {
				const br = document.body.getBoundingClientRect();
				const eref = ref.getBoundingClientRect();
				const ey = eref.top-br.top;
				const ex = eref.left-br.left+eref.width;
				// TODO: if in view only highlight like the cool kids do
				this.overlay = <HTMLDivElement>document.createElement("div");
				const phs = thread.querySelectorAll(".postheader");
				if(phs.length == 0) {
					return;
				}
				this.overlay.appendChild(phs[0].cloneNode(true));
				const files = thread.querySelectorAll(".file_thread");
				for(let i=0; i<files.length; i++) {
					this.overlay.appendChild(files[i].cloneNode(true));
				}
				this.overlay.appendChild(
					thread.querySelector(".postbody").cloneNode(true));
				this.overlay.style.background = "#aaaacc";
				this.overlay.style.border = "1px rgb(89,89,89) solid"
				this.overlay.style.boxShadow = 
					"2px 2px 0px 0px rgb(128,128,128)";				
				this.overlay.style.position = "absolute";
				this.overlay.style.top = ey+"px";
				this.overlay.style.left = (ex+offset)+"px";
				document.body.appendChild(this.overlay);
				const half = document.body.scrollTop + window.innerHeight/2;
				if(ey > half) {
					const or = this.overlay.getBoundingClientRect();
					this.overlay.style.top = (ey-or.height)+"px";
				}
			}
		}
	}
	private onRefMouseLeave = (e:MouseEvent) => {
		if(!this.overlay) {
			return;
		}
		document.body.removeChild(this.overlay);
		this.overlay = null;
	}
}

const oh = new OverlayHandler();

if(location.href.indexOf("thread-") > 0) {
	const rh = new ReferenceHandler();
}
