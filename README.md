# ReconhecimentoFacial-RedesNeurais
O script em questão usa fotos para comparar com o que está sendo exibido na câmera.
Para melhor funcionamento é recomendado colocar pelo menos 5 fotos da pessoa em questão.
</br>
Para alterar as fotos como é um script para teste para ser implementado em um sistema não tem ligação com DB e etc..
</br>
É necessário colocar as fotos manualmente e também criar uma pasta com o nome da Pessoa em assets/lib/face-api/labels
e colocar as fotos com numeração 1.jpg por exemplo, para alterar a função com o nome da pasta criada é necessário alterar
em assets/js/index.js na linha 32 para o nome da pasta criada e colocar as fotos dentro.
</br>

OBS.: Formato da foto deve ser .jpg caso queira alterar o formato é necessário alterar na linha 38 do arquivo assets/js/index.js, 
</br>
      A função compara 5 fotos caso queira diminuir o número alterar o for na linha 36 do mesmo arquivo

</br>
<strong>Tecnologia usada:</strong>
</br>
HTML, CSS, JAVASCRIPT
