import { createElement, Component } from 'preact';
import { withIntl } from '../../enhancers';
import style from './style';
import { Query } from 'react-apollo';
import { gql } from '@apollo/client';
import { ModalDialog } from '@zimbra-client/components';
import { withSetCustomMetaData } from '@zimbra-client/graphql';
import { withText } from 'preact-i18n';
import { Spinner } from '@zimbra-client/blocks';

// See : https://github.com/Zimbra/zimlet-cli/wiki/Storing-and-Fetching-MetaData-in-Zimlets

@withIntl()
@withText({
    title: 'sticky-notes-zimlet-modern.title',
})
@withSetCustomMetaData() // This will provide you setCustomMetadata method in props to set custom meta
export default class Display extends Component {

    constructor(props) {
        super(props);
        this.zimletContext = props.children.context;

        this.note = gql`
        query GetCustomMetadata($id: ID!, $section: String!) {
            getCustomMetadata(id: $id, section: $section) {
               meta {
                  section
                  _attrs {
                     key
                     value
                  }
               }
            }
         }
         `;
    };

    showDialog = () => {
        const { title } = this.props;
        this.modal = (
            <ModalDialog
                class={style.modalDialog}
                contentClass={style.modalContent}
                innerClass={style.inner}
                onClose={this.handleClose}
                cancelButton={false}
                header={false}
                footer={false}
            >
                <div class="zimbra-client_modal-dialog_inner"><header class="zimbra-client_modal-dialog_header"><h2>{title}</h2><button onClick={this.handleClose} aria-label="Close" class="zimbra-client_close-button_close zimbra-client_modal-dialog_actionButton"><span role="img" class="zimbra-icon zimbra-icon-close blocks_icon_md"></span></button></header>
                    <div class="zimbra-client_modal-dialog_content zimbra-client_language-modal_languageModalContent">
                        <textarea class={style.stickynote} style="width: 600px; height: 300px; border:0px;" id="stickyNotesEditor">{window.parent.document.getElementById('stickyNotes' + this.props.emailData.id).innerText || null}</textarea>

                    </div>
                    <footer class="zimbra-client_modal-dialog_footer" id="nextcloudDialogButtons"><button type="button" onClick={this.handleSave} class="blocks_button blocks_button_regular">OK</button></footer>
                </div>
            </ModalDialog>
        );

        const { dispatch } = this.zimletContext.store;
        dispatch(this.zimletContext.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal', modal: this.modal }));
    }

    handleSave = e => {
        const sticky = window.parent.document.getElementById('stickyNotesEditor').value;
        if (sticky.length > 0) {
            window.parent.document.getElementById('stickyNoteFromMeta' + this.props.emailData.id).style.display = 'none';
            window.parent.document.getElementById('stickyNotes' + this.props.emailData.id).innerText = sticky;
            window.parent.document.getElementById('stickyNotes' + this.props.emailData.id).className = style.stickynote;
        } else {
            window.parent.document.getElementById('stickyNoteFromMeta' + this.props.emailData.id).style.display = 'none';
            window.parent.document.getElementById('stickyNotes' + this.props.emailData.id).innerText = sticky;
            window.parent.document.getElementById('stickyNotes' + this.props.emailData.id).
            className = style.addStickynote;
        }

        this.props.setCustomMetadata({
            id: this.props.emailData.id, // id of any appointment, mail or contact item on which we want to set metadata
            section: "zwc:stikyNotesZimletMetaData", // <sectionName> can be replaced with any string, it is recommended to use zimlet name, like zwc:slackZimlet
            attrs: [
                {
                    key: "meta",
                    value: sticky
                },
            ]
        });

        const { dispatch } = this.zimletContext.store;
        return e && e.isTrusted && dispatch(this.zimletContext.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal' }));
    }

    handleClose = e => {
        const { dispatch } = this.zimletContext.store;
        return e && e.isTrusted && dispatch(this.zimletContext.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal' }));
    }

    /* Method to display a toaster to the user, not used ATM */
    alert = (message) => {
        const { dispatch } = this.zimletContext.store;
        dispatch(this.zimletContext.zimletRedux.actions.notifications.notify({
            message: message
        }));

    }

    render() {
        const { title } = this.props;
        return (
            <Query query={this.note} variables={{ id: this.props.emailData.id, section: "zwc:stikyNotesZimletMetaData" }}>
                {({ loading, error, data }) => {
                    if (loading) return <Spinner class={style.spinner} />;
                    if (error) return "";
                    if (data.getCustomMetadata.meta && data.getCustomMetadata.meta[0]._attrs[0].value !== "") {
                        return (
                            <div id={'stickyNotes' + this.props.emailData.id} onClick={this.showDialog} class={style.stickynote}><div id={'stickyNoteFromMeta' + this.props.emailData.id}>{data.getCustomMetadata.meta[0]._attrs[0].value || ""}</div></div>
                        );
                    } else {
                        return (
                            <div id={'stickyNotes' + this.props.emailData.id} onClick={this.showDialog} title={title} class={style.addStickynote}><div id={'stickyNoteFromMeta' + this.props.emailData.id}></div></div>
                        );
                    }
                }}
            </Query>
        );
    }
}
