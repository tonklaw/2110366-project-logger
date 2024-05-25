const Data = require('./models/data.js');

class Utils {
  static async getPayload(sampleRateSeconds) {
    const time = Date.now();
    const furthestTime = time - (sampleRateSeconds * 1000 * 10);

    const averageData = await Data.aggregate([
      { 
        $match: {
          timestamp: {
            $gte: new Date(furthestTime),
            $lte: new Date(time),
          },
        },
      },
      {
        $sort: {
          timestamp: 1,
        },
      },
      {
        $project: {
          timestampLong: { $toLong: "$timestamp" },
          aqi: 1,
          dust: 1,
        }
      },
      {
        $group: {
          _id: { $floor: { $divide: ["$timestampLong", (sampleRateSeconds * 1000)] } },
          aqi: { $avg: '$aqi' },
          dust: { $avg: '$dust' },
        },
      },
      {
        $project: {
          _id: 1,
          aqi: { $round: ["$aqi", 2] },
          dust: { $round: ["$dust", 2] }
        }
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $limit: 10,
      }
    ]);

    // console.log("test", averageData, time, furthestTime);

    const data = averageData.map((entry) => ({
      timestamp: entry._id * sampleRateSeconds * 1000,
      aqi: entry.aqi,
      dust: entry.dust,
    }));

    return data;
  }
}

module.exports = Utils;
