#!/bin/bash
echo "*** Configuring Zimbra-Zimlet-Sticky-Notes ***"
su - zimbra -c "zmmailboxdctl status"
if [ $? -ne 0 ]; then
   echo "*** Mailbox is not running... ***"
   echo "*** Follow the steps below as zimbra user ignore if installing through install.sh .. ***"
   echo "*** Install the Zimbra-Zimlet-Sticky-Notes zimlet. ***"
   echo "*** zmzimletctl -l deploy /opt/zimbra/zimlets-network/zimbra-zimlet-sticky-notes.zip ***"
   echo "*** zmprov fc zimlet ***"
else
   echo "*** Deploying Zimbra-Zimlet-Sticky-Notes zimlet ***"
   su - zimbra -c  "zmzimletctl -l deploy /opt/zimbra/zimlets-network/zimbra-zimlet-sticky-notes.zip"
   su - zimbra -c  "zmprov fc zimlet"
fi
echo "*** Zimbra-Zimlet-Sticky-Notes Installation Completed. ***"
echo "*** Restart the mailbox service as zimbra user. Run ***"
echo "*** su - zimbra ***"
echo "*** zmmailboxdctl restart ***"
