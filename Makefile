TSC=tsc
#CLOSURE=java -jar closure.jar
CLOSURE=closure

all: kctier.min.js

kctier.min.js: kctier.js
	$(CLOSURE) -O SIMPLE $< --js_output_file $@
	
kctier.js: kctier.ts
	$(TSC) $< --outFile $@
	
clean:
	rm kctier.js kctier.min.js
