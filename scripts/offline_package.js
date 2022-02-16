const fs = require('fs')
const JSZip = require('jszip')
const mime = require('mime-types')
const path = require('path')
const shell = require('shelljs')

require('colors')

// 打包文件存放的路径
const packageDir = path.resolve(`packages`)

// webpack 打包结果的路径
const webpackAssetsDir = path.resolve(`dist`)

const zip = new JSZip()

const version = 1
const remotePath = `https://cnd.xxxxx.com/`
const packageInfoFilePath = `${packageDir}/offline-package.json`

const folder = zip.folder('offline-package')

const packageId = 'demo'

const packageInfo = {
    packageId,
    version,
    items: [
        {
            packageId,
            version,
            remoteUrl: `https://server.xxxxx.top/index.html`,
            path: `index.html`,
            mimeType: mime.lookup('.html')
        }
    ]
}

const addFile = async (filePath) => {
    const state = fs.statSync(filePath)

    if (state.isFile()) {
        if (path.basename(filePath) !== 'index.html') {
            const localFilePath = filePath.replace(`${webpackAssetsDir}/`, '')

            folder.file(localFilePath, fs.readFileSync(filePath))

            packageInfo.items.push({
                packageId,
                version,
                remoteUrl: filePath.replace(`${webpackAssetsDir}`, remotePath),
                path: localFilePath,
                mimeType: mime.lookup(path.extname(filePath))
            })
        }
    } else {
        const files = fs.readdirSync(filePath)

        await Promise.all(files.map((file) => addFile(`${filePath}/${file}`)))
    }
}

Promise.resolve().then(async () => {
    folder.file(
        'index.html',
        fs.readFileSync(`${packageDir}/index.html`)
    )

    addFile(webpackAssetsDir)

    fs.writeFileSync(packageInfoFilePath, JSON.stringify(packageInfo))

    folder.file('index.json', fs.readFileSync(packageInfoFilePath))

    const zipContent = await zip.generateAsync({
        type: 'nodebuffer',
        streamFiles: true,
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
    })

    fs.writeFileSync(`${packageDir}/offline-package.zip`, zipContent)

    shell.exec(`rm ${packageInfoFilePath}`)
    shell.exec(`rm ${packageDir}/index.html`)

    console.log('\nwell done.\n'.green)
    console.log(
        'find your package file in',
        `./packages/offline-package.zip`.blue
    )
})