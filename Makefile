TSC=tsc
CLOSURE=closure# java -jar closure.jar

.DEFAULT: default
default: build;

dist: build
	zip -9 kctier.zip *.min.js manifest.json options.html icon16.png icon64.png

build: kctier.min.js options.min.js background.min.js

%.min.js: %.js
	$(CLOSURE) -O SIMPLE $< --js_output_file $@
	
%.js: %.ts
	$(TSC) $< --outFile $@
	
clean:
	rm -f *.js
