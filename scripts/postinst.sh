#!/bin/bash

packageName="Zimbra-Zimlet-Sticky-Notes"
packageZipName="zimbra-zimlet-sticky-notes.zip"
deployPath="/opt/zimbra/zimlets-network"

echo "*** Configuring ${packageName} ***"
su - zimbra -c "zmmailboxdctl status"

if [ $? -ne 0 ]; then
   echo "*** Mailbox is not running... ***"
   echo "*** Follow the steps below as zimbra user ignore if installing through install.sh .. ***"
   echo "*** Install the ${packageName} zimlet. ***"
   echo "*** zmzimletctl -l deploy ${deployPath}/${packageZipName} ***"
   echo "*** zmprov fc zimlet ***"
else
   echo "*** Deploying ${packageName} zimlet ***"
   su - zimbra -c  "zmzimletctl -l deploy ${deployPath}/${packageZipName}"
   su - zimbra -c  "zmprov fc zimlet"
fi

echo "*** ${packageName} Installation Completed. ***"
echo "*** Restart the mailbox service as zimbra user. Run ***"
echo "*** su - zimbra ***"
echo "*** zmmailboxdctl restart ***"
