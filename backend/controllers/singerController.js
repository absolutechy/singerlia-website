const { getAllSingers, getSingerById } = require("../services/singer");

const getAllSingersHandler = async (req, res) => {
  try {
    const { genre, city, address, name, limit = 10, page = 1 } = req.query;

    const decodedGenre = genre ? decodeURIComponent(genre) : null;
    const decodedCity = city ? decodeURIComponent(city) : null;
    const decodedAddress = address ? decodeURIComponent(address) : null;
    const decodedName = name ? decodeURIComponent(name) : null;
    const decodedLimit = parseInt(limit);
    const decodedPage = parseInt(page);

    const singers = await getAllSingers();

    const filteredSingers = singers.filter((singer) => {
      const matchGenre =
        !decodedGenre ||
        singer.genre?.toLowerCase().includes(decodedGenre.toLowerCase());
      const matchCity =
        !decodedCity ||
        singer.city?.toLowerCase().includes(decodedCity.toLowerCase());
      const matchAddress =
        !decodedAddress ||
        singer.address?.toLowerCase().includes(decodedAddress.toLowerCase());
      const matchName =
        !decodedName ||
        singer.name?.toLowerCase().includes(decodedName.toLowerCase());

      return matchGenre && matchCity && matchAddress && matchName;
    });

    if (!decodedLimit || !decodedPage) {
      return res.status(200).json(filteredSingers);
    }

    const startIndex = (decodedPage - 1) * decodedLimit;
    const endIndex = startIndex + decodedLimit;

    const paginatedSingers = filteredSingers.slice(startIndex, endIndex);

    res.status(200).json({
      page: decodedPage,
      limit: decodedLimit,
      totalPages: Math.ceil(filteredSingers.length / decodedLimit),
      singers: paginatedSingers,
    });
  } catch (error) {
    console.error("Error in getAllSingersHandler:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingerByIdHandler = async (req, res) => {
  try {
    const singer = await getSingerById(req.params.id);
    if (singer) {
      res.status(200).json(singer);
    } else {
      res.status(404).json({ message: "Singer not found" });
    }
  } catch (error) {
    console.error("Error in getSingerByIdHandler:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllSingersHandler,
  getSingerByIdHandler,
};
