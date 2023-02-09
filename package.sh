#!/bin/bash

npm install
zimlet build
zimlet package -v 1.0.7 --zimbraXVersion ">=2.0.0" -n "zimbra-zimlet-sticky-notes" --desc "Add Sticky Notes to your email messages" -l "Sticky Notes"
