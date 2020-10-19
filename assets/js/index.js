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
                    if (device.label.includes('')) {
                        navigator.getUserMedia(
                            { video: {
                                deviceId: device.deviceId
                            }},
                            stream => cam.srcObject = stream,
                            error => console.error(error)
                        )
                    }
                }
            })
        }
    })
}


// Função para detectar o a pessoa através das labels e as fotos
const loadLabels = () => {
    // Alterar para o nome da pasta em questão que deve ser criada em assets/lib/face-api/labels
    const labels = ['Henrique Piscinao']
    // Usar o map em vez do forEach pois é necessário retornar algumas coisas || retorna uma promise
    return Promise.all(labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 5; i++) {
            // Importar as imagens
            const img = await faceapi.fetchImage(`/assets/lib/face-api/labels/${label}/${i}.jpg`)
            const detections = await faceapi
                // Forçar para detectar apenas um rosto
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor()
            descriptions.push(detections.descriptor)
        }
        // Retorna o objeto que a faceapi irá utilizar, com as informções passadas
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
    }))
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
cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
     // Redimensionamento do canvas com o tamanho do vídeo
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }
    const labels = await loadLabels()
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)
     // faceapi começar a detectar as coisas
    setInterval(async () => {
        const detections = await faceapi
           // Detecta todas as faces
            .detectAllFaces(
                cam,
                new faceapi.TinyFaceDetectorOptions()
            )
            // chama as funções
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors()
            // Desenha o quadrado com o canvas
        const resizedDetections = faceapi.resizeResults(detections, canvasSize)
            // Pega o que foi retornado na função, retorna a label com a taxa de acerto de 60%
        const faceMatcher = new faceapi.FaceMatcher(labels, 0.6)
            // Retornar o melhor resultados de cada label
        const results = resizedDetections.map(d =>
            faceMatcher.findBestMatch(d.descriptor)
        )
        // Limpa o canvas a cada gerado || probabilidade de acerto %
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // Canvas com detecção e probabilidade
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // Desenha os traços do rosto
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // Detecta expressões faciais
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        // Não tem uma função auxiliar de detecção de idade
        // Dentro de cada detecção pega uma informação
        resizedDetections.forEach(detection => {
            const { age, gender, genderProbability } = detection
            // Pegar as informações e desenhar em tela com um array
            new faceapi.draw.DrawTextField([
                // Double pra int
                `${parseInt(age, 10)} years`,
                `${gender} (${parseInt(genderProbability * 100, 10)})`
            ], detection.detection.box.topRight).draw(canvas)
        })
        // Implementação para detecção de label com nome
        results.forEach((result, index) => {
            const box = resizedDetections[index].detection.box
            const { label, distance } = result
            // Desenha as informações capturadas
            new faceapi.draw.DrawTextField([
                `${label} (${parseInt(distance * 100, 10)})`
            ], box.bottomRight).draw(canvas)
        })
    }, 100)
})