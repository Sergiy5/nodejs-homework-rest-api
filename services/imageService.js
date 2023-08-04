const multer = require("multer");
const sharp = require("sharp");
// const jimp = require('jimp');
const path = require("path");
const uuid = require("uuid").v4;
const fse = require("fs-extra");

const { AppError } = require("../utils");

class ImageService {
  static initUploadMiddlware(name) {
    const multerStorage = multer.memoryStorage();
    //   const multerStorage = multer.diskStorage({
    //     destination: (req, file, cbk) => {
    //       cbk(null, 'tmp')
    //     },
    //     filename: (req, file, cbk) => {
    //       const extension = file.mimetype.split('/')[1];
    //       cbk(null, `${req.user.id}-${uuid()}.${extension}`)
    //     }
    //   });

    // Config multer filter
    const multerFilter = (req, file, cbk) => {
      // 'image/*'
      if (file.mimetype.startsWith("image/")) {
        cbk(null, true);
      } else {
        cbk(new AppError(400, "Pleas, upload image only!"), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, options, ...pathSegments) {
    if (file.size > (options?.maxSize || 1 * 1024 * 1024)) {
      throw new AppError(400, "File is to large");
}
    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), "static", ...pathSegments);

    // fse.ensureDir створює деректорію автоматично якщо її нема
    await fse.ensureDir(fullFilePath);
    await sharp(file.buffer)
      .resize(options || { height: 250, width: 250 })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;

/**
 * Exaple whith Jimp
 */
// const avatar = await jimp.read(file.buffer);
// await avatar
//     .cover(options.width || 250, options.height || 250)
//     .quality(80)
//     .writeAsync(path.join(fullFilePath, fileName))
