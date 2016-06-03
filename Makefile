TSC=tsc
#CLOSURE=java -jar closure.jar
CLOSURE=closure

.DEFAULT: default
default: build ;

dist: build
	7z a -tzip -mx9 kctier.zip kctier.min.js manifest.json options.html options.min.js icon16.png icon64.png

build: kctier.min.js options.min.js

kctier.min.js: kctier.js
	$(CLOSURE) -O SIMPLE $< --js_output_file $@
	
options.min.js: options.js
	$(CLOSURE) -O SIMPLE $< --js_output_file $@
	
kctier.js: kctier.ts
	$(TSC) $< --outFile $@
	
options.js: options.ts
	$(TSC) $< --outFile $@
	
clean:
	rm -f kctier.min.js kctier.js options.min.js options.js
