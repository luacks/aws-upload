const processType = process.argv.slice(2)[0]
const AWS = require('aws-sdk');
const fs = require('fs')
const colors = require('colors')

let s3 = new AWS.S3({
  accessKeyId: 'accesskey',
  secretAccessKey: 'secret'
})
// AWS.config.update()

const config = {
  Bucket: 'areachat-uploads',
  Key: 'error.html'
}

const uploadFile = () => {
  fs.readFile('./teste.txt', (err, result) => {
  if(err) throw err;
  config.Body = result;
  config.Bucket = process.argv.slice(2)[1]
    s3.upload(config, (err, res) => {
      if(err) throw err;
      console.log(colors.green(`Criado arquivo em: ${res.location}\n
                    Versão: ${res.VersionId}`))
    })
  })
}

const createBucket = () => {
  s3.createBucket({ Bucket : process.argv.slice(2)[1] }, (err, res) => {
    if(err) throw err
      console.log(res)
  })
}

const listBuckets = () => {
  s3.listBuckets((err, result) => {
    if(err) throw err
      result.Buckets.forEach(current => {
        console.log(colors.green(current.Name))
      })
  })
}

const deleteBucket = () => {
  s3.deleteBucket({ Bucket : process.argv.slice(2)[1] }, (err, result) => {
    if(err) throw err
      console.log('Bucket ' + process.argv.slice(2)[1] + ' deletado com sucesso')
  })
}

const deleteFile = () => {
  s3.deleteObject({ Bucket: process.argv.slice(2)[1], Key: 'tete.txt' }, (err, result) => {
    if(err) throw err
      console.log(result)
  })
}

const setPublic = () => {
  fs.readFile('./teste.txt', (err, result) => {
  if(err) throw err;
    config.ACL = 'public-read'
    config.Body = result;
    config.Bucket = process.argv.slice(2)[1]
    s3.upload(config, (err, result) => {
      if(err) throw err
        console.log('Arquivo mudado para public')
        console.log(result.Location)  
    })
  })
}

switch(processType){
  case 'upload':
    uploadFile()
    break;
  case 'create':
    createBucket()
  break;
  case 'list':
    listBuckets()
  break;
  case 'public':
    setPublic()
  break;
  case 'delete':
    deleteBucket()
  break;
  case 'deletefile':
    deleteFile()
  break;
  default:
    console.log(colors.inverse('Passe parametros: \n\n'))
    console.log(colors.green('upload') + ' - Enviar arquivo\n' + 
    colors.green('list') + ' - Listar buckets\n' 
    + 
    colors.green('delete') + ' - Deletar arquivo\n' +
    colors.green('create') + ' - Criar bucket [create nomedobucket] \n')
  break;
}