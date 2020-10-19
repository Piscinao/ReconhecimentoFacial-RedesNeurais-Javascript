// camera defaut
// navigator.getUserMedia({ video: true });
const cam = document.getElementById('cam')
// retorna uma promise

const startVideo = () => {
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
      if (Array.isArray(devices)) {
          devices.forEach(device => {
              if (device.kind === 'videoinput') {
                  if (device.label.includes('C920')) {
                      navigator.getUserMedia(
                          { video: {
                              deviceId: device.deviceId
                          }},
                          // função de callback dados do vídeo
                          stream => cam.srcObject = stream,
                          error => console.error(error)
                      )
                  }
              }
          })
      }
  })
}
// Promisses que são carregados antes de mostrar o vídeo para carregar a lib
// Quando as promisses foram resolvidas chama a função de iniciar o vídeo
// Redes neurais
Promise.all([
  // Detecta rostos no vídeo desenha o quadrado
  faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'),
  // Detecta e desenha os traços do rosto
  faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'),
  // Reconhecimento do rosto
  faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'),
  // Detecta expressões
  faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'),
  // Detecta idade e gênero
  faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'),
  // Detecta o rosto
  faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models'),
]).then(startVideo)


  // Gerar um canvas em cima do vídeo
// cam.addEventListener('play', async() => {
//   const canvas = faceapi.createCanvasFromMedia(cam)
//   // Redimensionamento do canvas com o tamanho do vídeo
//   const canvasSize = {
//     width: cam.width,
//     height: cam.height
//   }
//   faceapi.matchDimensions(canvas, canvasSize)
//   document.body.appendChild(canvas)
//   // faceapi começar a detectar as coisas
//   setInterval(async () => {
//     const detections = await faceapi
//     // Detecta todas as faces
//     .detectAllFaces(
//       cam, 
//       new faceapi.TinyFaceDetectorOptions()
//       )
//     // Desenha o quadrado com o canvas
//       const resizedDetections = faceapi.resizeResults(detections, canvasSize)
//       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
//       faceapi.draw.drawDetections(canvas, resizedDetections)
//       console.log(detections)
//   }, 100)
// })

