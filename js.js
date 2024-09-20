<script src="https://apis.google.com/js/api.js"></script>
<script>
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
            apiKey: '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', // Use API Key
            clientId: '17746212064-jkce9a3j7n8rnblpguo8377rer1n0kui.apps.googleusercontent.com', // Use Client ID from credentials
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: "https://www.googleapis.com/auth/gmail.readonly"
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            document.getElementById('signin-button').onclick = handleAuthClick;
            document.getElementById('signout-button').onclick = handleSignoutClick;
        });
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            listMessages();
        } else {
            document.getElementById('gmail-emails').innerHTML = '<p>Please sign in to view emails.</p>';
        }
    }

    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    function listMessages() {
        gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'maxResults': 5,
        }).then(function(response) {
            const messages = response.result.messages;
            let emailList = '';

            if (messages && messages.length > 0) {
                messages.forEach((message) => {
                    getMessageDetails(message.id);
                });
            } else {
                emailList = '<p>No new emails found.</p>';
            }
            document.getElementById('gmail-emails').innerHTML = emailList;
        });
    }

    function getMessageDetails(messageId) {
        gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': messageId,
        }).then(function(response) {
            const message = response.result;
            const snippet = message.snippet;
            const emailHtml = `
                <p><strong>Snippet:</strong> ${snippet}</p><hr>
            `;
            document.getElementById('gmail-emails').innerHTML += emailHtml;
        });
    }
</script>
