const express = require('express')
const fs = require('fs')
const sharp = require('sharp')
const compressImage = require('compress-images')
const { Console } = require('console')
const { response } = require('express')

const app = express()
app.use(express.json())

const dir = './tmp'
if(!fs.existsSync(dir)){
  fs.mkdir(dir)
}

const imagesDir = './img'
if(!fs.existsSync(imagesDir)){
  fs.mkdirSync(imagesDir)
}

app.post('/resizeImagesInfo', (request, response)=>{

     const { path, width } = request.body

     return response.json(resizeImage(path, width))
})

let resizeImage = (inPath, inWidth)=>{

  const otherPath = inPath
  const otherWidth = inWidth

  console.log(otherPath, otherWidth)

  sharp(otherPath)
  .resize({width: otherWidth})
  .toFile('./img/output_resize_image.jpg', (error)=>{

    if(error){
      return response
      .status(401)
      .json({error: "Unable resize this image"})
    }

    return response
    .status(201)
    .json({message: "Image resize by sucessfully"})
    
  })
}

app.post('/compressImages', (request, response)=>{
  

  const { pathInput, pathOutput } = request.body
  return response
  .json(funcCompressImage(pathInput, pathOutput), {message: "File compressed by sucesfully"})
})

let funcCompressImage = (pathInput, pathOutput)=>{


compressImage(pathInput, pathOutput, { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                { svg: { engine: "svgo", command: "--multipass" } },
                { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
  function (error, completed, statistic) {
    console.log("-------------");
    console.log(error);
    console.log(completed);
    console.log(statistic);
    console.log("-------------");
  }
);
}

app.listen(1800)
