const { Device, DeviceInfo } = require("../models/models");
const path = require("path");
const uuiv = require("uuid");
const ApiError = require("../error/ApiError");
class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, BrandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuiv.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const device = await Device.create({
        name,
        price,
        BrandId,
        typeId,
        img: fileName,
      });
      if (info) {
        info = JSON.parse(parse);
        info.forEach((i) => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          });
        });
      }

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
  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }
}

module.exports = new DeviceController();
