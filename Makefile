########################################################################################################

SHELL=bash
NAME = $(shell cat package.json | grep 'name":' | cut -c 12- | rev | cut -c 3- | rev)
DESC = $(shell cat package.json | grep 'description":' | cut -c 19- | rev | cut -c 3- | rev)
VERSION = 1.0.0
WORKSPACE = pkg

.PHONY: clean all

########################################################################################################

all: zimbra-zimlet-pkg
	rm -rf build/stage build/tmp
########################################################################################################

download:
	mkdir downloads
	wget -O downloads/zimbra-zimlet-sticky-notes.zip https://github.com/Zimbra/$(NAME)/releases/download/1.0.8/$(NAME).zip

stage-zimlet-zip:
	install -T -D downloads/zimbra-zimlet-sticky-notes.zip build/stage/$(NAME)/opt/zimbra/zimlets-network/$(NAME).zip

zimbra-zimlet-pkg: download stage-zimlet-zip
	../zm-pkg-tool/pkg-build.pl \
		--out-type=binary \
		--pkg-version=$(VERSION).$(shell git log --pretty=format:%ct -1) \
		--pkg-release=1 \
		--pkg-name=$(NAME) \
		--pkg-summary='$(DESC)' \
		--pkg-depends='zimbra-network-store (>= 10.0.0)' \
		--pkg-post-install-script='scripts/postinst.sh'\
		--pkg-installs='/opt/zimbra/zimlets-network/$(NAME).zip'

########################################################################################################

clean:
	rm -rf build
	rm -rf downloads

########################################################################################################
