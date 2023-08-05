const multer = require("multer");
// const sharp = require("sharp");
const Jimp = require('jimp');
const path = require("path");
const uuid = require("uuid").v4;
const fse = require("fs-extra");

const { AppError } = require("../utils");

class ImageService {
  static initUploadMiddlware(name) {
    /**
     *  Save in operation memory
     */
    // const multerStorage = multer.memoryStorage();

    /**
     * Save in folder
     */
    const multerStorage = multer.diskStorage({
      destination: (req, file, cbk) => {
        cbk(null, "tmp");
      },
      filename: (req, file, cbk) => {
        const extension = file.mimetype.split("/")[1];
        cbk(null, `${req.user.id}-${uuid()}.${extension}`);
      },
    });

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
    if (file.size > (options?.maxSize || 2 * 1024 * 1024)) {
      throw new AppError(400, "File is to large");
    }
    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments);

    // fse.ensureDir створює деректорію автоматично якщо її нема
    await fse.ensureDir(fullFilePath);
    console.log("pathJoin".blue, file);

    const avatar = await Jimp.read(file.path);
    await avatar
        .cover(options.width || 250, options.height || 250)
        .quality(90)
        .writeAsync(path.join(fullFilePath, fileName))
    
    const pathJoin = path.join(...pathSegments, fileName);
    return pathJoin;
  }
}

module.exports = ImageService;

/**
 * Exaple whith sharp
 */
// await sharp(file.buffer)
//   .resize(options || { height: 250, width: 250 })
//   .toFormat("jpeg")
//   .jpeg({ quality: 80 })
//   .toFile(path.join(fullFilePath, fileName));