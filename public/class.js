const socket = io('/');
const peer = new Peer();

let myVideoStream;
const videoGrid = document.getElementById('videoDiv')
const myvideo = document.createElement('video');
myvideo.muted = true;

const peerConnections = {}
navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
}).then((stream) => {
  myVideoStream = stream;
  addVideo(myvideo, stream);
  peer.on('call', call => {
    const vid = document.createElement('video');
    call.answer(stream);
    call.on('stream', userStream => addVideo(vid, userStream));
    call.on('error', (err) => {
      newNotify(err.message)
      setTimeout(() => location.reload(), 1000);
    })
    call.on("close", () => vid.remove());
    peerConnections[call.peer] = call;
  })
}).catch(err => {
    console.log(err)
    newNotify(err.message)
    setTimeout(() => location.reload(), 1000);
})

peer.on('open', (id) => socket.emit("newUser", id, roomID));

peer.on('error', (err) => {
  newNotify(err.message)
  setTimeout(() => location.reload(), 1000);
});

socket.on('userJoined' , id => {
  newNotify('New user joined')
  const call  = peer.call(id, myVideoStream);
  const vid = document.createElement('video');
  call.on('error' , (err) => {
    newNotify(err.message)
    setTimeout(() => location.reload(), 1000);
  })

  call.on('stream', userStream => addVideo(vid, userStream));

  call.on('close', () => {
    vid.remove();
    newNotify('User disconect');
    resizeVideos();
    setTimeout(() => resizeVideos(), 200);
  })
  peerConnections[id] = call;
})

socket.on('userDisconnect', id => {
  if(peerConnections[id]) peerConnections[id].close();
})

function addVideo(video, stream){
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () =>  video.play());
  videoGrid.append(video);
  resizeVideos()
}