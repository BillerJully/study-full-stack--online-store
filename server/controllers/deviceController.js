const { Device } = require("../models/models");
const path = require("path");
const uuiv = require("uuid");
const ApiError = require("../error/ApiError");
class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, BrandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuiv.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    let { BrandId, typeId, limit, page } = req.body;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    let devices;
    if (!BrandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (BrandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { BrandId },
        limit,
        offset,
      });
    }
    if (!BrandId && typeId) {
      devices = await Device.findAndCountAlll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (BrandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { BrandId, typeId },
        limit,
        offset,
      });
    }
    return res.json(devices);
  }
  async getOne(req, res) {}
}

module.exports = new DeviceController();
