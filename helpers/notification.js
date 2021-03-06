const axios = require('axios')
async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Check Now!',
      body: `Halo!, kamu terdeteksi berada di satu tempat yang sama dengan orang yang 
      teridentifaksi positif Covid-19. JANGAN PANIK! Isolasi mandiri dan segera cek status kamu ke rumah sakit terdekat.`,
      data: { data: 'goes here' },
    };
    
    // let expHost
    // if(!url) expHost = 'https://exp.host/--/api/v2/push/send'
    // else expHost = url

    await axios
    .post('https://exp.host/--/api/v2/push/send', message,
    {
      headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',}
    })
    .then( function(res) {
        console.log(`RESP: ${res}`, '<<<<<>>>>> berhasil brooo')
        console.log(typeof res, '<<<<<>>>>> datatype nya')
        return res
      })
    .catch( function(error){
      console.log(`ERR: ${error}`)
      // throw {name: 'INTERNAL_SERVER_ERROR'}
    })
  }

// sendPushNotification('ExponentPushToken[noIv86Iv0kqMRacllB1h0q]') // -> test to invoke notif
  module.exports = sendPushNotification