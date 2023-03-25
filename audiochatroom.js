// Set up the signaling server
const signalingServer = new WebSocket('ws://localhost:8080');

// When the signaling server connects, set up the peer connection
signalingServer.onopen = () => {
  // Create a new peer connection
  const peerConnection = new RTCPeerConnection();

  // When the peer connection receives a new ICE candidate, send it to the other peer
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingServer.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }));
    }
  };

  // When the peer connection receives a new stream, add it to the audio element
  peerConnection.ontrack = (event) => {
    const audioElement = document.createElement('audio');
    audioElement.srcObject = event.streams[0];
    document.body.appendChild(audioElement);
  };

  // When the signaling server receives a message, process it
  signalingServer.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'offer':
        // Set the remote description and create an answer
        peerConnection.setRemoteDescription(data.offer);
        peerConnection.createAnswer().then((answer) => {
          peerConnection.setLocalDescription(answer);
          signalingServer.send(JSON.stringify({ type: 'answer', answer: answer }));
        });
        break;
      case 'answer':
        // Set the remote description
        peerConnection.setRemoteDescription(data.answer);
        break;
      case 'iceCandidate':
        // Add the ICE candidate to the peer connection
        peerConnection.addIceCandidate(data.candidate);
        break;
    }
  };

  // When the user clicks the "join" button, create an offer and send it to the other peer
  document.querySelector('#join').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.createOffer().then((offer) => {
        peerConnection.setLocalDescription(offer);
        signalingServer.send(JSON.stringify({ type: 'offer', offer: offer }));
      });
    });
  });

  // When the user clicks the "leave" button, close the peer connection and remove the audio element
  document.querySelector('#leave').addEventListener('click', () => {
    peerConnection.close();
    document.querySelectorAll('audio').forEach((audioElement) => {
      audioElement.remove();
    });
  });
};
